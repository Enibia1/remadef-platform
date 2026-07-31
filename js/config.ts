    },
/* ==========================================================
   REMADEF PLATFORM
   Global Configuration
   File: js/config.ts
========================================================== */

export const CONFIG = {

    /* ======================================================
       APPLICATION
    ====================================================== */

    app: {

        name: "REMADEF Platform",

        version: "1.0.0",

        environment: "production",

        debug: false

    },

    /* ======================================================
       API
    ====================================================== */

    api: {

        baseUrl: "/api",

        timeout: 30000,

        retries: 2

    },

    /* ======================================================
       APPWRITE
    ====================================================== */

    appwrite: {

        endpoint:
            "https://fra.cloud.appwrite.io/v1",

        projectId:
            "6a634fdc00148a907132",

        functionId:
            "6a6380f40035f4b76305",

        databaseId:
            "6a66577c000d17565b18",

        storageBucketId:
            "",

        tables: {

            profiles:
                "profiles",

            conversations:
                "conversations",

            conversationMembers:
                "conversation_members",

            messages:
                "messages",

            notifications:
                "notifications",

            learning:
                "learning",

            jobs:
                "jobs",

            applications:
                "applications",

            businesses:
                "businesses",

            marketplace:
                "marketplace",

            wallets:
                "wallets",

            transactions:
                "transactions",

            escrows:
                "escrows",

            giftCards:
                "remadef_gift_cards"

        }

    },

    /* ======================================================
       SIDEBAR
    ====================================================== */

    sidebar: {

        collapsible: true,

        collapsedWidth: 80,

        expandedWidth: 260,

        mobileBreakpoint: 768,

        animationSpeed: 250

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

        floatingTab: true,

        saveDrafts: true,

        autoDeleteHours: 48,

        emojiOnlyComposer: true

    },

    /* ======================================================
       HOME FEED
    ====================================================== */

    feed: {

        infiniteScroll: true,

        pageSize: 20,

        preloadDistance: 300,

        skeletonCards: 6,

        autoplayMedia: false,

        cacheFeeds: true

    },

    /* ======================================================
       SEARCH
    ====================================================== */

    search: {

        liveSearch: true,

        debounce: 300,

        minimumCharacters: 2

    },

    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    notifications: {

        refreshInterval: 30000,

        grouped: true,

        desktop: true

    },

    /* ======================================================
       WALLET
    ====================================================== */

    wallet: {

        enabled: true,

        currency: "NGN",

        symbol: "₦",

        decimals: 2,

        allowBankFunding: true,

        allowGiftCards: true,

        allowTransfers: true

    },

    /* ======================================================
       ESCROW
    ====================================================== */

    escrow: {

        enabled: true,

        allowDisputes: true,

        autoRelease: false

    },

    /* ======================================================
       PROFILE
    ====================================================== */

    profile: {

        minimumCompletion: 80,

        showProgress: true

    },

    /* ======================================================
       FILES
    ====================================================== */

    uploads: {

        imageSize:
            5 * 1024 * 1024,

        documentSize:
            20 * 1024 * 1024,

        avatarSize:
            2 * 1024 * 1024

    },

    /* ======================================================
       UI
    ====================================================== */

    ui: {

        theme: "light",

        roundedCorners: 16,

        animationDuration: 250,

        useSvgIcons: true,

        useLucideIcons: true

    },

    /* ======================================================
       SECURITY
    ====================================================== */

    security: {

        sessionTimeout:
            1800000,

        rememberUser: true

    },

    /* ======================================================
       MODULES
    ====================================================== */

    modules: {

        home: true,

        learning: true,

        jobs: true,

        apprenticeship: true,

        business: true,

        marketplace: false,

        community: false,

        messages: true,

        wallet: true,

        escrow: true,

        notifications: true,

        settings: true

    }

} as const;

export default CONFIG;
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
