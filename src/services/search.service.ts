/* ==========================================================
   REMADEF PLATFORM
   Search Service
   File: src/services/search.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    SearchResult,
    SearchSuggestion,
    SearchHistory,
    SearchFilter,
    GlobalSearchResponse
} from "../types/search";

class SearchService {

    /* ======================================================
       GLOBAL SEARCH
    ====================================================== */

    search(
        query: string,
        page = 1,
        limit = 20,
        filter?: SearchFilter
    ): Promise<ApiResponse<GlobalSearchResponse>> {

        const params = new URLSearchParams({

            q: query,

            page: String(page),

            limit: String(limit)

        });

        if (filter) {

            Object.entries(filter).forEach(([key, value]) => {

                if (
                    value !== undefined &&
                    value !== null
                ) {

                    params.append(
                        key,
                        String(value)
                    );

                }

            });

        }

        return Client.get(

            `${ENDPOINTS.SEARCH.ROOT}?${params.toString()}`

        );

    }

    /* ======================================================
       SUGGESTIONS
    ====================================================== */

    suggestions(
        query: string
    ): Promise<ApiResponse<SearchSuggestion[]>> {

        return Client.get(

            `${ENDPOINTS.SEARCH.SUGGESTIONS}?q=${encodeURIComponent(query)}`,

            {
                cache: true,
                cacheTTL: 30000
            }

        );

    }

    /* ======================================================
       TRENDING
    ====================================================== */

    trending(): Promise<ApiResponse<SearchResult[]>> {

        return Client.get(

            ENDPOINTS.SEARCH.TRENDING,

            {
                cache: true,
                cacheTTL: 300000
            }

        );

    }

    /* ======================================================
       RECENT SEARCHES
    ====================================================== */

    recent(): Promise<ApiResponse<SearchHistory[]>> {

        return Client.get(

            ENDPOINTS.SEARCH.RECENT

        );

    }

    clearHistory(): Promise<ApiResponse> {

        return Client.delete(

            ENDPOINTS.SEARCH.RECENT

        );

    }

    /* ======================================================
       PEOPLE
    ====================================================== */

    people(
        query: string
    ): Promise<ListResponse<SearchResult>> {

        return Client.get(

            `${ENDPOINTS.SEARCH.PEOPLE}?q=${encodeURIComponent(query)}`

        );

    }

    /* ======================================================
       BUSINESSES
    ====================================================== */

    businesses(
        query: string
    ): Promise<ListResponse<SearchResult>> {

        return Client.get(

            `${ENDPOINTS.SEARCH.BUSINESSES}?q=${encodeURIComponent(query)}`

        );

    }

    /* ======================================================
       COURSES
    ====================================================== */

    courses(
        query: string
    ): Promise<ListResponse<SearchResult>> {

        return Client.get(

            `${ENDPOINTS.SEARCH.COURSES}?q=${encodeURIComponent(query)}`

        );

    }

    /* ======================================================
       APPRENTICESHIPS
    ====================================================== */

    apprenticeships(
        query: string
    ): Promise<ListResponse<SearchResult>> {

        return Client.get(

            `${ENDPOINTS.SEARCH.APPRENTICESHIPS}?q=${encodeURIComponent(query)}`

        );

    }

    /* ======================================================
       GIGS
    ====================================================== */

    gigs(
        query: string
    ): Promise<ListResponse<SearchResult>> {

        return Client.get(

            `${ENDPOINTS.SEARCH.GIGS}?q=${encodeURIComponent(query)}`

        );

    }

    /* ======================================================
       POSTS
    ====================================================== */

    posts(
        query: string
    ): Promise<ListResponse<SearchResult>> {

        return Client.get(

            `${ENDPOINTS.SEARCH.POSTS}?q=${encodeURIComponent(query)}`

        );

    }

}

export default new SearchService();
