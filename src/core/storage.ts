/* ==========================================================
   REMADEF PLATFORM
   Core Storage Manager
   File: src/core/storage.ts
========================================================== */

import CONFIG from "../config/config";

interface StorageItem<T = any> {
    value: T;
    expires?: number;
    version: string;
}

class StorageManager {

    private memory = new Map<string, StorageItem>();

    private namespace: string;

    constructor() {
        this.namespace = CONFIG.APP_NAMESPACE ?? "remadef";
    }

    /* ==========================================================
       KEY
    ========================================================== */

    private key(key: string): string {
        return `${this.namespace}:${key}`;
    }

    /* ==========================================================
       LOCAL STORAGE
    ========================================================== */

    private getStore(): Storage {
        try {
            return window.localStorage;
        } catch {
            return {
                getItem: (k) => JSON.stringify(this.memory.get(k)),
                setItem: (k, v) => {
                    this.memory.set(k, JSON.parse(v));
                },
                removeItem: (k) => {
                    this.memory.delete(k);
                },
                clear: () => {
                    this.memory.clear();
                },
                key: () => null,
                length: 0
            } as Storage;
        }
    }

    /* ==========================================================
       SET
    ========================================================== */

    set<T>(
        key: string,
        value: T,
        ttl?: number
    ): void {

        const item: StorageItem<T> = {
            value,
            version: CONFIG.VERSION,
            expires: ttl ? Date.now() + ttl : undefined
        };

        this.getStore().setItem(
            this.key(key),
            JSON.stringify(item)
        );

    }

    /* ==========================================================
       GET
    ========================================================== */

    get<T = any>(key: string): T | null {

        const raw = this.getStore().getItem(this.key(key));

        if (!raw) return null;

        try {

            const item: StorageItem<T> = JSON.parse(raw);

            if (
                item.expires &&
                Date.now() > item.expires
            ) {

                this.remove(key);

                return null;

            }

            return item.value;

        } catch {

            return null;

        }

    }

    /* ==========================================================
       HAS
    ========================================================== */

    has(key: string): boolean {

        return this.get(key) !== null;

    }

    /* ==========================================================
       REMOVE
    ========================================================== */

    remove(key: string): void {

        this.getStore().removeItem(this.key(key));

    }

    /* ==========================================================
       CLEAR
    ========================================================== */

    clear(): void {

        const storage = this.getStore();

        const prefix = `${this.namespace}:`;

        const keys: string[] = [];

        for (let i = 0; i < storage.length; i++) {

            const key = storage.key(i);

            if (key?.startsWith(prefix)) {

                keys.push(key);

            }

        }

        keys.forEach(key => storage.removeItem(key));

    }

    /* ==========================================================
       SESSION STORAGE
    ========================================================== */

    session = {

        set: (key: string, value: any) => {

            sessionStorage.setItem(
                this.key(key),
                JSON.stringify(value)
            );

        },

        get: <T = any>(key: string): T | null => {

            const raw = sessionStorage.getItem(
                this.key(key)
            );

            return raw ? JSON.parse(raw) : null;

        },

        remove: (key: string) => {

            sessionStorage.removeItem(
                this.key(key)
            );

        },

        clear: () => {

            sessionStorage.clear();

        }

    };

}

export default new StorageManager();
