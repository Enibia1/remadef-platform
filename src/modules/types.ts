/* ==========================================================
   REMADEF PLATFORM
   Module Types
   File: src/modules/types.ts
========================================================== */

export interface ModuleContext {

    app: unknown;

    router: unknown;

    services: unknown;

}

export interface PlatformModule {

    id: string;

    name: string;

    version: string;

    description?: string;

    enabled?: boolean;

    priority?: number;

    initialize(
        context: ModuleContext
    ): Promise<void>;

    destroy?(): Promise<void>;

}

export interface RegisteredModule {

    module: PlatformModule;

    initialized: boolean;

}
