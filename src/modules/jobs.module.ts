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

    /* ======================================================
       APPLY
    ====================================================== */

    async apply(
        jobId: string,
        data: Record<string, unknown>
    ): Promise<void> {

        await API.jobs.apply(

            jobId,

            data

        );

        await this.reloadApplications();

    }

    /* ======================================================
       WITHDRAW APPLICATION
    ====================================================== */

    async withdrawApplication(
        applicationId: string
    ): Promise<void> {

        await API.jobs.withdrawApplication(

            applicationId

        );

        await this.reloadApplications();

    }

    /* ======================================================
       SAVE JOB
    ====================================================== */

    async saveJob(
        jobId: string
    ): Promise<void> {

        await API.jobs.saveJob(

            jobId

        );

        await this.reloadSavedJobs();

    }

    async unsaveJob(
        jobId: string
    ): Promise<void> {

        await API.jobs.unsaveJob(

            jobId

        );

        await this.reloadSavedJobs();

    }

    /* ======================================================
       CREATE JOB
    ====================================================== */

    async createJob(
        data: Record<string, unknown>
    ): Promise<void> {

        await API.jobs.createJob(

            data

        );

        await this.refresh();

    }

    /* ======================================================
       UPDATE JOB
    ====================================================== */

    async updateJob(
        jobId: string,
        data: Record<string, unknown>
    ): Promise<void> {

        await API.jobs.updateJob(

            jobId,

            data

        );

        await this.refresh();

    }

    /* ======================================================
       DELETE JOB
    ====================================================== */

    async deleteJob(
        jobId: string
    ): Promise<void> {

        await API.jobs.deleteJob(

            jobId

        );

        await this.refresh();

    }

    /* ======================================================
       SEARCH
    ====================================================== */

    async search(
        query: string
    ): Promise<void> {

        const response =
            await API.jobs.search(
                query
            );

        State.set(

            "jobs.search",

            response.data ?? []

        );

        Events.emit(

            "jobs:searchUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       FILTER
    ====================================================== */

    async filter(
        filters: Record<string, unknown>
    ): Promise<void> {

        const response =
            await API.jobs.filter(
                filters
            );

        State.set(

            "jobs.filtered",

            response.data ?? []

        );

        Events.emit(

            "jobs:filteredUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       FOLLOW EMPLOYER
    ====================================================== */

    async followEmployer(
        employerId: string
    ): Promise<void> {

        await API.jobs.followEmployer(
            employerId
        );

        await this.reloadEmployers();

    }

    async unfollowEmployer(
        employerId: string
    ): Promise<void> {

        await API.jobs.unfollowEmployer(
            employerId
        );

        await this.reloadEmployers();

    }

    /* ======================================================
       REPORT JOB
    ====================================================== */

    async reportJob(
        jobId: string,
        reason: string
    ): Promise<void> {

        await API.jobs.reportJob({

            jobId,

            reason

        });

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getJobs(): Job[] {

        return (

            State.get(

                this.JOBS_KEY

            ) || []

        );

    }

    getSavedJobs(): SavedJob[] {

        return (

            State.get(

                this.SAVED_KEY

            ) || []

        );

    }

    getApplications(): JobApplication[] {

        return (

            State.get(

                this.APPLICATIONS_KEY

            ) || []

        );

    }

    getRecommendations(): JobRecommendation[] {

        return (

            State.get(

                this.RECOMMENDATIONS_KEY

            ) || []

        );

    }

    getCategories(): JobCategory[] {

        return (

            State.get(

                this.CATEGORIES_KEY

            ) || []

        );

    }

    getEmployers(): Employer[] {

        return (

            State.get(

                this.EMPLOYERS_KEY

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

            this.JOBS_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.JOBS_KEY

        );

        State.remove(

            this.SAVED_KEY

        );

        State.remove(

            this.APPLICATIONS_KEY

        );

        State.remove(

            this.RECOMMENDATIONS_KEY

        );

        State.remove(

            this.CATEGORIES_KEY

        );

        State.remove(

            this.EMPLOYERS_KEY

        );

        State.remove(

            "jobs.search"

        );

        State.remove(

            "jobs.filtered"

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "jobs:cleared"

        );

    }

}

export default new JobsModule();
