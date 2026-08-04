/* ==========================================================
   REMADEF PLATFORM
   Application
   File: src/app.ts
========================================================== */

import Bootstrap from "./bootstrap";
import EventBus from "./core/events";
import Logger from "./utils/logger";

class Application {
    private initialized = false;
    private shuttingDown = false;

    public async start(): Promise<void> {
        if (this.initialized) {
            Logger.warn("Application already started.");
            return;
        }

        Logger.info("Starting REMADEF Platform...");

        EventBus.emit("app:starting");

        try {
            await Bootstrap.initialize();

            this.initialized = true;

            EventBus.emit("app:started");

            Logger.info("Application started successfully.");
        } catch (error) {
            Logger.error("Application failed to start.", error);

            EventBus.emit("app:error", error);

            throw error;
        }
    }

    public async shutdown(): Promise<void> {
        if (this.shuttingDown) {
            return;
        }

        this.shuttingDown = true;

        Logger.info("Shutting down application...");

        EventBus.emit("app:shutdown");

        try {
            await Bootstrap.shutdown();

            this.initialized = false;

            Logger.info("Application shutdown complete.");
        } catch (error) {
            Logger.error("Shutdown failed.", error);
        }
    }

    public isRunning(): boolean {
        return this.initialized;
    }
}

export default new Application();
