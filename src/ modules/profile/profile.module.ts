/* ==========================================================
   REMADEF PLATFORM
   Profile Module
   File: src/modules/profile/profile.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {
    Profile,
    ProfileCompletion
} from "../../types/profile";

class ProfileModule {

    private readonly PROFILE_KEY =
        "profile.data";

    private readonly COMPLETION_KEY =
        "profile.completion";

    private readonly CACHE_KEY =
        "profile-cache";

    private loading = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        this.restore();

        this.registerEvents();

        await this.refresh();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "profile:refresh",

            () => this.refresh()

        );

        Events.on(

            "profile:update",

            (data) => this.update(data)

        );

    }

    /* ======================================================
       LOAD PROFILE
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.profile.get();

            const profile =
                response.data;

            State.set(

                this.PROFILE_KEY,

                profile

            );

            Cache.set(

                this.CACHE_KEY,

                profile

            );

            Events.emit(

                "profile:loaded",

                profile

            );

            await this.loadCompletion();

        } finally {

            this.loading = false;

        }

    }

    /* ======================================================
       PROFILE COMPLETION
    ====================================================== */

    async loadCompletion(): Promise<void> {

        const response =
            await API.profile.completion();

        const completion =
            response.data as ProfileCompletion;

        State.set(

            this.COMPLETION_KEY,

            completion

        );

        Events.emit(

            "profile:completionUpdated",

            completion

        );

    }

    /* ======================================================
       UPDATE PROFILE
    ====================================================== */

    async update(
    data: UpdateProfileRequest
)
    ): Promise<void> {

        const response =
            await API.profile.update(
                data
            );

        const profile =
            response.data;

        State.set(

            this.PROFILE_KEY,

            profile

        );

        Cache.set(

            this.CACHE_KEY,

            profile

        );

        Events.emit(

            "profile:updated",

            profile

        );

        await this.loadCompletion();

    }

    /* ======================================================
       AVATAR
    ====================================================== */

    async uploadAvatar(
        fileId: string
    ): Promise<void> {

        await API.profile.uploadAvatar(
            fileId
        );

        await this.refresh();

    }

    async removeAvatar(): Promise<void> {

        await API.profile.removeAvatar();

        await this.refresh();

    }

    /* ======================================================
       COVER PHOTO
    ====================================================== */

    async uploadCover(
        fileId: string
    ): Promise<void> {

        await API.profile.uploadCover(
            fileId
        );

        await this.refresh();

    }

    async removeCover(): Promise<void> {

        await API.profile.removeCover();

        await this.refresh();

    }

    /* ======================================================
       EDUCATION
    ====================================================== */

    async reloadEducation(): Promise<void> {

        const response =
            await API.profile.getEducation();

        State.set(

            "profile.education",

            response.data || []

        );

        Events.emit(

            "profile:educationUpdated",

            response.data || []

        );

    }

    /* ======================================================
       EXPERIENCE
    ====================================================== */

    async reloadExperience(): Promise<void> {

        const response =
            await API.profile.getExperience();

        State.set(

            "profile.experience",

            response.data || []

        );

        Events.emit(

            "profile:experienceUpdated",

            response.data || []

        );

    }

    /* ======================================================
       SKILLS
    ====================================================== */

    async reloadSkills(): Promise<void> {

        const response =
            await API.profile.getSkills();

        State.set(

            "profile.skills",

            response.data || []

        );

        Events.emit(

            "profile:skillsUpdated",

            response.data || []

        );

    }

    /* ======================================================
       CERTIFICATIONS
    ====================================================== */

    async reloadCertifications(): Promise<void> {

        const response =
            await API.profile.getCertifications();

        State.set(

            "profile.certifications",

            response.data || []

        );

        Events.emit(

            "profile:certificationsUpdated",

            response.data || []

        );

    }

    /* ======================================================
       PORTFOLIO
    ====================================================== */

    async reloadPortfolio(): Promise<void> {

        const response =
            await API.profile.getPortfolio();

        State.set(

            "profile.portfolio",

            response.data || []

        );

        Events.emit(

            "profile:portfolioUpdated",

            response.data || []

        );

    }

    /* ======================================================
       SOCIAL LINKS
    ====================================================== */

    async reloadSocialLinks(): Promise<void> {

        const response =
            await API.profile.getSocialLinks();

        State.set(

            "profile.socials",

            response.data || {}

        );

        Events.emit(

            "profile:socialsUpdated",

            response.data || {}

        );

    }
    /* ======================================================
       VERIFICATION
    ====================================================== */

    async reloadVerification(): Promise<void> {

        const response =
            await API.profile.getVerification();

        State.set(

            "profile.verification",

            response.data || null

        );

        Events.emit(

            "profile:verificationUpdated",

            response.data

        );

    }

    async submitVerification(
        data: Record<string, any>
    ): Promise<void> {

        await API.profile.submitVerification(
            data
        );

        await this.reloadVerification();

    }

    /* ======================================================
       PRIVACY
    ====================================================== */

    async reloadPrivacy(): Promise<void> {

        const response =
            await API.profile.getPrivacy();

        State.set(

            "profile.privacy",

            response.data || {}

        );

        Events.emit(

            "profile:privacyUpdated",

            response.data || {}

        );

    }

    async updatePrivacy(
        data: Record<string, any>
    ): Promise<void> {

        await API.profile.updatePrivacy(
            data
        );

        await this.reloadPrivacy();

    }

    /* ======================================================
       PREFERENCES
    ====================================================== */

    async reloadPreferences(): Promise<void> {

        const response =
            await API.profile.getPreferences();

        State.set(

            "profile.preferences",

            response.data || {}

        );

        Events.emit(

            "profile:preferencesUpdated",

            response.data || {}

        );

    }

    async updatePreferences(
        data: Record<string, any>
    ): Promise<void> {

        await API.profile.updatePreferences(
            data
        );

        await this.reloadPreferences();

    }

    /* ======================================================
       VISIBILITY
    ====================================================== */

    async updateVisibility(
        visibility: string
    ): Promise<void> {

        await API.profile.updateVisibility(
            visibility
        );

        await this.refresh();

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getProfile(): Profile | null {

        return (

            State.get(

                this.PROFILE_KEY

            ) || null

        );

    }

    getCompletion(): ProfileCompletion | null {

        return (

            State.get(

                this.COMPLETION_KEY

            ) || null

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restore(): void {

        const cached =
            Cache.get(
                this.CACHE_KEY
            );

        if (!cached) {

            return;

        }

        State.set(

            this.PROFILE_KEY,

            cached

        );

    }

}

export default new ProfileModule();
