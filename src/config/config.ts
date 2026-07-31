/* ==========================================================
   REMADEF PLATFORM
   MASTER CONFIGURATION
   File: src/config/config.ts

   PURPOSE
   ----------------------------------------------------------
   Single source of truth for platform configuration.

   NOTE
   ----------------------------------------------------------
   This file contains configuration only.

   Business logic belongs in:
       core/
       services/
       api.ts
       auth.ts

   Modules should NEVER hardcode values.
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
       Uses api.ts
    ====================================================== */

    api: {

        baseUrl: "/api",

        timeout: 30000,

        retries: 2,

        cache: true,

        cacheTTL: 300000
    },

    /* ======================================================
       APPWRITE
       Uses appwrite.ts
    ====================================================== */

    appwrite: {

        endpoint: "https://fra.cloud.appwrite.io/v1",

        projectId: "6a634fdc00148a907132",

        databaseId: "6a66577c000d17565b18",

        functionId: "6a6380f40035f4b76305",

        tables: {

            profiles: "profiles",

            conversations: "conversations",

            conversationMembers: "conversation_members",

            messages: "messages",

            wallets: "wallets",

            transactions: "transactions",

            escrows: "escrows",

            notifications: "notifications",

            businesses: "businesses",

            jobs: "jobs",

            learning: "learning",

            applications: "applications",

            giftCards: "remadef_gift_cards"
        },

        storage: {

            bucketId: ""
        }
    },

    /* ======================================================
       USER INTERFACE
    ====================================================== */

    ui: {

        theme: "light",

        roundedCorners: 16,

        animationDuration: 250,

        useSvgIcons: true,

        responsive: true,

        languageSwitcher: true
    },

    /* ======================================================
       SIDEBAR
    ====================================================== */

    sidebar: {

        collapsible: true,

        autoCollapse: true,

        autoCollapseDelay: 60000,

        collapsedWidth: 80,

        expandedWidth: 260,

        mobileBreakpoint: 768
    },

    /* ======================================================
       MESSAGE PANEL
    ====================================================== */

    messages: {

        enabled: true,

        panelWidth: 50,

        minWidth: 30,

        maxWidth: 70,

        floating: true,

        autoCollapse: true,

        collapseDelay: 60000,

        saveDrafts: true
    },

    /* ======================================================
       HOME FEED
    ====================================================== */

    feed: {

        pageSize: 20,

        infiniteScroll: true,

        preloadDistance: 300,

        skeletonCards: 6
    },

    /* ======================================================
       SEARCH
    ====================================================== */

    search: {

        live: true,

        debounce: 300,

        minimumCharacters: 2
    },

    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    notifications: {

        refreshInterval: 30000,

        desktop: true,

        grouped: true
    },

    /* ======================================================
       PROFILE
    ====================================================== */

    profile: {

        minimumCompletion: 80,

        showProgress: true
    },

    /* ======================================================
       WALLET
    ====================================================== */

    wallet: {

        currency: "NGN",

        symbol: "₦",

        decimals: 2
    },

    /* ======================================================
       ESCROW
    ====================================================== */

    escrow: {

        enabled: true,

        disputes: true
    },

    /* ======================================================
       FILE UPLOADS
    ====================================================== */

    uploads: {

        avatar: 2 * 1024 * 1024,

        image: 5 * 1024 * 1024,

        document: 20 * 1024 * 1024,

        video: 200 * 1024 * 1024
    },

    /* ======================================================
       SECURITY
    ====================================================== */

    security: {

        rememberUser: true,

        sessionTimeout: 1800000,

        requireEmailVerification: false,

        requirePhoneVerification: false
    }

} as const;

export default CONFIG;
