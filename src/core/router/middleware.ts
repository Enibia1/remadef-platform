/* ==========================================================
   REMADEF PLATFORM
   Router Middleware
   File: src/router/middleware.ts

   Responsibility:
   - Global navigation middleware
   - beforeEach / afterEach hooks
   - Route lifecycle
   - Navigation logging
   - Analytics hooks
   - Loading hooks
========================================================== */

import EventBus from "../core/events";

export interface RouteContext {
    path: string;
    from?: string;
    params?: Record<string, string>;
    query?: URLSearchParams;
    meta?: Record<string, unknown>;
}

export interface MiddlewareContext {
    to: RouteContext;
    from?: RouteContext;
}

export type Middleware =
    (
        context: MiddlewareContext
    ) => Promise<boolean | void> | boolean | void;

class RouterMiddleware {

    private before: Middleware[] = [];

    private after: Middleware[] = [];

    /* ======================================================
       REGISTER BEFORE
    ====================================================== */

    beforeEach(
        middleware: Middleware
    ): void {

        this.before.push(middleware);

    }

    /* ======================================================
       REGISTER AFTER
    ====================================================== */

    afterEach(
        middleware: Middleware
    ): void {

        this.after.push(middleware);

    }

    /* ======================================================
       EXECUTE BEFORE
    ====================================================== */

    async runBefore(
        context: MiddlewareContext
    ): Promise<boolean> {

        EventBus.emit(
            "router:before",
            context
        );

        for (const middleware of this.before) {

            const result =
                await middleware(context);

            if (result === false) {

                EventBus.emit(
                    "router:cancelled",
                    context
                );

                return false;

            }

        }

        return true;

    }

    /* ======================================================
       EXECUTE AFTER
    ====================================================== */

    async runAfter(
        context: MiddlewareContext
    ): Promise<void> {

        for (const middleware of this.after) {

            await middleware(context);

        }

        EventBus.emit(
            "router:after",
            context
        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        this.before = [];
        this.after = [];

    }

    /* ======================================================
       DEFAULT MIDDLEWARE
    ====================================================== */

    registerDefaults(): void {

        /* ----------------------------------------------
           Loading
        ---------------------------------------------- */

        this.beforeEach(async ({ to }) => {

            EventBus.emit(
                "loading:start",
                to
            );

        });

        this.afterEach(async ({ to }) => {

            EventBus.emit(
                "loading:stop",
                to
            );

        });

        /* ----------------------------------------------
           Logging
        ---------------------------------------------- */

        this.beforeEach(({ to, from }) => {

            console.info(
                `[Router] ${from?.path ?? "START"} → ${to.path}`
            );

        });

        /* ----------------------------------------------
           Analytics
        ---------------------------------------------- */

        this.afterEach(({ to }) => {

            EventBus.emit(
                "analytics:pageview",
                {
                    page: to.path
                }
            );

        });

        /* ----------------------------------------------
           Scroll Restoration
        ---------------------------------------------- */

        this.afterEach(() => {

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto"
            });

        });

    }

}

export const Middleware =
    new RouterMiddleware();

Middleware.registerDefaults();

export default Middleware;
