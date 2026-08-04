/* ==========================================================
   REMADEF PLATFORM
   System Types
   File: src/types/system.ts
========================================================== */

import type {
    BaseEntity
} from "./common";

/* ==========================================================
   HEALTH STATUS
========================================================== */

export interface HealthStatus {

    status:
        | "healthy"
        | "degraded"
        | "maintenance"
        | "offline";

    uptime: number;

    timestamp: string;

    services: ServiceHealth[];

}

/* ==========================================================
   SERVICE HEALTH
========================================================== */

export interface ServiceHealth {

    name: string;

    status:
        | "online"
        | "offline"
        | "degraded";

    responseTime?: number;

    message?: string;

}

/* ==========================================================
   PLATFORM INFO
========================================================== */

export interface PlatformInfo {

    name: string;

    shortName: string;

    version: string;

    environment:
        | "development"
        | "staging"
        | "production";

    description: string;

    country: string;

    timezone: string;

    website?: string;

    copyright?: string;

}

/* ==========================================================
   VERSION
========================================================== */

export interface VersionInfo {

    version: string;

    build: string;

    releasedAt: string;

    minimumSupportedVersion?: string;

    latest: boolean;

}

/* ==========================================================
   MAINTENANCE
========================================================== */

export interface MaintenanceStatus {

    enabled: boolean;

    title?: string;

    message?: string;

    startsAt?: string;

    endsAt?: string;

}

/* ==========================================================
   FEATURE FLAG
========================================================== */

export interface FeatureFlag {

    key: string;

    name: string;

    description?: string;

    enabled: boolean;

    rollout?: number;

}

/* ==========================================================
   SERVER TIME
========================================================== */

export interface ServerTime {

    utc: string;

    local: string;

    timezone: string;

    timestamp: number;

}

/* ==========================================================
   ANNOUNCEMENT
========================================================== */

export interface Announcement
    extends BaseEntity {

    title: string;

    message: string;

    type:
        | "info"
        | "success"
        | "warning"
        | "danger";

    priority:
        | "low"
        | "normal"
        | "high"
        | "critical";

    publishedAt: string;

    expiresAt?: string;

    actionLabel?: string;

    actionUrl?: string;

}
