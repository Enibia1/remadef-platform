/* ==========================================================
   REMADEF PLATFORM
   Business Routes
   File: src/modules/business/business.routes.ts
========================================================== */

import Router from "../../core/router";

import ROUTES from "../../config/routes";

import BusinessController from "./business.controller";

class BusinessRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           BUSINESS HOME
        ================================================== */

        Router.register({

            path: ROUTES.BUSINESS,

            name: "business",

            protected: true,

            title: "Business",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           BUSINESS PROFILE
        ================================================== */

        Router.register({

            path: "/html/business-profile.html",

            name: "business-profile",

            protected: true,

            title: "Business Profile",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           PRODUCTS
        ================================================== */

        Router.register({

            path: "/html/business-products.html",

            name: "business-products",

            protected: true,

            title: "Products",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           SERVICES
        ================================================== */

        Router.register({

            path: "/html/business-services.html",

            name: "business-services",

            protected: true,

            title: "Services",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           ORDERS
        ================================================== */

        Router.register({

            path: "/html/business-orders.html",

            name: "business-orders",

            protected: true,

            title: "Orders",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           CUSTOMERS
        ================================================== */

        Router.register({

            path: "/html/business-customers.html",

            name: "business-customers",

            protected: true,

            title: "Customers",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           REVIEWS
        ================================================== */

        Router.register({

            path: "/html/business-reviews.html",

            name: "business-reviews",

            protected: true,

            title: "Reviews",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           FOLLOWERS
        ================================================== */

        Router.register({

            path: "/html/business-followers.html",

            name: "business-followers",

            protected: true,

            title: "Followers",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           ANALYTICS
        ================================================== */

        Router.register({

            path: "/html/business-analytics.html",

            name: "business-analytics",

            protected: true,

            title: "Business Analytics",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

        /* ==================================================
           SETTINGS
        ================================================== */

        Router.register({

            path: "/html/business-settings.html",

            name: "business-settings",

            protected: true,

            title: "Business Settings",

            onEnter: async () => {

                await BusinessController.initialize();

            },

            onLeave: () => {

                BusinessController.destroy();

            }

        });

    }

}

export default new BusinessRoutes();
