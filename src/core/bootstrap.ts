/* ==========================================================
   REMADEF PLATFORM
   Application Bootstrap
   File: src/core/bootstrap.ts
========================================================== */

import Browser from "./browser";
import Cache from "./cache";
import FeatureFlags from "./feature-flags";
import Router from "./router";
import Session from "./session";
import EventBus from "./events";
import { setState } from "./state";

import CONFIG from "../config/config";
import MODULES from "../config/modules";

/* ==========================================================
   BOOTSTRAP
========================================================== */

class Bootstrap {

    private initialized = false;

    /* ==========================================================
       START APPLICATION
    ========================================================== */

    async start(): Promise<void> {

        if (this.initialized) {
            return;
        }

        try {

            console.info(
                `%c${CONFIG.APP_NAME} v${CONFIG.VERSION}`,
                "color:#2563EB;font-weight:bold;"
            );

            /* ==========================================
               CORE
            ========================================== */

            Browser.init();

            FeatureFlags.init();

            await Session.init();

            this.registerGlobalEvents();

            /* ==========================================
               LOAD MODULES
            ========================================== */

            await this.loadModules();

            /* ==========================================
               START ROUTER
            ========================================== */

            Router.init();

            /* ==========================================
               READY
            ========================================== */

            this.initialized = true;

            EventBus.emit("app:ready");

            console.info("REMADEF Platform Ready");

        } catch (error) {

            console.error(error);

            EventBus.emit("app:error", error);

        }

    }

    /* ==========================================================
       LOAD MODULES
    ========================================================== */

    private async loadModules(): Promise<void> {

        for (const module of MODULES) {

            if (module.enabled === false) {
                continue;
            }

            try {

                if (module.loader) {

                    await module.loader();

                }

            } catch (error) {

                console.error(
                    `Failed loading module: ${module.name}`,
                    error
                );

            }

        }

    }

    /* ==========================================================
       GLOBAL EVENTS
    ========================================================== */

    private registerGlobalEvents(): void {

        EventBus.on("browser:online", () => {

            setState("network.online", true);

        });

        EventBus.on("browser:offline", () => {

            setState("network.online", false);

        });

        EventBus.on("session:logout", () => {

            Cache.clear();

        });

    }

}

export default new Bootstrap();
