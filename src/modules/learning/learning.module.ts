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

           
    /* ======================================================
       ENROLLED COURSES
    ====================================================== */

    async reloadEnrolledCourses(): Promise<void> {

        const response =
            await API.learning.getEnrolledCourses();

        const courses =
            (response.data ?? []) as Course[];

        State.set(

            "learning.enrolled",

            courses

        );

        Events.emit(

            "learning:enrolledUpdated",

            courses

        );

    }

    /* ======================================================
       CONTINUE LEARNING
    ====================================================== */

    async reloadContinueLearning(): Promise<void> {

        const response =
            await API.learning.getContinueLearning();

        const courses =
            (response.data ?? []) as Course[];

        State.set(

            "learning.continue",

            courses

        );

        Events.emit(

            "learning:continueUpdated",

            courses

        );

    }

    /* ======================================================
       FEATURED COURSES
    ====================================================== */

    async reloadFeaturedCourses(): Promise<void> {

        const response =
            await API.learning.getFeaturedCourses();

        const courses =
            (response.data ?? []) as Course[];

        State.set(

            "learning.featured",

            courses

        );

        Events.emit(

            "learning:featuredUpdated",

            courses

        );

    }

    /* ======================================================
       BOOKMARKS
    ====================================================== */

    async reloadBookmarks(): Promise<void> {

        const response =
            await API.learning.getBookmarks();

        State.set(

            "learning.bookmarks",

            response.data ?? []

        );

        Events.emit(

            "learning:bookmarksUpdated",

            response.data ?? []

        );

    }

    async bookmarkCourse(
        courseId: string
    ): Promise<void> {

        await API.learning.bookmarkCourse(
            courseId
        );

        await this.reloadBookmarks();

    }

    async removeBookmark(
        courseId: string
    ): Promise<void> {

        await API.learning.removeBookmark(
            courseId
        );

        await this.reloadBookmarks();

    }

    /* ======================================================
       SEARCH
    ====================================================== */

    async searchCourses(
        query: string
    ): Promise<Course[]> {

        const response =
            await API.learning.searchCourses(
                query
            );

        return (response.data ?? []) as Course[];

    }

    /* ======================================================
       WISHLIST
    ====================================================== */

    async reloadWishlist(): Promise<void> {

        const response =
            await API.learning.getWishlist();

        State.set(

            "learning.wishlist",

            response.data ?? []

        );

        Events.emit(

            "learning:wishlistUpdated",

            response.data ?? []

        );

    }

    async addToWishlist(
        courseId: string
    ): Promise<void> {

        await API.learning.addToWishlist(
            courseId
        );

        await this.reloadWishlist();

    }

    async removeFromWishlist(
        courseId: string
    ): Promise<void> {

        await API.learning.removeFromWishlist(
            courseId
        );

        await this.reloadWishlist();

    }

    /* ======================================================
       NOTES
    ====================================================== */

    async reloadNotes(
        courseId: string
    ): Promise<void> {

        const response =
            await API.learning.getNotes(
                courseId
            );

        State.set(

            `learning.notes.${courseId}`,

            response.data ?? []

        );

        Events.emit(

            "learning:notesUpdated",

            response.data ?? []

        );

    }

    async saveNote(
        courseId: string,
        note: string
    ): Promise<void> {

        await API.learning.saveNote(

            courseId,

            note

        );

        await this.reloadNotes(
            courseId
        );

    }

    async deleteNote(
        noteId: string,
        courseId: string
    ): Promise<void> {

        await API.learning.deleteNote(
            noteId
        );

        await this.reloadNotes(
            courseId
        );

           /* ======================================================
       CERTIFICATES
    ====================================================== */

    async reloadCertificates(): Promise<void> {

        const response =
            await API.learning.getCertificates();

        State.set(

            "learning.certificates",

            response.data ?? []

        );

        Events.emit(

            "learning:certificatesUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       DOWNLOADS
    ====================================================== */

    async reloadDownloads(): Promise<void> {

        const response =
            await API.learning.getDownloads();

        State.set(

            "learning.downloads",

            response.data ?? []

        );

        Events.emit(

            "learning:downloadsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       REVIEWS
    ====================================================== */

    async submitReview(

        courseId: string,

        rating: number,

        comment: string

    ): Promise<void> {

        await API.learning.submitReview({

            courseId,

            rating,

            comment

        });

        Events.emit(

            "learning:reviewSubmitted",

            courseId

        );

    }

    /* ======================================================
       COURSE PROGRESS
    ====================================================== */

    async updateCourseProgress(

        courseId: string,

        lessonId: string,

        progress: number

    ): Promise<void> {

        await API.learning.updateProgress({

            courseId,

            lessonId,

            progress

        });

        await this.reloadProgress();

    }

    async completeLesson(

        lessonId: string

    ): Promise<void> {

        await API.learning.completeLesson(

            lessonId

        );

        await this.reloadProgress();

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getDashboard(): LearningDashboard | null {

        return (

            State.get(

                this.DASHBOARD_KEY

            ) || null

        );

    }

    getCourses(): Course[] {

        return (

            State.get(

                this.COURSES_KEY

            ) || []

        );

    }

    getCategories(): CourseCategory[] {

        return (

            State.get(

                this.CATEGORIES_KEY

            ) || []

        );

    }

    getProgress(): LearningProgress[] {

        return (

            State.get(

                this.PROGRESS_KEY

            ) || []

        );

    }

    getRecommendations(): LearningRecommendation[] {

        return (

            State.get(

                this.RECOMMENDATIONS_KEY

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

        Events.emit(

            "learning:loaded",

            cached

        );

    }

}

export default new LearningModule();



    }

