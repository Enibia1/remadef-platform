/* ==========================================================
   REMADEF PLATFORM
   Apprenticeship Applications
   File: src/modules/apprenticeship/applications.ts
========================================================== */

import ApprenticeshipModule from "./apprenticeship.module";
import Events from "../../core/events";

import type {
    ApprenticeshipApplication
} from "../../types/apprenticeship";

class ApprenticeshipApplications {

    private applications:
        ApprenticeshipApplication[] = [];

    initialize(): void {

        this.applications =
            ApprenticeshipModule.getApplications();

        this.registerEvents();

        this.render();

    }

    private registerEvents(): void {

        Events.on(

            "apprenticeship:applicationsLoaded",

            (items: ApprenticeshipApplication[]) => {

                this.applications = items;

                this.render();

            }

        );

    }

    private render(): void {

        if (

            !this.applications.length

        ) {

            this.renderEmptyState();

            return;

        }

        // Timeline

        // Submitted

        // Under Review

        // Interview

        // Accepted

        // Rejected

        // Withdrawn

        // Employer

        // Mentor

        // Last Updated

    }

    refresh(): void {

        Events.emit(

            "apprenticeship:reloadApplications"

        );

    }

    private renderEmptyState(): void {

        // No applications yet

        // Browse Opportunities button

    }

}

export default new ApprenticeshipApplications();
