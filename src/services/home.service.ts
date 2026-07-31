/* ==========================================================
   REMADEF PLATFORM
   Home Service
   File: src/services/home.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    Dashboard,
    FeedItem,
    CreatePostRequest,
    UpdatePostRequest,
    Comment,
    CreateCommentRequest,
    ReactionType,
    FeedFilters
} from "../types/home";

class HomeService {

    /* ======================================================
       DASHBOARD
    ====================================================== */

    getDashboard(): Promise<ApiResponse<Dashboard>> {

        return Client.get(
            ENDPOINTS.HOME.DASHBOARD,
            {
                cache: true,
                cacheTTL: 60000
            }
        );

    }

    /* ======================================================
       FEED
    ====================================================== */

    getFeed(
        page = 1,
        limit = 20,
        filters?: FeedFilters
    ): Promise<ListResponse<FeedItem>> {

        const params = new URLSearchParams({

            page: String(page),

            limit: String(limit)

        });

        if (filters) {

            Object.entries(filters).forEach(

                ([key, value]) => {

                    if (
                        value !== undefined &&
                        value !== null
                    ) {

                        params.append(
                            key,
                            String(value)
                        );

                    }

                }

            );

        }

        return Client.get(

            `${ENDPOINTS.HOME.FEED}?${params.toString()}`,

            {
                cache: true,
                cacheTTL: 30000
            }

        );

    }

    getFeedItem(
        postId: string
    ): Promise<ApiResponse<FeedItem>> {

        return Client.get(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}`

        );

    }

    /* ======================================================
       POSTS
    ====================================================== */

    createPost(
        data: CreatePostRequest
    ): Promise<ApiResponse<FeedItem>> {

        return Client.post(

            ENDPOINTS.HOME.FEED,

            data

        );

    }

    updatePost(
        postId: string,
        data: UpdatePostRequest
    ): Promise<ApiResponse<FeedItem>> {

        return Client.put(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}`,

            data

        );

    }

    deletePost(
        postId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}`

        );

    }

    /* ======================================================
       REACTIONS
    ====================================================== */

    react(

        postId: string,

        reaction: ReactionType

    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}/react`,

            {
                reaction
            }

        );

    }

    removeReaction(
        postId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}/react`

        );

    }

    /* ======================================================
       COMMENTS
    ====================================================== */

    getComments(
        postId: string
    ): Promise<ApiResponse<Comment[]>> {

        return Client.get(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}/comments`

        );

    }

    addComment(

        postId: string,

        data: CreateCommentRequest

    ): Promise<ApiResponse<Comment>> {

        return Client.post(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}/comments`,

            data

        );

    }

    deleteComment(

        postId: string,

        commentId: string

    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}/comments/${encodeURIComponent(commentId)}`

        );

    }

    /* ======================================================
       SHARES
    ====================================================== */

    share(
        postId: string
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}/share`

        );

    }

    /* ======================================================
       SAVED POSTS
    ====================================================== */

    save(
        postId: string
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}/save`

        );

    }

    unsave(
        postId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.HOME.FEED}/${encodeURIComponent(postId)}/save`

        );

    }

}
export default new HomeService();
