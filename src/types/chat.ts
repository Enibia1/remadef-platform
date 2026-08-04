/* ==========================================================
   REMADEF PLATFORM
   CHAT TYPES
   File: src/types/chat.ts

   PURPOSE
   ----------------------------------------------------------
   Chat session types used by the Messages module.

   USED BY
   ----------------------------------------------------------
   • Messages
   • Conversation List
   • Chat Window
   • Online Presence
   • Archived Chats
========================================================== */

import type {

    ID,
    Timestamp,
    ApiResponse

} from "./common";

import type {

    Conversation

} from "./conversation";

import type {

    Message

} from "./message";

/* ==========================================================
   USER PRESENCE
========================================================== */

export type PresenceStatus =
    | "online"
    | "away"
    | "busy"
    | "offline";

/* ==========================================================
   USER PRESENCE
========================================================== */

export interface UserPresence {

    userId: ID;

    status: PresenceStatus;

    lastSeen?: Timestamp;

    device?: string;
}

/* ==========================================================
   CHAT SETTINGS
========================================================== */

export interface ChatSettings {

    muted: boolean;

    pinned: boolean;

    archived: boolean;

    notifications: boolean;

    disappearingMessages: boolean;

    disappearingHours?: number;
}

/* ==========================================================
   CHAT SUMMARY
========================================================== */

export interface ChatSummary {

    conversationId: ID;

    title: string;

    avatar?: string;

    lastMessage?: Message;

    unreadCount: number;

    presence?: UserPresence;

    settings: ChatSettings;

    updatedAt: Timestamp;
}

/* ==========================================================
   ACTIVE CHAT
========================================================== */

export interface ActiveChat {

    conversation: Conversation;

    messages: Message[];

    hasMore: boolean;

    oldestMessageId?: ID;

    newestMessageId?: ID;

    typingUsers: ID[];

    draft?: string;
}

/* ==========================================================
   CHAT DRAFT
========================================================== */

export interface ChatDraft {

    conversationId: ID;

    content: string;

    updatedAt: Timestamp;
}

/* ==========================================================
   PINNED CHAT
========================================================== */

export interface PinnedChat {

    conversationId: ID;

    pinnedAt: Timestamp;
}

/* ==========================================================
   ARCHIVED CHAT
========================================================== */

export interface ArchivedChat {

    conversationId: ID;

    archivedAt: Timestamp;
}

/* ==========================================================
   CHAT FILTER
========================================================== */

export interface ChatFilter {

    archived?: boolean;

    pinned?: boolean;

    muted?: boolean;

    unreadOnly?: boolean;

    onlineOnly?: boolean;

    page?: number;

    limit?: number;
}

/* ==========================================================
   CHAT RESPONSES
========================================================== */

export type ChatSummaryResponse =
    ApiResponse<ChatSummary>;

export type ChatListResponse =
    ApiResponse<ChatSummary[]>;

export type ActiveChatResponse =
    ApiResponse<ActiveChat>;

export type ChatDraftResponse =
    ApiResponse<ChatDraft[]>;

export type PresenceResponse =
    ApiResponse<UserPresence[]>;
