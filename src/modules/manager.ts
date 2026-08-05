/* ==========================================================
   REMADEF PLATFORM
   Module Manager
   File: src/modules/manager.ts
========================================================== */

import Registry from "./registry";

import type {
    ModuleContext,
    PlatformModule
} from "./types";

class ModuleManager {

    private context?: ModuleContext;

    /* ======================================================
       INITIALIZE ALL MODULES
    ====================================================== */

    async initialize(
        context: ModuleContext
    ): Promise<void> {

        this.context = context;

        const modules =
            Registry
                .list()
                .sort(
                    (a, b) =>
                        (a.priority ?? 100) -
                        (b.priority ?? 100)
                );

        for (const module of modules) {

            if (module.enabled === false) {
                continue;
            }

            try {

                await module.initialize(
                    context
                );

                Registry.markInitialized(
                    module.id
                );

                console.info(
                    `[Module] ${module.name} initialized`
                );

            } catch (error) {

                console.error(
                    `[Module] Failed to initialize ${module.name}`,
                    error
                );

            }

        }

    }

    /* ======================================================
       DESTROY ALL MODULES
    ====================================================== */

    async destroy(): Promise<void> {

        const modules =
            Registry
                .initializedModules()
                .reverse();

        for (const module of modules) {

            if (!module.destroy) {
                continue;
            }

            try {

                await module.destroy();

                console.info(
                    `[Module] ${module.name} destroyed`
                );

            } catch (error) {

                console.error(
                    `[Module] Failed to destroy ${module.name}`,
                    error
                );

            }

        }

    }

    /* ======================================================
       GET CONTEXT
    ====================================================== */

    getContext(): ModuleContext | undefined {

        return this.context;

    }

    /* ======================================================
       GET MODULE
    ====================================================== */

    getModule(
        id: string
    ): PlatformModule | undefined {

        return Registry.get(id);

    }

}

export default new ModuleManager();
