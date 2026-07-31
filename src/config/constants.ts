/* ==========================================================
   REMADEF PLATFORM
   GLOBAL CONSTANTS
   File: src/config/constants.ts

   PURPOSE
   ----------------------------------------------------------
   Platform-wide constants that never change at runtime.

   DO NOT STORE
   ----------------------------------------------------------
   • API logic
   • Business logic
   • User data
   • Feature flags
========================================================== */

/* ==========================================================
   APPLICATION
========================================================== */

export const APP_NAME = "REMADEF Platform";

export const APP_SHORT_NAME = "REMADEF";

export const APP_VERSION = "1.0.0";

export const COMPANY_NAME = "REMADEF";

export const COUNTRY = "Nigeria";

export const DEFAULT_LANGUAGE = "en";

export const DEFAULT_TIMEZONE = "Africa/Lagos";


/* ==========================================================
   PLATFORM
========================================================== */

export const PLATFORM_NAME = "REMADEF";

export const PLATFORM_DESCRIPTION =
    "Opportunity, Learning, Business & Economic Development Platform";


/* ==========================================================
   USER
========================================================== */

export const MINIMUM_PROFILE_COMPLETION = 80;

export const DEFAULT_AVATAR =
    "/assets/images/avatar.png";

export const DEFAULT_COVER =
    "/assets/images/cover.jpg";


/* ==========================================================
   PAGINATION
========================================================== */

export const DEFAULT_PAGE_SIZE = 20;

export const MAX_PAGE_SIZE = 100;

export const DEFAULT_FEED_SIZE = 20;


/* ==========================================================
   SEARCH
========================================================== */

export const MIN_SEARCH_LENGTH = 2;

export const SEARCH_DEBOUNCE = 300;


/* ==========================================================
   WALLET
========================================================== */

export const DEFAULT_CURRENCY = "NGN";

export const DEFAULT_CURRENCY_SYMBOL = "₦";

export const DEFAULT_DECIMALS = 2;


/* ==========================================================
   MESSAGES
========================================================== */

export const MESSAGE_PANEL_WIDTH = 50;

export const MESSAGE_MIN_WIDTH = 30;

export const MESSAGE_MAX_WIDTH = 70;

export const MESSAGE_AUTO_COLLAPSE = 60000;


/* ==========================================================
   SIDEBAR
========================================================== */

export const SIDEBAR_EXPANDED_WIDTH = 260;

export const SIDEBAR_COLLAPSED_WIDTH = 80;

export const MOBILE_BREAKPOINT = 768;


/* ==========================================================
   NOTIFICATIONS
========================================================== */

export const NOTIFICATION_REFRESH = 30000;


/* ==========================================================
   FILES
========================================================== */

export const MAX_AVATAR_SIZE =
    2 * 1024 * 1024;

export const MAX_IMAGE_SIZE =
    5 * 1024 * 1024;

export const MAX_DOCUMENT_SIZE =
    20 * 1024 * 1024;

export const MAX_VIDEO_SIZE =
    200 * 1024 * 1024;


/* ==========================================================
   DATE FORMATS
========================================================== */

export const DATE_FORMAT = "DD/MM/YYYY";

export const DATE_TIME_FORMAT =
    "DD/MM/YYYY HH:mm";


/* ==========================================================
   SESSION
========================================================== */

export const SESSION_TIMEOUT =
    30 * 60 * 1000;


/* ==========================================================
   STORAGE KEYS
========================================================== */

export const STORAGE_KEYS = {

    USER: "remadef_user",

    PROFILE: "remadef_profile",

    ACCOUNT: "remadef_account",

    SESSION: "remadef_session",

    SETTINGS: "remadef_settings",

    SIDEBAR: "remadef_sidebar",

    THEME: "remadef_theme",

    LANGUAGE: "remadef_language"

} as const;


/* ==========================================================
   DEFAULT STATUS VALUES
========================================================== */

export const STATUS = {

    ACTIVE: "active",

    INACTIVE: "inactive",

    PENDING: "pending",

    SUSPENDED: "suspended",

    DRAFT: "draft",

    APPROVED: "approved",

    REJECTED: "rejected",

    ARCHIVED: "archived"

} as const;


/* ==========================================================
   COMMON RESPONSE MESSAGES
========================================================== */

export const MESSAGES = {

    SUCCESS: "Operation completed successfully.",

    ERROR: "Something went wrong.",

    NETWORK_ERROR: "Network connection failed.",

    UNAUTHORIZED: "Authentication required.",

    FORBIDDEN: "Permission denied.",

    NOT_FOUND: "Requested resource not found."

} as const;


/* ==========================================================
   MODULE NAMES
========================================================== */

export const MODULES = {

    HOME: "home",

    LEARNING: "learning",

    APPRENTICESHIP: "apprenticeship",

    JOBS: "jobs",

    BUSINESS: "business",

    MESSAGES: "messages",

    WALLET: "wallet",

    ESCROW: "escrow",

    NOTIFICATIONS: "notifications",

    SEARCH: "search",

    SETTINGS: "settings"

} as const;
