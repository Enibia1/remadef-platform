/* ==========================================================
   REMADEF PLATFORM
   Dashboard Routes
   File: src/modules/dashboard/dashboard.routes.ts
========================================================== */

import Router from "../../core/router";
import ROUTES from "../../config/routes";

import DashboardController from "./dashboard.controller";

class DashboardRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           MAIN DASHBOARD
        ================================================== */

        Router.register({

            path: ROUTES.DASHBOARD,

            name: "dashboard",

            protected: true,

            title: "Dashboard",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           ACTIVITY
        ================================================== */

        Router.register({

            path: "/html/dashboard-activity.html",

            name: "dashboard-activity",

            protected: true,

            title: "Activity",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           NOTIFICATIONS
        ================================================== */

        Router.register({

            path: "/html/dashboard-notifications.html",

            name: "dashboard-notifications",

            protected: true,

            title: "Notifications",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           QUICK ACTIONS
        ================================================== */

        Router.register({

            path: "/html/dashboard-actions.html",

            name: "dashboard-actions",

            protected: true,

            title: "Quick Actions",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           RECOMMENDATIONS
        ================================================== */

        Router.register({

            path: "/html/dashboard-recommendations.html",

            name: "dashboard-recommendations",

            protected: true,

            title: "Recommendations",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/dashboard-analytics.html",

            name: "dashboard-analytics",

            protected: true,

            title: "Dashboard Analytics",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           WALLET WIDGET
        ================================================== */

        Router.register({

            path: "/html/dashboard-wallet.html",

            name: "dashboard-wallet",

            protected: true,

            title: "Wallet Summary",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           LEARNING WIDGET
        ================================================== */

        Router.register({

            path: "/html/dashboard-learning.html",

            name: "dashboard-learning",

            protected: true,

            title: "Learning Summary",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           CREATOR WIDGET
        ================================================== */

        Router.register({

            path: "/html/dashboard-creator.html",

            name: "dashboard-creator",

            protected: true,

            title: "Creator Summary",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           BUSINESS WIDGET
        ================================================== */

        Router.register({

            path: "/html/dashboard-business.html",

            name: "dashboard-business",

            protected: true,

            title: "Business Summary",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

        /* ==================================================
           JOBS WIDGET
        ================================================== */

        Router.register({

            path: "/html/dashboard-jobs.html",

            name: "dashboard-jobs",

            protected: true,

            title: "Jobs Summary",

            onEnter: async () => {

                await DashboardController.initialize();

            },

            onLeave: () => {

                DashboardController.destroy();

            }

        });

    }

}

export default new DashboardRoutes();
