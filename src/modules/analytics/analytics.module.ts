/* ==========================================================
   REMADEF PLATFORM
   Analytics Module
   File: src/modules/analytics/analytics.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    AnalyticsOverview,
    AnalyticsSummary,
    AnalyticsMetric,
    AnalyticsChart,
    AnalyticsReport,
    AnalyticsInsight

} from "../../types/analytics";

class AnalyticsModule {

    private readonly OVERVIEW_KEY =
        "analytics.overview";

    private readonly SUMMARY_KEY =
        "analytics.summary";

    private readonly METRICS_KEY =
        "analytics.metrics";

    private readonly CHARTS_KEY =
        "analytics.charts";

    private readonly REPORTS_KEY =
        "analytics.reports";

    private readonly INSIGHTS_KEY =
        "analytics.insights";

    private readonly CACHE_KEY =
        "analytics-cache";

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

            "analytics:refresh",

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

                this.loadSummary(),

                this.loadMetrics(),

                this.loadCharts(),

                this.loadReports(),

                this.loadInsights()

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
            await API.analytics.overview();

        const overview =
            response.data as AnalyticsOverview;

        State.set(

            this.OVERVIEW_KEY,

            overview

        );

        Cache.set(

            this.CACHE_KEY,

            overview

        );

        Events.emit(

            "analytics:overviewUpdated",

            overview

        );

    }

    /* ======================================================
       SUMMARY
    ====================================================== */

    async loadSummary(): Promise<void> {

        const response =
            await API.analytics.summary();

        const summary =
            response.data as AnalyticsSummary;

        State.set(

            this.SUMMARY_KEY,

            summary

        );

        Events.emit(

            "analytics:summaryUpdated",

            summary

        );

    }

    /* ======================================================
       METRICS
    ====================================================== */

    async loadMetrics(): Promise<void> {

        const response =
            await API.analytics.metrics();

        const metrics =
            response.data as AnalyticsMetric[];

        State.set(

            this.METRICS_KEY,

            metrics

        );

        Events.emit(

            "analytics:metricsUpdated",

            metrics

        );

    }

    /* ======================================================
       CHARTS
    ====================================================== */

    async loadCharts(): Promise<void> {

        const response =
            await API.analytics.charts();

        const charts =
            response.data as AnalyticsChart[];

        State.set(

            this.CHARTS_KEY,

            charts

        );

        Events.emit(

            "analytics:chartsUpdated",

            charts

        );

    }

    /* ======================================================
       REPORTS
    ====================================================== */

    async loadReports(): Promise<void> {

        const response =
            await API.analytics.reports();

        const reports =
            response.data as AnalyticsReport[];

        State.set(

            this.REPORTS_KEY,

            reports

        );

        Events.emit(

            "analytics:reportsUpdated",

            reports

        );

    }

    /* ======================================================
       INSIGHTS
    ====================================================== */

    async loadInsights(): Promise<void> {

        const response =
            await API.analytics.insights();

        const insights =
            response.data as AnalyticsInsight[];

        State.set(

            this.INSIGHTS_KEY,

            insights

        );

        Events.emit(

            "analytics:insightsUpdated",

            insights

        );

    }

    /* ======================================================
       TIME RANGE
    ====================================================== */

    async setTimeRange(
        range: string
    ): Promise<void> {

        await API.analytics.timeRange(
            range
        );

        await this.refresh();

    }

    /* ======================================================
       EXPORT
    ====================================================== */

    async exportReport(
        format: "pdf" | "csv" | "xlsx"
    ): Promise<void> {

        await API.analytics.export(
            format
        );

    }

    /* ======================================================
       PERFORMANCE COMPARISON
    ====================================================== */

    async comparePerformance(
        firstPeriod: string,
        secondPeriod: string
    ): Promise<void> {

        const response =
            await API.analytics.compare(

                firstPeriod,

                secondPeriod

            );

        State.set(

            "analytics.comparison",

            response.data

        );

        Events.emit(

            "analytics:comparisonUpdated",

            response.data

        );

    }

    /* ======================================================
       REVENUE ANALYTICS
    ====================================================== */

    async loadRevenueAnalytics(): Promise<void> {

        const response =
            await API.analytics.revenue();

        State.set(

            "analytics.revenue",

            response.data

        );

        Events.emit(

            "analytics:revenueUpdated",

            response.data

        );

    }

    /* ======================================================
       USER GROWTH
    ====================================================== */

    async loadUserGrowth(): Promise<void> {

        const response =
            await API.analytics.userGrowth();

        State.set(

            "analytics.userGrowth",

            response.data

        );

        Events.emit(

            "analytics:userGrowthUpdated",

            response.data

        );

    }

    /* ======================================================
       ENGAGEMENT ANALYTICS
    ====================================================== */

    async loadEngagement(): Promise<void> {

        const response =
            await API.analytics.engagement();

        State.set(

            "analytics.engagement",

            response.data

        );

        Events.emit(

            "analytics:engagementUpdated",

            response.data

        );

    }

    /* ======================================================
       LEARNING ANALYTICS
    ====================================================== */

    async loadLearningAnalytics(): Promise<void> {

        const response =
            await API.analytics.learning();

        State.set(

            "analytics.learning",

            response.data

        );

        Events.emit(

            "analytics:learningUpdated",

            response.data

        );

    }

    /* ======================================================
       BUSINESS ANALYTICS
    ====================================================== */

    async loadBusinessAnalytics(): Promise<void> {

        const response =
            await API.analytics.business();

        State.set(

            "analytics.business",

            response.data

        );

        Events.emit(

            "analytics:businessUpdated",

            response.data

        );

    }

    /* ======================================================
       CREATOR ANALYTICS
    ====================================================== */

    async loadCreatorAnalytics(): Promise<void> {

        const response =
            await API.analytics.creator();

        State.set(

            "analytics.creator",

            response.data

        );

        Events.emit(

            "analytics:creatorUpdated",

            response.data

        );

    }     /* ======================================================
       HELPERS
    ====================================================== */

    getOverview(): AnalyticsOverview | null {

        return (

            State.get(

                this.OVERVIEW_KEY

            ) || null

        );

    }

    getSummary(): AnalyticsSummary | null {

        return (

            State.get(

                this.SUMMARY_KEY

            ) || null

        );

    }

    getMetrics(): AnalyticsMetric[] {

        return (

            State.get(

                this.METRICS_KEY

            ) || []

        );

    }

    getCharts(): AnalyticsChart[] {

        return (

            State.get(

                this.CHARTS_KEY

            ) || []

        );

    }

    getReports(): AnalyticsReport[] {

        return (

            State.get(

                this.REPORTS_KEY

            ) || []

        );

    }

    getInsights(): AnalyticsInsight[] {

        return (

            State.get(

                this.INSIGHTS_KEY

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

            this.SUMMARY_KEY

        );

        State.remove(

            this.METRICS_KEY

        );

        State.remove(

            this.CHARTS_KEY

        );

        State.remove(

            this.REPORTS_KEY

        );

        State.remove(

            this.INSIGHTS_KEY

        );

        State.remove(

            "analytics.comparison"

        );

        State.remove(

            "analytics.revenue"

        );

        State.remove(

            "analytics.userGrowth"

        );

        State.remove(

            "analytics.engagement"

        );

        State.remove(

            "analytics.learning"

        );

        State.remove(

            "analytics.business"

        );

        State.remove(

            "analytics.creator"

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "analytics:cleared"

        );

    }

}

export default new AnalyticsModule();
