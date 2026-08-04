/* ==========================================================
   REMADEF PLATFORM
   Service Client
   File: src/services/client.ts
========================================================== */

import CONFIG from "../config/config";
import Appwrite from "../config/appwrite";

import Cache from "../core/cache";
import Session from "../core/session";
import EventBus from "../core/events";

import type {
    ApiResponse,
    HttpMethod
} from "../types/api";

export interface RequestOptions {

    cache?: boolean;

    cacheTTL?: number;

    retries?: number;

    timeout?: number;

    headers?: Record<string, string>;

}

class ServiceClient {

    /* ======================================================
       REQUEST
    ====================================================== */

    async request<T = unknown>(

        method: HttpMethod,

        endpoint: string,

        body?: unknown,

        options: RequestOptions = {}

    ): Promise<ApiResponse<T>> {

        const cacheKey =
            `${method}:${endpoint}:${JSON.stringify(body ?? {})}`;

        /* ==================================================
           CACHE
        ================================================== */

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

        /* ==================================================
           REQUEST
        ================================================== */

        const response =
            await this.execute<T>(
                method,
                endpoint,
                body,
                options
            );

        /* ==================================================
           CACHE RESPONSE
        ================================================== */

        if (
            response.success &&
            method === "GET" &&
            options.cache
        ) {

            Cache.set(

                cacheKey,

                response,

                options.cacheTTL

            );

        }

        return response;

    }

    /* ======================================================
       EXECUTE
    ====================================================== */

    private async execute<T>(

        method: HttpMethod,

        endpoint: string,

        body?: unknown,

        options: RequestOptions = {}

    ): Promise<ApiResponse<T>> {

        const payload = {

            method,

            path: endpoint,

            body: body ?? {},

            request_id: this.requestId()

        };

        EventBus.emit(
            "api:request",
            payload
        );

        try {

            const execution =
                await Appwrite.functions.createExecution(

                    CONFIG.APPWRITE_FUNCTION_ID,

                    JSON.stringify(payload),

                    false

                );

            const response =
                this.parse<T>(execution);

            EventBus.emit(
                "api:success",
                response
            );

            return response;

        } catch (error) {

            EventBus.emit(
                "api:error",
                error
            );

            throw error;

        }

    }

    /* ======================================================
       PARSE
    ====================================================== */

    private parse<T>(
        execution: any
    ): ApiResponse<T> {

        if (
            !execution?.responseBody
        ) {

            throw new Error(
                "Empty server response."
            );

        }

        return JSON.parse(
            execution.responseBody
        );

    }

    /* ======================================================
       REQUEST ID
    ====================================================== */

    private requestId(): string {

        return (
            "req_" +
            Date.now().toString(36) +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );

    }

    /* ======================================================
       HTTP HELPERS
    ====================================================== */

    get<T>(
        endpoint: string,

        options?: RequestOptions

    ) {

        return this.request<T>(
            "GET",
            endpoint,
            undefined,
            options
        );

    }

    post<T>(
        endpoint: string,

        body?: unknown,

        options?: RequestOptions

    ) {

        return this.request<T>(
            "POST",
            endpoint,
            body,
            options
        );

    }

    put<T>(
        endpoint: string,

        body?: unknown,

        options?: RequestOptions

    ) {

        return this.request<T>(
            "PUT",
            endpoint,
            body,
            options
        );

    }

    patch<T>(
        endpoint: string,

        body?: unknown,

        options?: RequestOptions

    ) {

        return this.request<T>(
            "PATCH",
            endpoint,
            body,
            options
        );

    }

    delete<T>(
        endpoint: string,

        options?: RequestOptions

    ) {

        return this.request<T>(
            "DELETE",
            endpoint,
            undefined,
            options
        );

    }

}

export default new ServiceClient();
