/* ==========================================================
   REMADEF PLATFORM
   Admin Module
   File: src/modules/admin/admin.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    AdminOverview,
    AdminStatistics,
    AdminUser,
    AdminReport,
    AdminTask,
    AdminAnnouncement

} from "../../types/admin";

class AdminModule {

    private readonly OVERVIEW_KEY =
        "admin.overview";

    private readonly STATISTICS_KEY =
        "admin.statistics";

    private readonly USERS_KEY =
        "admin.users";

    private readonly REPORTS_KEY =
        "admin.reports";

    private readonly TASKS_KEY =
        "admin.tasks";

    private readonly ANNOUNCEMENTS_KEY =
        "admin.announcements";

    private readonly CACHE_KEY =
        "admin-cache";

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

            "admin:refresh",

            () => this.refresh()

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

                this.loadOverview(),

                this.loadStatistics(),

                this.loadUsers(),

                this.loadReports(),

                this.loadTasks(),

                this.loadAnnouncements()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       OVERVIEW
    ====================================================== */

    async loadOverview(): Promise<void> {

        const response =
            await API.admin.overview();

        const overview =
            response.data as AdminOverview;

        State.set(

            this.OVERVIEW_KEY,

            overview

        );

        Cache.set(

            this.CACHE_KEY,

            overview

        );

        Events.emit(

            "admin:overviewUpdated",

            overview

        );

    }

    /* ======================================================
       STATISTICS
    ====================================================== */

    async loadStatistics(): Promise<void> {

        const response =
            await API.admin.statistics();

        const statistics =
            response.data as AdminStatistics;

        State.set(

            this.STATISTICS_KEY,

            statistics

        );

        Events.emit(

            "admin:statisticsUpdated",

            statistics

        );

    }

    /* ======================================================
       USERS
    ====================================================== */

    async loadUsers(): Promise<void> {

        const response =
            await API.admin.users();

        const users =
            response.data as AdminUser[];

        State.set(

            this.USERS_KEY,

            users

        );

        Events.emit(

            "admin:usersUpdated",

            users

        );

    }

    /* ======================================================
       REPORTS
    ====================================================== */

    async loadReports(): Promise<void> {

        const response =
            await API.admin.reports();

        const reports =
            response.data as AdminReport[];

        State.set(

            this.REPORTS_KEY,

            reports

        );

        Events.emit(

            "admin:reportsUpdated",

            reports

        );

    }

    /* ======================================================
       TASKS
    ====================================================== */

    async loadTasks(): Promise<void> {

        const response =
            await API.admin.tasks();

        const tasks =
            response.data as AdminTask[];

        State.set(

            this.TASKS_KEY,

            tasks

        );

        Events.emit(

            "admin:tasksUpdated",

            tasks

        );

    }

    /* ======================================================
       ANNOUNCEMENTS
    ====================================================== */

    async loadAnnouncements(): Promise<void> {

        const response =
            await API.admin.announcements();

        const announcements =
            response.data as AdminAnnouncement[];

        State.set(

            this.ANNOUNCEMENTS_KEY,

            announcements

        );

        Events.emit(

            "admin:announcementsUpdated",

            announcements

        );

    }

    /* ======================================================
       USER MODERATION
    ====================================================== */

    async suspendUser(
        userId: string
    ): Promise<void> {

        await API.admin.suspendUser(
            userId
        );

        await this.loadUsers();

    }

    async restoreUser(
        userId: string
    ): Promise<void> {

        await API.admin.restoreUser(
            userId
        );

        await this.loadUsers();

    }

    /* ======================================================
       VERIFICATION MANAGEMENT
    ====================================================== */

    async approveVerification(
        verificationId: string
    ): Promise<void> {

        await API.admin.approveVerification(
            verificationId
        );

    }

    async rejectVerification(
        verificationId: string
    ): Promise<void> {

        await API.admin.rejectVerification(
            verificationId
        );

    }

    /* ======================================================
       WALLET OVERSIGHT
    ====================================================== */

    async loadWalletOverview(): Promise<void> {

        const response =
            await API.admin.walletOverview();

        State.set(

            "admin.wallet",

            response.data

        );

        Events.emit(

            "admin:walletUpdated",

            response.data

        );

    }

    /* ======================================================
       ESCROW OVERSIGHT
    ====================================================== */

    async loadEscrowOverview(): Promise<void> {

        const response =
            await API.admin.escrowOverview();

        State.set(

            "admin.escrow",

            response.data

        );

        Events.emit(

            "admin:escrowUpdated",

            response.data

        );

    }

    /* ======================================================
       LEARNING MANAGEMENT
    ====================================================== */

    async loadLearningOverview(): Promise<void> {

        const response =
            await API.admin.learningOverview();

        State.set(

            "admin.learning",

            response.data

        );

        Events.emit(

            "admin:learningUpdated",

            response.data

        );

    }

    /* ======================================================
       BUSINESS MANAGEMENT
    ====================================================== */

    async loadBusinessOverview(): Promise<void> {

        const response =
            await API.admin.businessOverview();

        State.set(

            "admin.business",

            response.data

        );

        Events.emit(

            "admin:businessUpdated",

            response.data

        );

    }

    /* ======================================================
       CREATOR MANAGEMENT
    ====================================================== */

    async loadCreatorOverview(): Promise<void> {

        const response =
            await API.admin.creatorOverview();

        State.set(

            "admin.creator",

            response.data

        );

        Events.emit(

            "admin:creatorUpdated",

            response.data

        );

    }

    /* ======================================================
       ADVERTISING MANAGEMENT
    ====================================================== */

    async loadAdvertisingOverview(): Promise<void> {

        const response =
            await API.admin.advertisingOverview();

        State.set(

            "admin.advertising",

            response.data

        );

        Events.emit(

            "admin:advertisingUpdated",

            response.data

        );

    }

    /* ======================================================
       PLATFORM HEALTH
    ====================================================== */

    async loadPlatformHealth(): Promise<void> {

        const response =
            await API.admin.platformHealth();

        State.set(

            "admin.platformHealth",

            response.data

        );

        Events.emit(

            "admin:platformHealthUpdated",

            response.data

        );

    }/* ======================================================
   HELPERS
====================================================== */

    getOverview(): AdminOverview | null {

        return (

            State.get(

                this.OVERVIEW_KEY

            ) || null

        );

    }

    getStatistics(): AdminStatistics | null {

        return (

            State.get(

                this.STATISTICS_KEY

            ) || null

        );

    }

    getUsers(): AdminUser[] {

        return (

            State.get(

                this.USERS_KEY

            ) || []

        );

    }

    getReports(): AdminReport[] {

        return (

            State.get(

                this.REPORTS_KEY

            ) || []

        );

    }

    getTasks(): AdminTask[] {

        return (

            State.get(

                this.TASKS_KEY

            ) || []

        );

    }

    getAnnouncements(): AdminAnnouncement[] {

        return (

            State.get(

                this.ANNOUNCEMENTS_KEY

            ) || []

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restore(): void {

        const cached = Cache.get(

            this.CACHE_KEY

        );

        if (!cached) {

            return;

        }

        State.set(

            this.OVERVIEW_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.OVERVIEW_KEY

        );

        State.remove(

            this.STATISTICS_KEY

        );

        State.remove(

            this.USERS_KEY

        );

        State.remove(

            this.REPORTS_KEY

        );

        State.remove(

            this.TASKS_KEY

        );

        State.remove(

            this.ANNOUNCEMENTS_KEY

        );

        State.remove(

            "admin.wallet"

        );

        State.remove(

            "admin.escrow"

        );

        State.remove(

            "admin.learning"

        );

        State.remove(

            "admin.business"

        );

        State.remove(

            "admin.creator"

        );

        State.remove(

            "admin.advertising"

        );

        State.remove(

            "admin.platformHealth"

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "admin:cleared"

        );

    }

}

export default new AdminModule();



