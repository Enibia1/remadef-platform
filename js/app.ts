/* ==========================================================
   REMADEF PLATFORM
   GLOBAL APPLICATION BOOTSTRAP
   File: js/app.ts

   RESPONSIBILITIES
   ----------------------------------------------------------
   • Start the REMADEF frontend
   • Initialize Appwrite
   • Initialize authentication
   • Protect private pages
   • Expose global application state
   • Initialize global UI systems
   • Dispatch application-ready event

   IMPORTANT
   ----------------------------------------------------------
   app.ts is the application orchestrator.

   It should NOT contain:
   • Page-specific UI logic
   • Messaging logic
   • Wallet logic
   • Feed logic
   • Profile form logic
   • Marketplace logic

   Those belong to their own modules.
========================================================== */

import CONFIG from "./config";
import Auth from "./auth";


/* ==========================================================
   TYPES
========================================================== */

interface AppState {

    initialized: boolean;

    authenticated: boolean;

    currentPage: string;

    user: any | null;

    profile: any | null;
}


/* ==========================================================
   APPLICATION STATE
========================================================== */

const appState: AppState = {

    initialized: false,

    authenticated: false,

    currentPage: "",

    user: null,

    profile: null

};


/* ==========================================================
   CURRENT PAGE
========================================================== */

function getCurrentPage(): string {

    if (
        typeof window === "undefined"
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
   DETECT PAGE
========================================================== */

function detectPage(): void {

    appState.currentPage =
        getCurrentPage();
}


/* ==========================================================
   APPWRITE INITIALIZATION
========================================================== */

async function initializeAppwrite(): Promise<void> {

    /*
     * Appwrite is expected to be initialized
     * by the global Appwrite bootstrap module
     * or by the page's Appwrite initialization.
     *
     * We intentionally don't create another
     * Appwrite client here.
     */

    if (
        typeof window !== "undefined" &&
        !(window as any).appwrite
    ) {

        console.warn(
            "REMADEF: Appwrite client is not available yet."
        );

        return;
    }

}


/* ==========================================================
   AUTHENTICATION INITIALIZATION
========================================================== */

async function initializeAuthentication(): Promise<boolean> {

    try {

        const state =
            await Auth.initializeAuth();

        appState.authenticated =
            state.authenticated;

        appState.user =
            state.user;

        appState.profile =
            state.profile;

        return state.authenticated;

    } catch (error) {

        console.error(
            "REMADEF authentication initialization failed:",
            error
        );

        appState.authenticated =
            false;

        return false;
    }
}


/* ==========================================================
   PRIVATE PAGE CHECK
========================================================== */

async function protectPrivatePage(): Promise<boolean> {

    const publicPages = [

        "login.html",

        "register.html",

        "forgot-password.html",

        "reset-password.html"

    ];

    const currentPage =
        getCurrentPage();

    /*
     * Public pages don't require
     * authentication.
     */

    if (
        publicPages.includes(
            currentPage
        )
    ) {

        return true;
    }

    /*
     * All other pages are protected.
     */

    return await Auth.requireAuth(
        "login.html"
    );
}


/* ==========================================================
   APPLICATION STATE UPDATE
========================================================== */

function synchronizeAuthState(): void {

    const state =
        Auth.getAuthState();

    appState.authenticated =
        state.authenticated;

    appState.user =
        state.user;

    appState.profile =
        state.profile;
}


/* ==========================================================
   GLOBAL ERROR HANDLER
========================================================== */

function setupGlobalErrorHandling(): void {

    if (
        typeof window === "undefined"
    ) {

        return;
    }

    window.addEventListener(
        "error",
        (event) => {

            if (
                CONFIG.app.debug
            ) {

                console.error(
                    "REMADEF Global Error:",
                    event.error
                );
            }

        }
    );


    window.addEventListener(
        "unhandledrejection",
        (event) => {

            if (
                CONFIG.app.debug
            ) {

                console.error(
                    "REMADEF Unhandled Promise:",
                    event.reason
                );
            }

        }
    );
}


/* ==========================================================
   APPLICATION READY EVENT
========================================================== */

function dispatchApplicationReady(): void {

    if (
        typeof window === "undefined"
    ) {

        return;
    }

    window.dispatchEvent(

        new CustomEvent(
            "remadef:ready",
            {
                detail: {
                    state:
                        {
                            ...appState
                        }
                }
            }
        )

    );
}


/* ==========================================================
   GLOBAL AUTH EVENTS
========================================================== */

function setupAuthEvents(): void {

    if (
        typeof window === "undefined"
    ) {

        return;
    }

    window.addEventListener(

        "remadef:auth-changed",

        () => {

            synchronizeAuthState();

        }

    );

}


/* ==========================================================
   APPLICATION INITIALIZATION
========================================================== */

async function initializeApp(): Promise<void> {

    if (
        appState.initialized
    ) {

        return;
    }

    try {

        /*
         * 1.
         * Detect current page.
         */

        detectPage();


        /*
         * 2.
         * Global error handling.
         */

        setupGlobalErrorHandling();


        /*
         * 3.
         * Initialize Appwrite.
         */

        await initializeAppwrite();


        /*
         * 4.
         * Initialize authentication.
         */

        await initializeAuthentication();


        /*
         * 5.
         * Protect private pages.
         */

        const authorized =
            await protectPrivatePage();


        /*
         * If private page is not
         * authorized, Auth.requireAuth()
         * handles the redirect.
         */

        if (
            !authorized &&
            ![
                "login.html",
                "register.html",
                "forgot-password.html",
                "reset-password.html"
            ].includes(
                appState.currentPage
            )
        ) {

            return;
        }


        /*
         * 6.
         * Synchronize state.
         */

        synchronizeAuthState();


        /*
         * 7.
         * Authentication event system.
         */

        setupAuthEvents();


        /*
         * 8.
         * Mark application ready.
         */

        appState.initialized =
            true;


        /*
         * 9.
         * Notify modules.
         */

        dispatchApplicationReady();


        if (
            CONFIG.app.debug
        ) {

            console.log(
                "REMADEF Platform initialized.",
                appState
            );

        }

    } catch (error) {

        console.error(
            "REMADEF application initialization failed:",
            error
        );

        appState.initialized =
            true;
    }
}


/* ==========================================================
   GET APPLICATION STATE
========================================================== */

export function getAppState(): AppState {

    return {
        ...appState
    };
}


/* ==========================================================
   IS APP INITIALIZED
========================================================== */

export function isAppInitialized(): boolean {

    return appState.initialized;
}


/* ==========================================================
   START APPLICATION
========================================================== */

export async function startApp(): Promise<void> {

    await initializeApp();

}


/* ==========================================================
   GLOBAL BROWSER ACCESS
========================================================== */

if (
    typeof window !== "undefined"
) {

    (
        window as any
    ).RemadefApp = {

        start:
            startApp,

        state:
            getAppState,

        initialized:
            isAppInitialized

    };

}


/* ==========================================================
   AUTOMATIC START
========================================================== */

if (
    typeof document !== "undefined"
) {

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(

            "DOMContentLoaded",

            () => {

                startApp();

            },

            {
                once: true
            }

        );

    } else {

        startApp();

    }

}


/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default {

    start:
        startApp,

    state:
        getAppState,

    initialized:
        isAppInitialized

};
