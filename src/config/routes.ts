/* ==========================================================
   REMADEF PLATFORM
   ROUTES
   File: src/config/routes.ts

   PURPOSE
   ----------------------------------------------------------
   Central routing registry.

   RULES
   ----------------------------------------------------------
   • Never hardcode page paths anywhere else.
   • Import ROUTES instead.
   • Supports active and dormant modules.
========================================================== */

export const ROUTES = {

    /* ======================================================
       ROOT
    ====================================================== */

    ROOT: "/",

    INDEX: "/index.html",

    HOME: "/html/home.html",

    /* ======================================================
       AUTHENTICATION
    ====================================================== */

    LOGIN: "/html/login.html",

    REGISTER: "/html/register.html",

    FORGOT_PASSWORD:
        "/html/forgot-password.html",

    RESET_PASSWORD:
        "/html/reset-password.html",

    VERIFY_EMAIL:
        "/html/verify-email.html",

    PROFILE_COMPLETION:
        "/html/profile-completion.html",

    /* ======================================================
       PROFILE
    ====================================================== */

    PROFILE:
        "/html/profile.html",

    EDIT_PROFILE:
        "/html/profile-edit.html",

    SETTINGS:
        "/html/settings.html",

    /* ======================================================
       CORE
    ====================================================== */

    SEARCH:
        "/html/search.html",

    NOTIFICATIONS:
        "/html/notifications.html",

    MESSAGES:
        "/html/messages.html",

    WALLET:
        "/html/wallet.html",

    ESCROW:
        "/html/escrow.html",

    /* ======================================================
       OPPORTUNITY MODULES
    ====================================================== */

    LEARNING:
        "/html/learning.html",

    APPRENTICESHIP:
        "/html/apprenticeship.html",

    JOBS:
        "/html/jobs.html",

    BUSINESS:
        "/html/business.html",

    /* ======================================================
       DORMANT MODULES
    ====================================================== */

    MARKETPLACE:
        "/html/marketplace.html",

    COMMUNITY:
        "/html/community.html",

    STORIES:
        "/html/stories.html",

    REELS:
        "/html/reels.html",

    HEALTHCARE:
        "/html/healthcare.html",

    GOVERNMENT:
        "/html/government.html",

    REAL_ESTATE:
        "/html/real-estate.html",

    AI:
        "/html/ai.html",

    ADMIN:
        "/html/admin.html"

} as const;


/* ==========================================================
   PUBLIC PAGES
========================================================== */

export const PUBLIC_ROUTES = [

    ROUTES.LOGIN,

    ROUTES.REGISTER,

    ROUTES.FORGOT_PASSWORD,

    ROUTES.RESET_PASSWORD,

    ROUTES.VERIFY_EMAIL

] as const;


/* ==========================================================
   PROTECTED PAGES
========================================================== */

export const PROTECTED_ROUTES = [

    ROUTES.HOME,

    ROUTES.PROFILE,

    ROUTES.PROFILE_COMPLETION,

    ROUTES.MESSAGES,

    ROUTES.NOTIFICATIONS,

    ROUTES.SEARCH,

    ROUTES.WALLET,

    ROUTES.ESCROW,

    ROUTES.LEARNING,

    ROUTES.APPRENTICESHIP,

    ROUTES.JOBS,

    ROUTES.BUSINESS,

    ROUTES.SETTINGS

] as const;


/* ==========================================================
   DEFAULT REDIRECTS
========================================================== */

export const DEFAULT_ROUTES = {

    AFTER_LOGIN:
        ROUTES.HOME,

    AFTER_REGISTER:
        ROUTES.PROFILE_COMPLETION,

    AFTER_LOGOUT:
        ROUTES.LOGIN,

    UNAUTHORIZED:
        ROUTES.LOGIN,

    NOT_FOUND:
        ROUTES.HOME

} as const;


/* ==========================================================
   HELPERS
========================================================== */

export function isPublicRoute(
    route: string
): boolean {

    return PUBLIC_ROUTES.includes(
        route as typeof PUBLIC_ROUTES[number]
    );
}

export function isProtectedRoute(
    route: string
): boolean {

    return PROTECTED_ROUTES.includes(
        route as typeof PROTECTED_ROUTES[number]
    );
}

export default ROUTES;
