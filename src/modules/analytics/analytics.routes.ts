/* ==========================================================
   REMADEF PLATFORM
   Analytics Routes
   File: src/modules/analytics/analytics.routes.ts
========================================================== */

import Router from "../../core/router";
import ROUTES from "../../config/routes";

import AnalyticsController from "./analytics.controller";

class AnalyticsRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           ANALYTICS HOME
        ================================================== */

        Router.register({

            path: ROUTES.ANALYTICS,

            name: "analytics",

            protected: true,

            title: "Analytics",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           OVERVIEW
        ================================================== */

        Router.register({

            path: "/html/analytics-overview.html",

            name: "analytics-overview",

            protected: true,

            title: "Analytics Overview",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           REPORTS
        ================================================== */

        Router.register({

            path: "/html/analytics-reports.html",

            name: "analytics-reports",

            protected: true,

            title: "Reports",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           CHARTS
        ================================================== */

        Router.register({

            path: "/html/analytics-charts.html",

            name: "analytics-charts",

            protected: true,

            title: "Charts",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           INSIGHTS
        ================================================== */

        Router.register({

            path: "/html/analytics-insights.html",

            name: "analytics-insights",

            protected: true,

            title: "Insights",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           REVENUE ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/analytics-revenue.html",

            name: "analytics-revenue",

            protected: true,

            title: "Revenue Analytics",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           USER GROWTH
        ================================================== */

        Router.register({

            path: "/html/analytics-user-growth.html",

            name: "analytics-user-growth",

            protected: true,

            title: "User Growth",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           ENGAGEMENT
        ================================================== */

        Router.register({

            path: "/html/analytics-engagement.html",

            name: "analytics-engagement",

            protected: true,

            title: "Engagement Analytics",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           LEARNING ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/analytics-learning.html",

            name: "analytics-learning",

            protected: true,

            title: "Learning Analytics",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           BUSINESS ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/analytics-business.html",

            name: "analytics-business",

            protected: true,

            title: "Business Analytics",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           CREATOR ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/analytics-creator.html",

            name: "analytics-creator",

            protected: true,

            title: "Creator Analytics",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

        /* ==================================================
           EXPORT CENTER
        ================================================== */

        Router.register({

            path: "/html/analytics-export.html",

            name: "analytics-export",

            protected: true,

            title: "Export Center",

            onEnter: async () => {

                await AnalyticsController.initialize();

            },

            onLeave: () => {

                AnalyticsController.destroy();

            }

        });

    }

}

export default new AnalyticsRoutes();
