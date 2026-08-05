/* ==========================================================
   REMADEF PLATFORM
   Bootstrap
   File: src/bootstrap.ts

   Initializes the entire platform.
========================================================== */

import Router from "./core/router";
import Session from "./core/session";
import Network from "./core/network";
import EventBus from "./core/events";
import Logger from "./utils/logger";

class Bootstrap {

    private initialized = false;

    public async initialize(): Promise<void> {

        if (this.initialized) {
            return;
        }

        Logger.info("Bootstrapping application...");

        /* ===========================================
           NETWORK
        =========================================== */

        Network.subscribe((online) => {

            EventBus.emit(
                online
                    ? "network:online"
                    : "network:offline"
            );

        });

        /* ===========================================
           SESSION RESTORE
        =========================================== */

        try {

            await Session.restore();

            Logger.info("Session restored.");

        } catch {

            Logger.warn("No previous session.");

        }

        /* ===========================================
           ROUTER
        =========================================== */

        Router.initialize();

        /* ===========================================
           GLOBAL ERROR HANDLER
        =========================================== */

        if (typeof window !== "undefined") {

            window.onerror = (
                message,
                source,
                line,
                column,
                error
            ) => {

                Logger.error(
                    "Unhandled Error",
                    {
                        message,
                        source,
                        line,
                        column,
                        error
                    }
                );

                EventBus.emit(
                    "app:exception",
                    error
                );

                return false;

            };

            window.onunhandledrejection = (
                event
            ) => {

                Logger.error(
                    "Unhandled Promise Rejection",
                    event.reason
                );

                EventBus.emit(
                    "app:promise_rejection",
                    event.reason
                );

            };

        }

        this.initialized = true;

        Logger.info("Bootstrap completed.");

    }

    public async shutdown(): Promise<void> {

        Logger.info("Application shutdown...");

        EventBus.emit("app:shutdown");

    }

}

export default new Bootstrap();
