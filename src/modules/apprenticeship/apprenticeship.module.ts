/* ==========================================================
   REMADEF PLATFORM
   Apprenticeship Module
   File: src/modules/apprenticeship/apprenticeship.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {
    Apprenticeship,
    ApprenticeshipApplication,
    ApprenticeshipDashboard,
    ApprenticeshipOpportunity
} from "../../types/apprenticeship";

class ApprenticeshipModule {

    private readonly DASHBOARD_KEY =
        "apprenticeship.dashboard";

    private readonly OPPORTUNITIES_KEY =
        "apprenticeship.opportunities";

    private readonly APPLICATIONS_KEY =
        "apprenticeship.applications";

    private readonly CACHE_KEY =
        "apprenticeship-cache";

    private loading = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        this.restore();

        this.registerEvents();

        await this.refresh();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "apprenticeship:refresh",

            () => this.refresh()

        );

        Events.on(

            "apprenticeship:reloadOpportunities",

            () => this.loadOpportunities()

        );

        Events.on(

            "apprenticeship:reloadApplications",

            () => this.loadApplications()

        );

    }

    /* ======================================================
       REFRESH
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            await Promise.all([

                this.loadDashboard(),

                this.loadOpportunities(),

                this.loadApplications()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       DASHBOARD
    ====================================================== */

    async loadDashboard(): Promise<void> {

        const response =
            await API.apprenticeship.getDashboard();

        State.set(

            this.DASHBOARD_KEY,

            response.data

        );

        Cache.set(

            this.CACHE_KEY,

            response.data

        );

        Events.emit(

            "apprenticeship:dashboardLoaded",

            response.data

        );

    }

    /* ======================================================
       OPPORTUNITIES
    ====================================================== */

    async loadOpportunities(): Promise<void> {

        const response =
            await API.apprenticeship.getOpportunities();

        State.set(

            this.OPPORTUNITIES_KEY,

            response.data || []

        );

        Events.emit(

            "apprenticeship:opportunitiesLoaded",

            response.data || []

        );

    }

    /* ======================================================
       APPLICATIONS
    ====================================================== */

    async loadApplications(): Promise<void> {

        const response =
            await API.apprenticeship.getApplications();

        State.set(

            this.APPLICATIONS_KEY,

            response.data || []

        );

        Events.emit(

            "apprenticeship:applicationsLoaded",

            response.data || []

        );

    }

    /* ======================================================
       APPLY
    ====================================================== */

    async apply(

        opportunityId: string

    ): Promise<void> {

        await API.apprenticeship.apply(

            opportunityId

        );

        await this.loadApplications();

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getDashboard():

        ApprenticeshipDashboard | null {

        return (

            State.get(

                this.DASHBOARD_KEY

            ) || null

        );

    }

    getApplications():

        ApprenticeshipApplication[] {

        return (

            State.get(

                this.APPLICATIONS_KEY

            ) || []

        );

    }

    getOpportunities():

        ApprenticeshipOpportunity[] {

        return (

            State.get(

                this.OPPORTUNITIES_KEY

            ) || []

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restore(): void {

        const cached =

            Cache.get(

                this.CACHE_KEY

            );

        if (!cached) {

            return;

        }

        State.set(

            this.DASHBOARD_KEY,

            cached

        );

    }

}

export default new ApprenticeshipModule();
