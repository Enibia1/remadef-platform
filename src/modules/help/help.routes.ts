/* ==========================================================
   REMADEF PLATFORM
   Help & Support Routes
   File: src/modules/help/help.routes.ts
========================================================== */

import Router from "../../core/router";
import ROUTES from "../../config/routes";

import HelpController from "./help.controller";

class HelpRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           HELP CENTER
        ================================================== */

        Router.register({

            path: ROUTES.HELP,

            name: "help",

            protected: true,

            title: "Help & Support",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

        /* ==================================================
           KNOWLEDGE BASE
        ================================================== */

        Router.register({

            path: "/html/help-knowledge-base.html",

            name: "help-knowledge-base",

            protected: true,

            title: "Knowledge Base",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

        /* ==================================================
           HELP ARTICLE
        ================================================== */

        Router.register({

            path: "/html/help-article.html",

            name: "help-article",

            protected: true,

            title: "Help Article",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

        /* ==================================================
           FAQ
        ================================================== */

        Router.register({

            path: "/html/help-faq.html",

            name: "help-faq",

            protected: true,

            title: "Frequently Asked Questions",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

        /* ==================================================
           SUPPORT TICKETS
        ================================================== */

        Router.register({

            path: "/html/help-tickets.html",

            name: "help-tickets",

            protected: true,

            title: "Support Tickets",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

        /* ==================================================
           CONTACT SUPPORT
        ================================================== */

        Router.register({

            path: "/html/help-contact.html",

            name: "help-contact",

            protected: true,

            title: "Contact Support",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

        /* ==================================================
           FEEDBACK
        ================================================== */

        Router.register({

            path: "/html/help-feedback.html",

            name: "help-feedback",

            protected: true,

            title: "Feedback",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

        /* ==================================================
           REPORT BUG
        ================================================== */

        Router.register({

            path: "/html/help-report-bug.html",

            name: "help-report-bug",

            protected: true,

            title: "Report a Bug",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

        /* ==================================================
           FEATURE REQUESTS
        ================================================== */

        Router.register({

            path: "/html/help-feature-request.html",

            name: "help-feature-request",

            protected: true,

            title: "Feature Requests",

            onEnter: async () => {

                await HelpController.initialize();

            },

            onLeave: () => {

                HelpController.destroy();

            }

        });

    }

}

export default new HelpRoutes();
