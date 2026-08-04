/* ==========================================================
   REMADEF PLATFORM
   FEED TYPES
   File: src/types/feed.ts

   PURPOSE
   ----------------------------------------------------------
   Types used by the REMADEF Home Feed.

   USED BY
   ----------------------------------------------------------
   • Home
   • Profile
   • Learning
   • Apprenticeship
   • Business
   • Jobs
========================================================== */

import type {

    ID,
    Timestamp,
    ApiResponse

} from "./common";

import type {

    Post

} from "./post";

/* ==========================================================
   FEED TYPE
========================================================== */

export type FeedType =
    | "home"
    | "following"
    | "discover"
    | "trending"
    | "learning"
    | "apprenticeship"
    | "business"
    | "jobs"
    | "saved";

/* ==========================================================
   SORT ORDER
========================================================== */

export type FeedSort =
    | "latest"
    | "popular"
    | "trending"
    | "recommended";

/* ==========================================================
   FILTER
========================================================== */

export interface FeedFilter {

    type?: FeedType;

    authorId?: ID;

    postType?: string;

    hashtag?: string;

    verifiedOnly?: boolean;

    mediaOnly?: boolean;

    bookmarked?: boolean;

    sort?: FeedSort;
}

/* ==========================================================
   FEED REQUEST
========================================================== */

export interface FeedRequest {

    page?: number;

    limit?: number;

    filter?: FeedFilter;
}

/* ==========================================================
   FEED PAGINATION
========================================================== */

export interface FeedPagination {

    page: number;

    limit: number;

    total: number;

    totalPages: number;

    hasNext: boolean;

    hasPrevious: boolean;
}

/* ==========================================================
   FEED RESPONSE
========================================================== */

export interface Feed {

    posts: Post[];

    pagination: FeedPagination;

    generatedAt: Timestamp;
}

/* ==========================================================
   FEED ITEM
========================================================== */

export interface FeedItem {

    id: ID;

    post: Post;

    position: number;

    sponsored: boolean;

    recommendationScore?: number;
}

/* ==========================================================
   SAVED POST
========================================================== */

export interface SavedPost {

    id: ID;

    postId: ID;

    savedAt: Timestamp;
}

/* ==========================================================
   BOOKMARK
========================================================== */

export interface Bookmark {

    id: ID;

    postId: ID;

    createdAt: Timestamp;
}

/* ==========================================================
   HASHTAG
========================================================== */

export interface TrendingHashtag {

    tag: string;

    posts: number;

    growth: number;
}

/* ==========================================================
   FEED STATS
========================================================== */

export interface FeedStats {

    totalPosts: number;

    unreadPosts: number;

    sponsoredPosts: number;

    trendingPosts: number;
}

/* ==========================================================
   API RESPONSES
========================================================== */

export type FeedResponse =
    ApiResponse<Feed>;

export type FeedStatsResponse =
    ApiResponse<FeedStats>;

export type SavedPostsResponse =
    ApiResponse<SavedPost[]>;

export type TrendingHashtagsResponse =
    ApiResponse<TrendingHashtag[]>;
