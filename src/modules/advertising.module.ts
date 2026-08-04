/* ==========================================================
   REMADEF PLATFORM
   Advertising Module
   File: src/modules/advertising/advertising.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    AdvertisingCampaign,
    AdvertisingAnalytics,
    Advertisement,
    AdPlacement,
    AdInvoice,
    CreatorRevenue

} from "../../types/advertising";

class AdvertisingModule {

    private readonly CAMPAIGNS_KEY =
        "advertising.campaigns";

    private readonly ADS_KEY =
        "advertising.ads";

    private readonly ANALYTICS_KEY =
        "advertising.analytics";

    private readonly PLACEMENTS_KEY =
        "advertising.placements";

    private readonly INVOICES_KEY =
        "advertising.invoices";

    private readonly REVENUE_KEY =
        "advertising.creatorRevenue";

    private readonly CACHE_KEY =
        "advertising-cache";

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

            "advertising:refresh",

            () => this.refresh()

        );

    }

    /* ======================================================
       REFRESH
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            await Promise.all([

                this.loadCampaigns(),

                this.loadAdvertisements(),

                this.loadPlacements(),

                this.loadAnalytics(),

                this.loadInvoices(),

                this.loadCreatorRevenue()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       CAMPAIGNS
    ====================================================== */

    async loadCampaigns(): Promise<void> {

        const response =
            await API.advertising.campaigns();

        const campaigns =
            response.data as AdvertisingCampaign[];

        State.set(

            this.CAMPAIGNS_KEY,

            campaigns

        );

        Cache.set(

            this.CACHE_KEY,

            campaigns

        );

        Events.emit(

            "advertising:campaignsUpdated",

            campaigns

        );

    }

    /* ======================================================
       ADVERTISEMENTS
    ====================================================== */

    async loadAdvertisements(): Promise<void> {

        const response =
            await API.advertising.advertisements();

        const ads =
            response.data as Advertisement[];

        State.set(

            this.ADS_KEY,

            ads

        );

        Events.emit(

            "advertising:adsUpdated",

            ads

        );

    }

    /* ======================================================
       PLACEMENTS
    ====================================================== */

    async loadPlacements(): Promise<void> {

        const response =
            await API.advertising.placements();

        const placements =
            response.data as AdPlacement[];

        State.set(

            this.PLACEMENTS_KEY,

            placements

        );

        Events.emit(

            "advertising:placementsUpdated",

            placements

        );

    }

    /* ======================================================
       ANALYTICS
    ====================================================== */

    async loadAnalytics(): Promise<void> {

        const response =
            await API.advertising.analytics();

        const analytics =
            response.data as AdvertisingAnalytics;

        State.set(

            this.ANALYTICS_KEY,

            analytics

        );

        Events.emit(

            "advertising:analyticsUpdated",

            analytics

        );

    }

    /* ======================================================
       IMPRESSION TRACKING
    ====================================================== */

    async recordImpression(
        advertisementId: string,
        placementId: string
    ): Promise<void> {

        await API.advertising.recordImpression(

            advertisementId,

            placementId

        );

    }

    /* ======================================================
       CLICK TRACKING
    ====================================================== */

    async recordClick(
        advertisementId: string,
        placementId: string
    ): Promise<void> {

        await API.advertising.recordClick(

            advertisementId,

            placementId

        );

    }

    /* ======================================================
       CONVERSION TRACKING
    ====================================================== */

    async recordConversion(
        advertisementId: string,
        placementId: string,
        value?: number
    ): Promise<void> {

        await API.advertising.recordConversion(

            advertisementId,

            placementId,

            value

        );

    }

    /* ======================================================
       INVOICES
    ====================================================== */

    async loadInvoices(): Promise<void> {

        const response =
            await API.advertising.invoices();

        const invoices =
            response.data as AdInvoice[];

        State.set(

            this.INVOICES_KEY,

            invoices

        );

        Events.emit(

            "advertising:invoicesUpdated",

            invoices

        );

    }

    /* ======================================================
       CREATOR REVENUE
    ====================================================== */

    async loadCreatorRevenue(): Promise<void> {

        const response =
            await API.advertising.creatorRevenue();

        const revenue =
            response.data as CreatorRevenue;

        State.set(

            this.REVENUE_KEY,

            revenue

        );

        Events.emit(

            "advertising:creatorRevenueUpdated",

            revenue

        );

    }

    /* ======================================================
       CREATE CAMPAIGN
    ====================================================== */

    async createCampaign(
        campaign: AdvertisingCampaign
    ): Promise<void> {

        await API.advertising.createCampaign(
            campaign
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       APPROVE CAMPAIGN
    ====================================================== */

    async approveCampaign(
        campaignId: string
    ): Promise<void> {

        await API.advertising.approveCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       PAUSE CAMPAIGN
    ====================================================== */

    async pauseCampaign(
        campaignId: string
    ): Promise<void> {

        await API.advertising.pauseCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       RESUME CAMPAIGN
    ====================================================== */

    async resumeCampaign(
        campaignId: string
    ): Promise<void> {

        await API.advertising.resumeCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       DELETE CAMPAIGN
    ====================================================== */

    async deleteCampaign(
        campaignId: string
    ): Promise<void> {

        await API.advertising.deleteCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       BUDGET MANAGEMENT
    ====================================================== */

    async updateBudget(
        campaignId: string,
        budget: number
    ): Promise<void> {

        await API.advertising.updateBudget(

            campaignId,

            budget

        );

        await this.loadCampaigns();

    }

    /* ======================================================
       AUDIENCE TARGETING
    ====================================================== */

    async updateAudienceTargeting(
        campaignId: string,
        targeting: unknown
    ): Promise<void> {

        await API.advertising.updateAudienceTargeting(

            campaignId,

            targeting

        );

        await this.loadCampaigns();

    }

    /* ======================================================
       ANALYTICS
    ====================================================== */

    async loadAnalytics(): Promise<void> {

        const response =
            await API.advertising.analytics();

        const analytics =
            response.data as AdvertisingAnalytics;

        State.set(

            this.ANALYTICS_KEY,

            analytics

        );

        Events.emit(

            "advertising:analyticsUpdated",

            analytics

        );

    }

    /* ======================================================
       IMPRESSION TRACKING
    ====================================================== */

    async recordImpression(
        advertisementId: string,
        placementId: string
    ): Promise<void> {

        await API.advertising.recordImpression(

            advertisementId,

            placementId

        );

    }

    /* ======================================================
       CLICK TRACKING
    ====================================================== */

    async recordClick(
        advertisementId: string,
        placementId: string
    ): Promise<void> {

        await API.advertising.recordClick(

            advertisementId,

            placementId

        );

    }

    /* ======================================================
       CONVERSION TRACKING
    ====================================================== */

    async recordConversion(
        advertisementId: string,
        placementId: string,
        value?: number
    ): Promise<void> {

        await API.advertising.recordConversion(

            advertisementId,

            placementId,

            value

        );

    }

    /* ======================================================
       INVOICES
    ====================================================== */

    async loadInvoices(): Promise<void> {

        const response =
            await API.advertising.invoices();

        const invoices =
            response.data as AdInvoice[];

        State.set(

            this.INVOICES_KEY,

            invoices

        );

        Events.emit(

            "advertising:invoicesUpdated",

            invoices

        );

    }

    /* ======================================================
       CREATOR REVENUE
    ====================================================== */

    async loadCreatorRevenue(): Promise<void> {

        const response =
            await API.advertising.creatorRevenue();

        const revenue =
            response.data as CreatorRevenue;

        State.set(

            this.REVENUE_KEY,

            revenue

        );

        Events.emit(

            "advertising:creatorRevenueUpdated",

            revenue

        );

    }

    /* ======================================================
       CREATE CAMPAIGN
    ====================================================== */

    async createCampaign(
        campaign: AdvertisingCampaign
    ): Promise<void> {

        await API.advertising.createCampaign(
            campaign
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       APPROVE CAMPAIGN
    ====================================================== */

    async approveCampaign(
        campaignId: string
    ): Promise<void> {

        await API.advertising.approveCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       PAUSE CAMPAIGN
    ====================================================== */

    async pauseCampaign(
        campaignId: string
    ): Promise<void> {

        await API.advertising.pauseCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       RESUME CAMPAIGN
    ====================================================== */

    async resumeCampaign(
        campaignId: string
    ): Promise<void> {

        await API.advertising.resumeCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       DELETE CAMPAIGN
    ====================================================== */

    async deleteCampaign(
        campaignId: string
    ): Promise<void> {

        await API.advertising.deleteCampaign(
            campaignId
        );

        await this.loadCampaigns();

    }

    /* ======================================================
       BUDGET MANAGEMENT
    ====================================================== */

    async updateBudget(
        campaignId: string,
        budget: number
    ): Promise<void> {

        await API.advertising.updateBudget(

            campaignId,

            budget

        );

        await this.loadCampaigns();

    }

    /* ======================================================
       AUDIENCE TARGETING
    ====================================================== */

    async updateAudienceTargeting(
        campaignId: string,
        targeting: unknown
    ): Promise<void> {

        await API.advertising.updateAudienceTargeting(

            campaignId,

            targeting

        );

        await this.loadCampaigns();

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getCampaigns(): AdvertisingCampaign[] {

        return (

            State.get(

                this.CAMPAIGNS_KEY

            ) || []

        );

    }

    getAdvertisements(): Advertisement[] {

        return (

            State.get(

                this.ADS_KEY

            ) || []

        );

    }

    getPlacements(): AdPlacement[] {

        return (

            State.get(

                this.PLACEMENTS_KEY

            ) || []

        );

    }

    getAnalytics(): AdvertisingAnalytics | null {

        return (

            State.get(

                this.ANALYTICS_KEY

            ) || null

        );

    }

    getInvoices(): AdInvoice[] {

        return (

            State.get(

                this.INVOICES_KEY

            ) || []

        );

    }

    getCreatorRevenue(): CreatorRevenue | null {

        return (

            State.get(

                this.REVENUE_KEY

            ) || null

        );

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

            this.CAMPAIGNS_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.CAMPAIGNS_KEY

        );

        State.remove(

            this.ADS_KEY

        );

        State.remove(

            this.PLACEMENTS_KEY

        );

        State.remove(

            this.ANALYTICS_KEY

        );

        State.remove(

            this.INVOICES_KEY

        );

        State.remove(

            this.REVENUE_KEY

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "advertising:cleared"

        );

    }

}

export default new AdvertisingModule();
