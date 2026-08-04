/* ==========================================================
   REMADEF PLATFORM
   Settings Types
   File: src/types/settings.ts
========================================================== */

import type {
    BaseEntity
} from "./common";

/* ==========================================================
   GENERAL SETTINGS
========================================================== */

export interface UserSettings {

    profile: ProfileSettings;

    privacy: PrivacySettings;

    notifications: NotificationSettings;

    security: SecuritySettings;

    appearance: AppearanceSettings;

    language: LanguageSettings;

    account: AccountSettings;

}

/* ==========================================================
   PROFILE
========================================================== */

export interface ProfileSettings {

    profileVisibility:
        | "public"
        | "connections"
        | "private";

    searchable: boolean;

    showEmail: boolean;

    showPhone: boolean;

    showLocation: boolean;

    allowMessages: boolean;

    allowConnectionRequests: boolean;

}

/* ==========================================================
   PRIVACY
========================================================== */

export interface PrivacySettings {

    activityStatus: boolean;

    readReceipts: boolean;

    lastSeen: boolean;

    profileIndexing: boolean;

    personalizedAds: boolean;

    dataSharing: boolean;

}

/* ==========================================================
   NOTIFICATION SETTINGS
========================================================== */

export interface NotificationSettings {

    push: boolean;

    email: boolean;

    sms: boolean;

    inApp: boolean;

    sound: boolean;

    vibration: boolean;

}

/* ==========================================================
   SECURITY
========================================================== */

export interface SecuritySettings {

    twoFactorEnabled: boolean;

    biometricEnabled: boolean;

    loginAlerts: boolean;

    rememberDevices: boolean;

    sessionTimeout: number;

}

/* ==========================================================
   APPEARANCE
========================================================== */

export interface AppearanceSettings {

    theme:
        | "light"
        | "dark"
        | "system";

    fontSize:
        | "small"
        | "medium"
        | "large";

    compactMode: boolean;

    animations: boolean;

}

/* ==========================================================
   LANGUAGE
========================================================== */

export interface LanguageSettings {

    language: string;

    timezone: string;

    dateFormat: string;

    timeFormat:
        | "12h"
        | "24h";

}

/* ==========================================================
   ACCOUNT
========================================================== */

export interface AccountSettings {

    email: string;

    phone?: string;

    emailVerified: boolean;

    phoneVerified: boolean;

    createdAt: string;

}

/* ==========================================================
   CONNECTED ACCOUNT
========================================================== */

export interface ConnectedAccount
    extends BaseEntity {

    provider: string;

    accountId: string;

    email?: string;

    connectedAt: string;

}

/* ==========================================================
   DEVICE SESSION
========================================================== */

export interface DeviceSession
    extends BaseEntity {

    device: string;

    platform: string;

    browser?: string;

    ipAddress?: string;

    location?: string;

    current: boolean;

    lastActive: string;

}
