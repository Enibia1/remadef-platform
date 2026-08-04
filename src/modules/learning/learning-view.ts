/* ==========================================================
   REMADEF PLATFORM
   Learning View
   File: src/modules/learning/learning-view.ts
========================================================== */

import LearningModule from "./learning.module";

import Events from "../../core/events";

import type {

    LearningDashboard,
    Course,
    CourseCategory,
    LearningProgress,
    LearningRecommendation

} from "../../types/learning";

class LearningView {

    private dashboard: LearningDashboard | null = null;

    private courses: Course[] = [];

    private categories: CourseCategory[] = [];

    private progress: LearningProgress[] = [];

    private recommendations: LearningRecommendation[] = [];

    /* ======================================================
       INITIALIZE
    ====================================================== */

    initialize(): void {

        this.dashboard =
            LearningModule.getDashboard();

        this.courses =
            LearningModule.getCourses();

        this.categories =
            LearningModule.getCategories();

        this.progress =
            LearningModule.getProgress();

        this.recommendations =
            LearningModule.getRecommendations();

        this.registerEvents();

        this.render();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "learning:loaded",

            (dashboard: LearningDashboard) => {

                this.dashboard = dashboard;

                this.render();

            }

        );

        Events.on(

            "learning:coursesUpdated",

            (courses: Course[]) => {

                this.courses = courses;

                this.renderCourses();

            }

        );

        Events.on(

            "learning:categoriesUpdated",

            (categories: CourseCategory[]) => {

                this.categories = categories;

                this.renderCategories();

            }

        );

        Events.on(

            "learning:progressUpdated",

            (progress: LearningProgress[]) => {

                this.progress = progress;

                this.renderProgress();

            }

        );

        Events.on(

            "learning:recommendationsUpdated",

            (recommendations: LearningRecommendation[]) => {

                this.recommendations =
                    recommendations;

                this.renderRecommendations();

            }

        );

    }

    /* ======================================================
       RENDER
    ====================================================== */

    private render(): void {

        this.renderDashboard();

        this.renderContinueLearning();

        this.renderFeaturedCourses();

        this.renderCategories();

        this.renderProgress();

        this.renderRecommendations();

    }

    /* ======================================================
       DASHBOARD
    ====================================================== */

    private renderDashboard(): void {

        if (!this.dashboard) {

            return;

        }

        // Welcome Banner

        // Total Courses

        // Active Courses

        // Certificates

        // Learning Hours

        // Weekly Progress

    }

    /* ======================================================
       CONTINUE LEARNING
    ====================================================== */

    private renderContinueLearning(): void {

        // Resume latest course

        // Resume latest lesson

        // Continue button

        // Progress bar

    }

    /* ======================================================
       FEATURED COURSES
    ====================================================== */

    private renderFeaturedCourses(): void {

        // Responsive Course Cards

        // Thumbnail

        // Instructor

        // Rating

        // Students

        // Duration

        // Price

    }

    /* ======================================================
       COURSE GRID
    ====================================================== */

    private renderCourses(): void {

        // Masonry/Grid renderer

        // Pagination

        // Infinite Scroll

    }

    /* ======================================================
       CATEGORIES
    ====================================================== */

    private renderCategories(): void {

        // Horizontal chips

        // Icons

        // Course counts

    }
