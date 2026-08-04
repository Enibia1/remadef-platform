/* ==========================================================
   REMADEF PLATFORM
   Wallet Routes
   File: src/modules/wallet/wallet.routes.ts
========================================================== */

import Router from "../../core/router";

import ROUTES from "../../config/routes";

import WalletController from "./wallet.controller";

class WalletRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           WALLET
        ================================================== */

        Router.register({

            path: ROUTES.WALLET,

            name: "wallet",

            protected: true,

            title: "Wallet",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

        /* ==================================================
           TRANSACTIONS
        ================================================== */

        Router.register({

            path: "/html/transactions.html",

            name: "transactions",

            protected: true,

            title: "Transactions",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

        /* ==================================================
           TRANSFER
        ================================================== */

        Router.register({

            path: "/html/transfer.html",

            name: "wallet-transfer",

            protected: true,

            title: "Transfer",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

        /* ==================================================
           WITHDRAW
        ================================================== */

        Router.register({

            path: "/html/withdraw.html",

            name: "wallet-withdraw",

            protected: true,

            title: "Withdraw",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

        /* ==================================================
           DEPOSIT
        ================================================== */

        Router.register({

            path: "/html/deposit.html",

            name: "wallet-deposit",

            protected: true,

            title: "Deposit",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

        /* ==================================================
           BANK ACCOUNTS
        ================================================== */

        Router.register({

            path: "/html/bank-accounts.html",

            name: "bank-accounts",

            protected: true,

            title: "Bank Accounts",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

        /* ==================================================
           BENEFICIARIES
        ================================================== */

        Router.register({

            path: "/html/beneficiaries.html",

            name: "beneficiaries",

            protected: true,

            title: "Beneficiaries",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

        /* ==================================================
           VIRTUAL ACCOUNT
        ================================================== */

        Router.register({

            path: "/html/virtual-account.html",

            name: "virtual-account",

            protected: true,

            title: "Virtual Account",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

        /* ==================================================
           GIFT CARDS
        ================================================== */

        Router.register({

            path: "/html/gift-cards.html",

            name: "gift-cards",

            protected: true,

            title: "Gift Cards",

            onEnter: async () => {

                await WalletController.initialize();

            },

            onLeave: () => {

                WalletController.destroy();

            }

        });

    }

}

export default new WalletRoutes();
