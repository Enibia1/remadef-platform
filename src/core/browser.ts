/* ==========================================================
   REMADEF PLATFORM
   Browser Manager
   File: src/core/browser.ts
========================================================== */

import EventBus from "./events";

export interface BrowserInfo {
    online: boolean;
    language: string;
    languages: readonly string[];
    cookieEnabled: boolean;
    touch: boolean;
    mobile: boolean;
    darkMode: boolean;
    viewport: {
        width: number;
        height: number;
    };
}

class BrowserManager {

    /* ==========================================================
       INITIALIZE
    ========================================================== */

    init(): void {

        window.addEventListener("online", () => {
            EventBus.emit("browser:online");
        });

        window.addEventListener("offline", () => {
            EventBus.emit("browser:offline");
        });

        window.addEventListener("resize", () => {
            EventBus.emit("browser:resize", this.viewport());
        });

        const media = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        media.addEventListener("change", () => {
            EventBus.emit(
                "browser:theme",
                media.matches ? "dark" : "light"
            );
        });

        document.addEventListener(
            "visibilitychange",
            () => {

                EventBus.emit(
                    document.hidden
                        ? "browser:hidden"
                        : "browser:visible"
                );

            }
        );

    }

    /* ==========================================================
       INFO
    ========================================================== */

    info(): BrowserInfo {

        return {
            online: navigator.onLine,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            touch: this.isTouch(),
            mobile: this.isMobile(),
            darkMode: this.prefersDarkMode(),
            viewport: this.viewport()
        };

    }

    /* ==========================================================
       VIEWPORT
    ========================================================== */

    viewport() {

        return {
            width: window.innerWidth,
            height: window.innerHeight
        };

    }

    /* ==========================================================
       MOBILE
    ========================================================== */

    isMobile(): boolean {

        return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
            navigator.userAgent
        );

    }

    /* ==========================================================
       TOUCH
    ========================================================== */

    isTouch(): boolean {

        return (
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0
        );

    }

    /* ==========================================================
       DARK MODE
    ========================================================== */

    prefersDarkMode(): boolean {

        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    }

    /* ==========================================================
       ONLINE
    ========================================================== */

    isOnline(): boolean {

        return navigator.onLine;

    }

    /* ==========================================================
       LANGUAGE
    ========================================================== */

    language(): string {

        return navigator.language;

    }

    /* ==========================================================
       USER AGENT
    ========================================================== */

    userAgent(): string {

        return navigator.userAgent;

    }

    /* ==========================================================
       COPY
    ========================================================== */

    async copy(text: string): Promise<boolean> {

        try {

            await navigator.clipboard.writeText(text);

            return true;

        } catch {

            return false;

        }

    }

    /* ==========================================================
       SHARE
    ========================================================== */

    async share(data: ShareData): Promise<boolean> {

        if (!navigator.share) {

            return false;

        }

        try {

            await navigator.share(data);

            return true;

        } catch {

            return false;

        }

    }

}

export default new BrowserManager();
