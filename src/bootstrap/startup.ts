/* ==========================================================
   REMADEF PLATFORM
   Startup Lifecycle
   File: src/bootstrap/startup.ts
========================================================== */

import Lifecycle from "../core/lifecycle";

import Container from "../core/container";

import Router from "../router";

import ModuleManager from "../modules/manager";

import Registry from "../modules";

export async function startup(): Promise<void> {

    Lifecycle.onStart(async () => {

        Router.init();

    });

    Lifecycle.onStart(async () => {

        await ModuleManager.initialize({

            app: null,

            router: Router,

            services: Container

        });

    });

    Lifecycle.onShutdown(async () => {

        await ModuleManager.destroy();

    });

    await Lifecycle.start();

}

export default startup;
