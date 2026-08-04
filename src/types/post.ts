/* ==========================================================
   REMADEF PLATFORM
   POST TYPES
   File: src/types/post.ts

   PURPOSE
   ----------------------------------------------------------
   Shared types for the Home Feed and every module capable of
   publishing content.

   USED BY
   ----------------------------------------------------------
   • Home Feed
   • Profile
   • Business
   • Learning
   • Apprenticeship
   • Jobs
   • Future Marketplace
========================================================== */

import type {

    ID,
    Timestamp,
    Status,
    ApiResponse

} from "./common";

/* ==========================================================
   POST TYPE
========================================================== */

export type PostType =
    | "text"
    | "image"
    | "video"
    | "audio"
    | "document"
    | "poll"
    | "event"
    | "job"
    | "business"
    | "learning"
    | "apprenticeship"
    | "achievement"
    | "announcement";

/* ==========================================================
   POST VISIBILITY
========================================================== */

export type PostVisibility =
    | "public"
    | "followers"
    | "connections"
    | "private";

/* ==========================================================
   ATTACHMENT
========================================================== */

export interface PostAttachment {

    id: ID;

    name: string;

    url: string;

    type: string;

    size: number;

    width?: number;

    height?: number;

    duration?: number;

    thumbnail?: string;
}

/* ==========================================================
   LOCATION
========================================================== */

export interface PostLocation {

    country?: string;

    state?: string;

    city?: string;

    latitude?: number;

    longitude?: number;
}

/* ==========================================================
   POLL
========================================================== */

export interface PollOption {

    id: ID;

    text: string;

    votes: number;
}

export interface Poll {

    multipleChoice: boolean;

    expiresAt?: Timestamp;

    options: PollOption[];
}

/* ==========================================================
   POST STATISTICS
========================================================== */

export interface PostStats {

    views: number;

    reactions: number;

    comments: number;

    shares: number;

    bookmarks: number;
}

/* ==========================================================
   POST AUTHOR
========================================================== */

export interface PostAuthor {

    id: ID;

    username: string;

    displayName: string;

    avatar?: string;

    verified: boolean;
}

/* ==========================================================
   POST
========================================================== */

export interface Post {

    id: ID;

    author: PostAuthor;

    type: PostType;

    visibility: PostVisibility;

    content: string;

    attachments: PostAttachment[];

    hashtags: string[];

    mentions: string[];

    location?: PostLocation;

    poll?: Poll;

    pinned: boolean;

    edited: boolean;

    commentsEnabled: boolean;

    stats: PostStats;

    status: Status;

    createdAt: Timestamp;

    updatedAt: Timestamp;
}

/* ==========================================================
   CREATE POST
========================================================== */

export interface CreatePostRequest {

    type: PostType;

    content: string;

    visibility?: PostVisibility;

    attachments?: PostAttachment[];

    hashtags?: string[];

    mentions?: string[];

    location?: PostLocation;

    poll?: Poll;
}

/* ==========================================================
   UPDATE POST
========================================================== */

export interface UpdatePostRequest {

    content?: string;

    visibility?: PostVisibility;

    attachments?: PostAttachment[];

    hashtags?: string[];

    mentions?: string[];

    location?: PostLocation;

    commentsEnabled?: boolean;
}

/* ==========================================================
   API RESPONSES
========================================================== */

export type PostResponse =
    ApiResponse<Post>;

export type PostsResponse =
    ApiResponse<Post[]>;

export type CreatePostResponse =
    ApiResponse<Post>;

export type UpdatePostResponse =
    ApiResponse<Post>;
