/* ==========================================================
   REMADEF PLATFORM
   Module Registry
   File: src/modules/registry.ts
========================================================== */

import type {
    PlatformModule,
    RegisteredModule
} from "./types";

class ModuleRegistry {

    private modules =
        new Map<string, RegisteredModule>();

    register(
        module: PlatformModule
    ): void {

        this.modules.set(
            module.id,
            {
                module,
                initialized: false
            }
        );

    }

    unregister(
        id: string
    ): void {

        this.modules.delete(id);

    }

    get(
        id: string
    ): PlatformModule | undefined {

        return this.modules.get(id)?.module;

    }

    has(
        id: string
    ): boolean {

        return this.modules.has(id);

    }

    list(): PlatformModule[] {

        return Array.from(
            this.modules.values()
        ).map(
            item => item.module
        );

    }

    markInitialized(
        id: string
    ): void {

        const item =
            this.modules.get(id);

        if (item) {

            item.initialized = true;

        }

    }

    initializedModules(): PlatformModule[] {

        return Array.from(
            this.modules.values()
        )
            .filter(
                item => item.initialized
            )
            .map(
                item => item.module
            );

    }

}

export default new ModuleRegistry();
