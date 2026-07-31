/* ==========================================================
   REMADEF PLATFORM
   System Service
   File: src/services/system.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type { ApiResponse } from "../types/api";

import type {
    HealthStatus,
    PlatformInfo,
    VersionInfo,
    MaintenanceStatus,
    FeatureFlag,
    ServerTime,
    Announcement
} from "../types/system";

class SystemService {

    /* ======================================================
       HEALTH
    ====================================================== */

    health(): Promise<ApiResponse<HealthStatus>> {

        return Client.get(

            ENDPOINTS.SYSTEM.HEALTH,

            {
                cache: true,
                cacheTTL: 10000
            }

        );

    }

    /* ======================================================
       PLATFORM INFO
    ====================================================== */

    info(): Promise<ApiResponse<PlatformInfo>> {

        return Client.get(

            ENDPOINTS.SYSTEM.INFO,

            {
                cache: true,
                cacheTTL: 300000
            }

        );

    }

    /* ======================================================
       VERSION
    ====================================================== */

    version(): Promise<ApiResponse<VersionInfo>> {

        return Client.get(

            ENDPOINTS.SYSTEM.VERSION,

            {
                cache: true,
                cacheTTL: 300000
            }

        );

    }

    /* ======================================================
       SERVER TIME
    ====================================================== */

    serverTime(): Promise<ApiResponse<ServerTime>> {

        return Client.get(

            ENDPOINTS.SYSTEM.TIME,

            {
                cache: true,
                cacheTTL: 5000
            }

        );

    }

    /* ======================================================
       MAINTENANCE
    ====================================================== */

    maintenance(): Promise<ApiResponse<MaintenanceStatus>> {

        return Client.get(

            ENDPOINTS.SYSTEM.MAINTENANCE,

            {
                cache: true,
                cacheTTL: 30000
            }

        );

    }

    /* ======================================================
       FEATURE FLAGS
    ====================================================== */

    featureFlags(): Promise<ApiResponse<FeatureFlag[]>> {

        return Client.get(

            ENDPOINTS.SYSTEM.FEATURE_FLAGS,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    /* ======================================================
       ANNOUNCEMENTS
    ====================================================== */

    announcements(): Promise<ApiResponse<Announcement[]>> {

        return Client.get(

            ENDPOINTS.SYSTEM.ANNOUNCEMENTS,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    /* ======================================================
       PING
    ====================================================== */

    ping(): Promise<boolean> {

        return this.health()

            .then(() => true)

            .catch(() => false);

    }

}

export default new SystemService();
