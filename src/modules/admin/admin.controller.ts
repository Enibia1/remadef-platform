/* ==========================================================
   REMADEF PLATFORM
   Admin Controller
   File: src/modules/admin/admin.controller.ts
========================================================== */

import AdminModule from "./admin.module";
import AdminView from "./admin-view";

class AdminController {

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

        await AdminModule.initialize();

        AdminView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindEvents(): void {

        /* ==================================================
           REFRESH
        ================================================== */

        document

            .querySelector(
                "[data-admin-refresh]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await AdminModule.refresh();

                }

            );

        /* ==================================================
           USER SEARCH
        ================================================== */

        document

            .querySelector(
                "[data-admin-user-search]"
            )

            ?.addEventListener(

                "input",

                event => {

                    const value = (

                        event.target as HTMLInputElement

                    ).value;

                    console.log(
                        "User search:",
                        value
                    );

                }

            );

        /* ==================================================
           USER SUSPEND
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const action =
                        target.closest(
                            "[data-suspend-user]"
                        );

                    if (!action) {

                        return;

                    }

                    const userId =
                        action.getAttribute(
                            "data-suspend-user"
                        );

                    if (!userId) {

                        return;

                    }

                    await AdminModule.suspendUser(
                        userId
                    );

                }

            );

        /* ==================================================
           USER RESTORE
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const action =
                        target.closest(
                            "[data-restore-user]"
                        );

                    if (!action) {

                        return;

                    }

                    const userId =
                        action.getAttribute(
                            "data-restore-user"
                        );

                    if (!userId) {

                        return;

                    }

                    await AdminModule.restoreUser(
                        userId
                    );

                }

            );

        /* ==================================================
           APPROVE VERIFICATION
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const action =
                        target.closest(
                            "[data-approve-verification]"
                        );

                    if (!action) {

                        return;

                    }

                    const verificationId =
                        action.getAttribute(
                            "data-approve-verification"
                        );

                    if (!verificationId) {

                        return;

                    }

                    await AdminModule.approveVerification(
                        verificationId
                    );

                }

            );

        /* ==================================================
           REJECT VERIFICATION
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const action =
                        target.closest(
                            "[data-reject-verification]"
                        );

                    if (!action) {

                        return;

                    }

                    const verificationId =
                        action.getAttribute(
                            "data-reject-verification"
                        );

                    if (!verificationId) {

                        return;

                    }

                    await AdminModule.rejectVerification(
                        verificationId
                    );

                }

            );

        /* ==================================================
           ANNOUNCEMENT
        ================================================== */

        document

            .querySelector(
                "[data-admin-announcement]"
            )

            ?.addEventListener(

                "click",

                () => {

                    console.log(
                        "Create announcement"
                    );

                }

            );

        /* ==================================================
           REPORT REVIEW
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const report =
                        target.closest(
                            "[data-report-id]"
                        );

                    if (!report) {

                        return;

                    }

                    console.log(

                        "Review report:",

                        report.getAttribute(
                            "data-report-id"
                        )

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

export default new AdminController();
