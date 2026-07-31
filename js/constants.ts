/* ==========================================================
   REMADEF PLATFORM
   Global Constants
   File: js/constants.ts
   Description:
   Permanent constants used throughout the platform.
========================================================== */

/* ==========================================================
   APPLICATION
========================================================== */

export const APP = {
    NAME: "REMADEF Platform",
    SHORT_NAME: "REMADEF",
    VERSION: "1.0.0"
} as const;

/* ==========================================================
   LOCAL STORAGE KEYS
========================================================== */

export const STORAGE_KEYS = {
    SESSION: "remadef_session",
    USER: "remadef_user",
    PROFILE: "remadef_profile",
    SETTINGS: "remadef_settings",
    TOKEN: "remadef_token",
    SIDEBAR: "remadef_sidebar",
    MESSAGES: "remadef_messages",
    DRAFTS: "remadef_drafts",
    NOTIFICATIONS: "remadef_notifications"
} as const;

/* ==========================================================
   USER ROLES
========================================================== */

export const USER_ROLES = {
    STUDENT: "student",
    APPRENTICE: "apprentice",
    TRAINER: "trainer",
    EMPLOYER: "employer",
    BUSINESS: "business",
    INVESTOR: "investor",
    STAFF: "staff",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin"
} as const;

/* ==========================================================
   PROFILE STATUS
========================================================== */

export const PROFILE_STATUS = {
    INCOMPLETE: "incomplete",
    PENDING: "pending",
    VERIFIED: "verified",
    SUSPENDED: "suspended"
} as const;

/* ==========================================================
   MESSAGE TYPES
========================================================== */

export const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file",
    AUDIO: "audio",
    VIDEO: "video",
    SYSTEM: "system"
} as const;

/* ==========================================================
   NOTIFICATION TYPES
========================================================== */

export const NOTIFICATION_TYPES = {
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
    MESSAGE: "message"
} as const;

/* ==========================================================
   FEED TYPES
========================================================== */

export const FEED_TYPES = {
    COMMUNITY: "community",
    LEARNING: "learning",
    BUSINESS: "business",
    OPPORTUNITY: "opportunity",
    SYSTEM: "system"
} as const;

/* ==========================================================
   WALLET
========================================================== */

export const TRANSACTION_STATUS = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
    CANCELLED: "cancelled"
} as const;

/* ==========================================================
   ESCROW
========================================================== */

export const ESCROW_STATUS = {
    CREATED: "created",
    FUNDED: "funded",
    RELEASED: "released",
    DISPUTED: "disputed",
    REFUNDED: "refunded"
} as const;

/* ==========================================================
   MODULES
========================================================== */

export const MODULES = [
    "home",
    "profile",
    "messages",
    "learning",
    "apprenticeship",
    "business",
    "wallet",
    "escrow",
    "settings",
    "help"
] as const;

/* ==========================================================
   API ENDPOINTS
========================================================== */

export const API_ENDPOINTS = {
    LOGIN: "/api/login",
    LOGOUT: "/api/logout",
    REGISTER: "/api/register",
    PROFILE: "/api/profile",
    DASHBOARD: "/api/dashboard",
    MESSAGES: "/api/messages",
    LEARNING: "/api/learning",
    BUSINESS: "/api/business",
    WALLET: "/api/wallet",
    ESCROW: "/api/escrow",
    NOTIFICATIONS: "/api/notifications",
    SEARCH: "/api/search"
} as const;
