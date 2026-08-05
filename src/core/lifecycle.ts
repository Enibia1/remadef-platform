/* ==========================================================
   REMADEF PLATFORM
   Application Lifecycle
   File: src/core/lifecycle.ts
========================================================== */

import EventBus from "./events";
import Container from "./container";

class Lifecycle {

    private started = false;

    private startCallbacks: Array<() => Promise<void> | void> = [];

    private shutdownCallbacks: Array<() => Promise<void> | void> = [];

    /* ======================================================
       START
    ====================================================== */

    async start(): Promise<void> {

        if (this.started) {
            return;
        }

        EventBus.emit("app:starting");

        for (const callback of this.startCallbacks) {
            await callback();
        }

        this.started = true;

        EventBus.emit("app:started");

        console.info(
            "[Lifecycle] Application started."
        );

    }

    /* ======================================================
       SHUTDOWN
    ====================================================== */

    async shutdown(): Promise<void> {

        EventBus.emit("app:shutdown");

        for (const callback of this.shutdownCallbacks) {
            await callback();
        }

        Container.clear();

        this.started = false;

        EventBus.emit("app:shutdown:complete");

        console.info(
            "[Lifecycle] Application shutdown complete."
        );

    }

    /* ======================================================
       REGISTER START CALLBACK
    ====================================================== */

    onStart(
        callback: () => Promise<void> | void
    ): void {

        this.startCallbacks.push(callback);

    }

    /* ======================================================
       REGISTER SHUTDOWN CALLBACK
    ====================================================== */

    onShutdown(
        callback: () => Promise<void> | void
    ): void {

        this.shutdownCallbacks.push(callback);

    }

    /* ======================================================
       STATUS
    ====================================================== */

    isStarted(): boolean {

        return this.started;

    }

}

export default new Lifecycle();
