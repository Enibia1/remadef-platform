/* ==========================================================
   REMADEF PLATFORM
   Creator Module
   File: src/modules/creator/creator.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    CreatorProfile,
    CreatorAnalytics,
    CreatorPost,
    CreatorCampaign,
    CreatorEarnings,
    CreatorVerification

} from "../../types/creator";

class CreatorModule {

    private readonly PROFILE_KEY =
        "creator.profile";

    private readonly POSTS_KEY =
        "creator.posts";

    private readonly ANALYTICS_KEY =
        "creator.analytics";

    private readonly EARNINGS_KEY =
        "creator.earnings";

    private readonly CAMPAIGNS_KEY =
        "creator.campaigns";

    private readonly CACHE_KEY =
        "creator-cache";

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

            "creator:refresh",

            () => this.refresh()

        );

    }

    /* ======================================================
       LOAD CREATOR
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.creator.profile();

            const profile =
                response.data as CreatorProfile;

            State.set(

                this.PROFILE_KEY,

                profile

            );

            Cache.set(

                this.CACHE_KEY,

                profile

            );

            Events.emit(

                "creator:loaded",

                profile

            );

            await Promise.all([

                this.loadPosts(),

                this.loadAnalytics(),

                this.loadCampaigns(),

                this.loadEarnings()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       POSTS
    ====================================================== */

    async loadPosts(): Promise<void> {

        const response =
            await API.creator.posts();

        State.set(

            this.POSTS_KEY,

            response.data ?? []

        );

        Events.emit(

            "creator:postsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       EARNINGS
    ====================================================== */

    async loadEarnings(): Promise<void> {

        const response =
            await API.creator.earnings();

        const earnings =
            response.data as CreatorEarnings;

        State.set(

            this.EARNINGS_KEY,

            earnings

        );

        Events.emit(

            "creator:earningsUpdated",

            earnings

        );

    }

    /* ======================================================
       ANALYTICS
    ====================================================== */

    async loadAnalytics(): Promise<void> {

        const response =
            await API.creator.analytics();

        const analytics =
            response.data as CreatorAnalytics;

        State.set(

            this.ANALYTICS_KEY,

            analytics

        );

        Events.emit(

            "creator:analyticsUpdated",

            analytics

        );

    }

    /* ======================================================
       CAMPAIGNS
    ====================================================== */

    async loadCampaigns(): Promise<void> {

        const response =
            await API.creator.campaigns();

        const campaigns =
            response.data as CreatorCampaign[];

        State.set(

            this.CAMPAIGNS_KEY,

            campaigns

        );

        Events.emit(

            "creator:campaignsUpdated",

            campaigns

        );

    }

    /* ======================================================
       FOLLOWERS
    ====================================================== */

    async loadFollowers(): Promise<void> {

        const response =
            await API.creator.followers();

        State.set(

            "creator.followers",

            response.data ?? []

        );

        Events.emit(

            "creator:followersUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       SUBSCRIBERS
    ====================================================== */

    async loadSubscribers(): Promise<void> {

        const response =
            await API.creator.subscribers();

        State.set(

            "creator.subscribers",

            response.data ?? []

        );

        Events.emit(

            "creator:subscribersUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       LIVE STREAMS
    ====================================================== */

    async loadLiveStreams(): Promise<void> {

        const response =
            await API.creator.liveStreams();

        State.set(

            "creator.liveStreams",

            response.data ?? []

        );

        Events.emit(

            "creator:liveStreamsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       VERIFICATION
    ====================================================== */

    async loadVerification(): Promise<void> {

        const response =
            await API.creator.verification();

        const verification =
            response.data as CreatorVerification;

        State.set(

            "creator.verification",

            verification

        );

        Events.emit(

            "creator:verificationUpdated",

            verification

        );

    }

    /* ======================================================
       MONETIZATION
    ====================================================== */

    async checkMonetizationEligibility(): Promise<void> {

        const response =
            await API.creator.monetizationEligibility();

        State.set(

            "creator.monetization",

            response.data

        );

        Events.emit(

            "creator:monetizationUpdated",

            response.data

        );

    }

    /* ======================================================
       REVENUE SHARING
    ====================================================== */

    async loadRevenueSharing(): Promise<void> {

        const response =
            await API.creator.revenueSharing();

        State.set(

            "creator.revenueSharing",

            response.data

        );

        Events.emit(

            "creator:revenueSharingUpdated",

            response.data

        );

    }

    /* ======================================================
       PERFORMANCE
    ====================================================== */

    async loadPerformanceMetrics(): Promise<void> {

        const response =
            await API.creator.performance();

        State.set(

            "creator.performance",

            response.data

        );

        Events.emit(

            "creator:performanceUpdated",

            response.data

        );

    }

    /* ======================================================
       ENGAGEMENT
    ====================================================== */

    async loadEngagementMetrics(): Promise<void> {

        const response =
            await API.creator.engagement();

        State.set(

            "creator.engagement",

            response.data

        );

        Events.emit(

            "creator:engagementUpdated",

            response.data

        );

    }

    /* ======================================================
       BRAND COLLABORATIONS
    ====================================================== */

    async loadCollaborations(): Promise<void> {

        const response =
            await API.creator.collaborations();

        State.set(

            "creator.collaborations",

            response.data ?? []

        );

        Events.emit(

            "creator:collaborationsUpdated",

            response.data ?? []

        );

    }

    async applyForCampaign(
        campaignId: string
    ): Promise<void> {

        await API.creator.applyForCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       PAYOUTS
    ====================================================== */

    async requestPayout(): Promise<void> {

        await API.creator.requestPayout();

        await this.loadEarnings();

    }

    /* ======================================================
       CONTENT INSIGHTS
    ====================================================== */

    async loadContentInsights(): Promise<void> {

        const response =
            await API.creator.contentInsights();

        State.set(

            "creator.contentInsights",

            response.data ?? []

        );

        Events.emit(

            "creator:contentInsightsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getProfile(): CreatorProfile | null {

        return State.get(
            this.PROFILE_KEY
        ) || null;

    }

    getPosts(): CreatorPost[] {

        return State.get(
            this.POSTS_KEY
        ) || [];

    }

    getAnalytics(): CreatorAnalytics | null {

        return State.get(
            this.ANALYTICS_KEY
        ) || null;

    }

    getEarnings(): CreatorEarnings | null {

        return State.get(
            this.EARNINGS_KEY
        ) || null;

    }

    getCampaigns(): CreatorCampaign[] {

        return State.get(
            this.CAMPAIGNS_KEY
        ) || [];

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restore(): void {

        const cached = Cache.get(
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

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(
            this.PROFILE_KEY
        );

        State.remove(
            this.POSTS_KEY
        );

        State.remove(
            this.ANALYTICS_KEY
        );

        State.remove(
            this.EARNINGS_KEY
        );

        State.remove(
            this.CAMPAIGNS_KEY
        );

        Cache.remove(
            this.CACHE_KEY
        );

        Events.emit(
            "creator:cleared"
        );

    }

}

export default new CreatorModule();
