/* ==========================================================
   REMADEF PLATFORM
   AUTHENTICATION CONTROLLER
   File: js/auth.ts

   RESPONSIBILITIES
   ----------------------------------------------------------
   • Register users
   • Login users
   • Verify sessions
   • Load current user
   • Load master profile
   • Protect private pages
   • Handle logout
   • Maintain frontend auth state

   IMPORTANT
   ----------------------------------------------------------
   Appwrite is the authentication authority.

   localStorage is ONLY used for:
   • UI state
   • cached profile information
   • account information
   • remembering frontend state

   localStorage is NOT treated as proof of authentication.
========================================================== */

import RemadefAPI from "./api";
import CONFIG from "./config";


/* ==========================================================
   TYPES
========================================================== */

export interface RemadefUser {

    id?: string;

    accountId?: string;

    name?: string;

    firstName?: string;

    lastName?: string;

    email?: string;

    phone?: string;

    avatar?: string;

    emailVerification?: boolean;

    phoneVerification?: boolean;

    status?: boolean;

    [key: string]: any;
}


export interface AuthState {

    authenticated: boolean;

    user: RemadefUser | null;

    profile: any | null;

    account: any | null;

    initialized: boolean;
}


export interface LoginResult {

    success?: boolean;

    message?: string;

    user?: RemadefUser;

    profile?: any;

    accountId?: string;

    data?: any;

    [key: string]: any;
}


/* ==========================================================
   STORAGE KEYS
========================================================== */

const STORAGE_KEYS = {

    user:
        "remadef_user",

    profile:
        "remadef_profile",

    account:
        "remadef_account",

    remember:
        "remadef_remember_user"
};


/* ==========================================================
   PUBLIC / PRIVATE PAGES
========================================================== */

const PUBLIC_PAGES = [

    "login.html",

    "register.html",

    "forgot-password.html",

    "reset-password.html"
];


/* ==========================================================
   AUTH STATE
========================================================== */

let authState: AuthState = {

    authenticated:
        false,

    user:
        null,

    profile:
        null,

    account:
        null,

    initialized:
        false
};


/* ==========================================================
   STORAGE HELPERS
========================================================== */

function canUseStorage(): boolean {

    try {

        return (
            typeof window !== "undefined" &&
            !!window.localStorage
        );

    } catch {

        return false;
    }
}


/* ==========================================================
   SAVE JSON
========================================================== */

function saveJSON(
    key: string,
    value: any
): void {

    if (!canUseStorage()) {
        return;
    }


    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.warn(
            "REMADEF storage error:",
            error
        );
    }
}


/* ==========================================================
   READ JSON
========================================================== */

function readJSON<T = any>(
    key: string
): T | null {

    if (!canUseStorage()) {
        return null;
    }


    const value =
        localStorage.getItem(key);


    if (!value) {
        return null;
    }


    try {

        return JSON.parse(value);

    } catch {

        return null;
    }
}


/* ==========================================================
   REMOVE STORAGE
========================================================== */

function removeStorage(
    key: string
): void {

    if (!canUseStorage()) {
        return;
    }


    localStorage.removeItem(
        key
    );
}


/* ==========================================================
   CURRENT PAGE
========================================================== */

function getCurrentPage(): string {

    if (
        typeof window ===
        "undefined"
    ) {

        return "";
    }


    return (
        window.location.pathname
            .split("/")
            .pop() ||
        "home.html"
    );
}


/* ==========================================================
   CHECK PUBLIC PAGE
========================================================== */

function isPublicPage(): boolean {

    return PUBLIC_PAGES.includes(
        getCurrentPage()
    );
}


/* ==========================================================
   STORE USER
========================================================== */

function storeUser(
    user: RemadefUser | null
): void {

    if (!user) {
        return;
    }


    authState.user =
        user;


    saveJSON(
        STORAGE_KEYS.user,
        user
    );
}


/* ==========================================================
   STORE PROFILE
========================================================== */

function storeProfile(
    profile: any
): void {

    if (!profile) {
        return;
    }


    authState.profile =
        profile;


    saveJSON(
        STORAGE_KEYS.profile,
        profile
    );
}


/* ==========================================================
   STORE ACCOUNT
========================================================== */

function storeAccount(
    account: any
): void {

    if (!account) {
        return;
    }


    authState.account =
        account;


    saveJSON(
        STORAGE_KEYS.account,
        account
    );
}


/* ==========================================================
   RESTORE CACHED STATE
========================================================== */

function restoreCachedState(): void {

    authState.user =
        readJSON<RemadefUser>(
            STORAGE_KEYS.user
        );


    authState.profile =
        readJSON(
            STORAGE_KEYS.profile
        );


    authState.account =
        readJSON(
            STORAGE_KEYS.account
        );
}


/* ==========================================================
   REGISTER
========================================================== */

export async function register(
    userData: Record<string, any>
): Promise<LoginResult> {

    if (!userData) {

        throw new Error(
            "Registration data is required."
        );
    }


    try {

        const result =
            await RemadefAPI.auth.register(
                userData
            );


        if (
            result?.success === false
        ) {

            throw new Error(
                result.message ||
                "Registration failed."
            );
        }


        /*
         * Registration normally creates
         * the Appwrite account and REMADEF
         * master profile.
         *
         * We don't mark the user authenticated
         * unless login/session confirmation
         * actually occurs.
         */

        if (result.user) {

            storeUser(
                result.user
            );
        }


        if (result.profile) {

            storeProfile(
                result.profile
            );
        }


        if (
            result.accountId
        ) {

            storeAccount({
                accountId:
                    result.accountId
            });
        }


        return result as LoginResult;

    } catch (error) {

        console.error(
            "REMADEF registration error:",
            error
        );

        throw error;
    }
}


/* ==========================================================
   LOGIN
========================================================== */

export async function login(
    credentials: Record<string, any>,
    rememberUser = true
): Promise<LoginResult> {

    if (!credentials) {

        throw new Error(
            "Login credentials are required."
        );
    }


    try {

        const result =
            await RemadefAPI.auth.login(
                credentials
            );


        if (
            result?.success === false
        ) {

            throw new Error(
                result.message ||
                "Login failed."
            );
        }


        /*
         * Store returned user.
         */

        if (result.user) {

            storeUser(
                result.user
            );
        }


        /*
         * Store returned profile.
         */

        if (result.profile) {

            storeProfile(
                result.profile
            );
        }


        /*
         * Store account ID.
         */

        if (
            result.accountId
        ) {

            storeAccount({
                accountId:
                    result.accountId
            });
        }


        /*
         * Remember preference.
         */

        if (
            canUseStorage()
        ) {

            localStorage.setItem(
                STORAGE_KEYS.remember,

                rememberUser
                    ? "true"
                    : "false"
            );
        }


        /*
         * Authentication is only considered
         * successful after the backend login
         * succeeds.
         */

        authState.authenticated =
            true;


        return result as LoginResult;

    } catch (error) {

        authState.authenticated =
            false;

        console.error(
            "REMADEF login error:",
            error
        );

        throw error;
    }
}


/* ==========================================================
   VERIFY SESSION
========================================================== */

export async function verifySession():
    Promise<boolean> {

    try {

        const result =
            await RemadefAPI.auth.session();


        if (
            result?.success === false
        ) {

            authState.authenticated =
                false;

            return false;
        }


        /*
         * Backend may return the
         * authenticated user.
         */

        if (result.user) {

            storeUser(
                result.user
            );
        }


        if (result.profile) {

            storeProfile(
                result.profile
            );
        }


        authState.authenticated =
            true;


        return true;

    } catch (error) {

        console.warn(
            "REMADEF session verification failed:",
            error
        );


        /*
         * Network failure is NOT treated
         * as a confirmed logout.
         *
         * The caller can decide whether
         * to retry or redirect.
         */

        return false;
    }
}


/* ==========================================================
   GET CURRENT USER
========================================================== */

export async function getCurrentUser():
    Promise<RemadefUser | null> {

    try {

        const result =
            await RemadefAPI.auth.me();


        if (
            result?.success === false
        ) {

            return null;
        }


        if (result.user) {

            storeUser(
                result.user
            );


            return result.user;
        }


        return (
            authState.user ||
            readJSON<RemadefUser>(
                STORAGE_KEYS.user
            )
        );

    } catch {

        return (
            authState.user ||
            readJSON<RemadefUser>(
                STORAGE_KEYS.user
            )
        );
    }
}


/* ==========================================================
   GET PROFILE
========================================================== */

export async function getProfile():
    Promise<any | null> {

    try {

        const result =
            await RemadefAPI.profile.get();


        if (
            result?.success === false
        ) {

            return null;
        }


        const profile =
            result.profile ??
            result.data ??
            result;


        storeProfile(
            profile
        );


        return profile;

    } catch {

        return (
            authState.profile ||
            readJSON(
                STORAGE_KEYS.profile
            )
        );
    }
}


/* ==========================================================
   REFRESH AUTHENTICATED USER
========================================================== */

export async function refresh():
    Promise<AuthState> {

    const valid =
        await verifySession();


    if (!valid) {

        authState.authenticated =
            false;

        return authState;
    }


    await getCurrentUser();

    await getProfile();


    return authState;
}


/* ==========================================================
   IS AUTHENTICATED
========================================================== */

export function isAuthenticated():
    boolean {

    return (
        authState.authenticated
    );
}


/* ==========================================================
   GET AUTH STATE
========================================================== */

export function getAuthState():
    AuthState {

    return {
        ...authState
    };
}


/* ==========================================================
   REQUIRE AUTHENTICATION
========================================================== */

export async function requireAuth(
    redirect = "login.html"
): Promise<boolean> {

    /*
     * Always verify the real Appwrite/API
     * session instead of trusting localStorage.
     */

    const valid =
        await verifySession();


    if (valid) {

        return true;
    }


    clearLocalState();


    if (
        typeof window !==
        "undefined"
    ) {

        const current =
            getCurrentPage();


        if (
            current !==
            redirect
        ) {

            window.location.href =
                redirect;
        }
    }


    return false;
}


/* ==========================================================
   CLEAR LOCAL AUTH STATE
========================================================== */

export function clearLocalState():
    void {

    removeStorage(
        STORAGE_KEYS.user
    );

    removeStorage(
        STORAGE_KEYS.profile
    );

    removeStorage(
        STORAGE_KEYS.account
    );

    removeStorage(
        STORAGE_KEYS.remember
    );


    authState = {

        authenticated:
            false,

        user:
            null,

        profile:
            null,

        account:
            null,

        initialized:
            true
    };
}


/* ==========================================================
   LOGOUT
========================================================== */

export async function logout(
    redirect = "login.html"
): Promise<void> {

    try {

        /*
         * Ask backend/Appwrite to
         * terminate the actual session.
         */

        await RemadefAPI.auth.logout();

    } catch (error) {

        console.warn(
            "Remote logout request failed:",
            error
        );

    } finally {

        /*
         * Always remove local cached
         * authentication state.
         */

        clearLocalState();


        /*
         * Logout belongs to Settings.
         */

        if (
            typeof window !==
            "undefined"
        ) {

            window.location.href =
                redirect;
        }
    }
}


/* ==========================================================
   INITIALIZE AUTHENTICATION
========================================================== */

export async function initializeAuth():
    Promise<AuthState> {

    /*
     * Restore cached information only
     * for UI continuity.
     */

    restoreCachedState();


    /*
     * Public pages don't need an
     * immediate protected-session check.
     */

    if (
        isPublicPage()
    ) {

        authState.initialized =
            true;

        return authState;
    }


    /*
     * Private pages must verify
     * the actual session.
     */

    const valid =
        await verifySession();


    if (!valid) {

        clearLocalState();

        authState.initialized =
            true;

        return authState;
    }


    /*
     * Refresh user/profile information.
     */

    await getCurrentUser();

    await getProfile();


    authState.initialized =
        true;


    return authState;
}


/* ==========================================================
   GLOBAL PAGE GUARD
========================================================== */

export async function setupAuthGuard():
    Promise<boolean> {

    /*
     * Public pages.
     */

    if (
        isPublicPage()
    ) {

        return true;
    }


    /*
     * Private page.
     */

    const valid =
        await requireAuth();


    return valid;
}


/* ==========================================================
   REDIRECT AFTER LOGIN
========================================================== */

export function redirectAfterLogin(
    destination = "home.html"
): void {

    if (
        typeof window ===
        "undefined"
    ) {

        return;
    }


    window.location.href =
        destination;
}


/* ==========================================================
   REDIRECT AFTER REGISTRATION
========================================================== */

export function redirectAfterRegistration(
    accountId?: string
): void {

    if (
        typeof window ===
        "undefined"
    ) {

        return;
    }


    /*
     * Registration flow:
     *
     * CREATE ACCOUNT
     *       ↓
     * COMPLETE MASTER PROFILE
     */

    if (accountId) {

        window.location.href =
            `profile-completion.html?account=${encodeURIComponent(accountId)}`;

        return;
    }


    window.location.href =
        "profile-completion.html";
}


/* ==========================================================
   AUTH OBJECT
========================================================== */

const Auth = {

    register,

    login,

    logout,

    verifySession,

    getCurrentUser,

    getProfile,

    refresh,

    isAuthenticated,

    getAuthState,

    requireAuth,

    initializeAuth,

    setupAuthGuard,

    clearLocalState,

    redirectAfterLogin,

    redirectAfterRegistration
};


/* ==========================================================
   GLOBAL BROWSER ACCESS
========================================================== */

if (
    typeof window !==
    "undefined"
) {

    (
        window as any
    ).RemadefAuth =
        Auth;
}


/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default Auth;
