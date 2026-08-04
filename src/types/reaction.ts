/* ==========================================================
   REMADEF PLATFORM
   REACTION TYPES
   File: src/types/reaction.ts

   PURPOSE
   ----------------------------------------------------------
   Shared reaction types used throughout the platform.

   USED BY
   ----------------------------------------------------------
   • Posts
   • Comments
   • Messages
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

/* ==========================================================
   REACTION TYPE
========================================================== */

export type ReactionType =
    | "like"
    | "love"
    | "celebrate"
    | "support"
    | "insightful"
    | "funny"
    | "wow"
    | "sad"
    | "angry";

/* ==========================================================
   REACTION TARGET
========================================================== */

export type ReactionTarget =
    | "post"
    | "comment"
    | "message"
    | "course"
    | "lesson"
    | "business"
    | "job"
    | "product";

/* ==========================================================
   REACTION USER
========================================================== */

export interface ReactionUser {

    id: ID;

    username: string;

    displayName: string;

    avatar?: string;

    verified: boolean;
}

/* ==========================================================
   REACTION
========================================================== */

export interface Reaction {

    id: ID;

    targetId: ID;

    targetType: ReactionTarget;

    type: ReactionType;

    user: ReactionUser;

    createdAt: Timestamp;
}

/* ==========================================================
   CREATE REACTION
========================================================== */

export interface CreateReactionRequest {

    targetId: ID;

    targetType: ReactionTarget;

    type: ReactionType;
}

/* ==========================================================
   UPDATE REACTION
========================================================== */

export interface UpdateReactionRequest {

    type: ReactionType;
}

/* ==========================================================
   REACTION COUNT
========================================================== */

export interface ReactionCount {

    type: ReactionType;

    count: number;
}

/* ==========================================================
   REACTION SUMMARY
========================================================== */

export interface ReactionSummary {

    total: number;

    userReaction?: ReactionType;

    counts: ReactionCount[];
}

/* ==========================================================
   REACTION FILTER
========================================================== */

export interface ReactionFilter {

    targetId: ID;

    targetType: ReactionTarget;

    type?: ReactionType;

    page?: number;

    limit?: number;
}

/* ==========================================================
   API RESPONSES
========================================================== */

export type ReactionResponse =
    ApiResponse<Reaction>;

export type ReactionsResponse =
    ApiResponse<Reaction[]>;

export type ReactionSummaryResponse =
    ApiResponse<ReactionSummary>;
