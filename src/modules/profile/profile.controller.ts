/* ==========================================================
   REMADEF PLATFORM
   Profile Controller
   File: src/modules/profile/profile.controller.ts
========================================================== */

import ProfileModule from "./profile.module";
import ProfileView from "./profile-view";
import Events from "../../core/events";

class ProfileController {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.bindUI();

        await ProfileModule.initialize();

        ProfileView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindUI(): void {

        /* Refresh */

        document

            .querySelector("[data-profile-refresh]")

            ?.addEventListener(

                "click",

                () => {

                    ProfileModule.refresh();

                }

            );

        /* Edit Profile */

        document

            .querySelector("[data-profile-edit]")

            ?.addEventListener(

                "click",

                () => {

                    Events.emit(

                        "profile:edit"

                    );

                }

            );

        /* Avatar Upload */

        document

            .querySelector<HTMLInputElement>(
                "[data-profile-avatar]"
            )

            ?.addEventListener(

                "change",

                async event => {

                    const input =
                        event.target as HTMLInputElement;

                    const file =
                        input.files?.[0];

                    if (!file) {

                        return;

                    }

                    /*
                     * Upload service placeholder.
                     * Replace with UploadModule later.
                     */

                    const fileId = file.name;

                    await ProfileModule.uploadAvatar(
                        fileId
                    );

                }

            );

        /* Cover Upload */

        document

            .querySelector<HTMLInputElement>(
                "[data-profile-cover]"
            )

            ?.addEventListener(

                "change",

                async event => {

                    const input =
                        event.target as HTMLInputElement;

                    const file =
                        input.files?.[0];

                    if (!file) {

                        return;

                    }

                    const fileId =
                        file.name;

                    await ProfileModule.uploadCover(
                        fileId
                    );

                }

            );

        /* Visibility */

        document

            .querySelector<HTMLSelectElement>(
                "[data-profile-visibility]"
            )

            ?.addEventListener(

                "change",

                event => {

                    const value = (

                        event.target as HTMLSelectElement

                    ).value;

                    ProfileModule.updateVisibility(
                        value
                    );

                }

            );

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        this.initialized = false;

    }

}

export default new ProfileController();
