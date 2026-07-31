/* ==========================================================
   REMADEF PLATFORM
   Core Network Manager
   File: src/core/network.ts
========================================================== */

import CONFIG from "../config/config";
import Cache from "./cache";
import Storage from "./storage";
import EventBus from "./events";

export interface RequestOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    cache?: boolean;
    cacheTTL?: number;
    cacheKey?: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    status: number;
    data: T;
    error?: string;
}

class NetworkManager {

    private pending = new Map<string, AbortController>();

    /* ==========================================================
       REQUEST
    ========================================================== */

    async request<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {

        const method = (options.method ?? "GET").toUpperCase();

        const url = `${CONFIG.API_URL}${endpoint}`;

        const cacheKey =
            options.cacheKey ??
            `${method}:${url}:${options.body ?? ""}`;

        if (
            method === "GET" &&
            options.cache
        ) {

            const cached =
                Cache.get<ApiResponse<T>>(cacheKey);

            if (cached) {
                return cached;
            }

        }

        return this.execute<T>(
            url,
            cacheKey,
            options
        );

    }

    /* ==========================================================
       EXECUTE
    ========================================================== */

    private async execute<T>(
        url: string,
        cacheKey: string,
        options: RequestOptions
    ): Promise<ApiResponse<T>> {

        const controller = new AbortController();

        const timeout =
            options.timeout ?? 30000;

        const retries =
            options.retries ?? 1;

        this.pending.set(url, controller);

        const timer = setTimeout(() => {

            controller.abort();

        }, timeout);

        try {

            const token =
                Storage.get<string>("session.token");

            const headers: HeadersInit = {
                "Content-Type": "application/json",
                ...(options.headers || {})
            };

            if (token) {
                (headers as any)["Authorization"] =
                    `Bearer ${token}`;
            }

            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal
            });

            clearTimeout(timer);

            this.pending.delete(url);

            const data = await response.json();

            const result: ApiResponse<T> = {
                success: response.ok,
                status: response.status,
                data
            };

            if (
                options.cache &&
                response.ok
            ) {

                Cache.set(
                    cacheKey,
                    result,
                    options.cacheTTL
                );

            }

            EventBus.emit(
                "network:success",
                result
            );

            return result;

        } catch (error: any) {

            clearTimeout(timer);

            this.pending.delete(url);

            if (
                retries > 0 &&
                navigator.onLine
            ) {

                return this.execute(
                    url,
                    cacheKey,
                    {
                        ...options,
                        retries: retries - 1
                    }
                );

            }

            const result: ApiResponse = {
                success: false,
                status: 0,
                data: null,
                error:
                    error?.message ??
                    "Network Error"
            };

            EventBus.emit(
                "network:error",
                result
            );

            return result;

        }

    }

    /* ==========================================================
       HTTP HELPERS
    ========================================================== */

    get<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ) {

        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "GET"
            }
        );

    }

    post<T = any>(
        endpoint: string,
        body: any,
        options: RequestOptions = {}
    ) {

        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "POST",
                body: JSON.stringify(body)
            }
        );

    }

    put<T = any>(
        endpoint: string,
        body: any,
        options: RequestOptions = {}
    ) {

        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "PUT",
                body: JSON.stringify(body)
            }
        );

    }

    patch<T = any>(
        endpoint: string,
        body: any,
        options: RequestOptions = {}
    ) {

        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "PATCH",
                body: JSON.stringify(body)
            }
        );

    }

    delete<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ) {

        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "DELETE"
            }
        );

    }

    /* ==========================================================
       CANCEL REQUEST
    ========================================================== */

    cancel(url: string): void {

        this.pending
            .get(url)
            ?.abort();

        this.pending.delete(url);

    }

    /* ==========================================================
       CANCEL ALL
    ========================================================== */

    cancelAll(): void {

        for (const controller of this.pending.values()) {

            controller.abort();

        }

        this.pending.clear();

    }

}

export default new NetworkManager();
