/* ==========================================================
   REMADEF PLATFORM
   Analytics Controller
   File: src/modules/analytics/analytics.controller.ts
========================================================== */

import AnalyticsModule from "./analytics.module";
import AnalyticsView from "./analytics-view";

class AnalyticsController {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.bindEvents();

        await AnalyticsModule.initialize();

        AnalyticsView.initialize();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private bindEvents(): void {

        /* ==================================================
           REFRESH
        ================================================== */

        document

            .querySelector(
                "[data-analytics-refresh]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await AnalyticsModule.refresh();

                }

            );

        /* ==================================================
           TIME RANGE
        ================================================== */

        document

            .querySelector(
                "[data-analytics-range]"
            )

            ?.addEventListener(

                "change",

                async event => {

                    const range = (

                        event.target as HTMLSelectElement

                    ).value;

                    await AnalyticsModule.setTimeRange(
                        range
                    );

                }

            );

        /* ==================================================
           EXPORT REPORT
        ================================================== */

        document

            .querySelector(
                "[data-export-report]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const format = (

                        document.querySelector(

                            "[data-export-format]"

                        ) as HTMLSelectElement

                    ).value as
                        "pdf" | "csv" | "xlsx";

                    await AnalyticsModule.exportReport(
                        format
                    );

                }

            );

        /* ==================================================
           COMPARE PERIODS
        ================================================== */

        document

            .querySelector(
                "[data-compare-periods]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const first = (

                        document.querySelector(

                            "[data-first-period]"

                        ) as HTMLInputElement

                    ).value;

                    const second = (

                        document.querySelector(

                            "[data-second-period]"

                        ) as HTMLInputElement

                    ).value;

                    await AnalyticsModule.comparePerformance(

                        first,

                        second

                    );

                }

            );

        /* ==================================================
           REPORT DETAILS
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const report =
                        target.closest(
                            "[data-report-id]"
                        );

                    if (!report) {

                        return;

                    }

                    const reportId =
                        report.getAttribute(
                            "data-report-id"
                        );

                    console.log(
                        "Report:",
                        reportId
                    );

                }

            );

        /* ==================================================
           INSIGHT DETAILS
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const insight =
                        target.closest(
                            "[data-insight-id]"
                        );

                    if (!insight) {

                        return;

                    }

                    const insightId =
                        insight.getAttribute(
                            "data-insight-id"
                        );

                    console.log(
                        "Insight:",
                        insightId
                    );

                }

            );

        /* ==================================================
           CHART INTERACTION
        ================================================== */

        document

            .addEventListener(

                "click",

                event => {

                    const target =
                        event.target as HTMLElement;

                    const chart =
                        target.closest(
                            "[data-chart-id]"
                        );

                    if (!chart) {

                        return;

                    }

                    const chartId =
                        chart.getAttribute(
                            "data-chart-id"
                        );

                    console.log(
                        "Chart:",
                        chartId
                    );

                }

            );

        /* ==================================================
           FILTER METRICS
        ================================================== */

        document

            .querySelector(
                "[data-analytics-filter]"
            )

            ?.addEventListener(

                "input",

                event => {

                    const value = (

                        event.target as HTMLInputElement

                    ).value;

                    console.log(
                        "Analytics filter:",
                        value
                    );

                }

            );

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        this.initialized = false;

    }

}

export default new AnalyticsController();
