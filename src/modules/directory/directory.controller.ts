/* ==========================================================
   REMADEF PLATFORM
   Directory Controller
   File: src/modules/directory/directory.controller.ts
========================================================== */

import DirectoryModule from "./directory.module";
import DirectoryView from "./directory-view";

class DirectoryController {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.bindUI();

        await DirectoryModule.initialize();

        DirectoryView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindUI(): void {

        /* ==================================================
           SEARCH
        ================================================== */

        document

            .querySelector<HTMLInputElement>(
                "[data-directory-search]"
            )

            ?.addEventListener(

                "input",

                async event => {

                    const query =

                        (
                            event.target as HTMLInputElement
                        ).value.trim();

                    if (!query) {

                        await DirectoryModule.refresh();

                        return;

                    }

                    await DirectoryModule.search(
                        query
                    );

                }

            );

        /* ==================================================
           FILTERS
        ================================================== */

        document

            .querySelector(
                "[data-directory-filter]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const filters = {

                        category:

                            (
                                document.querySelector(
                                    "[data-filter-category]"
                                ) as HTMLSelectElement
                            )?.value,

                        location:

                            (
                                document.querySelector(
                                    "[data-filter-location]"
                                ) as HTMLInputElement
                            )?.value,

                        verified:

                            (
                                document.querySelector(
                                    "[data-filter-verified]"
                                ) as HTMLInputElement
                            )?.checked

                    };

                    await DirectoryModule.applyFilters(
                        filters
                    );

                }

            );

        /* ==================================================
           CATEGORY
        ================================================== */

        document

            .querySelectorAll(
                "[data-directory-category]"
            )

            .forEach(element => {

                element.addEventListener(

                    "click",

                    async () => {

                        const category =

                            element.getAttribute(
                                "data-directory-category"
                            );

                        switch (category) {

                            case "students":

                                await DirectoryModule.loadStudents();

                                break;

                            case "apprentices":

                                await DirectoryModule.loadApprentices();

                                break;

                            case "businesses":

                                await DirectoryModule.loadBusinesses();

                                break;

                            case "employers":

                                await DirectoryModule.loadEmployers();

                                break;

                            case "professionals":

                                await DirectoryModule.loadProfessionals();

                                break;

                            case "creators":

                                await DirectoryModule.loadCreators();

                                break;

                            case "organizations":

                                await DirectoryModule.loadOrganizations();

                                break;

                            case "services":

                                await DirectoryModule.loadServiceProviders();

                                break;

                            default:

                                await DirectoryModule.refresh();

                        }

                    }

                );

            });

        /* ==================================================
           FAVORITES
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =

                        event.target as HTMLElement;

                    const favorite =

                        target.closest(
                            "[data-directory-favorite]"
                        );

                    if (!favorite) {

                        return;

                    }

                    const id =

                        favorite.getAttribute(
                            "data-directory-favorite"
                        );

                    if (!id) {

                        return;

                    }

                    await DirectoryModule.addFavorite(
                        id
                    );

                }

            );

        /* ==================================================
           FOLLOW
        ================================================== */

        document

            .addEventListener(

                "click",

                async event => {

                    const target =

                        event.target as HTMLElement;

                    const follow =

                        target.closest(
                            "[data-directory-follow]"
                        );

                    if (!follow) {

                        return;

                    }

                    const id =

                        follow.getAttribute(
                            "data-directory-follow"
                        );

                    if (!id) {

                        return;

                    }

                    await DirectoryModule.follow(
                        id
                    );

                }

            );

        /* ==================================================
           NEARBY
        ================================================== */

        document

            .querySelector(
                "[data-directory-nearby]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await DirectoryModule.loadNearby();

                }

            );

        /* ==================================================
           RECOMMENDATIONS
        ================================================== */

        document

            .querySelector(
                "[data-directory-recommendations]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await DirectoryModule.loadRecommendations();

                }

            );

        /* ==================================================
           RECENT
        ================================================== */

        document

            .querySelector(
                "[data-directory-recent]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await DirectoryModule.loadRecent();

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

export default new DirectoryConController
