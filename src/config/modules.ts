/* ==========================================================
   REMADEF PLATFORM
   MODULE REGISTRY
   File: src/config/modules.ts

   PURPOSE
   ----------------------------------------------------------
   Master registry of every REMADEF module.

   IMPORTANT
   ----------------------------------------------------------
   This file decides:

   • Which modules exist
   • Which are active
   • Which are dormant
   • Sidebar visibility
   • Home widgets
   • Search indexing
   • Notifications
   • Wallet integration
   • AI integration
   • Future expansion

   Nothing should be hardcoded elsewhere.
========================================================== */

export type ModuleStatus =
    | "active"
    | "beta"
    | "coming-soon"
    | "disabled";

export interface PlatformModule {

    id: string;

    name: string;

    icon: string;

    description: string;

    status: ModuleStatus;

    sidebar: boolean;

    home: boolean;

    searchable: boolean;

    notifications: boolean;

    wallet: boolean;

    ai: boolean;

    order: number;

    permissions: string[];

    dependencies: string[];
}

/* ==========================================================
   MASTER MODULE REGISTRY
========================================================== */

export const MODULES: Record<
    string,
    PlatformModule
> = {

    /* ======================================================
       CORE PLATFORM
    ====================================================== */

    home: {

        id: "home",

        name: "Home",

        icon: "home",

        description:
            "Personal dashboard",

        status: "active",

        sidebar: true,

        home: true,

        searchable: false,

        notifications: true,

        wallet: false,

        ai: true,

        order: 1,

        permissions: [],

        dependencies: []
    },

    search: {

        id: "search",

        name: "Search",

        icon: "search",

        description:
            "Universal search",

        status: "active",

        sidebar: true,

        home: true,

        searchable: false,

        notifications: false,

        wallet: false,

        ai: true,

        order: 2,

        permissions: [],

        dependencies: []
    },

    notifications: {

        id: "notifications",

        name: "Notifications",

        icon: "bell",

        description:
            "Platform notifications",

        status: "active",

        sidebar: true,

        home: true,

        searchable: false,

        notifications: false,

        wallet: false,

        ai: false,

        order: 3,

        permissions: [],

        dependencies: []
    },

    messages: {

        id: "messages",

        name: "Messages",

        icon: "message-circle",

        description:
            "Universal messaging",

        status: "active",

        sidebar: true,

        home: true,

        searchable: true,

        notifications: true,

        wallet: false,

        ai: true,

        order: 4,

        permissions: [],

        dependencies: []
    },

    profile: {

        id: "profile",

        name: "Profile",

        icon: "user",

        description:
            "Master identity",

        status: "active",

        sidebar: true,

        home: false,

        searchable: true,

        notifications: false,

        wallet: false,

        ai: true,

        order: 5,

        permissions: [],

        dependencies: []
    },

    wallet: {

        id: "wallet",

        name: "Wallet",

        icon: "wallet",

        description:
            "Payments & Escrow",

        status: "active",

        sidebar: true,

        home: true,

        searchable: true,

        notifications: true,

        wallet: true,

        ai: true,

        order: 6,

        permissions: [],

        dependencies: []
    },

    learning: {

        id: "learning",

        name: "Learning",

        icon: "graduation-cap",

        description:
            "Learning platform",

        status: "active",

        sidebar: true,

        home: true,

        searchable: true,

        notifications: true,

        wallet: true,

        ai: true,

        order: 7,

        permissions: [],

        dependencies: []
    },

    apprenticeship: {

        id: "apprenticeship",

        name: "Apprenticeship",

        icon: "briefcase",

        description:
            "Apprenticeship ecosystem",

        status: "active",

        sidebar: true,

        home: true,

        searchable: true,

        notifications: true,

        wallet: true,

        ai: true,

        order: 8,

        permissions: [],

        dependencies: [
            "learning"
        ]
    },

    jobs: {

        id: "jobs",

        name: "Jobs",

        icon: "building",

        description:
            "Employment platform",

        status: "active",

        sidebar: true,

        home: true,

        searchable: true,

        notifications: true,

        wallet: false,

        ai: true,

        order: 9,

        permissions: [],

        dependencies: []
    },

    business: {

        id: "business",

        name: "Business",

        icon: "store",

        description:
            "Business ecosystem",

        status: "active",

        sidebar: true,

        home: true,

        searchable: true,

        notifications: true,

        wallet: true,

        ai: true,

        order: 10,

        permissions: [],

        dependencies: []
    },

    settings: {

        id: "settings",

        name: "Settings",

        icon: "settings",

        description:
            "Preferences",

        status: "active",

        sidebar: true,

        home: false,

        searchable: false,

        notifications: false,

        wallet: false,

        ai: false,

        order: 11,

        permissions: [],

        dependencies: []
    },

    /* ======================================================
       DORMANT MODULES
    ====================================================== */

    marketplace: {

        id: "marketplace",

        name: "Marketplace",

        icon: "shopping-cart",

        description:
            "Products & Services",

        status: "coming-soon",

        sidebar: false,

        home: false,

        searchable: true,

        notifications: true,

        wallet: true,

        ai: true,

        order: 100,

        permissions: [],

        dependencies: [
            "wallet"
        ]
    },

    healthcare: {

        id: "healthcare",

        name: "Healthcare",

        icon: "heart",

        description:
            "Healthcare platform",

        status: "coming-soon",

        sidebar: false,

        home: false,

        searchable: true,

        notifications: true,

        wallet: true,

        ai: true,

        order: 101,

        permissions: [],

        dependencies: []
    },

    government: {

        id: "government",

        name: "Government",

        icon: "landmark",

        description:
            "Government services",

        status: "coming-soon",

        sidebar: false,

        home: false,

        searchable: true,

        notifications: true,

        wallet: true,

        ai: true,

        order: 102,

        permissions: [],

        dependencies: []
    },

    realEstate: {

        id: "real-estate",

        name: "Real Estate",

        icon: "building-2",

        description:
            "Property ecosystem",

        status: "coming-soon",

        sidebar: false,

        home: false,

        searchable: true,

        notifications: true,

        wallet: true,

        ai: true,

        order: 103,

        permissions: [],

        dependencies: []
    },

    ai: {

        id: "ai",

        name: "AI",

        icon: "sparkles",

        description:
            "Platform AI",

        status: "coming-soon",

        sidebar: false,

        home: false,

        searchable: true,

        notifications: false,

        wallet: false,

        ai: false,

        order: 104,

        permissions: [],

        dependencies: []
    }

};

/* ==========================================================
   HELPERS
========================================================== */

export const ACTIVE_MODULES =
    Object.values(MODULES)
        .filter(
            m => m.status === "active"
        );

export const SIDEBAR_MODULES =
    ACTIVE_MODULES
        .filter(
            m => m.sidebar
        )
        .sort(
            (a, b) =>
                a.order - b.order
        );

export const HOME_MODULES =
    ACTIVE_MODULES
        .filter(
            m => m.home
        );

export default MODULES;
