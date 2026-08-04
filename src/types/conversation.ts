/* ==========================================================
   REMADEF PLATFORM
   CONVERSATION TYPES
   File: src/types/conversation.ts

   PURPOSE
   ----------------------------------------------------------
   Shared conversation types for REMADEF Messaging.

   USED BY
   ----------------------------------------------------------
   • Messages
   • Chat
   • Notifications
   • Search
========================================================== */

import type {

    ID,
    Timestamp,
    Status,
    ApiResponse

} from "./common";

/* ==========================================================
   CONVERSATION TYPE
========================================================== */

export type ConversationType =
    | "direct"
    | "group"
    | "channel"
    | "support";

/* ==========================================================
   MEMBER ROLE
========================================================== */

export type ConversationRole =
    | "owner"
    | "admin"
    | "moderator"
    | "member";

/* ==========================================================
   MEMBER
========================================================== */

export interface ConversationMember {

    id: ID;

    userId: ID;

    username: string;

    displayName: string;

    avatar?: string;

    verified: boolean;

    role: ConversationRole;

    joinedAt: Timestamp;

    lastReadMessageId?: ID;

    muted: boolean;
}

/* ==========================================================
   LAST MESSAGE
========================================================== */

export interface LastMessage {

    id: ID;

    senderId: ID;

    content: string;

    createdAt: Timestamp;
}

/* ==========================================================
   CONVERSATION SETTINGS
========================================================== */

export interface ConversationSettings {

    onlyAdminsCanPost: boolean;

    onlyAdminsCanAddMembers: boolean;

    disappearingMessages: boolean;

    disappearingAfterHours?: number;
}

/* ==========================================================
   CONVERSATION
========================================================== */

export interface Conversation {

    id: ID;

    type: ConversationType;

    title?: string;

    description?: string;

    avatar?: string;

    ownerId: ID;

    members: ConversationMember[];

    memberCount: number;

    lastMessage?: LastMessage;

    unreadCount: number;

    pinned: boolean;

    archived: boolean;

    muted: boolean;

    settings: ConversationSettings;

    status: Status;

    createdAt: Timestamp;

    updatedAt: Timestamp;
}

/* ==========================================================
   CREATE CONVERSATION
========================================================== */

export interface CreateConversationRequest {

    type: ConversationType;

    title?: string;

    description?: string;

    memberIds: ID[];

    avatar?: string;
}

/* ==========================================================
   UPDATE CONVERSATION
========================================================== */

export interface UpdateConversationRequest {

    title?: string;

    description?: string;

    avatar?: string;

    settings?: Partial<ConversationSettings>;
}

/* ==========================================================
   CONVERSATION FILTER
========================================================== */

export interface ConversationFilter {

    archived?: boolean;

    muted?: boolean;

    pinned?: boolean;

    type?: ConversationType;

    page?: number;

    limit?: number;
}

/* ==========================================================
   INVITATION
========================================================== */

export interface ConversationInvite {

    conversationId: ID;

    invitedUserId: ID;

    invitedBy: ID;

    createdAt: Timestamp;
}

/* ==========================================================
   API RESPONSES
========================================================== */

export type ConversationResponse =
    ApiResponse<Conversation>;

export type ConversationsResponse =
    ApiResponse<Conversation[]>;

export type ConversationMemberResponse =
    ApiResponse<ConversationMember>;

export type ConversationInviteResponse =
    ApiResponse<ConversationInvite>;
