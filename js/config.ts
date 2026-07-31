/* ==========================================================
   REMADEF PLATFORM
   Global Configuration
   File: js/config.ts
   Description:
   Central configuration for the entire REMADEF Platform.
   Do NOT place business logic or API calls here.
========================================================== */

export const CONFIG = {

    /* ======================================================
       APPLICATION
    ====================================================== */
    app: {
        name: "REMADEF Platform",
        shortName: "REMADEF",
        version: "1.0.0",
        environment: "production",
        debug: false,
        timezone: "Africa/Lagos",
        locale: "en-NG"
    },

    /* ======================================================
       API
    ====================================================== */
    api: {
        baseUrl: "/api",
        timeout: 30000,
        retries: 2,
        retryDelay: 1000
    },

    /* ======================================================
       APPWRITE
    ====================================================== */
    appwrite: {
        endpoint: "",
        projectId: "",
        databaseId: "",
        storageId: "",
        functionsBase: "/api"
    },

    /* ======================================================
       ROUTING
    ====================================================== */
    routes: {
        login: "login.html",
        register: "register.html",
        home: "home.html",
        profile: "profile.html",
        learning: "learning.html",
        apprenticeship: "apprenticeship.html",
        business: "business.html",
        wallet: "wallet.html",
        settings: "settings.html",
        help: "help.html"
    },

    /* ======================================================
       SIDEBAR
    ====================================================== */
    sidebar: {
        collapsible: true,
        expandedWidth: 260,
        collapsedWidth: 80,
        mobileBreakpoint: 768,
        animationDuration: 250,
        rememberState: true
    },

    /* ======================================================
       MESSAGES
    ====================================================== */
    messages: {
        enabled: true,
        defaultWidth: 50,
        minWidth: 30,
        maxWidth: 70,
        autoCollapse: true,
        autoCollapseDelay: 60000,
        rememberWidth: true,
        floatingTab: true,
        preserveDrafts: true,
        desktopSplitView: true
    },

    /* ======================================================
       FEED
    ====================================================== */
    feed: {
        infiniteScroll: true,
        pageSize: 20,
        preloadDistance: 300,
        refreshInterval: 60000,
        skeletonCards: 6
    },

    /* ======================================================
       SEARCH
    ====================================================== */
    search: {
        enabled: true,
        liveSearch: true,
        debounce: 300,
        minimumCharacters: 2,
        maxResults: 10
    },

    /* ======================================================
       NOTIFICATIONS
    ====================================================== */
    notifications: {
        enabled: true,
        refreshInterval: 30000,
        desktop: true,
        sound: true,
        badge: true
    },

    /* ======================================================
       WALLET
    ====================================================== */
    wallet: {
        enabled: true,
        currency: "NGN",
        symbol: "₦",
        decimals: 2
    },

    /* ======================================================
       ESCROW
    ====================================================== */
    escrow: {
        enabled: true,
        disputesEnabled: true
    },

    /* ======================================================
       PROFILE
    ====================================================== */
    profile: {
        minimumCompletion: 80,
        showProgress: true,
        requireVerification: true
    },

    /* ======================================================
       FILE UPLOADS
    ====================================================== */
    uploads: {
        avatarMaxSize: 2 * 1024 * 1024,
        imageMaxSize: 5 * 1024 * 1024,
        documentMaxSize: 20 * 1024 * 1024,
        allowedImages: [
            "image/jpeg",
            "image/png",
            "image/webp"
        ],
        allowedDocuments: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]
    },

    /* ======================================================
       USER INTERFACE
    ====================================================== */
    ui: {
        theme: "light",
        useSvgIcons: true,
        roundedCorners: 16,
        animationDuration: 250,
        enableAnimations: true,
        showTooltips: true
    },

    /* ======================================================
       STORAGE
    ====================================================== */
    storage: {
        prefix: "remadef_",
        rememberSession: true
    },

    /* ======================================================
       SECURITY
    ====================================================== */
    security: {
        sessionTimeout: 1800000,
        rememberUser: true,
        idleLogout: false
    },

    /* ======================================================
       DEVELOPMENT
    ====================================================== */
    development: {
        logApiCalls: false,
        showPerformance: false
    }

} as const;

export default CONFIG;
