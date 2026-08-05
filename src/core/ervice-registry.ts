/* ==========================================================
   REMADEF PLATFORM
   Core Service Registry
   File: src/core/service-registry.ts

   Registers all platform-wide singleton services into the
   Dependency Injection Container.
========================================================== */

import Container from "./container";

/* ==========================================================
   CORE
========================================================== */

import Router from "../router";
import EventBus from "./events";
import Network from "./network";
import Cache from "./cache";
import State from "./state";
import Session from "./session";

/* ==========================================================
   UTILITIES
========================================================== */

import Logger from "../utils/logger";
import Storage from "../utils/storage";

/* ==========================================================
   SERVICES
========================================================== */

import Client from "../services/client";

/* ==========================================================
   SERVICE IDENTIFIERS
========================================================== */

export const SERVICES = {

    ROUTER: "router",

    CLIENT: "client",

    SESSION: "session",

    NETWORK: "network",

    CACHE: "cache",

    STORAGE: "storage",

    LOGGER: "logger",

    STATE: "state",

    EVENTS: "events"

} as const;

/* ==========================================================
   REGISTER
========================================================== */

export function registerCoreServices(): void {

    Container.register(
        SERVICES.ROUTER,
        Router
    );

    Container.register(
        SERVICES.CLIENT,
        Client
    );

    Container.register(
        SERVICES.SESSION,
        Session
    );

    Container.register(
        SERVICES.NETWORK,
        Network
    );

    Container.register(
        SERVICES.CACHE,
        Cache
    );

    Container.register(
        SERVICES.STORAGE,
        Storage
    );

    Container.register(
        SERVICES.LOGGER,
        Logger
    );

    Container.register(
        SERVICES.STATE,
        State
    );

    Container.register(
        SERVICES.EVENTS,
        EventBus
    );

}

/* ==========================================================
   EXPORTS
========================================================== */

export default registerCoreServices;
