/* ==========================================================
   REMADEF PLATFORM
   Dashboard Controller
   File: src/modules/dashboard/dashboard.controller.ts
========================================================== */

import DashboardModule from "./dashboard.module";
import DashboardView from "./dashboard-view";

class DashboardController {

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

        await DashboardModule.initialize();

        DashboardView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindEvents(): void {

        /* ==================================================
           REFRESH DASHBOARD
        ================================================== */

        document

            .querySelector(
                "[data-dashboard-refresh]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await DashboardModule.refresh();

                }

            );

        /* ==================================================
           QUICK ACTIONS
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const action =
                        target.closest(
                            "[data-dashboard-action]"
                        );

                    if (!action) {

                        return;

                    }

                    const route =
                        action.getAttribute(
                            "data-dashboard-action"
                        );

                    if (route) {

                        window.location.href = route;

                    }

                }

            );

        /* ==================================================
           OPEN WIDGET
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const widget =
                        target.closest(
                            "[data-widget-route]"
                        );

                    if (!widget) {

                        return;

                    }

                    const route =
                        widget.getAttribute(
                            "data-widget-route"
                        );

                    if (route) {

                        window.location.href = route;

                    }

                }

            );

        /* ==================================================
           OPEN NOTIFICATION
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const notification =
                        target.closest(
                            "[data-notification-id]"
                        );

                    if (!notification) {

                        return;

                    }

                    const id =
                        notification.getAttribute(
                            "data-notification-id"
                        );

                    console.log(
                        "Notification:",
                        id
                    );

                }

            );

        /* ==================================================
           OPEN ACTIVITY
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const activity =
                        target.closest(
                            "[data-activity-id]"
                        );

                    if (!activity) {

                        return;

                    }

                    const id =
                        activity.getAttribute(
                            "data-activity-id"
                        );

                    console.log(
                        "Activity:",
                        id
                    );

                }

            );

        /* ==================================================
           SEARCH
        ================================================== */

        document

            .querySelector(
                "[data-dashboard-search]"
            )

            ?.addEventListener(

                "input",

                event => {

                    const value =
                        (
                            event.target as HTMLInputElement
                        ).value;

                    console.log(
                        "Dashboard search:",
                        value
                    );

                }

            );

        /* ==================================================
           DISMISS NOTIFICATION
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const dismiss =
                        target.closest(
                            "[data-dismiss-notification]"
                        );

                    if (!dismiss) {

                        return;

                    }

                    const id =
                        dismiss.getAttribute(
                            "data-dismiss-notification"
                        );

                    console.log(
                        "Dismiss:",
                        id
                    );

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

export default new DashboardController();
