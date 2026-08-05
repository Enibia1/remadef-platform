/* ==========================================================
   REMADEF PLATFORM
   Browser History Manager
   File: src/router/history.ts

   Responsibility:
   - Browser History API wrapper
   - Navigation state
   - Query parameters
   - Hash management
   - Back / Forward
   - URL helpers
========================================================== */

import EventBus from "../core/events";

export interface NavigationState {
    path: string;
    query: URLSearchParams;
    hash: string;
    state: unknown;
}

class HistoryManager {

    private listeners = new Set<(nav: NavigationState) => void>();

    constructor() {

        if (typeof window !== "undefined") {

            window.addEventListener(
                "popstate",
                this.handlePopState
            );

        }

    }

    /* ======================================================
       POPSTATE
    ====================================================== */

    private handlePopState = (
        event: PopStateEvent
    ): void => {

        const navigation = this.current();

        EventBus.emit(
            "history:popstate",
            navigation
        );

        this.notify(navigation);

    };

    /* ======================================================
       LISTENERS
    ====================================================== */

    subscribe(
        listener: (
            navigation: NavigationState
        ) => void
    ): () => void {

        this.listeners.add(listener);

        return () => {

            this.listeners.delete(listener);

        };

    }

    private notify(
        navigation: NavigationState
    ): void {

        this.listeners.forEach(listener => {

            listener(navigation);

        });

    }

    /* ======================================================
       PUSH
    ====================================================== */

    push(
        path: string,
        state: unknown = {}
    ): void {

        history.pushState(
            state,
            "",
            path
        );

        const navigation = this.current();

        EventBus.emit(
            "history:push",
            navigation
        );

        this.notify(navigation);

    }

    /* ======================================================
       REPLACE
    ====================================================== */

    replace(
        path: string,
        state: unknown = {}
    ): void {

        history.replaceState(
            state,
            "",
            path
        );

        const navigation = this.current();

        EventBus.emit(
            "history:replace",
            navigation
        );

        this.notify(navigation);

    }

    /* ======================================================
       BACK
    ====================================================== */

    back(): void {

        history.back();

    }

    /* ======================================================
       FORWARD
    ====================================================== */

    forward(): void {

        history.forward();

    }

    /* ======================================================
       GO
    ====================================================== */

    go(
        delta: number
    ): void {

        history.go(delta);

    }

    /* ======================================================
       CURRENT
    ====================================================== */

    current(): NavigationState {

        return {

            path: location.pathname,

            query: new URLSearchParams(
                location.search
            ),

            hash: location.hash,

            state: history.state

        };

    }

    /* ======================================================
       PATH
    ====================================================== */

    path(): string {

        return location.pathname;

    }

    /* ======================================================
       QUERY
    ====================================================== */

    query(): URLSearchParams {

        return new URLSearchParams(
            location.search
        );

    }

    queryParam(
        key: string
    ): string | null {

        return this.query().get(key);

    }

    hasQuery(
        key: string
    ): boolean {

        return this.query().has(key);

    }

    /* ======================================================
       HASH
    ====================================================== */

    hash(): string {

        return location.hash;

    }

    setHash(
        hash: string
    ): void {

        location.hash =
            hash.startsWith("#")
                ? hash
                : `#${hash}`;

    }

    /* ======================================================
       URL
    ====================================================== */

    url(): string {

        return location.href;

    }

    origin(): string {

        return location.origin;

    }

    /* ======================================================
       SCROLL
    ====================================================== */

    scrollTop(
        smooth = true
    ): void {

        window.scrollTo({

            top: 0,

            left: 0,

            behavior: smooth
                ? "smooth"
                : "auto"

        });

    }

    scroll(
        x: number,
        y: number,
        smooth = true
    ): void {

        window.scrollTo({

            left: x,

            top: y,

            behavior: smooth
                ? "smooth"
                : "auto"

        });

    }

    /* ======================================================
       RELOAD
    ====================================================== */

    reload(): void {

        location.reload();

    }

    /* ======================================================
       ASSIGN
    ====================================================== */

    assign(
        url: string
    ): void {

        location.assign(url);

    }

    /* ======================================================
       REPLACE URL
    ====================================================== */

    replaceUrl(
        url: string
    ): void {

        location.replace(url);

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        if (typeof window !== "undefined") {

            window.removeEventListener(
                "popstate",
                this.handlePopState
            );

        }

        this.listeners.clear();

    }

}

export const History =
    new HistoryManager();

export default History;
