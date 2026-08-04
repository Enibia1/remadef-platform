/* ==========================================================
   REMADEF PLATFORM
   Advertising Routes
   File: src/modules/advertising/advertising.routes.ts
========================================================== */

import Router from "../../core/router";
import ROUTES from "../../config/routes";

import AdvertisingController from "./advertising.controller";

class AdvertisingRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           ADVERTISING HOME
        ================================================== */

        Router.register({

            path: ROUTES.ADVERTISING,

            name: "advertising",

            protected: true,

            title: "Advertising",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

        /* ==================================================
           CAMPAIGNS
        ================================================== */

        Router.register({

            path: "/html/advertising-campaigns.html",

            name: "advertising-campaigns",

            protected: true,

            title: "Campaign Manager",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

        /* ==================================================
           AD MANAGER
        ================================================== */

        Router.register({

            path: "/html/advertising-manager.html",

            name: "advertising-manager",

            protected: true,

            title: "Advertisement Manager",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

        /* ==================================================
           ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/advertising-analytics.html",

            name: "advertising-analytics",

            protected: true,

            title: "Advertising Analytics",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

        /* ==================================================
           BILLING
        ================================================== */

        Router.register({

            path: "/html/advertising-billing.html",

            name: "advertising-billing",

            protected: true,

            title: "Billing & Invoices",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

        /* ==================================================
           REVENUE SHARING
        ================================================== */

        Router.register({

            path: "/html/advertising-revenue.html",

            name: "advertising-revenue",

            protected: true,

            title: "Creator Revenue Sharing",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

        /* ==================================================
           AUDIENCE TARGETING
        ================================================== */

        Router.register({

            path: "/html/advertising-targeting.html",

            name: "advertising-targeting",

            protected: true,

            title: "Audience Targeting",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

        /* ==================================================
           PLACEMENTS
        ================================================== */

        Router.register({

            path: "/html/advertising-placements.html",

            name: "advertising-placements",

            protected: true,

            title: "Ad Placements",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

        /* ==================================================
           ADVERTISER DASHBOARD
        ================================================== */

        Router.register({

            path: "/html/advertising-dashboard.html",

            name: "advertising-dashboard",

            protected: true,

            title: "Advertiser Dashboard",

            onEnter: async () => {

                await AdvertisingController.initialize();

            },

            onLeave: () => {

                AdvertisingController.destroy();

            }

        });

    }

}

export default new AdvertisingRoutes();
