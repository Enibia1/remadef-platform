/* ==========================================================
   REMADEF PLATFORM
   Help & Support Controller
   File: src/modules/help/help.controller.ts
========================================================== */

import HelpModule from "./help.module";
import HelpView from "./help-view";

class HelpController {

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

        await HelpModule.initialize();

        HelpView.initialize();

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
                "[data-help-refresh]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await HelpModule.refresh();

                }

            );

        /* ==================================================
           SEARCH
        ================================================== */

        document

            .querySelector(
                "[data-help-search]"
            )

            ?.addEventListener(

                "input",

                async event => {

                    const query = (

                        event.target as HTMLInputElement

                    ).value.trim();

                    if (!query) {

                        return;

                    }

                    await HelpModule.searchArticles(
                        query
                    );

                }

            );

        /* ==================================================
           CREATE TICKET
        ================================================== */

        document

            .querySelector(
                "[data-create-ticket]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const payload = {

                        category: (
                            document.querySelector(
                                "[data-ticket-category]"
                            ) as HTMLSelectElement
                        ).value,

                        subject: (
                            document.querySelector(
                                "[data-ticket-subject]"
                            ) as HTMLInputElement
                        ).value,

                        description: (
                            document.querySelector(
                                "[data-ticket-description]"
                            ) as HTMLTextAreaElement
                        ).value

                    };

                    await HelpModule.createTicket(
                        payload
                    );

                }

            );

        /* ==================================================
           REPLY TO TICKET
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const action =
                        target.closest(
                            "[data-ticket-id]"
                        );

                    if (!action) {

                        return;

                    }

                    const ticketId =
                        action.getAttribute(
                            "data-ticket-id"
                        );

                    const message = (
                        document.querySelector(
                            "[data-ticket-reply]"
                        ) as HTMLTextAreaElement
                    )?.value;

                    if (!ticketId || !message) {

                        return;

                    }

                    await HelpModule.replyToTicket(

                        ticketId,

                        message

                    );

                }

            );

        /* ==================================================
           CLOSE TICKET
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const action =
                        target.closest(
                            "[data-close-ticket]"
                        );

                    if (!action) {

                        return;

                    }

                    const ticketId =
                        action.getAttribute(
                            "data-close-ticket"
                        );

                    if (!ticketId) {

                        return;

                    }

                    await HelpModule.closeTicket(
                        ticketId
                    );

                }

            );

        /* ==================================================
           LIVE CHAT
        ================================================== */

        document

            .querySelector(
                "[data-live-chat]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await HelpModule.startLiveChat();

                }

            );

        /* ==================================================
           SUBMIT FEEDBACK
        ================================================== */

        document

            .querySelector(
                "[data-submit-feedback]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const payload = {

                        rating: (
                            document.querySelector(
                                "[data-feedback-rating]"
                            ) as HTMLInputElement
                        ).value,

                        message: (
                            document.querySelector(
                                "[data-feedback-message]"
                            ) as HTMLTextAreaElement
                        ).value

                    };

                    await HelpModule.submitFeedback(
                        payload
                    );

                }

            );

        /* ==================================================
           REPORT BUG
        ================================================== */

        document

            .querySelector(
                "[data-report-bug]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const payload = {

                        title: (
                            document.querySelector(
                                "[data-bug-title]"
                            ) as HTMLInputElement
                        ).value,

                        description: (
                            document.querySelector(
                                "[data-bug-description]"
                            ) as HTMLTextAreaElement
                        ).value

                    };

                    await HelpModule.reportBug(
                        payload
                    );

                }

            );

        /* ==================================================
           FEATURE REQUEST
        ================================================== */

        document

            .querySelector(
                "[data-request-feature]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const payload = {

                        title: (
                            document.querySelector(
                                "[data-feature-title]"
                            ) as HTMLInputElement
                        ).value,

                        description: (
                            document.querySelector(
                                "[data-feature-description]"
                            ) as HTMLTextAreaElement
                        ).value

                    };

                    await HelpModule.requestFeature(
                        payload
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

export default new HelpController();
