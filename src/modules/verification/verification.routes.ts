/* ==========================================================
   REMADEF PLATFORM
   Verification Routes
   File: src/modules/verification/verification.routes.ts
========================================================== */

import Router from "../../core/router";
import ROUTES from "../../config/routes";

import VerificationController from "./verification.controller";

class VerificationRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           VERIFICATION HOME
        ================================================== */

        Router.register({

            path: ROUTES.VERIFICATION,

            name: "verification",

            protected: true,

            title: "Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           IDENTITY VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/verification-identity.html",

            name: "verification-identity",

            protected: true,

            title: "Identity Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           EMAIL VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/verification-email.html",

            name: "verification-email",

            protected: true,

            title: "Email Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           PHONE VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/verification-phone.html",

            name: "verification-phone",

            protected: true,

            title: "Phone Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           STUDENT VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/verification-student.html",

            name: "verification-student",

            protected: true,

            title: "Student Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           APPRENTICESHIP VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/verification-apprenticeship.html",

            name: "verification-apprenticeship",

            protected: true,

            title: "Apprenticeship Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           BUSINESS VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/verification-business.html",

            name: "verification-business",

            protected: true,

            title: "Business Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           EMPLOYER VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/verification-employer.html",

            name: "verification-employer",

            protected: true,

            title: "Employer Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           CREATOR VERIFICATION
        ================================================== */

        Router.register({

            path: "/html/verification-creator.html",

            name: "verification-creator",

            protected: true,

            title: "Creator Verification",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           DOCUMENTS
        ================================================== */

        Router.register({

            path: "/html/verification-documents.html",

            name: "verification-documents",

            protected: true,

            title: "Verification Documents",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           REQUEST HISTORY
        ================================================== */

        Router.register({

            path: "/html/verification-history.html",

            name: "verification-history",

            protected: true,

            title: "Verification History",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

        /* ==================================================
           VERIFICATION DASHBOARD
        ================================================== */

        Router.register({

            path: "/html/verification-dashboard.html",

            name: "verification-dashboard",

            protected: true,

            title: "Verification Dashboard",

            onEnter: async () => {

                await VerificationController.initialize();

            },

            onLeave: () => {

                VerificationController.destroy();

            }

        });

    }

}

export default new VerificationRoutes();
