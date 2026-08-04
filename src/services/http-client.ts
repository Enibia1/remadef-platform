/* ==========================================================
   REMADEF PLATFORM
   Master HTTP Engine
   File: src/services/http-client.ts
========================================================== */

import Network, { SerializedQueuedRequest } from "../core/network";
import { CONFIG } from "../config";
import { Auth } from "./auth.service";
import { Session } from "./session.service";
import EventBus from "../core/event-bus";
import Logger from "../utils/logger";

export type ResponseType = 'json' | 'blob' | 'arrayBuffer' | 'text';

export interface ClientMetrics {
  requests: number;
  successes: number;
  failures: number;
  averageLatency: number;
  retries: number;
}

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  requestId?: string;
  cancelGroup?: string;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  apiVersion?: string;
  authRequired?: boolean;
  queueIfOffline?: boolean;
  responseType?: ResponseType;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Headers;
  requestId: string;
}

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = (response: ApiResponse<unknown>) => ApiResponse<unknown> | Promise<ApiResponse<unknown>>;

export class HttpClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  private RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
  private NON_RETRYABLE_STATUS_CODES = new Set([401, 403, 404, 422]);

  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  // Request Cancellation Maps
  private activeControllers: Map<string, AbortController> = new Map();
  private groupControllers: Map<string, Set<string>> = new Map();

  private isRefreshingToken = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  public metrics: ClientMetrics = {
    requests: 0,
    successes: 0,
    failures: 0,
    averageLatency: 0,
    retries: 0,
  };

  private totalLatency = 0;

  constructor() {
    this.baseURL = CONFIG.API_URL;
    this.defaultTimeout = 15000;
    this.defaultRetries = 2;

    // Register queue rehydration listener with Network Manager
    Network.processQueue((item: SerializedQueuedRequest) => {
      return this.request(item.endpoint, item.config as RequestConfig);
    });
  }

  /* ----------------------------------------------
     Interceptors API
  ---------------------------------------------- */
  public useRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public useResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /* ----------------------------------------------
     Request Cancellation API
  ---------------------------------------------- */
  public cancel(requestId: string): void {
    const controller = this.activeControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.activeControllers.delete(requestId);
      Logger.info(`Cancelled request [${requestId}]`);
    }
  }

  public cancelGroup(group: string): void {
    const requestIds = this.groupControllers.get(group);
    if (requestIds) {
      requestIds.forEach((id) => this.cancel(id));
      this.groupControllers.delete(group);
      Logger.info(`Cancelled request group [${group}]`);
    }
  }

  public cancelAll(): void {
    this.activeControllers.forEach((controller) => controller.abort());
    this.activeControllers.clear();
    this.groupControllers.clear();
    Logger.info("Cancelled all active HTTP requests.");
  }

  /* ----------------------------------------------
     Private Helpers & Interceptors Handling
  ---------------------------------------------- */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private registerController(requestId: string, cancelGroup?: string): AbortController {
    const controller = new AbortController();
    this.activeControllers.set(requestId, controller);

    if (cancelGroup) {
      if (!this.groupControllers.has(cancelGroup)) {
        this.groupControllers.set(cancelGroup, new Set());
      }
      this.groupControllers.get(cancelGroup)!.add(requestId);
    }

    return controller;
  }

  private unregisterController(requestId: string, cancelGroup?: string): void {
    this.activeControllers.delete(requestId);
    if (cancelGroup && this.groupControllers.has(cancelGroup)) {
      this.groupControllers.get(cancelGroup)!.delete(requestId);
    }
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>, apiVersion = 'v1'): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseURL}/${apiVersion}${cleanEndpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async parseResponseBody(response: Response, type: ResponseType = 'json'): Promise<unknown> {
    if (response.status === 204) return null;
    switch (type) {
      case 'blob': return response.blob();
      case 'arrayBuffer': return response.arrayBuffer();
      case 'text': return response.text();
      case 'json':
      default:
        return response.json();
    }
  }

  private recordMetrics(startTime: number, success: boolean): void {
    const latency = Date.now() - startTime;
    this.metrics.requests++;
    
    if (success) {
      this.metrics.successes++;
      this.totalLatency += latency;
      this.metrics.averageLatency = Math.round(this.totalLatency / this.metrics.successes);
    } else {
      this.metrics.failures++;
    }
  }

  private async handleTokenRefresh(): Promise<string> {
    if (this.isRefreshingToken) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshingToken = true;

    try {
      const newToken = await Session.refresh();
      this.isRefreshingToken = false;
      this.refreshSubscribers.forEach((callback) => callback(newToken));
      this.refreshSubscribers = [];
      return newToken;
    } catch (error) {
      this.isRefreshingToken = false;
      this.refreshSubscribers = [];
      Auth.logout();
      throw error;
    }
  }

  /* ----------------------------------------------
     Core Request Engine
  ---------------------------------------------- */
  public async request<T = unknown>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    // 1. Request Interceptors Pipeline
    let processedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }

    const {
      requestId = this.generateRequestId(),
      cancelGroup,
      params,
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      apiVersion = 'v1',
      authRequired = true,
      queueIfOffline = false,
      responseType = 'json',
      headers: customHeaders,
      ...customConfig
    } = processedConfig;

    // 2. Lifecycle Event: Request Start
    EventBus.emit('request:start', { requestId, endpoint, config: processedConfig });

    // 3. Offline Handling & Persistent Queueing
    if (!Network.isOnline()) {
      if (queueIfOffline) {
        Network.queueRequest(
          requestId,
          () => this.request<T>(endpoint, processedConfig),
          { endpoint, config: processedConfig }
        );
        EventBus.emit('request:queued', { requestId, endpoint });
        Logger.info(`Client offline. Request queued for [${endpoint}] with ID [${requestId}].`);
        return { data: null as unknown as T, status: 0, headers: new Headers(), requestId };
      }
      
      const offlineError = new Error("Network Error: Application is currently offline.");
      EventBus.emit('request:error', { requestId, endpoint, error: offlineError });
      Logger.error(`Request failed: Device is offline [${endpoint}].`);
      throw offlineError;
    }

    const url = this.buildUrl(endpoint, params, apiVersion);
    const headers = new Headers(customHeaders);
    headers.set('X-Request-ID', requestId);

    if (authRequired) {
      const token = Auth.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    let finalBody: BodyInit | null = null;
    if (body) {
      if (body instanceof FormData) {
        finalBody = body;
      } else {
        headers.set('Content-Type', 'application/json');
        finalBody = JSON.stringify(body);
      }
    }

    const controller = this.registerController(requestId, cancelGroup);
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions: RequestInit = {
      ...customConfig,
      headers,
      body: finalBody,
      signal: controller.signal,
    };

    const startTime = Date.now();
    let attempts = 0;

    Logger.debug(`HTTP ${customConfig.method || 'GET'} Request [${requestId}] to ${url}`);

    while (attempts <= retries) {
      try {
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        // 4. Automatic 401 Session Token Refresh
        if (response.status === 401 && authRequired && attempts === 0) {
          Logger.warn(`Received 401 for [${endpoint}]. Attempting token refresh...`);
          try {
            const newToken = await this.handleTokenRefresh();
            headers.set('Authorization', `Bearer ${newToken}`);
            attempts++;
            continue; // Re-issue original request with new token
          } catch (refreshErr) {
            this.recordMetrics(startTime, false);
            EventBus.emit('request:error', { requestId, endpoint, error: refreshErr });
            throw refreshErr;
          }
        }

        // 5. Error Response Handling
        if (!response.ok) {
          const status = response.status;

          if (this.NON_RETRYABLE_STATUS_CODES.has(status)) {
            Logger.warn(`Non-retryable HTTP Error ${status} for [${endpoint}].`);
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            const err = new Error(errorData.message || `HTTP Error ${status}`);
            this.recordMetrics(startTime, false);
            EventBus.emit('request:error', { requestId, endpoint, error: err, status });
            throw err;
          }

          if (this.RETRYABLE_STATUS_CODES.has(status) && attempts < retries) {
            attempts++;
            this.metrics.retries++;
            EventBus.emit('request:retry', { requestId, endpoint, attempt: attempts });
            Logger.warn(`Retryable HTTP Error ${status}. Retrying (${attempts}/${retries}) for [${endpoint}]...`);
            await new Promise((res) => setTimeout(res, attempts * 1000));
            continue;
          }

          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          const err = new Error(errorData.message || `HTTP Error ${status}`);
          this.recordMetrics(startTime, false);
          EventBus.emit('request:error', { requestId, endpoint, error: err, status });
          throw err;
        }

        // 6. Response Parsing & Interceptors
        const parsedData = (await this.parseResponseBody(response, responseType)) as T;
        this.unregisterController(requestId, cancelGroup);
        this.recordMetrics(startTime, true);

        let finalResponse: ApiResponse<T> = {
          data: parsedData,
          status: response.status,
          headers: response.headers,
          requestId,
        };

        for (const interceptor of this.responseInterceptors) {
          finalResponse = (await interceptor(finalResponse as ApiResponse<unknown>)) as ApiResponse<T>;
        }

        EventBus.emit('request:success', { requestId, endpoint, status: response.status });
        EventBus.emit('request:completed', { requestId, endpoint });
        Logger.debug(`HTTP ${customConfig.method || 'GET'} Success [${response.status}] for [${requestId}]`);

        return finalResponse;

      } catch (err: unknown) {
        clearTimeout(timeoutId);
        const isAbort = err instanceof Error && err.name === 'AbortError';

        if (isAbort) {
          this.unregisterController(requestId, cancelGroup);
          this.recordMetrics(startTime, false);
          EventBus.emit('request:error', { requestId, endpoint, error: err, aborted: true });
          throw err;
        }

        const isNetworkError = err instanceof Error && err.message === 'Failed to fetch';

        if (isNetworkError && attempts < retries) {
          attempts++;
          this.metrics.retries++;
          EventBus.emit('request:retry', { requestId, endpoint, attempt: attempts });
          Logger.warn(`Network failure. Retrying (${attempts}/${retries}) for [${endpoint}]...`);
          await new Promise((res) => setTimeout(res, attempts * 1000));
          continue;
        }

        this.unregisterController(requestId, cancelGroup);
        this.recordMetrics(startTime, false);
        EventBus.emit('request:error', { requestId, endpoint, error: err });
        EventBus.emit('request:completed', { requestId, endpoint });
        Logger.error(`Request [${requestId}] failed for [${endpoint}]:`, err);
        throw err;
      }
    }

    this.unregisterController(requestId, cancelGroup);
    this.recordMetrics(startTime, false);
    const finalErr = new Error('Request execution failed unexpectedly.');
    EventBus.emit('request:error', { requestId, endpoint, error: finalErr });
    EventBus.emit('request:completed', { requestId, endpoint });
    throw finalErr;
  }

  /* ----------------------------------------------
     HTTP Method Helpers
  ---------------------------------------------- */
  public get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  public put<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  public patch<T>(endpoint: string, body?: unknown, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  public delete<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  public upload<T>(endpoint: string, formData: FormData, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: formData });
  }
}

export const Client = new HttpClient();
export default Client;
