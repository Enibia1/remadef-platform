/* ==========================================================
   REMADEF PLATFORM
   Master API
   File: src/services/api.ts

   Single entry point for all platform services.
========================================================== */

import Client from "./client";

/* ==========================================================
   CORE SERVICES
========================================================== */

import AuthService from "./auth.service";
import ProfileService from "./profile.service";
import HomeService from "./home.service";
import NotificationService from "./notification.service";
import MessageService from "./message.service";

/* ==========================================================
   PLATFORM SERVICES
========================================================== */

import LearningService from "./learning.service";
import ApprenticeshipService from "./apprenticeship.service";
import BusinessService from "./business.service";
import MarketplaceService from "./marketplace.service";

/* ==========================================================
   FINANCIAL SERVICES
========================================================== */

import WalletService from "./wallet.service";
import EscrowService from "./escrow.service";

/* ==========================================================
   SUPPORT SERVICES
========================================================== */

import SearchService from "./search.service";
import SettingsService from "./settings.service";
import FilesService from "./files.service";
import SystemService from "./system.service";

/* ==========================================================
   MASTER API OBJECT
========================================================== */

export const API = {

    /* ----------------------------------------------
       HTTP Client
    ---------------------------------------------- */

    client: Client,

    /* ----------------------------------------------
       Authentication
    ---------------------------------------------- */

    auth: AuthService,

    /* ----------------------------------------------
       User Profile
    ---------------------------------------------- */

    profile: ProfileService,

    /* ----------------------------------------------
       Home / Dashboard / Feed
    ---------------------------------------------- */

    home: HomeService,

    dashboard: HomeService,

    /* ----------------------------------------------
       Notifications
    ---------------------------------------------- */

    notifications: NotificationService,

    /* ----------------------------------------------
       Messages
    ---------------------------------------------- */

    messages: MessageService,

    /* ----------------------------------------------
       Learning
    ---------------------------------------------- */

    learning: LearningService,

    /* ----------------------------------------------
       Apprenticeship
    ---------------------------------------------- */

    apprenticeship: ApprenticeshipService,

    /* ----------------------------------------------
       Business & Gigs
    ---------------------------------------------- */

    business: BusinessService,

    /* ----------------------------------------------
       Marketplace
       (Feature Flag Controlled)
    ---------------------------------------------- */

    marketplace: MarketplaceService,

    /* ----------------------------------------------
       Wallet
    ---------------------------------------------- */

    wallet: WalletService,

    /* ----------------------------------------------
       Escrow
    ---------------------------------------------- */

    escrow: EscrowService,

    /* ----------------------------------------------
       Search
    ---------------------------------------------- */

    search: SearchService,

    /* ----------------------------------------------
       Settings
    ---------------------------------------------- */

    settings: SettingsService,

    /* ----------------------------------------------
       Files
    ---------------------------------------------- */

    files: FilesService,

    /* ----------------------------------------------
       System
    ---------------------------------------------- */

    system: SystemService

};

/* ==========================================================
   NAMED EXPORTS
========================================================== */

export {

    Client,

    AuthService,
    ProfileService,
    HomeService,
    NotificationService,
    MessageService,

    LearningService,
    ApprenticeshipService,
    BusinessService,
    MarketplaceService,

    WalletService,
    EscrowService,

    SearchService,
    SettingsService,
    FilesService,
    SystemService

};

/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default API;
