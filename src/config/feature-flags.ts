/* ==========================================================
   REMADEF PLATFORM
   FEATURE FLAGS
   File: src/config/feature-flags.ts

   PURPOSE
   ----------------------------------------------------------
   Controls which platform features are available.

   RULES
   ----------------------------------------------------------
   • true  = feature is enabled
   • false = feature exists but is dormant
   • Never delete dormant modules.
   • Enable features by changing only the flag.
========================================================== */

export const FEATURE_FLAGS = {

    /* ======================================================
       FOUNDATION
       (Always Enabled)
    ====================================================== */

    foundation: {

        authentication: true,

        authorization: true,

        api: true,

        appwrite: true,

        routing: true,

        search: true,

        notifications: true,

        realtime: true,

        cache: true,

        storage: true,

        uploads: true,

        analytics: true,

        auditTrail: true,

        activityLogs: true,

        featureFlags: true
    },

    /* ======================================================
       CORE PLATFORM
    ====================================================== */

    core: {

        home: true,

        profile: true,

        settings: true,

        sidebar: true,

        navigation: true,

        dashboard: true,

        messages: true,

        wallet: true,

        escrow: true,

        search: true,

        notifications: true
    },

    /* ======================================================
       OPPORTUNITY MODULES
    ====================================================== */

    opportunities: {

        learning: true,

        apprenticeship: true,

        jobs: true,

        business: true
    },

    /* ======================================================
       SOCIAL
       (Dormant)
    ====================================================== */

    social: {

        feed: false,

        stories: false,

        reels: false,

        shorts: false,

        livestream: false,

        groups: false,

        communities: false,

        events: false,

        polls: false,

        hashtags: false,

        bookmarks: false,

        mentions: false,

        trending: false
    },

    /* ======================================================
       MARKETPLACE
    ====================================================== */

    marketplace: {

        enabled: false,

        products: false,

        services: false,

        rentals: false,

        auctions: false,

        digitalGoods: false,

        classifieds: false,

        wishlist: false,

        cart: false,

        checkout: false,

        reviews: false
    },

    /* ======================================================
       BUSINESS SUITE
    ====================================================== */

    enterprise: {

        crm: false,

        inventory: false,

        procurement: false,

        warehouse: false,

        logistics: false,

        fleet: false,

        accounting: false,

        payroll: false,

        hr: false,

        pos: false
    },

    /* ======================================================
       FINANCE
    ====================================================== */

    finance: {

        savings: false,

        investments: false,

        loans: false,

        insurance: false,

        crypto: false,

        rewards: false,

        cashback: false,

        referrals: false,

        giftCards: true
    },

    /* ======================================================
       EDUCATION
    ====================================================== */

    education: {

        aiTutor: false,

        liveClasses: false,

        cbt: false,

        assignments: false,

        exams: false,

        certificates: true,

        transcript: false,

        skillsPassport: false
    },

    /* ======================================================
       HEALTHCARE
    ====================================================== */

    healthcare: {

        enabled: false,

        hospitals: false,

        pharmacies: false,

        telemedicine: false,

        hmo: false,

        medicalRecords: false,

        ambulance: false
    },

    /* ======================================================
       GOVERNMENT
    ====================================================== */

    government: {

        enabled: false,

        licensing: false,

        permits: false,

        taxes: false,

        grants: false,

        agriculture: false
    },

    /* ======================================================
       REAL ESTATE
    ====================================================== */

    realEstate: {

        enabled: false,

        properties: false,

        rentals: false,

        land: false,

        valuation: false
    },

    /* ======================================================
       AI PLATFORM
    ====================================================== */

    ai: {

        assistant: false,

        search: false,

        recommendations: false,

        translation: false,

        moderation: false,

        automation: false,

        analytics: false
    },

    /* ======================================================
       MAPS
    ====================================================== */

    maps: {

        enabled: false,

        nearby: false,

        routing: false,

        tracking: false,

        geofencing: false
    },

    /* ======================================================
       ADMINISTRATION
    ====================================================== */

    admin: {

        moderation: true,

        reports: true,

        appeals: true,

        fraudReview: true,

        systemHealth: true,

        auditLogs: true,

        featureManagement: true,

        userManagement: true,

        businessManagement: true
    }

} as const;


/* ==========================================================
   HELPER
========================================================== */

export function isFeatureEnabled(
    value: boolean
): boolean {

    return value === true;
}

export default FEATURE_FLAGS;
