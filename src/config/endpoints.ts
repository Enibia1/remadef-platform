/* ==========================================================
   REMADEF PLATFORM
   API ENDPOINTS
   File: src/config/endpoints.ts

   PURPOSE
   ----------------------------------------------------------
   Single source of truth for every backend endpoint.

   RULES
   ----------------------------------------------------------
   • Never hardcode "/api/..." anywhere else.
   • API.ts must import these endpoints.
   • New modules only add endpoints here.
   • Dormant modules remain registered but disabled.
========================================================== */

import CONFIG from "./config";

/* ==========================================================
   API ROOT
========================================================== */

export const API_ROOT =
    CONFIG.api.baseUrl;

/* ==========================================================
   AUTHENTICATION
========================================================== */

export const AUTH_ENDPOINTS = {

    HEALTH:
        `${API_ROOT}/health`,

    REGISTER:
        `${API_ROOT}/register`,

    LOGIN:
        `${API_ROOT}/login`,

    LOGOUT:
        `${API_ROOT}/logout`,

    SESSION:
        `${API_ROOT}/session`,

    ME:
        `${API_ROOT}/me`,

    VERIFY_EMAIL:
        `${API_ROOT}/verify-email`,

    FORGOT_PASSWORD:
        `${API_ROOT}/forgot-password`,

    RESET_PASSWORD:
        `${API_ROOT}/reset-password`

} as const;

/* ==========================================================
   PROFILE
========================================================== */

export const PROFILE_ENDPOINTS = {

    GET:
        `${API_ROOT}/profile`,

    UPDATE:
        `${API_ROOT}/profile`,

    PHOTO:
        `${API_ROOT}/profile/photo`,

    COVER:
        `${API_ROOT}/profile/cover`

} as const;

/* ==========================================================
   HOME
========================================================== */

export const HOME_ENDPOINTS = {

    DASHBOARD:
        `${API_ROOT}/dashboard`,

    FEED:
        `${API_ROOT}/feed`,

    STORIES:
        `${API_ROOT}/stories`,

    REELS:
        `${API_ROOT}/reels`

} as const;

/* ==========================================================
   SEARCH
========================================================== */

export const SEARCH_ENDPOINTS = {

    SEARCH:
        `${API_ROOT}/search`,

    TRENDING:
        `${API_ROOT}/search/trending`

} as const;

/* ==========================================================
   NOTIFICATIONS
========================================================== */

export const NOTIFICATION_ENDPOINTS = {

    LIST:
        `${API_ROOT}/notifications`,

    READ:
        `${API_ROOT}/notifications/read`,

    READ_ALL:
        `${API_ROOT}/notifications/read-all`

} as const;

/* ==========================================================
   MESSAGES
========================================================== */

export const MESSAGE_ENDPOINTS = {

    CONVERSATIONS:
        `${API_ROOT}/conversations`,

    MESSAGES:
        `${API_ROOT}/messages`,

    SEND:
        `${API_ROOT}/messages`,

    DELETE:
        `${API_ROOT}/messages/delete`

} as const;

/* ==========================================================
   WALLET
========================================================== */

export const WALLET_ENDPOINTS = {

    WALLET:
        `${API_ROOT}/wallet`,

    BALANCE:
        `${API_ROOT}/wallet/balance`,

    TRANSACTIONS:
        `${API_ROOT}/wallet/transactions`,

    FUND:
        `${API_ROOT}/wallet/fund`,

    WITHDRAW:
        `${API_ROOT}/wallet/withdraw`,

    TRANSFER:
        `${API_ROOT}/wallet/transfer`

} as const;

/* ==========================================================
   ESCROW
========================================================== */

export const ESCROW_ENDPOINTS = {

    LIST:
        `${API_ROOT}/escrow`,

    CREATE:
        `${API_ROOT}/escrow/create`,

    RELEASE:
        `${API_ROOT}/escrow/release`,

    DISPUTE:
        `${API_ROOT}/escrow/dispute`

} as const;

/* ==========================================================
   LEARNING
========================================================== */

export const LEARNING_ENDPOINTS = {

    COURSES:
        `${API_ROOT}/learning/courses`,

    COURSE:
        `${API_ROOT}/learning/course`,

    ENROLL:
        `${API_ROOT}/learning/enroll`,

    LESSON:
        `${API_ROOT}/learning/lesson`

} as const;

/* ==========================================================
   APPRENTICESHIP
========================================================== */

export const APPRENTICESHIP_ENDPOINTS = {

    LIST:
        `${API_ROOT}/apprenticeships`,

    APPLY:
        `${API_ROOT}/apprenticeships/apply`,

    TRACK:
        `${API_ROOT}/apprenticeships/track`

} as const;

/* ==========================================================
   JOBS
========================================================== */

export const JOB_ENDPOINTS = {

    JOBS:
        `${API_ROOT}/jobs`,

    APPLY:
        `${API_ROOT}/jobs/apply`,

    SAVED:
        `${API_ROOT}/jobs/saved`

} as const;

/* ==========================================================
   BUSINESS
========================================================== */

export const BUSINESS_ENDPOINTS = {

    LIST:
        `${API_ROOT}/businesses`,

    PROFILE:
        `${API_ROOT}/business/profile`,

    PRODUCTS:
        `${API_ROOT}/business/products`

} as const;

/* ==========================================================
   DORMANT MODULES
========================================================== */

export const DORMANT_ENDPOINTS = {

    MARKETPLACE:
        `${API_ROOT}/marketplace`,

    HEALTHCARE:
        `${API_ROOT}/healthcare`,

    GOVERNMENT:
        `${API_ROOT}/government`,

    REAL_ESTATE:
        `${API_ROOT}/real-estate`,

    AI:
        `${API_ROOT}/ai`,

    ADMIN:
        `${API_ROOT}/admin`

} as const;

/* ==========================================================
   EXPORT
========================================================== */

export default {

    AUTH_ENDPOINTS,

    PROFILE_ENDPOINTS,

    HOME_ENDPOINTS,

    SEARCH_ENDPOINTS,

    NOTIFICATION_ENDPOINTS,

    MESSAGE_ENDPOINTS,

    WALLET_ENDPOINTS,

    ESCROW_ENDPOINTS,

    LEARNING_ENDPOINTS,

    APPRENTICESHIP_ENDPOINTS,

    JOB_ENDPOINTS,

    BUSINESS_ENDPOINTS,

    DORMANT_ENDPOINTS

};
