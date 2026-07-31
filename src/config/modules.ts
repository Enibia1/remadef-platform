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

       
