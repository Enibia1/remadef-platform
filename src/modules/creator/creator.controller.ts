/* ==========================================================
   REMADEF PLATFORM
   Creator Controller
   File: src/modules/creator/creator.controller.ts
========================================================== */

import CreatorModule from "./creator.module";
import CreatorView from "./creator-view";

class CreatorController {

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

        await CreatorModule.initialize();

        CreatorView.initialize();

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
                "[data-creator-refresh]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.refresh();

                }

            );

        /* ==================================================
           CAMPAIGN APPLICATION
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =

                        event.target as HTMLElement;

                    const button =

                        target.closest(
                            "[data-campaign-id]"
                        );

                    if (!button) {

                        return;

                    }

                    const campaignId =

                        button.getAttribute(
                            "data-campaign-id"
                        );

                    if (!campaignId) {

                        return;

                    }

                    await CreatorModule.applyForCampaign(
                        campaignId
                    );

                }

            );

        /* ==================================================
           PAYOUT
        ================================================== */

        document

            .querySelector(
                "[data-request-payout]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.requestPayout();

                }

            );

        /* ==================================================
           POSTS
        ================================================== */

        document

            .querySelector(
                "[data-load-posts]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadPosts();

                }

            );

        /* ==================================================
           EARNINGS
        ================================================== */

        document

            .querySelector(
                "[data-load-earnings]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadEarnings();

                }

            );

        /* ==================================================
           ANALYTICS
        ================================================== */

        document

            .querySelector(
                "[data-load-analytics]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadAnalytics();

                }

            );

        /* ==================================================
           CAMPAIGNS
        ================================================== */

        document

            .querySelector(
                "[data-load-campaigns]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadCampaigns();

                }

            );

        /* ==================================================
           FOLLOWERS
        ================================================== */

        document

            .querySelector(
                "[data-load-followers]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadFollowers();

                }

            );

        /* ==================================================
           SUBSCRIBERS
        ================================================== */

        document

            .querySelector(
                "[data-load-subscribers]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadSubscribers();

                }

            );

        /* ==================================================
           LIVE STREAMS
        ================================================== */

        document

            .querySelector(
                "[data-load-live-streams]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadLiveStreams();

                }

            );

        /* ==================================================
           CONTENT INSIGHTS
        ================================================== */

        document

            .querySelector(
                "[data-load-content-insights]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadContentInsights();

                }

            );

        /* ==================================================
           COLLABORATIONS
        ================================================== */

        document

            .querySelector(
                "[data-load-collaborations]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.loadCollaborations();

                }

            );

        /* ==================================================
           MONETIZATION
        ================================================== */

        document

            .querySelector(
                "[data-check-monetization]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await CreatorModule.checkMonetizationEligibility();

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

export default new CreatorController();

