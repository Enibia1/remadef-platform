/* ==========================================================
   REMADEF PLATFORM
   Global State Manager
   File: src/core/state.ts
========================================================== */

export interface AppState {
    auth: {
        user: any | null;
        session: any | null;
        authenticated: boolean;
    };

    profile: {
        data: any | null;
        completion: number;
        verified: boolean;
        roles: string[];
    };

    router: {
        current: string;
        previous: string;
    };

    ui: {
        loading: boolean;
        sidebarOpen: boolean;
        theme: string;
    };

    notifications: {
        unread: number;
        items: any[];
    };

    messages: {
        conversations: any[];
        activeConversation: string | null;
        unread: number;
    };

    wallet: {
        balance: number;
        escrow: number;
        transactions: any[];
    };

    network: {
        online: boolean;
    };

    cache: Record<string, any>;
}

const state: AppState = {

    auth: {
        user: null,
        session: null,
        authenticated: false
    },

    profile: {
        data: null,
        completion: 0,
        verified: false,
        roles: []
    },

    router: {
        current: "/",
        previous: "/"
    },

    ui: {
        loading: false,
        sidebarOpen: false,
        theme: "light"
    },

    notifications: {
        unread: 0,
        items: []
    },

    messages: {
        conversations: [],
        activeConversation: null,
        unread: 0
    },

    wallet: {
        balance: 0,
        escrow: 0,
        transactions: []
    },

    network: {
        online: navigator.onLine
    },

    cache: {}
};

const listeners = new Map<string, Set<(value: any) => void>>();

/* ==========================================================
   GET STATE
========================================================== */

export function getState(path?: string): any {

    if (!path) return state;

    return path.split(".").reduce((obj: any, key: string) => obj?.[key], state);

}

/* ==========================================================
   SET STATE
========================================================== */

export function setState(path: string, value: any): void {

    const keys = path.split(".");

    const last = keys.pop()!;

    let current: any = state;

    for (const key of keys) {

        if (!(key in current)) {
            current[key] = {};
        }

        current = current[key];

    }

    current[last] = value;

    notify(path, value);

}

/* ==========================================================
   UPDATE STATE
========================================================== */

export function updateState(path: string, updater: (value: any) => any): void {

    const current = getState(path);

    setState(path, updater(current));

}

/* ==========================================================
   SUBSCRIBE
========================================================== */

export function subscribe(

    path: string,

    callback: (value: any) => void

): () => void {

    if (!listeners.has(path)) {

        listeners.set(path, new Set());

    }

    listeners.get(path)!.add(callback);

    return () => {

        listeners.get(path)?.delete(callback);

    };

}

/* ==========================================================
   NOTIFY
========================================================== */

function notify(path: string, value: any): void {

    listeners.get(path)?.forEach(callback => {

        callback(value);

    });

}

/* ==========================================================
   RESET
========================================================== */

export function resetState(): void {

    state.auth.user = null;
    state.auth.session = null;
    state.auth.authenticated = false;

    state.profile.data = null;
    state.profile.completion = 0;
    state.profile.verified = false;
    state.profile.roles = [];

    state.notifications.items = [];
    state.notifications.unread = 0;

    state.messages.conversations = [];
    state.messages.activeConversation = null;
    state.messages.unread = 0;

    state.wallet.balance = 0;
    state.wallet.escrow = 0;
    state.wallet.transactions = [];

    state.cache = {};

}
