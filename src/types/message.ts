/* ==========================================================
   REMADEF PLATFORM
   MESSAGE TYPES
   File: src/types/message.ts

   PURPOSE
   ----------------------------------------------------------
   Shared message types used throughout REMADEF Messaging.

   FEATURES
   ----------------------------------------------------------
   • Direct Messages
   • Group Messages
   • Replies
   • Forwarding
   • Attachments
   • Read Receipts
   • Reactions
   • Typing
   • Delivery Status
   • End-to-End Encryption
   • 72 Hour Auto Deletion
========================================================== */

import type {

    ID,
    Timestamp,
    ApiResponse

} from "./common";

import type {

    ReactionSummary

} from "./reaction";

/* ==========================================================
   MESSAGE TYPE
========================================================== */

export type MessageType =
    | "text"
    | "image"
    | "video"
    | "audio"
    | "file"
    | "location"
    | "contact"
    | "system";

/* ==========================================================
   DELIVERY STATUS
========================================================== */

export type MessageStatus =
    | "sending"
    | "sent"
    | "delivered"
    | "read"
    | "failed";

/* ==========================================================
   ATTACHMENT
========================================================== */

export interface MessageAttachment {

    id: ID;

    name: string;

    type: string;

    url: string;

    thumbnail?: string;

    size: number;

    width?: number;

    height?: number;

    duration?: number;
}

/* ==========================================================
   MESSAGE USER
========================================================== */

export interface MessageUser {

    id: ID;

    username: string;

    displayName: string;

    avatar?: string;

    verified: boolean;
}

/* ==========================================================
   REPLY
========================================================== */

export interface MessageReply {

    messageId: ID;

    senderId: ID;

    content: string;

    type: MessageType;
}

/* ==========================================================
   READ RECEIPT
========================================================== */

export interface ReadReceipt {

    userId: ID;

    readAt: Timestamp;
}

/* ==========================================================
   ENCRYPTION
========================================================== */

export interface EncryptionMetadata {

    encrypted: boolean;

    algorithm?: string;

    keyVersion?: string;
}

/* ==========================================================
   AUTO DELETE
========================================================== */

export interface AutoDelete {

    enabled: boolean;

    expiresAt?: Timestamp;

    durationHours: number;
}

/* ==========================================================
   MESSAGE
========================================================== */

export interface Message {

    id: ID;

    conversationId: ID;

    sender: MessageUser;

    type: MessageType;

    content: string;

    attachments: MessageAttachment[];

    reply?: MessageReply;

    forwarded: boolean;

    edited: boolean;

    deleted: boolean;

    status: MessageStatus;

    reactions?: ReactionSummary;

    readReceipts: ReadReceipt[];

    encryption: EncryptionMetadata;

    autoDelete: AutoDelete;

    createdAt: Timestamp;

    updatedAt: Timestamp;
}

/* ==========================================================
   SEND MESSAGE
========================================================== */

export interface SendMessageRequest {

    content: string;

    type?: MessageType;

    attachments?: MessageAttachment[];

    replyTo?: ID;
}

/* ==========================================================
   UPDATE MESSAGE
========================================================== */

export interface UpdateMessageRequest {

    content: string;
}

/* ==========================================================
   MESSAGE SEARCH
========================================================== */

export interface MessageSearchFilter {

    conversationId?: ID;

    query?: string;

    senderId?: ID;

    type?: MessageType;

    fromDate?: Timestamp;

    toDate?: Timestamp;

    page?: number;

    limit?: number;
}

/* ==========================================================
   MESSAGE RESPONSE
========================================================== */

export type MessageResponse =
    ApiResponse<Message>;

export type MessagesResponse =
    ApiResponse<Message[]>;

export type SendMessageResponse =
    ApiResponse<Message>;
