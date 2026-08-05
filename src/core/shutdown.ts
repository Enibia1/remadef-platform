/* ==========================================================
   REMADEF PLATFORM
   Graceful Shutdown Manager
   File: src/core/shutdown.ts
========================================================== */

import EventBus from "./events";
import Logger from "../utils/logger";

export type ShutdownCallback = () => void | Promise<void>;

class ShutdownManager {

    private callbacks: ShutdownCallback[] = [];
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
            "beforeunload",
            this.shutdown
        );

        window.addEventListener(
            "pagehide",
            this.shutdown
        );

        Logger.info("[Shutdown] Initialized.");

    }

    /* ======================================================
       REGISTER CALLBACK
    ====================================================== */

    register(
        callback: ShutdownCallback
    ): void {

        this.callbacks.push(callback);

    }

    /* ======================================================
       SHUTDOWN
    ====================================================== */

    private shutdown = async (): Promise<void> => {

        Logger.info("[Shutdown] Starting cleanup...");

        EventBus.emit("app:shutdown:start");

        for (const callback of this.callbacks) {

            try {

                await callback();

            } catch (error) {

                Logger.error(
                    "[Shutdown] Cleanup failed.",
                    error
                );

            }

        }

        EventBus.emit("app:shutdown:complete");

        Logger.info("[Shutdown] Complete.");

    };

}

export default new ShutdownManager();
