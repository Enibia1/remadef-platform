/* ==========================================================
   REMADEF PLATFORM
   Feature Flags Manager
   File: src/core/feature-flags.ts
========================================================== */

import CONFIG from "../config/config";
import Storage from "./storage";
import EventBus from "./events";

export interface FeatureFlag {
    key: string;
    enabled: boolean;
    description?: string;
    rollout?: number; // 0 - 100
}

class FeatureFlags {

    private readonly STORAGE_KEY = "system.feature-flags";

    private flags = new Map<string, FeatureFlag>();

    /* ==========================================================
       INITIALIZE
    ========================================================== */

    init(): void {

        this.loadDefaults();

        this.loadOverrides();

    }

    /* ==========================================================
       DEFAULT FLAGS
    ========================================================== */

    private loadDefaults(): void {

        const defaults: FeatureFlag[] = [

            {
                key: "messages",
                enabled: true
            },

            {
                key: "learning",
                enabled: true
            },

            {
                key: "apprenticeship",
                enabled: true
            },

            {
                key: "business",
                enabled: true
            },

            {
                key: "wallet",
                enabled: true
            },

            {
                key: "escrow",
                enabled: true
            },

            {
                key: "marketplace",
                enabled: false
            },

            {
                key: "ai-assistant",
                enabled: false
            },

            {
                key: "voice-calls",
                enabled: false
            },

            {
                key: "video-calls",
                enabled: false
            }

        ];

        defaults.forEach(flag => {

            this.flags.set(flag.key, flag);

        });

    }

    /* ==========================================================
       LOAD OVERRIDES
    ========================================================== */

    private loadOverrides(): void {

        const overrides =
            Storage.get<FeatureFlag[]>(this.STORAGE_KEY);

        if (!overrides) return;

        overrides.forEach(flag => {

            this.flags.set(flag.key, flag);

        });

    }

    /* ==========================================================
       ENABLE
    ========================================================== */

    enable(key: string): void {

        this.update(key, true);

    }

    /* ==========================================================
       DISABLE
    ========================================================== */

    disable(key: string): void {

        this.update(key, false);

    }

    /* ==========================================================
       TOGGLE
    ========================================================== */

    toggle(key: string): void {

        this.update(key, !this.isEnabled(key));

    }

    /* ==========================================================
       UPDATE
    ========================================================== */

    update(
        key: string,
        enabled: boolean
    ): void {

        const flag = this.flags.get(key);

        if (flag) {

            flag.enabled = enabled;

        } else {

            this.flags.set(key, {
                key,
                enabled
            });

        }

        this.save();

        EventBus.emit(
            "feature:changed",
            this.flags.get(key)
        );

    }

    /* ==========================================================
       ENABLED?
    ========================================================== */

    isEnabled(key: string): boolean {

        const flag = this.flags.get(key);

        if (!flag) return false;

        if (
            typeof flag.rollout === "number"
        ) {

            return (
                flag.enabled &&
                Math.random() * 100 <= flag.rollout
            );

        }

        return flag.enabled;

    }

    /* ==========================================================
       GET FLAG
    ========================================================== */

    get(key: string): FeatureFlag | undefined {

        return this.flags.get(key);

    }

    /* ==========================================================
       GET ALL
    ========================================================== */

    all(): FeatureFlag[] {

        return [...this.flags.values()];

    }

    /* ==========================================================
       SAVE
    ========================================================== */

    private save(): void {

        Storage.set(
            this.STORAGE_KEY,
            this.all()
        );

    }

}

export default new FeatureFlags();
