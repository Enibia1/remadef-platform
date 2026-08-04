/* ==========================================================
   REMADEF PLATFORM
   Dashboard Module
   File: src/modules/dashboard/dashboard.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    DashboardOverview,
    DashboardStatistics,
    DashboardActivity,
    DashboardNotification,
    DashboardQuickAction,
    DashboardWidget

} from "../../types/dashboard";

class DashboardModule {

    private readonly OVERVIEW_KEY =
        "dashboard.overview";

    private readonly STATISTICS_KEY =
        "dashboard.statistics";

    private readonly ACTIVITIES_KEY =
        "dashboard.activities";

    private readonly NOTIFICATIONS_KEY =
        "dashboard.notifications";

    private readonly QUICK_ACTIONS_KEY =
        "dashboard.quickActions";

    private readonly WIDGETS_KEY =
        "dashboard.widgets";

    private readonly CACHE_KEY =
        "dashboard-cache";

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

            "dashboard:refresh",

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

                this.loadActivities(),

                this.loadNotifications(),

                this.loadQuickActions(),

                this.loadWidgets()

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
            await API.dashboard.overview();

        const overview =
            response.data as DashboardOverview;

        State.set(

            this.OVERVIEW_KEY,

            overview

        );

        Cache.set(

            this.CACHE_KEY,

            overview

        );

        Events.emit(

            "dashboard:overviewUpdated",

            overview

        );

    }

    /* ======================================================
       STATISTICS
    ====================================================== */

    async loadStatistics(): Promise<void> {

        const response =
            await API.dashboard.statistics();

        const statistics =
            response.data as DashboardStatistics;

        State.set(

            this.STATISTICS_KEY,

            statistics

        );

        Events.emit(

            "dashboard:statisticsUpdated",

            statistics

        );

    }

    /* ======================================================
       ACTIVITIES
    ====================================================== */

    async loadActivities(): Promise<void> {

        const response =
            await API.dashboard.activities();

        const activities =
            response.data as DashboardActivity[];

        State.set(

            this.ACTIVITIES_KEY,

            activities

        );

        Events.emit(

            "dashboard:activitiesUpdated",

            activities

        );

    }

    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    async loadNotifications(): Promise<void> {

        const response =
            await API.dashboard.notifications();

        const notifications =
            response.data as DashboardNotification[];

        State.set(

            this.NOTIFICATIONS_KEY,

            notifications

        );

        Events.emit(

            "dashboard:notificationsUpdated",

            notifications

        );

    }

    /* ======================================================
       QUICK ACTIONS
    ====================================================== */

    async loadQuickActions(): Promise<void> {

        const response =
            await API.dashboard.quickActions();

        const actions =
            response.data as DashboardQuickAction[];

        State.set(

            this.QUICK_ACTIONS_KEY,

            actions

        );

        Events.emit(

            "dashboard:quickActionsUpdated",

            actions

        );

    }

    /* ======================================================
       WIDGETS
    ====================================================== */

    async loadWidgets(): Promise<void> {

        const response =
            await API.dashboard.widgets();

        const widgets =
            response.data as DashboardWidget[];

        State.set(

            this.WIDGETS_KEY,

            widgets

        );

        Events.emit(

            "dashboard:widgetsUpdated",

            widgets

        );

    }

    /* ======================================================
       RECOMMENDATIONS
    ====================================================== */

    async loadRecommendations(): Promise<void> {

        const response =
            await API.dashboard.recommendations();

        State.set(

            "dashboard.recommendations",

            response.data ?? []

        );

        Events.emit(

            "dashboard:recommendationsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       RECENT MESSAGES
    ====================================================== */

    async loadRecentMessages(): Promise<void> {

        const response =
            await API.dashboard.recentMessages();

        State.set(

            "dashboard.recentMessages",

            response.data ?? []

        );

        Events.emit(

            "dashboard:recentMessagesUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       WALLET SUMMARY
    ====================================================== */

    async loadWalletSummary(): Promise<void> {

        const response =
            await API.dashboard.walletSummary();

        State.set(

            "dashboard.walletSummary",

            response.data

        );

        Events.emit(

            "dashboard:walletSummaryUpdated",

            response.data

        );

    }

    /* ======================================================
       LEARNING SUMMARY
    ====================================================== */

    async loadLearningSummary(): Promise<void> {

        const response =
            await API.dashboard.learningSummary();

        State.set(

            "dashboard.learningSummary",

            response.data

        );

        Events.emit(

            "dashboard:learningSummaryUpdated",

            response.data

        );

    }

    /* ======================================================
       JOBS SUMMARY
    ====================================================== */

    async loadJobsSummary(): Promise<void> {

        const response =
            await API.dashboard.jobsSummary();

        State.set(

            "dashboard.jobsSummary",

            response.data

        );

        Events.emit(

            "dashboard:jobsSummaryUpdated",

            response.data

        );

    }

    /* ======================================================
       BUSINESS SUMMARY
    ====================================================== */

    async loadBusinessSummary(): Promise<void> {

        const response =
            await API.dashboard.businessSummary();

        State.set(

            "dashboard.businessSummary",

            response.data

        );

        Events.emit(

            "dashboard:businessSummaryUpdated",

            response.data

        );

    }

    /* ======================================================
       CREATOR SUMMARY
    ====================================================== */

    async loadCreatorSummary(): Promise<void> {

        const response =
            await API.dashboard.creatorSummary();

        State.set(

            "dashboard.creatorSummary",

            response.data

        );

        Events.emit(

            "dashboard:creatorSummaryUpdated",

            response.data

        );

    }

    /* ======================================================
       VERIFICATION SUMMARY
    ====================================================== */

    async loadVerificationSummary(): Promise<void> {

        const response =
            await API.dashboard.verificationSummary();

        State.set(

            "dashboard.verificationSummary",

            response.data

        );

        Events.emit(

            "dashboard:verificationSummaryUpdated",

            response.data

        );

    }

    /* ======================================================
       ANALYTICS SNAPSHOT
    ====================================================== */

    async loadAnalyticsSnapshot(): Promise<void> {

        const response =
            await API.dashboard.analyticsSnapshot();

        State.set(

            "dashboard.analyticsSnapshot",

            response.data

        );

        Events.emit(

            "dashboard:analyticsSnapshotUpdated",

            response.data

        );

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getOverview(): DashboardOverview | null {

        return (

            State.get(

                this.OVERVIEW_KEY

            ) || null

        );

    }

    getStatistics(): DashboardStatistics | null {

        return (

            State.get(

                this.STATISTICS_KEY

            ) || null

        );

    }

    getActivities(): DashboardActivity[] {

        return (

            State.get(

                this.ACTIVITIES_KEY

            ) || []

        );

    }

    getNotifications(): DashboardNotification[] {

        return (

            State.get(

                this.NOTIFICATIONS_KEY

            ) || []

        );

    }

    getQuickActions(): DashboardQuickAction[] {

        return (

            State.get(

                this.QUICK_ACTIONS_KEY

            ) || []

        );

    }

    getWidgets(): DashboardWidget[] {

        return (

            State.get(

                this.WIDGETS_KEY

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

            this.ACTIVITIES_KEY

        );

        State.remove(

            this.NOTIFICATIONS_KEY

        );

        State.remove(

            this.QUICK_ACTIONS_KEY

        );

        State.remove(

            this.WIDGETS_KEY

        );

        State.remove(

            "dashboard.recommendations"

        );

        State.remove(

            "dashboard.recentMessages"

        );

        State.remove(

            "dashboard.walletSummary"

        );

        State.remove(

            "dashboard.learningSummary"

        );

        State.remove(

            "dashboard.jobsSummary"

        );

        State.remove(

            "dashboard.businessSummary"

        );

        State.remove(

            "dashboard.creatorSummary"

        );

        State.remove(

            "dashboard.verificationSummary"

        );

        State.remove(

            "dashboard.analyticsSnapshot"

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "dashboard:cleared"

        );

    }

}

export default new DashboardModule();
