/* ============================================================
REMADEF PLATFORM
AUTHENTICATION & SESSION MANAGER
File: js/auth.ts

Responsibilities:

- Appwrite authentication
- Sign in
- Registration handoff
- Current user
- Session validation
- Protected-page enforcement
- Sign out
- Session state
- Local application state
  ============================================================ */

import RemadefAPI from "./api";
import CONFIG from "./config";

/* ============================================================
TYPES
============================================================ */

export interface AuthUser {

$id: string;

name?: string;

email?: string;

phone?: string;

status?: boolean;

emailVerification?: boolean;

phoneVerification?: boolean;

registration?: string;

prefs?: Record<string, unknown>;

[key: string]: unknown;

}

export interface AuthState {

authenticated: boolean;

user: AuthUser | null;

loading: boolean;

lastChecked: number;

}

interface StoredAuth {

user: AuthUser;

authenticated: boolean;

timestamp: number;

}

/* ============================================================
STORAGE KEYS
============================================================ */

const STORAGE_KEYS = {

auth:
    "remadef_auth",

user:
    "remadef_user",

account:
    "remadef_account",

profile:
    "remadef_profile"

} as const;

/* ============================================================
AUTH MANAGER
============================================================ */

class RemadefAuth {

private state: AuthState = {

    authenticated:
        false,

    user:
        null,

    loading:
        false,

    lastChecked:
        0

};

private listeners:
    Array<(state: AuthState) => void> = [];

/* ========================================================
   INITIALIZE
======================================================== */

async initialize(): Promise<AuthState> {

    if (
        typeof window === "undefined"
    ) {

        return this.state;

    }

    this.state.loading =
        true;

    this.notify();

    try {

        const user =
            await this.getCurrentUser();

        if (user) {

            this.setAuthenticatedUser(
                user
            );

        } else {

            this.clearAuthentication();

        }

    } catch (error) {

        console.error(
            "[REMADEF AUTH] Initialization failed:",
            error
        );

        this.clearAuthentication();

    } finally {

        this.state.loading =
            false;

        this.state.lastChecked =
            Date.now();

        this.notify();

    }

    return this.state;

}

/* ========================================================
   SIGN IN
======================================================== */

async signIn(

    email: string,

    password: string

): Promise<AuthUser> {

    if (!email.trim()) {

        throw new Error(
            "Email is required."
        );

    }

    if (!password) {

        throw new Error(
            "Password is required."
        );

    }

    this.state.loading =
        true;

    this.notify();

    try {

        /*
         * Appwrite Account SDK is used here.
         *
         * The SDK must already be initialized by app.ts.
         */

        const account =
            this.getAccountService();

        if (!account) {

            throw new Error(
                "Appwrite Account service is not initialized."
            );

        }

        /*
         * Appwrite SDK versions use createEmailPasswordSession()
         * for email/password authentication.
         */

        await account.createEmailPasswordSession(

            email.trim().toLowerCase(),

            password

        );

        const user =
            await this.getCurrentUser();

        if (!user) {

            throw new Error(
                "Authentication succeeded but the user could not be loaded."
            );

        }

        this.setAuthenticatedUser(
            user
        );

        return user;

    } finally {

        this.state.loading =
            false;

        this.notify();

    }

}

/* ========================================================
   PHONE SIGN IN
======================================================== */

async signInWithPhone(

    phone: string,

    password: string

): Promise<AuthUser> {

    if (!phone.trim()) {

        throw new Error(
            "Phone number is required."
        );

    }

    if (!password) {

        throw new Error(
            "Password is required."
        );

    }

    const account =
        this.getAccountService();

    if (!account) {

        throw new Error(
            "Appwrite Account service is not initialized."
        );

    }

    /*
     * Appwrite phone/password sessions.
     */

    await account.createPhoneSession(

        phone.trim(),

        password

    );

    const user =
        await this.getCurrentUser();

    if (!user) {

        throw new Error(
            "Unable to load authenticated user."
        );

    }

    this.setAuthenticatedUser(
        user
    );

    return user;

}

/* ========================================================
   REGISTER
======================================================== */

async register(

    data:
        Record<string, unknown>

) {

    const response =
        await RemadefAPI.register(
            data
        );

    /*
     * Registration creates the account/profile
     * on the backend.
     *
     * It does NOT automatically assume that a
     * browser session exists.
     */

    if (
        response.success
    ) {

        if (
            response.account
        ) {

            this.saveAccount(
                response.account
            );

        }

        if (
            response.profile
        ) {

            this.saveProfile(
                response.profile as Record<
                    string,
                    unknown
                >
            );

        }

    }

    return response;

}

/* ========================================================
   CURRENT USER
======================================================== */

async getCurrentUser():

    Promise<AuthUser | null> {

    try {

        const account =
            this.getAccountService();

        if (!account) {

            return null;

        }

        const user =
            await account.get();

        return user as AuthUser;

    } catch {

        return null;

    }

}

/* ========================================================
   VALIDATE SESSION
======================================================== */

async validateSession():

    Promise<boolean> {

    try {

        const user =
            await this.getCurrentUser();

        if (!user) {

            this.clearAuthentication();

            return false;

        }

        this.setAuthenticatedUser(
            user
        );

        return true;

    } catch {

        this.clearAuthentication();

        return false;

    }

}

/* ========================================================
   REQUIRE AUTHENTICATION
======================================================== */

async requireAuth(

    redirect = "login.html"

): Promise<AuthUser> {

    const user =
        await this.getCurrentUser();

    if (!user) {

        this.clearAuthentication();

        if (
            typeof window !== "undefined"
        ) {

            const currentPage =
                window.location.pathname;

            const returnUrl =
                encodeURIComponent(
                    currentPage
                );

            window.location.href =
                `${redirect}?return=${returnUrl}`;

        }

        throw new Error(
            "Authentication required."
        );

    }

    this.setAuthenticatedUser(
        user
    );

    return user;

}

/* ========================================================
   SIGN OUT
======================================================== */

async signOut(

    redirect = "login.html"

): Promise<void> {

    try {

        const account =
            this.getAccountService();

        if (account) {

            await account.deleteSession(
                "current"
            );

        }

    } catch (error) {

        /*
         * Even if the remote session has already
         * expired, local authentication state must
         * still be cleared.
         */

        console.warn(
            "[REMADEF AUTH] Remote logout warning:",
            error
        );

    } finally {

        this.clearAuthentication();

        if (
            typeof window !== "undefined" &&
            redirect
        ) {

            window.location.href =
                redirect;

        }

    }

}

/* ========================================================
   GET AUTH STATE
======================================================== */

getState(): AuthState {

    return {

        ...this.state

    };

}

/* ========================================================
   IS AUTHENTICATED
======================================================== */

isAuthenticated(): boolean {

    return this.state.authenticated;

}

/* ========================================================
   GET CACHED USER
======================================================== */

getCachedUser():

    AuthUser | null {

    return this.state.user;

}

/* ========================================================
   STATE LISTENER
======================================================== */

subscribe(

    listener:
        (state: AuthState) => void

): () => void {

    this.listeners.push(
        listener
    );

    /*
     * Return unsubscribe function.
     */

    return () => {

        this.listeners =
            this.listeners.filter(

                item =>
                    item !== listener

            );

    };

}

/* ========================================================
   NOTIFY LISTENERS
======================================================== */

private notify(): void {

    const snapshot = {

        ...this.state

    };

    this.listeners.forEach(

        listener => {

            try {

                listener(
                    snapshot
                );

            } catch (error) {

                console.error(
                    "[REMADEF AUTH] Listener error:",
                    error
                );

            }

        }

    );

}

/* ========================================================
   SAVE AUTHENTICATED USER
======================================================== */

private setAuthenticatedUser(

    user: AuthUser

): void {

    this.state.user =
        user;

    this.state.authenticated =
        true;

    this.state.lastChecked =
        Date.now();

    if (
        typeof window !== "undefined"
    ) {

        const authData:
            StoredAuth = {

                user,

                authenticated:
                    true,

                timestamp:
                    Date.now()

            };

        localStorage.setItem(

            STORAGE_KEYS.auth,

            JSON.stringify(
                authData
            )

        );

        localStorage.setItem(

            STORAGE_KEYS.user,

            JSON.stringify(
                user
            )

        );

    }

    this.notify();

}

/* ========================================================
   CLEAR AUTHENTICATION
======================================================== */

private clearAuthentication(): void {

    this.state.user =
        null;

    this.state.authenticated =
        false;

    if (
        typeof window !== "undefined"
    ) {

        localStorage.removeItem(
            STORAGE_KEYS.auth
        );

        localStorage.removeItem(
            STORAGE_KEYS.user
        );

        localStorage.removeItem(
            STORAGE_KEYS.account
        );

        /*
         * Profile data is deliberately retained
         * temporarily because it is useful for
         * registration/profile completion recovery.
         *
         * The backend remains the authoritative
         * source of profile data.
         */

    }

    this.notify();

}

/* ========================================================
   SAVE ACCOUNT
======================================================== */

private saveAccount(

    account:
        Record<string, unknown>

): void {

    if (
        typeof window === "undefined"
    ) {

        return;

    }

    localStorage.setItem(

        STORAGE_KEYS.account,

        JSON.stringify(
            account
        )

    );

}

/* ========================================================
   SAVE PROFILE
======================================================== */

private saveProfile(

    profile:
        Record<string, unknown>

): void {

    if (
        typeof window === "undefined"
    ) {

        return;

    }

    localStorage.setItem(

        STORAGE_KEYS.profile,

        JSON.stringify(
            profile
        )

    );

}

/* ========================================================
   GET ACCOUNT SERVICE
======================================================== */

private getAccountService():

    any {

    if (
        typeof window === "undefined"
    ) {

        return null;

    }

    /*
     * app.ts will initialize the Appwrite SDK
     * and expose the Account service here.
     */

    const globalAppwrite =
        window.appwrite;

    if (
        !globalAppwrite
    ) {

        return null;

    }

    /*
     * The account service is intentionally
     * retrieved from the global application
     * bootstrap layer.
     */

    return (
        globalAppwrite as any
    ).account || null;

}

}

/* ============================================================
SINGLETON
============================================================ */

const auth =
new RemadefAuth();

/* ============================================================
GLOBAL EXPORT
============================================================ */

if (
typeof window !== "undefined"
) {

(
    window as any
).RemadefAuth =
    auth;

}

/* ============================================================
MODULE EXPORT
============================================================ */

export default auth;

export {
auth as RemadefAuth
};
