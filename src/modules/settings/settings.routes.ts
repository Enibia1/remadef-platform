/* ==========================================================
   REMADEF PLATFORM
   Settings Routes
   File: src/modules/settings/settings.routes.ts
========================================================== */

import Router from "../../core/router";
import ROUTES from "../../config/routes";

import SettingsController from "./settings.controller";

class SettingsRoutes {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(): void {

        /* ==================================================
           SETTINGS HOME
        ================================================== */

        Router.register({

            path: ROUTES.SETTINGS,

            name: "settings",

            protected: true,

            title: "Settings",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           ACCOUNT
        ================================================== */

        Router.register({

            path: "/html/settings-account.html",

            name: "settings-account",

            protected: true,

            title: "Account Settings",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           PRIVACY
        ================================================== */

        Router.register({

            path: "/html/settings-privacy.html",

            name: "settings-privacy",

            protected: true,

            title: "Privacy",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           SECURITY
        ================================================== */

        Router.register({

            path: "/html/settings-security.html",

            name: "settings-security",

            protected: true,

            title: "Security",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           NOTIFICATIONS
        ================================================== */

        Router.register({

            path: "/html/settings-notifications.html",

            name: "settings-notifications",

            protected: true,

            title: "Notifications",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           APPEARANCE
        ================================================== */

        Router.register({

            path: "/html/settings-appearance.html",

            name: "settings-appearance",

            protected: true,

            title: "Appearance",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           LANGUAGE
        ================================================== */

        Router.register({

            path: "/html/settings-language.html",

            name: "settings-language",

            protected: true,

            title: "Language & Region",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           CONNECTED ACCOUNTS
        ================================================== */

        Router.register({

            path: "/html/settings-connected-accounts.html",

            name: "settings-connected-accounts",

            protected: true,

            title: "Connected Accounts",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           SESSIONS
        ================================================== */

        Router.register({

            path: "/html/settings-sessions.html",

            name: "settings-sessions",

            protected: true,

            title: "Active Sessions",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           DEVICES
        ================================================== */

        Router.register({

            path: "/html/settings-devices.html",

            name: "settings-devices",

            protected: true,

            title: "Trusted Devices",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           DATA EXPORT
        ================================================== */

        Router.register({

            path: "/html/settings-data-export.html",

            name: "settings-data-export",

            protected: true,

            title: "Data Export",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           BACKUP & RESTORE
        ================================================== */

        Router.register({

            path: "/html/settings-backup.html",

            name: "settings-backup",

            protected: true,

            title: "Backup & Restore",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

        /* ==================================================
           ACCOUNT MANAGEMENT
        ================================================== */

        Router.register({

            path: "/html/settings-account-management.html",

            name: "settings-account-management",

            protected: true,

            title: "Account Management",

            onEnter: async () => {

                await SettingsController.initialize();

            },

            onLeave: () => {

                SettingsController.destroy();

            }

        });

    }

}

export default new SettingsRoutes();
