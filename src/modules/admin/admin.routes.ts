/* ==========================================================
   REMADEF PLATFORM
   Admin Routes
   File: src/modules/admin/admin.routes.ts
========================================================== */

import Router from "../../core/router";
import ROUTES from "../../config/routes";

import AdminController from "./admin.controller";

class AdminRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           ADMIN HOME
        ================================================== */

        Router.register({

            path: ROUTES.ADMIN,

            name: "admin",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Administration",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           USERS
        ================================================== */

        Router.register({

            path: "/html/admin-users.html",

            name: "admin-users",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "User Management",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           MODERATION
        ================================================== */

        Router.register({

            path: "/html/admin-moderation.html",

            name: "admin-moderation",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Content Moderation",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           REPORTS
        ================================================== */

        Router.register({

            path: "/html/admin-reports.html",

            name: "admin-reports",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Reports",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/admin-verification.html",

            name: "admin-verification",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Verification",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           LEARNING
        ================================================== */

        Router.register({

            path: "/html/admin-learning.html",

            name: "admin-learning",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Learning Management",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           BUSINESS
        ================================================== */

        Router.register({

            path: "/html/admin-business.html",

            name: "admin-business",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Business Management",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           CREATORS
        ================================================== */

        Router.register({

            path: "/html/admin-creators.html",

            name: "admin-creators",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Creator Management",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           WALLET
        ================================================== */

        Router.register({

            path: "/html/admin-wallet.html",

            name: "admin-wallet",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Wallet Management",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           ESCROW
        ================================================== */

        Router.register({

            path: "/html/admin-escrow.html",

            name: "admin-escrow",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Escrow Management",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           ADVERTISING
        ================================================== */

        Router.register({

            path: "/html/admin-advertising.html",

            name: "admin-advertising",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Advertising Management",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           PLATFORM HEALTH
        ================================================== */

        Router.register({

            path: "/html/admin-platform-health.html",

            name: "admin-platform-health",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Platform Health",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

        /* ==================================================
           AUDIT LOGS
        ================================================== */

        Router.register({

            path: "/html/admin-audit-logs.html",

            name: "admin-audit-logs",

            protected: true,

            roles: [

                "admin",
                "super-admin"

            ],

            title: "Audit Logs",

            onEnter: async () => {

                await AdminController.initialize();

            },

            onLeave: () => {

                AdminController.destroy();

            }

        });

    }

}

export default new AdminRoutes();
