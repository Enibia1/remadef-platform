/* ==========================================================
   REMADEF PLATFORM
   Learning Module
   File: src/modules/learning/learning.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    LearningDashboard,
    Course,
    CourseCategory,
    LearningProgress,
    LearningRecommendation

} from "../../types/learning";

class LearningModule {

    private readonly DASHBOARD_KEY =
        "learning.dashboard";

    private readonly COURSES_KEY =
        "learning.courses";

    private readonly CATEGORIES_KEY =
        "learning.categories";

    private readonly PROGRESS_KEY =
        "learning.progress";

    private readonly RECOMMENDATIONS_KEY =
        "learning.recommendations";

    private readonly CACHE_KEY =
        "learning-cache";

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

            "learning:refresh",

            () => this.refresh()

        );

        Events.on(

            "learning:reloadCourses",

            () => this.reloadCourses()

        );

        Events.on(

            "learning:reloadCategories",

            () => this.reloadCategories()

        );

        Events.on(

            "learning:reloadProgress",

            () => this.reloadProgress()

        );

        Events.on(

            "learning:reloadRecommendations",

            () => this.reloadRecommendations()

        );

    }

    /* ======================================================
       DASHBOARD
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.learning.dashboard();

            const dashboard =
                response.data as LearningDashboard;

            State.set(

                this.DASHBOARD_KEY,

                dashboard

            );

            Cache.set(

                this.CACHE_KEY,

                dashboard

            );

            Events.emit(

                "learning:loaded",

                dashboard

            );

            await Promise.all([

                this.reloadCourses(),

                this.reloadCategories(),

                this.reloadProgress(),

                this.reloadRecommendations()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       COURSES
    ====================================================== */

    async reloadCourses(): Promise<void> {

        const response =
            await API.learning.getCourses();

        const courses =
            (response.data ?? []) as Course[];

        State.set(

            this.COURSES_KEY,

            courses

        );

        Events.emit(

            "learning:coursesUpdated",

            courses

        );

    }

    /* ======================================================
       CATEGORIES
    ====================================================== */

    async reloadCategories(): Promise<void> {

        const response =
            await API.learning.getCategories();

        const categories =
            (response.data ?? []) as CourseCategory[];

        State.set(

            this.CATEGORIES_KEY,

            categories

        );

        Events.emit(

            "learning:categoriesUpdated",

            categories

        );

    }

    /* ======================================================
       PROGRESS
    ====================================================== */

    async reloadProgress(): Promise<void> {

        const response =
            await API.learning.getProgress();

        const progress =
            (response.data ?? []) as LearningProgress[];

        State.set(

            this.PROGRESS_KEY,

            progress

        );

        Events.emit(

            "learning:progressUpdated",

            progress

        );

    }

    /* ======================================================
       RECOMMENDATIONS
    ====================================================== */

    async reloadRecommendations(): Promise<void> {

        const response =
            await API.learning.getRecommendations();

        const recommendations =
            (response.data ?? []) as LearningRecommendation[];

        State.set(

            this.RECOMMENDATIONS_KEY,

            recommendations

        );

        Events.emit(

            "learning:recommendationsUpdated",

            recommendations

        );

    }
