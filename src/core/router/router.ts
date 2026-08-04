/* ==========================================================
   REMADEF PLATFORM
   Core Router
   File: src/core/router.ts
========================================================== */

import ROUTES from "../config/routes";
import { EVENTS } from "../config/constants";
import { getState, setState } from "./state";
import EventBus from "./events";

export interface RouteContext {
    path: string;
    params: Record<string, string>;
    query: URLSearchParams;
}

export interface RouteDefinition {
    path: string;
    protected?: boolean;
    roles?: string[];
    loader: (context: RouteContext) => Promise<void>;
}

class Router {

    private routes = new Map<string, RouteDefinition>();

    /* ==========================================================
       REGISTER ROUTE
    ========================================================== */

    register(route: RouteDefinition): void {
        this.routes.set(route.path, route);
    }

    /* ==========================================================
       INITIALIZE
    ========================================================== */

    init(): void {

        window.addEventListener("popstate", () => {
            this.resolve(location.pathname);
        });

        document.addEventListener("click", (event) => {

            const target = event.target as HTMLElement;

            const link = target.closest("[data-route]") as HTMLElement | null;

            if (!link) return;

            event.preventDefault();

            const path = link.dataset.route;

            if (path) {
                this.navigate(path);
            }

        });

        this.resolve(location.pathname);

    }

    /* ==========================================================
       NAVIGATE
    ========================================================== */

    async navigate(path: string): Promise<void> {

        history.pushState({}, "", path);

        await this.resolve(path);

    }

    /* ==========================================================
       RESOLVE ROUTE
    ========================================================== */

    async resolve(path: string): Promise<void> {

        const route = this.routes.get(path);

        if (!route) {

            await this.notFound();

            return;

        }

        const context: RouteContext = {
            path,
            params: {},
            query: new URLSearchParams(location.search)
        };

        setState("router.current", path);

        EventBus.emit(EVENTS.ROUTE_CHANGE, context);

        await route.loader(context);

    }

    /* ==========================================================
       404
    ========================================================== */

    private async notFound(): Promise<void> {

        console.warn("Route not found.");

        EventBus.emit(EVENTS.ROUTE_NOT_FOUND);

    }

}

export default new Router();
