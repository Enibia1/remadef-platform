 /* ==========================================================
   REMADEF PLATFORM
   Advertising Controller
   File: src/modules/advertising/advertising.controller.ts
========================================================== */

import AdvertisingModule from "./advertising.module";
import AdvertisingView from "./advertising-view";

class AdvertisingController {

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

        await AdvertisingModule.initialize();

        AdvertisingView.initialize();

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
                "[data-advertising-refresh]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await AdvertisingModule.refresh();

                }

            );

        /* ==================================================
           CREATE CAMPAIGN
        ================================================== */

        document

            .querySelector(
                "[data-create-campaign]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const campaign = {

                        name: (
                            document.querySelector(
                                "[data-campaign-name]"
                            ) as HTMLInputElement
                        ).value,

                        objective: (
                            document.querySelector(
                                "[data-campaign-objective]"
                            ) as HTMLSelectElement
                        ).value,

                        budget: Number(
                            (
                                document.querySelector(
                                    "[data-campaign-budget]"
                                ) as HTMLInputElement
                            ).value
                        )

                    };

                    await AdvertisingModule.createCampaign(
                        campaign as never
                    );

                }

            );

        /* ==================================================
           APPROVE CAMPAIGN
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const button =
                        target.closest(
                            "[data-approve-campaign]"
                        );

                    if (!button) {

                        return;

                    }

                    const campaignId =
                        button.getAttribute(
                            "data-approve-campaign"
                        );

                    if (!campaignId) {

                        return;

                    }

                    await AdvertisingModule.approveCampaign(
                        campaignId
                    );

                }

            );

        /* ==================================================
           PAUSE CAMPAIGN
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const button =
                        target.closest(
                            "[data-pause-campaign]"
                        );

                    if (!button) {

                        return;

                    }

                    const campaignId =
                        button.getAttribute(
                            "data-pause-campaign"
                        );

                    if (!campaignId) {

                        return;

                    }

                    await AdvertisingModule.pauseCampaign(
                        campaignId
                    );

                }

            );

        /* ==================================================
           RESUME CAMPAIGN
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const button =
                        target.closest(
                            "[data-resume-campaign]"
                        );

                    if (!button) {

                        return;

                    }

                    const campaignId =
                        button.getAttribute(
                            "data-resume-campaign"
                        );

                    if (!campaignId) {

                        return;

                    }

                    await AdvertisingModule.resumeCampaign(
                        campaignId
                    );

                }

            );

        /* ==================================================
           DELETE CAMPAIGN
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const button =
                        target.closest(
                            "[data-delete-campaign]"
                        );

                    if (!button) {

                        return;

                    }

                    const campaignId =
                        button.getAttribute(
                            "data-delete-campaign"
                        );

                    if (!campaignId) {

                        return;

                    }

                    await AdvertisingModule.deleteCampaign(
                        campaignId
                    );

                }

            );

        /* ==================================================
           UPDATE BUDGET
        ================================================== */

        document

            .querySelector(
                "[data-update-budget]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const campaignId = (
                        document.querySelector(
                            "[data-budget-campaign-id]"
                        ) as HTMLInputElement
                    ).value;

                    const budget = Number(
                        (
                            document.querySelector(
                                "[data-budget-value]"
                            ) as HTMLInputElement
                        ).value
                    );

                    await AdvertisingModule.updateBudget(
                        campaignId,
                        budget
                    );

                }

            );

        /* ==================================================
           TRACK IMPRESSION
        ================================================== */

        document

            .addEventListener(

                "impression",

                async event => {

                    const detail = (event as CustomEvent).detail;

                    await AdvertisingModule.recordImpression(

                        detail.advertisementId,

                        detail.placementId

                    );

                }

            );

        /* ==================================================
           TRACK CLICK
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =
                        event.target as HTMLElement;

                    const ad =
                        target.closest(
                            "[data-ad-id]"
                        );

                    if (!ad) {

                        return;

                    }

                    await AdvertisingModule.recordClick(

                        ad.getAttribute(
                            "data-ad-id"
                        )!,

                        ad.getAttribute(
                            "data-placement-id"
                        )!

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

export default new AdvertisingController();
