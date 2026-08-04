/* ==========================================================
   REMADEF PLATFORM
   Business Module
   File: src/modules/business/business.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    Business,
    BusinessAnalytics,
    BusinessFollower,
    BusinessProduct,
    BusinessReview,
    BusinessService

} from "../../types/business";

class BusinessModule {

    private readonly BUSINESS_KEY =
        "business.data";

    private readonly ANALYTICS_KEY =
        "business.analytics";

    private readonly PRODUCTS_KEY =
        "business.products";

    private readonly SERVICES_KEY =
        "business.services";

    private readonly REVIEWS_KEY =
        "business.reviews";

    private readonly FOLLOWERS_KEY =
        "business.followers";

    private readonly CACHE_KEY =
        "business-cache";

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

            "business:refresh",

            () => this.refresh()

        );

        Events.on(

            "business:products",

            () => this.reloadProducts()

        );

        Events.on(

            "business:services",

            () => this.reloadServices()

        );

        Events.on(

            "business:reviews",

            () => this.reloadReviews()

        );

        Events.on(

            "business:followers",

            () => this.reloadFollowers()

        );

    }

    /* ======================================================
       LOAD BUSINESS
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.business.get();

            const business =
                response.data as Business;

            State.set(

                this.BUSINESS_KEY,

                business

            );

            Cache.set(

                this.CACHE_KEY,

                business

            );

            Events.emit(

                "business:loaded",

                business

            );

            await Promise.all([

                this.reloadAnalytics(),

                this.reloadProducts(),

                this.reloadServices(),

                this.reloadReviews(),

                this.reloadFollowers()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       ANALYTICS
    ====================================================== */

    async reloadAnalytics(): Promise<void> {

        const response =
            await API.business.analytics();

        const analytics =
            response.data as BusinessAnalytics;

        State.set(

            this.ANALYTICS_KEY,

            analytics

        );

        Events.emit(

            "business:analyticsUpdated",

            analytics

        );

    }

    /* ======================================================
       PRODUCTS
    ====================================================== */

    async reloadProducts(): Promise<void> {

        const response =
            await API.business.getProducts();

        const products =
            (response.data ?? []) as BusinessProduct[];

        State.set(

            this.PRODUCTS_KEY,

            products

        );

        Events.emit(

            "business:productsUpdated",

            products

        );

    }

    /* ======================================================
       SERVICES
    ====================================================== */

    async reloadServices(): Promise<void> {

        const response =
            await API.business.getServices();

        const services =
            (response.data ?? []) as BusinessService[];

        State.set(

            this.SERVICES_KEY,

            services

        );

        Events.emit(

            "business:servicesUpdated",

            services

        );

    }
