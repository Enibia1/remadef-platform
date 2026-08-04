/* ==========================================================
   REMADEF PLATFORM
   Settings Module
   File: src/modules/settings/settings.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    UserSettings,
    PrivacySettings,
    SecuritySettings,
    NotificationSettings,
    AppearanceSettings,
    LanguageSettings,
    ConnectedAccount

} from "../../types/settings";

class SettingsModule {

    private readonly USER_SETTINGS_KEY =
        "settings.user";

    private readonly PRIVACY_KEY =
        "settings.privacy";

    private readonly SECURITY_KEY =
        "settings.security";

    private readonly NOTIFICATIONS_KEY =
        "settings.notifications";

    private readonly APPEARANCE_KEY =
        "settings.appearance";

    private readonly LANGUAGE_KEY =
        "settings.language";

    private readonly CONNECTED_ACCOUNTS_KEY =
        "settings.connectedAccounts";

    private readonly CACHE_KEY =
        "settings-cache";

    private loading = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        this.restore();

        this.registerEvents();

        await this.refresh();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "settings:refresh",

            () => this.refresh()

        );

    }

    /* ======================================================
       REFRESH
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            await Promise.all([

                this.loadUserSettings(),

                this.loadPrivacy(),

                this.loadSecurity(),

                this.loadNotifications(),

                this.loadAppearance(),

                this.loadLanguage(),

                this.loadConnectedAccounts()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       USER SETTINGS
    ====================================================== */

    async loadUserSettings(): Promise<void> {

        const response =
            await API.settings.user();

        const settings =
            response.data as UserSettings;

        State.set(

            this.USER_SETTINGS_KEY,

            settings

        );

        Cache.set(

            this.CACHE_KEY,

            settings

        );

        Events.emit(

            "settings:userUpdated",

            settings

        );

    }

    /* ======================================================
       PRIVACY
    ====================================================== */

    async loadPrivacy(): Promise<void> {

        const response =
            await API.settings.privacy();

        const privacy =
            response.data as PrivacySettings;

        State.set(

            this.PRIVACY_KEY,

            privacy

        );

        Events.emit(

            "settings:privacyUpdated",

            privacy

        );

    }

    /* ======================================================
       SECURITY
    ====================================================== */

    async loadSecurity(): Promise<void> {

        const response =
            await API.settings.security();

        const security =
            response.data as SecuritySettings;

        State.set(

            this.SECURITY_KEY,

            security

        );

        Events.emit(

            "settings:securityUpdated",

            security

        );

    }

    /* ======================================================
       NOTIFICATION SETTINGS
    ====================================================== */

    async loadNotifications(): Promise<void> {

        const response =
            await API.settings.notifications();

        const notifications =
            response.data as NotificationSettings;

        State.set(

            this.NOTIFICATIONS_KEY,

            notifications

        );

        Events.emit(

            "settings:notificationsUpdated",

            notifications

        );

    }

    /* ======================================================
       APPEARANCE
    ====================================================== */

    async loadAppearance(): Promise<void> {

        const response =
            await API.settings.appearance();

        const appearance =
            response.data as AppearanceSettings;

        State.set(

            this.APPEARANCE_KEY,

            appearance

        );

        Events.emit(

            "settings:appearanceUpdated",

            appearance

        );

    }

    /* ======================================================
       LANGUAGE
    ====================================================== */

    async loadLanguage(): Promise<void> {

        const response =
            await API.settings.language();

        const language =
            response.data as LanguageSettings;

        State.set(

            this.LANGUAGE_KEY,

            language

        );

        Events.emit(

            "settings:languageUpdated",

            language

        );

    }

    /* ======================================================
       CONNECTED ACCOUNTS
    ====================================================== */

    async loadConnectedAccounts(): Promise<void> {

        const response =
            await API.settings.connectedAccounts();

        const accounts =
            response.data as ConnectedAccount[];

        State.set(

            this.CONNECTED_ACCOUNTS_KEY,

            accounts

        );

        Events.emit(

            "settings:connectedAccountsUpdated",

            accounts

        );

    }

    /* ======================================================
       SESSION MANAGEMENT
    ====================================================== */

    async loadSessions(): Promise<void> {

        const response =
            await API.settings.sessions();

        State.set(

            "settings.sessions",

            response.data ?? []

        );

        Events.emit(

            "settings:sessionsUpdated",

            response.data ?? []

        );

    }

    async revokeSession(
        sessionId: string
    ): Promise<void> {

        await API.settings.revokeSession(
            sessionId
        );

        await this.loadSessions();

    }

    /* ======================================================
       DEVICE MANAGEMENT
    ====================================================== */

    async loadDevices(): Promise<void> {

        const response =
            await API.settings.devices();

        State.set(

            "settings.devices",

            response.data ?? []

        );

        Events.emit(

            "settings:devicesUpdated",

            response.data ?? []

        );

    }

    async revokeDevice(
        deviceId: string
    ): Promise<void> {

        await API.settings.revokeDevice(
            deviceId
        );

        await this.loadDevices();

    }

    /* ======================================================
       TWO-FACTOR AUTHENTICATION
    ====================================================== */

    async enableTwoFactor(): Promise<void> {

        await API.settings.enableTwoFactor();

        await this.loadSecurity();

    }

    async disableTwoFactor(): Promise<void> {

        await API.settings.disableTwoFactor();

        await this.loadSecurity();

    }

    /* ======================================================
       LOGIN HISTORY
    ====================================================== */

    async loadLoginHistory(): Promise<void> {

        const response =
            await API.settings.loginHistory();

        State.set(

            "settings.loginHistory",

            response.data ?? []

        );

        Events.emit(

            "settings:loginHistoryUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       DATA EXPORT
    ====================================================== */

    async exportData(): Promise<void> {

        await API.settings.exportData();

    }

    /* ======================================================
       ACCOUNT DELETION
    ====================================================== */

    async deleteAccount(): Promise<void> {

        await API.settings.deleteAccount();

    }

    /* ======================================================
       PREFERENCE SYNCHRONIZATION
    ====================================================== */

    async synchronize(): Promise<void> {

        await API.settings.synchronize();

        await this.refresh();

    }

    /* ======================================================
       SETTINGS BACKUP
    ====================================================== */

    async backup(): Promise<void> {

        await API.settings.backup();

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getUserSettings(): UserSettings | null {

        return (

            State.get(

                this.USER_SETTINGS_KEY

            ) || null

        );

    }

    getPrivacy(): PrivacySettings | null {

        return (

            State.get(

                this.PRIVACY_KEY

            ) || null

        );

    }

    getSecurity(): SecuritySettings | null {

        return (

            State.get(

                this.SECURITY_KEY

            ) || null

        );

    }

    getNotifications(): NotificationSettings | null {

        return (

            State.get(

                this.NOTIFICATIONS_KEY

            ) || null

        );

    }

    getAppearance(): AppearanceSettings | null {

        return (

            State.get(

                this.APPEARANCE_KEY

            ) || null

        );

    }

    getLanguage(): LanguageSettings | null {

        return (

            State.get(

                this.LANGUAGE_KEY

            ) || null

        );

    }

    getConnectedAccounts(): ConnectedAccount[] {

        return (

            State.get(

                this.CONNECTED_ACCOUNTS_KEY

            ) || []

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restore(): void {

        const cached = Cache.get(

            this.CACHE_KEY

        );

        if (!cached) {

            return;

        }

        State.set(

            this.USER_SETTINGS_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.USER_SETTINGS_KEY

        );

        State.remove(

            this.PRIVACY_KEY

        );

        State.remove(

            this.SECURITY_KEY

        );

        State.remove(

            this.NOTIFICATIONS_KEY

        );

        State.remove(

            this.APPEARANCE_KEY

        );

        State.remove(

            this.LANGUAGE_KEY

        );

        State.remove(

            this.CONNECTED_ACCOUNTS_KEY

        );

        State.remove(

            "settings.sessions"

        );

        State.remove(

            "settings.devices"

        );

        State.remove(

            "settings.loginHistory"

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "settings:cleared"

        );

    }

}

export default new SettingsModule();
