/* ==========================================================
   REMADEF PLATFORM
   Creator Routes
   File: src/modules/creator/creator.routes.ts
========================================================== */

import Router from "../../core/router";
import ROUTES from "../../config/routes";

import CreatorController from "./creator.controller";

class CreatorRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           CREATOR HUB
        ================================================== */

        Router.register({

            path: ROUTES.CREATOR,

            name: "creator",

            protected: true,

            title: "Creator Hub",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           DASHBOARD
        ================================================== */

        Router.register({

            path: "/html/creator-dashboard.html",

            name: "creator-dashboard",

            protected: true,

            title: "Creator Dashboard",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           EARNINGS
        ================================================== */

        Router.register({

            path: "/html/creator-earnings.html",

            name: "creator-earnings",

            protected: true,

            title: "Creator Earnings",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/creator-analytics.html",

            name: "creator-analytics",

            protected: true,

            title: "Creator Analytics",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           CAMPAIGNS
        ================================================== */

        Router.register({

            path: "/html/creator-campaigns.html",

            name: "creator-campaigns",

            protected: true,

            title: "Brand Campaigns",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           COLLABORATIONS
        ================================================== */

        Router.register({

            path: "/html/creator-collaborations.html",

            name: "creator-collaborations",

            protected: true,

            title: "Brand Collaborations",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           LIVE STREAMS
        ================================================== */

        Router.register({

            path: "/html/creator-live.html",

            name: "creator-live",

            protected: true,

            title: "Live Streams",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           CONTENT
        ================================================== */

        Router.register({

            path: "/html/creator-content.html",

            name: "creator-content",

            protected: true,

            title: "Content Management",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           AUDIENCE
        ================================================== */

        Router.register({

            path: "/html/creator-audience.html",

            name: "creator-audience",

            protected: true,

            title: "Audience Insights",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           PAYOUTS
        ================================================== */

        Router.register({

            path: "/html/creator-payouts.html",

            name: "creator-payouts",

            protected: true,

            title: "Payout History",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

        /* ==================================================
           MONETIZATION
        ================================================== */

        Router.register({

            path: "/html/creator-monetization.html",

            name: "creator-monetization",

            protected: true,

            title: "Monetization",

            onEnter: async () => {

                await CreatorController.initialize();

            },

            onLeave: () => {

                CreatorController.destroy();

            }

        });

    }

}

export default new CreatorRoutes();
