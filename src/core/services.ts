/* ==========================================================
   REMADEF PLATFORM
   Core Service Registration
   File: src/core/services.ts
========================================================== */

import Container from "./container";

import Router from "../router";
import EventBus from "./events";
import Cache from "./cache";
import State from "./state";
import Session from "./session";

import Client from "../services/client";

/* ==========================================================
   REGISTER CORE SERVICES
========================================================== */

Container.register(
    "router",
    Router
);

Container.register(
    "events",
    EventBus
);

Container.register(
    "cache",
    Cache
);

Container.register(
    "state",
    State
);

Container.register(
    "session",
    Session
);

Container.register(
    "client",
    Client
);

export default Container;
