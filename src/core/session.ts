/* ==========================================================
   REMADEF PLATFORM
   Core Session Manager
   File: src/core/session.ts
========================================================== */

import Storage from "./storage";
import EventBus from "./events";
import { getState, setState, resetState } from "./state";
import Auth from "../config/auth";
import Appwrite from "../config/appwrite";

export interface SessionData {
    token: string;
    refreshToken?: string;
    userId: string;
    expiresAt: number;
    lastActivity: number;
}

class SessionManager {

    private refreshTimer: number | null = null;
    private inactivityTimer: number | null = null;

    private readonly SESSION_KEY = "auth.session";
    private readonly ACTIVITY_EVENTS = [
        "click",
        "keydown",
        "mousemove",
        "touchstart",
        "scroll"
    ];

    /* ==========================================================
       INITIALIZE
    ========================================================== */

    async init(): Promise<void> {

        this.restore();

        this.bindActivityListeners();

        this.bindStorageSync();

    }

    /* ==========================================================
       RESTORE SESSION
    ========================================================== */

    private restore(): void {

        const session = Storage.get<SessionData>(this.SESSION_KEY);

        if (!session) return;

        if (Date.now() >= session.expiresAt) {

            this.logout();

            return;

        }

        setState("auth.session", session);
        setState("auth.authenticated", true);

        this.scheduleRefresh(session);
        this.scheduleInactivityTimeout();

    }

    /* ==========================================================
       CREATE SESSION
    ========================================================== */

    create(session: SessionData): void {

        Storage.set(
            this.SESSION_KEY,
            session,
            session.expiresAt - Date.now()
        );

        setState("auth.session", session);
        setState("auth.authenticated", true);

        this.scheduleRefresh(session);
        this.scheduleInactivityTimeout();

        EventBus.emit("session:created", session);

    }

    /* ==========================================================
       GET SESSION
    ========================================================== */

    get(): SessionData | null {

        return getState("auth.session");

    }

    /* ==========================================================
       IS AUTHENTICATED
    ========================================================== */

    isAuthenticated(): boolean {

        return getState("auth.authenticated") === true;

    }

    /* ==========================================================
       REFRESH SESSION
    ========================================================== */

    async refresh(): Promise<boolean> {

        const session = this.get();

        if (!session?.refreshToken) {
            return false;
        }

        try {

            // TODO:
            // Replace with Appwrite Account updateSession()
            // or your backend refresh endpoint.

            EventBus.emit("session:refresh");

            return true;

        } catch {

            this.logout();

            return false;

        }

    }

    /* ==========================================================
       LOGOUT
    ========================================================== */

    async logout(): Promise<void> {

        this.clearTimers();

        Storage.remove(this.SESSION_KEY);

        resetState();

        try {

            // TODO:
            // await Appwrite.account.deleteSession("current");

        } catch {}

        EventBus.emit("session:logout");

    }

    /* ==========================================================
       UPDATE ACTIVITY
    ========================================================== */

    touch(): void {

        const session = this.get();

        if (!session) return;

        session.lastActivity = Date.now();

        Storage.set(
            this.SESSION_KEY,
            session,
            session.expiresAt - Date.now()
        );

        this.scheduleInactivityTimeout();

    }

    /* ==========================================================
       REFRESH TIMER
    ========================================================== */

    private scheduleRefresh(
        session: SessionData
    ): void {

        if (this.refreshTimer) {

            clearTimeout(this.refreshTimer);

        }

        const refreshIn =
            Math.max(
                session.expiresAt -
                Date.now() -
                (5 * 60 * 1000),
                0
            );

        this.refreshTimer =
            window.setTimeout(() => {

                this.refresh();

            }, refreshIn);

    }

    /* ==========================================================
       INACTIVITY TIMER
    ========================================================== */

    private scheduleInactivityTimeout(): void {

        if (this.inactivityTimer) {

            clearTimeout(this.inactivityTimer);

        }

        this.inactivityTimer =
            window.setTimeout(() => {

                this.logout();

            }, 30 * 60 * 1000);

    }

    /* ==========================================================
       USER ACTIVITY
    ========================================================== */

    private bindActivityListeners(): void {

        this.ACTIVITY_EVENTS.forEach(event => {

            window.addEventListener(
                event,
                () => this.touch(),
                {
                    passive: true
                }
            );

        });

    }

    /* ==========================================================
       MULTI TAB SYNC
    ========================================================== */

    private bindStorageSync(): void {

        window.addEventListener(
            "storage",
            (event) => {

                if (
                    event.key !==
                    "remadef:auth.session"
                ) {
                    return;
                }

                if (!event.newValue) {

                    this.logout();

                }

            }
        );

    }

    /* ==========================================================
       CLEAR TIMERS
    ========================================================== */

    private clearTimers(): void {

        if (this.refreshTimer) {

            clearTimeout(this.refreshTimer);

            this.refreshTimer = null;

        }

        if (this.inactivityTimer) {

            clearTimeout(this.inactivityTimer);

            this.inactivityTimer = null;

        }

    }

}

export default new SessionManager();
