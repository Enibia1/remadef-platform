/* ==========================================================
   REMADEF PLATFORM
   Notification Types
   File: src/types/notification.ts
========================================================== */

import type {
    BaseEntity,
    UserReference,
    Pagination
} from "./common";

/* ==========================================================
   NOTIFICATION TYPE
========================================================== */

export type NotificationType =
    | "system"
    | "message"
    | "comment"
    | "mention"
    | "reaction"
    | "follow"
    | "connection"
    | "job"
    | "learning"
    | "apprenticeship"
    | "business"
    | "wallet"
    | "escrow"
    | "marketplace"
    | "verification"
    | "security"
    | "promotion"
    | "announcement";

/* ==========================================================
   PRIORITY
========================================================== */

export type NotificationPriority =
    | "low"
    | "normal"
    | "high"
    | "urgent";

/* ==========================================================
   NOTIFICATION
========================================================== */

export interface Notification
    extends BaseEntity {

    type: NotificationType;

    title: string;

    message: string;

    sender?: UserReference;

    image?: string;

    actionUrl?: string;

    actionLabel?: string;

    metadata?: Record<string, any>;

    priority: NotificationPriority;

    read: boolean;

    readAt?: string;

}

/* ==========================================================
   UNREAD COUNT
========================================================== */

export interface NotificationCount {

    total: number;

    unread: number;

}

/* ==========================================================
   FILTER
========================================================== */

export interface NotificationFilter {

    type?: NotificationType;

    read?: boolean;

    priority?: NotificationPriority;

    from?: string;

    to?: string;

    page?: number;

    limit?: number;

}

/* ==========================================================
   PREFERENCES
========================================================== */

export interface NotificationPreference {

    email: boolean;

    push: boolean;

    sms: boolean;

    inApp: boolean;

    sound: boolean;

    vibration: boolean;

    marketing: boolean;

    security: boolean;

    messages: boolean;

    jobs: boolean;

    learning: boolean;

    apprenticeship: boolean;

    business: boolean;

    wallet: boolean;

    marketplace: boolean;

}

/* ==========================================================
   DEVICE TOKEN
========================================================== */

export interface NotificationDevice {

    token: string;

    platform:
        | "web"
        | "android"
        | "ios";

}

/* ==========================================================
   PAGE
========================================================== */

export interface NotificationPage {

    items: Notification[];

    pagination: Pagination;

}
