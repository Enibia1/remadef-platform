/* ==========================================================
   REMADEF PLATFORM
   Apprenticeship Opportunities
   File: src/modules/apprenticeship/opportunities.ts
========================================================== */

import ApprenticeshipModule from "./apprenticeship.module";
import Events from "../../core/events";

import type {
    ApprenticeshipOpportunity
} from "../../types/apprenticeship";

class ApprenticeshipOpportunities {

    private opportunities: ApprenticeshipOpportunity[] = [];

    private filtered: ApprenticeshipOpportunity[] = [];

    initialize(): void {

        this.opportunities =
            ApprenticeshipModule.getOpportunities();

        this.filtered = [
            ...this.opportunities
        ];

        this.registerEvents();

        this.render();

    }

    private registerEvents(): void {

        Events.on(

            "apprenticeship:opportunitiesLoaded",

            (items: ApprenticeshipOpportunity[]) => {

                this.opportunities = items;

                this.filtered = [...items];

                this.render();

            }

        );

    }

    filter(

        keyword: string

    ): void {

        const search =
            keyword.toLowerCase();

        this.filtered =
            this.opportunities.filter(

                item =>

                    item.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.company
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.location
                        .toLowerCase()
                        .includes(search)

            );

        this.render();

    }

    async apply(

        opportunityId: string

    ): Promise<void> {

        await ApprenticeshipModule.apply(

            opportunityId

        );

    }

    private render(): void {

        if (

            !this.filtered.length

        ) {

            this.renderEmptyState();

            return;

        }

        // Responsive opportunity grid

        // Company logo

        // Match score

        // Salary / Stipend

        // Duration

        // Required skills

        // Save

        // Share

        // Apply

    }

    private renderEmptyState(): void {

        // No opportunities found

    }

}

export default new ApprenticeshipOpportunities();
