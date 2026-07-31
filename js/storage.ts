/* ==========================================================
   REMADEF PLATFORM
   Browser Storage Manager
   File: js/storage.ts

   Purpose:
   Centralized management of:
   - localStorage
   - sessionStorage
   - REMADEF session data
   - user data
   - profile data
   - UI preferences
   - drafts

   Rules:
   - No Appwrite calls.
   - No DOM manipulation.
   - No authentication logic.
   - No module-specific business logic.
========================================================== */

import CONFIG from "./config";
import { STORAGE_KEYS } from "./constants";


/* ==========================================================
   TYPES
========================================================== */

type StorageArea =
    | "local"
    | "session";


/* ==========================================================
   STORAGE ENGINE
========================================================== */

function getStorage(
    area: StorageArea = "local"
): Storage | null {

    try {

        if (typeof window === "undefined") {
            return null;
        }

        return area === "session"
            ? window.sessionStorage
            : window.localStorage;

    } catch {

        return null;
    }
}


/* ==========================================================
   KEY PREFIX
========================================================== */

function buildKey(
    key: string
): string {

    return `${CONFIG.storage.prefix}${key}`;
}


/* ==========================================================
   SET VALUE
========================================================== */

export function setItem<T>(
    key: string,
    value: T,
    area: StorageArea = "local"
): boolean {

    const storage = getStorage(area);

    if (!storage) {
        return false;
    }

    try {

        storage.setItem(
            buildKey(key),
            JSON.stringify(value)
        );

        return true;

    } catch {

        return false;
    }
}


/* ==========================================================
   GET VALUE
========================================================== */

export function getItem<T>(
    key: string,
    fallback: T | null = null,
    area: StorageArea = "local"
): T | null {

    const storage = getStorage(area);

    if (!storage) {
        return fallback;
    }

    try {

        const value = storage.getItem(
            buildKey(key)
        );

        if (value === null) {
            return fallback;
        }

        return JSON.parse(value) as T;

    } catch {

        return fallback;
    }
}


/* ==========================================================
   REMOVE VALUE
========================================================== */

export function removeItem(
    key: string,
    area: StorageArea = "local"
): void {

    const storage = getStorage(area);

    if (!storage) {
        return;
    }

    try {

        storage.removeItem(
            buildKey(key)
        );

    } catch {
        // Storage failure intentionally ignored.
    }
}


/* ==========================================================
   CLEAR REMADEF STORAGE
========================================================== */

export function clearRemadefStorage(): void {

    const storage = getStorage("local");

    if (!storage) {
        return;
    }

    try {

        const prefix =
            CONFIG.storage.prefix;

        const keysToRemove: string[] = [];

        for (
            let index = 0;
            index < storage.length;
            index++
        ) {

            const key = storage.key(index);

            if (
                key &&
                key.startsWith(prefix)
            ) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(
            key => storage.removeItem(key)
        );

    } catch {
        // Ignore storage errors.
    }
}


/* ==========================================================
   SESSION
========================================================== */

export interface RemadefSession {

    accountId?: string;

    userId?: string;

    email?: string;

    phone?: string;

    authenticated: boolean;

    createdAt?: number;

    expiresAt?: number;
}


/**
 * Save current REMADEF session.
 */
export function setSession(
    session: RemadefSession
): boolean {

    return setItem(
        STORAGE_KEYS.SESSION,
        session,
        "session"
    );
}


/**
 * Retrieve current session.
 */
export function getSession():
    RemadefSession | null {

    return getItem<RemadefSession>(
        STORAGE_KEYS.SESSION,
        null,
        "session"
    );
}


/**
 * Remove current session.
 */
export function clearSession(): void {

    removeItem(
        STORAGE_KEYS.SESSION,
        "session"
    );

    removeItem(
        STORAGE_KEYS.TOKEN,
        "session"
    );
}


/**
 * Check whether a local session exists.
 */
export function hasSession(): boolean {

    const session = getSession();

    return Boolean(
        session &&
        session.authenticated
    );
}


/* ==========================================================
   USER
========================================================== */

export interface StoredUser {

    id?: string;

    accountId?: string;

    name?: string;

    email?: string;

    phone?: string;

    role?: string;

    avatar?: string;

    verified?: boolean;

    [key: string]: unknown;
}


/**
 * Save user.
 */
export function setUser(
    user: StoredUser
): boolean {

    return setItem(
        STORAGE_KEYS.USER,
        user
    );
}


/**
 * Get user.
 */
export function getUser():
    StoredUser | null {

    return getItem<StoredUser>(
        STORAGE_KEYS.USER,
        null
    );
}


/**
 * Remove user.
 */
export function clearUser(): void {

    removeItem(
        STORAGE_KEYS.USER
    );
}


/* ==========================================================
   PROFILE
========================================================== */

export interface StoredProfile {

    id?: string;

    accountId?: string;

    firstName?: string;

    lastName?: string;

    displayName?: string;

    avatar?: string;

    completion?: number;

    status?: string;

    [key: string]: unknown;
}


/**
 * Save profile.
 */
export function setProfile(
    profile: StoredProfile
): boolean {

    return setItem(
        STORAGE_KEYS.PROFILE,
        profile
    );
}


/**
 * Get profile.
 */
export function getProfile():
    StoredProfile | null {

    return getItem<StoredProfile>(
        STORAGE_KEYS.PROFILE,
        null
    );
}


/**
 * Remove profile.
 */
export function clearProfile(): void {

    removeItem(
        STORAGE_KEYS.PROFILE
    );
}


/* ==========================================================
   SETTINGS
========================================================== */

export interface UserSettings {

    theme?: "light" | "dark" | "system";

    language?: string;

    notifications?: boolean;

    [key: string]: unknown;
}


/**
 * Save settings.
 */
export function setSettings(
    settings: UserSettings
): boolean {

    return setItem(
        STORAGE_KEYS.SETTINGS,
        settings
    );
}


/**
 * Get settings.
 */
export function getSettings():
    UserSettings | null {

    return getItem<UserSettings>(
        STORAGE_KEYS.SETTINGS,
        null
    );
}


/* ==========================================================
   SIDEBAR STATE
========================================================== */

export interface SidebarState {

    collapsed: boolean;

    width?: number;
}


/**
 * Save sidebar state.
 */
export function setSidebarState(
    state: SidebarState
): boolean {

    return setItem(
        STORAGE_KEYS.SIDEBAR,
        state
    );
}


/**
 * Get sidebar state.
 */
export function getSidebarState():
    SidebarState | null {

    return getItem<SidebarState>(
        STORAGE_KEYS.SIDEBAR,
        null
    );
}


/* ==========================================================
   MESSAGE DRAFTS
========================================================== */

export interface MessageDraft {

    conversationId: string;

    text: string;

    updatedAt: number;
}


/**
 * Save a message draft.
 */
export function saveMessageDraft(
    draft: MessageDraft
): boolean {

    const drafts =
        getItem<Record<string, MessageDraft>>(
            STORAGE_KEYS.DRAFTS,
            {}
        ) || {};

    drafts[draft.conversationId] = draft;

    return setItem(
        STORAGE_KEYS.DRAFTS,
        drafts
    );
}


/**
 * Retrieve a message draft.
 */
export function getMessageDraft(
    conversationId: string
): MessageDraft | null {

    const drafts =
        getItem<Record<string, MessageDraft>>(
            STORAGE_KEYS.DRAFTS,
            {}
        ) || {};

    return drafts[conversationId] || null;
}


/**
 * Delete a message draft.
 */
export function removeMessageDraft(
    conversationId: string
): void {

    const drafts =
        getItem<Record<string, MessageDraft>>(
            STORAGE_KEYS.DRAFTS,
            {}
        ) || {};

    delete drafts[conversationId];

    setItem(
        STORAGE_KEYS.DRAFTS,
        drafts
    );
}


/* ==========================================================
   TOKEN
========================================================== */

/**
 * Save authentication token.
 *
 * The backend remains responsible for secure
 * authentication. This is only client-side state.
 */
export function setToken(
    token: string
): boolean {

    return setItem(
        STORAGE_KEYS.TOKEN,
        token,
        "session"
    );
}


/**
 * Get authentication token.
 */
export function getToken():
    string | null {

    return getItem<string>(
        STORAGE_KEYS.TOKEN,
        null,
        "session"
    );
}


/**
 * Remove authentication token.
 */
export function clearToken(): void {

    removeItem(
        STORAGE_KEYS.TOKEN,
        "session"
    );
}


/* ==========================================================
   LOGOUT CLEANUP
========================================================== */

/**
 * Clear client-side authentication data.
 *
 * IMPORTANT:
 * This does NOT perform server-side logout.
 * auth.ts will handle that.
 */
export function clearAuthenticationState(): void {

    clearSession();

    clearToken();

    clearUser();

    clearProfile();
}


/* ==========================================================
   COMPLETE RESET
========================================================== */

/**
 * Remove all REMADEF browser data.
 *
 * Use carefully.
 */
export function resetRemadefStorage(): void {

    clearRemadefStorage();

    const sessionStorage =
        getStorage("session");

    if (!sessionStorage) {
        return;
    }

    try {

        const prefix =
            CONFIG.storage.prefix;

        const keysToRemove: string[] = [];

        for (
            let index = 0;
            index < sessionStorage.length;
            index++
        ) {

            const key =
                sessionStorage.key(index);

            if (
                key &&
                key.startsWith(prefix)
            ) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(
            key => sessionStorage.removeItem(key)
        );

    } catch {
        // Ignore storage errors.
    }
}


/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default {

    setItem,
    getItem,
    removeItem,

    clearRemadefStorage,

    setSession,
    getSession,
    clearSession,
    hasSession,

    setUser,
    getUser,
    clearUser,

    setProfile,
    getProfile,
    clearProfile,

    setSettings,
    getSettings,

    setSidebarState,
    getSidebarState,

    saveMessageDraft,
    getMessageDraft,
    removeMessageDraft,

    setToken,
    getToken,
    clearToken,

    clearAuthenticationState,
    resetRemadefStorage
};
