/* ==========================================================
   REMADEF PLATFORM
   Escrow Routes
   File: src/modules/escrow/escrow.routes.ts
========================================================== */

import Router from "../../core/router";

import ROUTES from "../../config/routes";

import EscrowController from "./escrow.controller";

class EscrowRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           ESCROW DASHBOARD
        ================================================== */

        Router.register({

            path: ROUTES.ESCROW,

            name: "escrow",

            protected: true,

            title: "Escrow",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

        /* ==================================================
           CREATE ESCROW
        ================================================== */

        Router.register({

            path: "/html/create-escrow.html",

            name: "create-escrow",

            protected: true,

            title: "Create Escrow",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

        /* ==================================================
           ACTIVE ESCROWS
        ================================================== */

        Router.register({

            path: "/html/active-escrows.html",

            name: "active-escrows",

            protected: true,

            title: "Active Escrows",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

        /* ==================================================
           ESCROW DETAILS
        ================================================== */

        Router.register({

            path: "/html/escrow-details.html",

            name: "escrow-details",

            protected: true,

            title: "Escrow Details",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

        /* ==================================================
           MILESTONES
        ================================================== */

        Router.register({

            path: "/html/escrow-milestones.html",

            name: "escrow-milestones",

            protected: true,

            title: "Escrow Milestones",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

        /* ==================================================
           TRANSACTIONS
        ================================================== */

        Router.register({

            path: "/html/escrow-transactions.html",

            name: "escrow-transactions",

            protected: true,

            title: "Escrow Transactions",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

        /* ==================================================
           DISPUTES
        ================================================== */

        Router.register({

            path: "/html/escrow-disputes.html",

            name: "escrow-disputes",

            protected: true,

            title: "Escrow Disputes",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

        /* ==================================================
           RELEASE FUNDS
        ================================================== */

        Router.register({

            path: "/html/release-funds.html",

            name: "release-funds",

            protected: true,

            title: "Release Funds",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

        /* ==================================================
           ESCROW HISTORY
        ================================================== */

        Router.register({

            path: "/html/escrow-history.html",

            name: "escrow-history",

            protected: true,

            title: "Escrow History",

            onEnter: async () => {

                await EscrowController.initialize();

            },

            onLeave: () => {

                EscrowController.destroy();

            }

        });

    }

}

export default new EscrowRoutes();
