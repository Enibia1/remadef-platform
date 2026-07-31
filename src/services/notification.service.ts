/* ==========================================================
   REMADEF PLATFORM
   Notification Service
   File: src/services/notification.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    Notification,
    NotificationPreference,
    NotificationCount,
    NotificationFilter
} from "../types/notification";

class NotificationService {

    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    getAll(
        page = 1,
        limit = 20,
        filter?: NotificationFilter
    ): Promise<ListResponse<Notification>> {

        const params = new URLSearchParams({

            page: String(page),

            limit: String(limit)

        });

        if (filter) {

            Object.entries(filter).forEach(

                ([key, value]) => {

                    if (
                        value !== undefined &&
                        value !== null
                    ) {

                        params.append(
                            key,
                            String(value)
                        );

                    }

                }

            );

        }

        return Client.get(

            `${ENDPOINTS.NOTIFICATIONS.LIST}?${params.toString()}`,

            {
                cache: true,
                cacheTTL: 30000
            }

        );

    }

    /* ======================================================
       SINGLE
    ====================================================== */

    get(
        notificationId: string
    ): Promise<ApiResponse<Notification>> {

        return Client.get(

            `${ENDPOINTS.NOTIFICATIONS.LIST}/${encodeURIComponent(notificationId)}`

        );

    }

    /* ======================================================
       UNREAD COUNT
    ====================================================== */

    unreadCount(): Promise<ApiResponse<NotificationCount>> {

        return Client.get(

            ENDPOINTS.NOTIFICATIONS.UNREAD,

            {
                cache: true,
                cacheTTL: 10000
            }

        );

    }

    /* ======================================================
       MARK READ
    ====================================================== */

    markRead(
        notificationId: string
    ): Promise<ApiResponse> {

        return Client.patch(

            `${ENDPOINTS.NOTIFICATIONS.LIST}/${encodeURIComponent(notificationId)}/read`

        );

    }

    markUnread(
        notificationId: string
    ): Promise<ApiResponse> {

        return Client.patch(

            `${ENDPOINTS.NOTIFICATIONS.LIST}/${encodeURIComponent(notificationId)}/unread`

        );

    }

    /* ======================================================
       BULK
    ====================================================== */

    markAllRead(): Promise<ApiResponse> {

        return Client.patch(

            ENDPOINTS.NOTIFICATIONS.READ_ALL

        );

    }

    delete(
        notificationId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.NOTIFICATIONS.LIST}/${encodeURIComponent(notificationId)}`

        );

    }

    clearAll(): Promise<ApiResponse> {

        return Client.delete(

            ENDPOINTS.NOTIFICATIONS.CLEAR

        );

    }

    /* ======================================================
       PREFERENCES
    ====================================================== */

    getPreferences(): Promise<ApiResponse<NotificationPreference>> {

        return Client.get(

            ENDPOINTS.NOTIFICATIONS.PREFERENCES,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    updatePreferences(
        data: NotificationPreference
    ): Promise<ApiResponse<NotificationPreference>> {

        return Client.put(

            ENDPOINTS.NOTIFICATIONS.PREFERENCES,

            data

        );

    }

    /* ======================================================
       DEVICE TOKEN
    ====================================================== */

    registerDevice(
        token: string,
        platform: string
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.NOTIFICATIONS.DEVICE,

            {
                token,
                platform
            }

        );

    }

    unregisterDevice(
        token: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.NOTIFICATIONS.DEVICE}/${encodeURIComponent(token)}`

        );

    }

}

export default new NotificationService();
