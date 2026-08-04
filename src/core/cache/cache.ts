/* ==========================================================
   REMADEF PLATFORM
   Core Cache Manager
   File: src/core/cache.ts
========================================================== */

import Storage from "./storage";

export interface CacheEntry<T = any> {
    value: T;
    expires: number;
    created: number;
    hits: number;
}

class CacheManager {

    private cache = new Map<string, CacheEntry>();

    private pending = new Map<string, Promise<any>>();

    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 min

    /* ==========================================================
       SET
    ========================================================== */

    set<T>(
        key: string,
        value: T,
        ttl: number = this.DEFAULT_TTL,
        persist = false
    ): T {

        const entry: CacheEntry<T> = {
            value,
            created: Date.now(),
            expires: Date.now() + ttl,
            hits: 0
        };

        this.cache.set(key, entry);

        if (persist) {
            Storage.set(`cache:${key}`, entry, ttl);
        }

        return value;

    }

    /* ==========================================================
       GET
    ========================================================== */

    get<T = any>(key: string): T | null {

        let entry = this.cache.get(key);

        if (!entry) {

            entry = Storage.get<CacheEntry<T>>(`cache:${key}`) ?? undefined;

            if (entry) {
                this.cache.set(key, entry);
            }

        }

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expires) {

            this.delete(key);

            return null;

        }

        entry.hits++;

        return entry.value;

    }

    /* ==========================================================
       HAS
    ========================================================== */

    has(key: string): boolean {

        return this.get(key) !== null;

    }

    /* ==========================================================
       DELETE
    ========================================================== */

    delete(key: string): void {

        this.cache.delete(key);

        Storage.remove(`cache:${key}`);

    }

    /* ==========================================================
       CLEAR
    ========================================================== */

    clear(): void {

        this.cache.clear();

    }

    /* ==========================================================
       REMEMBER
    ========================================================== */

    async remember<T>(
        key: string,
        loader: () => Promise<T>,
        ttl: number = this.DEFAULT_TTL,
        persist = false
    ): Promise<T> {

        const cached = this.get<T>(key);

        if (cached !== null) {
            return cached;
        }

        if (this.pending.has(key)) {
            return this.pending.get(key)!;
        }

        const request = loader()
            .then(result => {

                this.set(
                    key,
                    result,
                    ttl,
                    persist
                );

                this.pending.delete(key);

                return result;

            })
            .catch(error => {

                this.pending.delete(key);

                throw error;

            });

        this.pending.set(key, request);

        return request;

    }

    /* ==========================================================
       CLEANUP
    ========================================================== */

    cleanup(): void {

        const
