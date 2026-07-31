/* ==========================================================
   REMADEF PLATFORM
   Global Event Bus
   File: src/core/events.ts
========================================================== */

export type EventHandler<T = any> = (payload?: T) => void | Promise<void>;

class EventBus {

    private listeners = new Map<string, Set<EventHandler>>();

    /* ==========================================================
       ON
    ========================================================== */

    on<T = any>(
        event: string,
        handler: EventHandler<T>
    ): () => void {

        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        this.listeners.get(event)!.add(handler);

        return () => this.off(event, handler);

    }

    /* ==========================================================
       ONCE
    ========================================================== */

    once<T = any>(
        event: string,
        handler: EventHandler<T>
    ): () => void {

        const wrapper: EventHandler<T> = async (payload) => {

            this.off(event, wrapper);

            await handler(payload);

        };

        return this.on(event, wrapper);

    }

    /* ==========================================================
       OFF
    ========================================================== */

    off(
        event: string,
        handler: EventHandler
    ): void {

        const listeners = this.listeners.get(event);

        if (!listeners) return;

        listeners.delete(handler);

        if (listeners.size === 0) {
            this.listeners.delete(event);
        }

    }

    /* ==========================================================
       EMIT
    ========================================================== */

    async emit<T = any>(
        event: string,
        payload?: T
    ): Promise<void> {

        const listeners = this.listeners.get(event);

        if (!listeners) return;

        for (const handler of listeners) {
            await handler(payload);
        }

    }

    /* ==========================================================
       HAS LISTENERS
    ========================================================== */

    has(event: string): boolean {

        return this.listeners.has(event);

    }

    /* ==========================================================
       REMOVE EVENT
    ========================================================== */

    clear(event: string): void {

        this.listeners.delete(event);

    }

    /* ==========================================================
       REMOVE ALL
    ========================================================== */

    clearAll(): void {

        this.listeners.clear();

    }

    /* ==========================================================
       COUNT
    ========================================================== */

    listenerCount(event: string): number {

        return this.listeners.get(event)?.size ?? 0;

    }

}

export default new EventBus();
