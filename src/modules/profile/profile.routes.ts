/* ==========================================================
   REMADEF PLATFORM
   Profile Routes
   File: src/modules/profile/profile.routes.ts
========================================================== */

import Router from "../../core/router";

import ROUTES from "../../config/routes";

import ProfileController from "./profile.controller";

class ProfileRoutes {

    /* ======================================================
       REGISTER ROUTES
    ====================================================== */

    register(): void {

        Router.register({

            path: ROUTES.PROFILE,

            name: "profile",

            protected: true,

            title: "My Profile",

            onEnter: async () => {

                await ProfileController.initialize();

            },

            onLeave: () => {

                ProfileController.destroy();

            }

        });

        Router.register({

            path: ROUTES.EDIT_PROFILE,

            name: "edit-profile",

            protected: true,

            title: "Edit Profile",

            onEnter: async () => {

                await ProfileController.initialize();

            },

            onLeave: () => {

                ProfileController.destroy();

            }

        });

    }

}

export default new ProfileRoutes();
