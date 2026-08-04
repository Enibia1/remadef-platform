/* ==========================================================
   REMADEF PLATFORM
   Jobs & Gigs Module
   File: src/modules/jobs/jobs.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    Job,
    JobApplication,
    JobCategory,
    JobRecommendation,
    SavedJob,
    Employer

} from "../../types/jobs";

class JobsModule {

    private readonly JOBS_KEY =
        "jobs.data";

    private readonly SAVED_KEY =
        "jobs.saved";

    private readonly APPLICATIONS_KEY =
        "jobs.applications";

    private readonly RECOMMENDATIONS_KEY =
        "jobs.recommendations";

    private readonly CATEGORIES_KEY =
        "jobs.categories";

    private readonly EMPLOYERS_KEY =
        "jobs.employers";

    private readonly CACHE_KEY =
        "jobs-cache";

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

            "jobs:refresh",

            () => this.refresh()

        );

        Events.on(

            "jobs:saved",

            () => this.reloadSavedJobs()

        );

        Events.on(

            "jobs:applications",

            () => this.reloadApplications()

        );

        Events.on(

            "jobs:recommendations",

            () => this.reloadRecommendations()

        );

    }

    /* ======================================================
       LOAD JOBS
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.jobs.getJobs();

            const jobs =
                response.data as Job[];

            State.set(

                this.JOBS_KEY,

                jobs

            );

            Cache.set(

                this.CACHE_KEY,

                jobs

            );

            Events.emit(

                "jobs:loaded",

                jobs

            );

            await Promise.all([

                this.reloadSavedJobs(),

                this.reloadApplications(),

                this.reloadRecommendations(),

                this.reloadCategories(),

                this.reloadEmployers()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       SAVED JOBS
    ====================================================== */

    async reloadSavedJobs(): Promise<void> {

        const response =
            await API.jobs.getSavedJobs();

        const saved =
            (response.data ?? []) as SavedJob[];

        State.set(

            this.SAVED_KEY,

            saved

        );

        Events.emit(

            "jobs:savedUpdated",

            saved

        );

    }

    /* ======================================================
       APPLICATIONS
    ====================================================== */

    async reloadApplications(): Promise<void> {

        const response =
            await API.jobs.getApplications();

        const applications =
            (response.data ?? []) as JobApplication[];

        State.set(

            this.APPLICATIONS_KEY,

            applications

        );

        Events.emit(

            "jobs:applicationsUpdated",

            applications

        );

    }

    /* ======================================================
       RECOMMENDATIONS
    ====================================================== */

    async reloadRecommendations(): Promise<void> {

        const response =
            await API.jobs.getRecommendations();

        const recommendations =
            (response.data ?? []) as JobRecommendation[];

        State.set(

            this.RECOMMENDATIONS_KEY,

            recommendations

        );

        Events.emit(

            "jobs:recommendationsUpdated",

            recommendations

        );

    }

    /* ======================================================
       CATEGORIES
    ====================================================== */

    async reloadCategories(): Promise<void> {

        const response =
            await API.jobs.getCategories();

        const categories =
            (response.data ?? []) as JobCategory[];

        State.set(

            this.CATEGORIES_KEY,

            categories

        );

        Events.emit(

            "jobs:categoriesUpdated",

            categories

        );

    }

    /* ======================================================
       EMPLOYERS
    ====================================================== */

    async reloadEmployers(): Promise<void> {

        const response =
            await API.jobs.getEmployers();

        const employers =
            (response.data ?? []) as Employer[];

        State.set(

            this.EMPLOYERS_KEY,

            employers

        );

        Events.emit(

            "jobs:employersUpdated",

            employers

        );

    }
