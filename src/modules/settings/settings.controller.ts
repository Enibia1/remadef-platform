/* ==========================================================
   REMADEF PLATFORM
   Settings Controller
   File: src/modules/settings/settings.controller.ts
========================================================== */

import SettingsModule from "./settings.module";
import SettingsView from "./settings-view";

class SettingsController {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.bindEvents();

        await SettingsModule.initialize();

        SettingsView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindEvents(): void {

        /* ==================================================
           REFRESH SETTINGS
        ================================================== */

        document

            .querySelector(
                "[data-settings-refresh]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await SettingsModule.refresh();

                }

            );

        /* ==================================================
           SAVE ACCOUNT SETTINGS
        ================================================== */

        document

            .querySelector(
                "[data-save-settings]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    // Placeholder:
                    // Collect account settings form values
                    // Send to backend update endpoint

                    await SettingsModule.synchronize();

                }

            );

        /* ==================================================
           ENABLE TWO-FACTOR AUTHENTICATION
        ================================================== */

        document

            .querySelector(
                "[data-enable-2fa]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await SettingsModule.enableTwoFactor();

                }

            );

        /* ==================================================
           DISABLE TWO-FACTOR AUTHENTICATION
        ================================================== */

        document

            .querySelector(
                "[data-disable-2fa]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await SettingsModule.disableTwoFactor();

                }

            );

        /* ==================================================
           EXPORT DATA
        ================================================== */

        document

            .querySelector(
                "[data-export-data]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await SettingsModule.exportData();

                }

            );

        /* ==================================================
           BACKUP SETTINGS
        ================================================== */

        document

            .querySelector(
                "[data-backup-settings]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await SettingsModule.backup();

                }

            );

        /* ==================================================
           REVOKE SESSION
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const session =
                        target.closest(
                            "[data-session-id]"
                        );

                    if (!session) {

                        return;

                    }

                    const sessionId =
                        session.getAttribute(
                            "data-session-id"
                        );

                    if (!sessionId) {

                        return;

                    }

                    await SettingsModule.revokeSession(
                        sessionId
                    );

                }

            );

        /* ==================================================
           REVOKE DEVICE
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const device =
                        target.closest(
                            "[data-device-id]"
                        );

                    if (!device) {

                        return;

                    }

                    const deviceId =
                        device.getAttribute(
                            "data-device-id"
                        );

                    if (!deviceId) {

                        return;

                    }

                    await SettingsModule.revokeDevice(
                        deviceId
                    );

                }

            );

        /* ==================================================
           DELETE ACCOUNT
        ================================================== */

        document

            .querySelector(
                "[data-delete-account]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const confirmed = window.confirm(

                        "Are you sure you want to permanently delete your account?"

                    );

                    if (!confirmed) {

                        return;

                    }

                    await SettingsModule.deleteAccount();

                }

            );

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        this.initialized = false;

    }

}

export default new SettingsController();
