/* ==========================================================
   REMADEF PLATFORM
   Settings Service
   File: src/services/settings.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse
} from "../types/api";

import type {
    UserSettings,
    ProfileSettings,
    PrivacySettings,
    NotificationSettings,
    SecuritySettings,
    AppearanceSettings,
    LanguageSettings,
    AccountSettings,
    ConnectedAccount,
    DeviceSession
} from "../types/settings";

class SettingsService {

    /* ======================================================
       GENERAL SETTINGS
    ====================================================== */

    getSettings(): Promise<ApiResponse<UserSettings>> {

        return Client.get(

            ENDPOINTS.SETTINGS.ROOT,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    updateSettings(
        data: Partial<UserSettings>
    ): Promise<ApiResponse<UserSettings>> {

        return Client.put(

            ENDPOINTS.SETTINGS.ROOT,

            data

        );

    }

    /* ======================================================
       PROFILE
    ====================================================== */

    getProfileSettings(): Promise<ApiResponse<ProfileSettings>> {

        return Client.get(

            ENDPOINTS.SETTINGS.PROFILE

        );

    }

    updateProfileSettings(
        data: Partial<ProfileSettings>
    ): Promise<ApiResponse<ProfileSettings>> {

        return Client.put(

            ENDPOINTS.SETTINGS.PROFILE,

            data

        );

    }

    /* ======================================================
       PRIVACY
    ====================================================== */

    getPrivacySettings(): Promise<ApiResponse<PrivacySettings>> {

        return Client.get(

            ENDPOINTS.SETTINGS.PRIVACY

        );

    }

    updatePrivacySettings(
        data: Partial<PrivacySettings>
    ): Promise<ApiResponse<PrivacySettings>> {

        return Client.put(

            ENDPOINTS.SETTINGS.PRIVACY,

            data

        );

    }

    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    getNotificationSettings(): Promise<ApiResponse<NotificationSettings>> {

        return Client.get(

            ENDPOINTS.SETTINGS.NOTIFICATIONS

        );

    }

    updateNotificationSettings(
        data: Partial<NotificationSettings>
    ): Promise<ApiResponse<NotificationSettings>> {

        return Client.put(

            ENDPOINTS.SETTINGS.NOTIFICATIONS,

            data

        );

    }

    /* ======================================================
       SECURITY
    ====================================================== */

    getSecuritySettings(): Promise<ApiResponse<SecuritySettings>> {

        return Client.get(

            ENDPOINTS.SETTINGS.SECURITY

        );

    }

    updateSecuritySettings(
        data: Partial<SecuritySettings>
    ): Promise<ApiResponse<SecuritySettings>> {

        return Client.put(

            ENDPOINTS.SETTINGS.SECURITY,

            data

        );

    }

    changePassword(
        currentPassword: string,
        newPassword: string
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.SETTINGS.CHANGE_PASSWORD,

            {
                currentPassword,
                newPassword
            }

        );

    }

    enableTwoFactor(): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.SETTINGS.TWO_FACTOR_ENABLE

        );

    }

    disableTwoFactor(): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.SETTINGS.TWO_FACTOR_DISABLE

        );

    }

    /* ======================================================
       APPEARANCE
    ====================================================== */

    getAppearanceSettings(): Promise<ApiResponse<AppearanceSettings>> {

        return Client.get(

            ENDPOINTS.SETTINGS.APPEARANCE

        );

    }

    updateAppearanceSettings(
        data: Partial<AppearanceSettings>
    ): Promise<ApiResponse<AppearanceSettings>> {

        return Client.put(

            ENDPOINTS.SETTINGS.APPEARANCE,

            data

        );

    }

    /* ======================================================
       LANGUAGE
    ====================================================== */

    getLanguageSettings(): Promise<ApiResponse<LanguageSettings>> {

        return Client.get(

            ENDPOINTS.SETTINGS.LANGUAGE

        );

    }

    updateLanguageSettings(
        data: Partial<LanguageSettings>
    ): Promise<ApiResponse<LanguageSettings>> {

        return Client.put(

            ENDPOINTS.SETTINGS.LANGUAGE,

            data

        );

    }

    /* ======================================================
       ACCOUNT
    ====================================================== */

    getAccountSettings(): Promise<ApiResponse<AccountSettings>> {

        return Client.get(

            ENDPOINTS.SETTINGS.ACCOUNT

        );

    }

    deactivateAccount(): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.SETTINGS.DEACTIVATE

        );

    }

    deleteAccount(): Promise<ApiResponse> {

        return Client.delete(

            ENDPOINTS.SETTINGS.DELETE

        );

    }

    /* ======================================================
       CONNECTED ACCOUNTS
    ====================================================== */

    getConnectedAccounts(): Promise<ApiResponse<ConnectedAccount[]>> {

        return Client.get(

            ENDPOINTS.SETTINGS.CONNECTED_ACCOUNTS

        );

    }

    disconnectAccount(
        provider: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.SETTINGS.CONNECTED_ACCOUNTS}/${encodeURIComponent(provider)}`

        );

    }

    /* ======================================================
       ACTIVE SESSIONS / DEVICES
    ====================================================== */

    getSessions(): Promise<ApiResponse<DeviceSession[]>> {

        return Client.get(

            ENDPOINTS.SETTINGS.SESSIONS

        );

    }

    revokeSession(
        sessionId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.SETTINGS.SESSIONS}/${encodeURIComponent(sessionId)}`

        );

    }

    revokeAllSessions(): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.SETTINGS.REVOKE_ALL_SESSIONS

        );

    }

}

export default new SettingsService();
