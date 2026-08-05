/* ==========================================================
   REMADEF PLATFORM
   Dependency Injection Container
   File: src/core/container.ts
========================================================== */

class Container {

    private services =
        new Map<string, unknown>();

    /* ======================================================
       REGISTER
    ====================================================== */

    register<T>(
        key: string,
        instance: T
    ): void {

        if (this.services.has(key)) {

            console.warn(
                `[Container] '${key}' already registered.`
            );

            return;

        }

        this.services.set(
            key,
            instance
        );

    }

    /* ======================================================
       REPLACE
    ====================================================== */

    replace<T>(
        key: string,
        instance: T
    ): void {

        this.services.set(
            key,
            instance
        );

    }

    /* ======================================================
       RESOLVE
    ====================================================== */

    resolve<T>(
        key: string
    ): T {

        const service =
            this.services.get(key);

        if (!service) {

            throw new Error(
                `Service '${key}' not found.`
            );

        }

        return service as T;

    }

    /* ======================================================
       EXISTS
    ====================================================== */

    has(
        key: string
    ): boolean {

        return this.services.has(key);

    }

    /* ======================================================
       REMOVE
    ====================================================== */

    remove(
        key: string
    ): void {

        this.services.delete(key);

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        this.services.clear();

    }

    /* ======================================================
       LIST
    ====================================================== */

    keys(): string[] {

        return Array.from(
            this.services.keys()
        );

    }

}

export default new Container();
