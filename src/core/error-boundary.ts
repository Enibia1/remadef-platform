/* ==========================================================
   REMADEF PLATFORM
   Global Error Boundary
   File: src/core/error-boundary.ts
========================================================== */

import EventBus from "./events";

export interface ErrorPayload {

    message: string;

    stack?: string;

    source?: string;

    timestamp: number;

}

class ErrorBoundary {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    init(): void {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        window.addEventListener(
            "error",
            this.handleError
        );

        window.addEventListener(
            "unhandledrejection",
            this.handlePromiseError
        );

        console.info(
            "[ErrorBoundary] Initialized."
        );

    }

    /* ======================================================
       WINDOW ERROR
    ====================================================== */

    private handleError = (
        event: ErrorEvent
    ): void => {

        const payload: ErrorPayload = {

            message:
                event.message,

            stack:
                event.error?.stack,

            source:
                event.filename,

            timestamp:
                Date.now()

        };

        this.report(payload);

    };

    /* ======================================================
       PROMISE ERROR
    ====================================================== */

    private handlePromiseError = (
        event: PromiseRejectionEvent
    ): void => {

        const reason =
            event.reason;

        const payload: ErrorPayload = {

            message:
                reason?.message ||
                "Unhandled Promise Rejection",

            stack:
                reason?.stack,

            timestamp:
                Date.now()

        };

        this.report(payload);

    };

    /* ======================================================
       REPORT
    ====================================================== */

    report(
        error: ErrorPayload
    ): void {

        console.error(
            "[Application Error]",
            error
        );

        EventBus.emit(
            "app:error",
            error
        );

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        window.removeEventListener(
            "error",
            this.handleError
        );

        window.removeEventListener(
            "unhandledrejection",
            this.handlePromiseError
        );

        this.initialized = false;

    }

}

export default new ErrorBoundary();
