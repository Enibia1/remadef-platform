/* ==========================================================
   REMADEF PLATFORM
   Helper Functions
   File: js/utils/helpers.ts
========================================================== */

import CONFIG from "../config";

/* ==========================================================
   UUID
========================================================== */

export function uuid(): string {

    return crypto.randomUUID();
}

/* ==========================================================
   DELAY
========================================================== */

export function sleep(
    ms: number
): Promise<void> {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

/* ==========================================================
   DEBOUNCE
========================================================== */

export function debounce<T extends (...args: any[]) => void>(

    callback: T,

    delay = CONFIG.search.debounce

) {

    let timer: number;

    return (...args: Parameters<T>) => {

        clearTimeout(timer);

        timer = window.setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/* ==========================================================
   THROTTLE
========================================================== */

export function throttle<T extends (...args: any[]) => void>(

    callback: T,

    limit = 300

) {

    let waiting = false;

    return (...args: Parameters<T>) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, limit);

    };

}

/* ==========================================================
   CLAMP
========================================================== */

export function clamp(

    value: number,

    min: number,

    max: number

): number {

    return Math.min(

        Math.max(value, min),

        max

    );

}

/* ==========================================================
   COPY
========================================================== */

export async function copy(

    text: string

): Promise<boolean> {

    try {

        await navigator.clipboard.writeText(text);

        return true;

    }

    catch {

        return false;

    }

}

/* ==========================================================
   IS MOBILE
========================================================== */

export function isMobile(): boolean {

    return window.innerWidth <=

        CONFIG.sidebar.mobileBreakpoint;

}

/* ==========================================================
   ONLINE
========================================================== */

export function isOnline(): boolean {

    return navigator.onLine;

}

/* ==========================================================
   QUERY SELECTOR
========================================================== */

export function $<T extends HTMLElement>(

    selector: string

): T | null {

    return document.querySelector(selector);

}

/* ==========================================================
   QUERY SELECTOR ALL
========================================================== */

export function $$<T extends HTMLElement>(

    selector: string

): NodeListOf<T> {

    return document.querySelectorAll(selector);

}

/* ==========================================================
   CREATE ELEMENT
========================================================== */

export function create(

    tag: string,

    className = ""

): HTMLElement {

    const el = document.createElement(tag);

    if (className)

        el.className = className;

    return el;

}

/* ==========================================================
   TOGGLE CLASS
========================================================== */

export function toggle(

    element: HTMLElement,

    className: string

): void {

    element.classList.toggle(className);

}

/* ==========================================================
   SHOW
========================================================== */

export function show(

    element: HTMLElement

): void {

    element.style.display = "";

}

/* ==========================================================
   HIDE
========================================================== */

export function hide(

    element: HTMLElement

): void {

    element.style.display = "none";

}

/* ==========================================================
   EMPTY
========================================================== */

export function empty(

    element: HTMLElement

): void {

    while (element.firstChild)

        element.removeChild(

            element.firstChild

        );

}

/* ==========================================================
   SCROLL TO TOP
========================================================== */

export function scrollTop(): void {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* ==========================================================
   EXPORT
========================================================== */

export default {

    uuid,

    sleep,

    debounce,

    throttle,

    clamp,

    copy,

    isMobile,

    isOnline,

    $,

    $$,

    create,

    toggle,

    show,

    hide,

    empty,

    scrollTop

};
