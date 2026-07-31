/* ==========================================================
   REMADEF PLATFORM
   Global Utilities
   File: js/utils.ts

   Purpose:
   Shared helper functions used throughout REMADEF.

   Rules:
   - No module-specific business logic.
   - No Appwrite calls.
   - No direct page-specific logic.
   - Keep functions small and reusable.
========================================================== */

import CONFIG from "./config";
import {
    APP,
    STORAGE_KEYS,
    TRANSACTION_STATUS
} from "./constants";


/* ==========================================================
   TYPE HELPERS
========================================================== */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;


/* ==========================================================
   DOM HELPERS
========================================================== */

/**
 * Safely select a single DOM element.
 */
export function $(selector: string): HTMLElement | null {
    return document.querySelector(selector);
}


/**
 * Safely select multiple DOM elements.
 */
export function $$(selector: string): HTMLElement[] {
    return Array.from(document.querySelectorAll(selector));
}


/**
 * Create a DOM element.
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    text?: string
): HTMLElementTagNameMap[K] {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}


/* ==========================================================
   DEVICE / RESPONSIVE HELPERS
========================================================== */

/**
 * Check whether the current device is mobile-sized.
 */
export function isMobile(): boolean {
    return window.innerWidth <= CONFIG.sidebar.mobileBreakpoint;
}


/**
 * Check whether the current device is tablet-sized.
 */
export function isTablet(): boolean {
    return (
        window.innerWidth > CONFIG.sidebar.mobileBreakpoint &&
        window.innerWidth <= 1024
    );
}


/**
 * Check whether the current device is desktop-sized.
 */
export function isDesktop(): boolean {
    return window.innerWidth > 1024;
}


/* ==========================================================
   DEBOUNCE / THROTTLE
========================================================== */

/**
 * Prevent a function from running too frequently.
 */
export function debounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {

    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {

        clearTimeout(timer);

        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}


/**
 * Limit how frequently a function executes.
 */
export function throttle<T extends (...args: any[]) => void>(
    callback: T,
    limit: number
): (...args: Parameters<T>) => void {

    let waiting = false;

    return (...args: Parameters<T>) => {

        if (waiting) {
            return;
        }

        callback(...args);

        waiting = true;

        setTimeout(() => {
            waiting = false;
        }, limit);
    };
}


/* ==========================================================
   FORMATTERS
========================================================== */

/**
 * Format Nigerian currency.
 */
export function formatCurrency(
    amount: number,
    currency = CONFIG.wallet.currency
): string {

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        minimumFractionDigits: CONFIG.wallet.decimals,
        maximumFractionDigits: CONFIG.wallet.decimals
    }).format(amount);
}


/**
 * Format a number.
 */
export function formatNumber(value: number): string {

    return new Intl.NumberFormat("en-NG").format(value);
}


/**
 * Format date.
 */
export function formatDate(
    value: string | number | Date,
    options?: Intl.DateTimeFormatOptions
): string {

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        CONFIG.app.locale,
        options ?? {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    ).format(date);
}


/**
 * Format date and time.
 */
export function formatDateTime(
    value: string | number | Date
): string {

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        CONFIG.app.locale,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(date);
}


/**
 * Convert bytes into readable size.
 */
export function formatFileSize(bytes: number): string {

    if (bytes <= 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return `${(
        bytes / Math.pow(1024, index)
    ).toFixed(2)} ${units[index]}`;
}


/* ==========================================================
   STRING HELPERS
========================================================== */

/**
 * Capitalize first character.
 */
export function capitalize(value: string): string {

    if (!value) {
        return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}


/**
 * Convert text to title case.
 */
export function titleCase(value: string): string {

    return value
        .toLowerCase()
        .split(" ")
        .map(word => capitalize(word))
        .join(" ");
}


/**
 * Generate initials.
 */
export function getInitials(
    name: string,
    maxInitials = 2
): string {

    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, maxInitials)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}


/**
 * Truncate long text.
 */
export function truncate(
    value: string,
    maxLength: number
): string {

    if (value.length <= maxLength) {
        return value;
    }

    return value.slice(0, maxLength).trimEnd() + "…";
}


/* ==========================================================
   VALIDATION
========================================================== */

/**
 * Validate email address.
 */
export function isValidEmail(email: string): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
    );
}


/**
 * Validate Nigerian phone number.
 */
export function isValidNigerianPhone(
    phone: string
): boolean {

    const normalized = phone.replace(/\s+/g, "");

    return /^(\+234|0)[789][01]\d{8}$/.test(
        normalized
    );
}


/**
 * Check password strength.
 */
export function passwordStrength(
    password: string
): "weak" | "medium" | "strong" {

    if (password.length < 8) {
        return "weak";
    }

    let score = 0;

    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
        return "medium";
    }

    return "strong";
}


/* ==========================================================
   ID GENERATION
========================================================== */

/**
 * Generate a client-side unique identifier.
 */
export function generateId(
    prefix = "remadef"
): string {

    if (
        typeof crypto !== "undefined" &&
        "randomUUID" in crypto
    ) {
        return `${prefix}_${crypto.randomUUID()}`;
    }

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 10)}`;
}


/* ==========================================================
   URL HELPERS
========================================================== */

/**
 * Safely navigate to a page.
 */
export function navigate(
    path: string
): void {

    window.location.href = path;
}


/**
 * Get query parameter.
 */
export function getQueryParam(
    name: string
): string | null {

    return new URLSearchParams(
        window.location.search
    ).get(name);
}


/**
 * Build query string.
 */
export function buildQuery(
    params: Record<string, string | number | boolean | null | undefined>
): string {

    const search = new URLSearchParams();

    Object.entries(params).forEach(
        ([key, value]) => {

            if (
                value !== null &&
                value !== undefined
            ) {
                search.set(key, String(value));
            }
        }
    );

    const result = search.toString();

    return result ? `?${result}` : "";
}


/* ==========================================================
   STORAGE SAFETY
========================================================== */

/**
 * Safely parse JSON.
 */
export function safeJsonParse<T>(
    value: string | null,
    fallback: T
): T {

    if (!value) {
        return fallback;
    }

    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}


/* ==========================================================
   ERROR HANDLING
========================================================== */

/**
 * Convert unknown errors to readable messages.
 */
export function getErrorMessage(
    error: unknown
): string {

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    return "Something went wrong. Please try again.";
}


/* ==========================================================
   UI FEEDBACK
========================================================== */

/**
 * Basic notification/toast.
 *
 * This remains deliberately lightweight.
 * The full notification component will live separately.
 */
export function showToast(
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    duration = 3000
): void {

    const existing = document.querySelector(
        ".remadef-toast"
    );

    if (existing) {
        existing.remove();
    }

    const toast = createElement(
        "div",
        `remadef-toast remadef-toast-${type}`,
        message
    );

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 250);

    }, duration);
}


/* ==========================================================
   LOADING STATE
========================================================== */

/**
 * Set loading state on an element.
 */
export function setLoading(
    element: HTMLElement | null,
    loading: boolean
): void {

    if (!element) {
        return;
    }

    element.classList.toggle(
        "is-loading",
        loading
    );

    if (
        element instanceof HTMLButtonElement
    ) {
        element.disabled = loading;
    }

    element.setAttribute(
        "aria-busy",
        String(loading)
    );
}


/* ==========================================================
   SCROLL HELPERS
========================================================== */

/**
 * Scroll smoothly to top.
 */
export function scrollToTop(): void {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/**
 * Check whether user is near bottom of page.
 */
export function isNearPageBottom(
    distance = 300
): boolean {

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight =
        document.documentElement.scrollHeight;

    return (
        scrollTop + viewportHeight >=
        documentHeight - distance
    );
}


/* ==========================================================
   FILE VALIDATION
========================================================== */

/**
 * Validate uploaded file size.
 */
export function isValidFileSize(
    file: File,
    maxSize: number
): boolean {

    return file.size <= maxSize;
}


/**
 * Validate uploaded file type.
 */
export function isValidFileType(
    file: File,
    allowedTypes: readonly string[]
): boolean {

    return allowedTypes.includes(file.type);
}


/* ==========================================================
   SAFE JSON RESPONSE
========================================================== */

/**
 * Extract useful data from an API response.
 */
export async function parseResponse<T>(
    response: Response
): Promise<T> {

    const contentType =
        response.headers.get("content-type") || "";

    if (
        contentType.includes("application/json")
    ) {
        return await response.json() as T;
    }

    return await response.text() as T;
}


/* ==========================================================
   DEVELOPMENT LOGGING
========================================================== */

export function log(
    ...args: unknown[]
): void {

    if (CONFIG.app.debug) {
        console.log(
            `[${APP.SHORT_NAME}]`,
            ...args
        );
    }
}


export function warn(
    ...args: unknown[]
): void {

    if (CONFIG.app.debug) {
        console.warn(
            `[${APP.SHORT_NAME}]`,
            ...args
        );
    }
}


/* ==========================================================
   EXPORT DEFAULT UTILITIES
========================================================== */

export default {
    $,
    $$,
    createElement,

    isMobile,
    isTablet,
    isDesktop,

    debounce,
    throttle,

    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime,
    formatFileSize,

    capitalize,
    titleCase,
    getInitials,
    truncate,

    isValidEmail,
    isValidNigerianPhone,
    passwordStrength,

    generateId,

    navigate,
    getQueryParam,
    buildQuery,

    safeJsonParse,
    getErrorMessage,

    showToast,
    setLoading,

    scrollToTop,
    isNearPageBottom,

    isValidFileSize,
    isValidFileType,

    parseResponse,

    log,
    warn
};
