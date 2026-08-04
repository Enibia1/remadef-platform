/* ==========================================================
   REMADEF PLATFORM
   Directory Module
   File: src/modules/directory/directory.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    DirectoryEntry,
    DirectoryCategory,
    DirectoryFilter,
    DirectoryAnalytics,
    FeaturedDirectoryEntry

} from "../../types/directory";

class DirectoryModule {

    private readonly DIRECTORY_KEY =
        "directory.entries";

    private readonly FEATURED_KEY =
        "directory.featured";

    private readonly CATEGORIES_KEY =
        "directory.categories";

    private readonly FILTERS_KEY =
        "directory.filters";

    private readonly ANALYTICS_KEY =
        "directory.analytics";

    private readonly CACHE_KEY =
        "directory-cache";

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

            "directory:refresh",

            () => this.refresh()

        );

        Events.on(

            "directory:search",

            (query: string) =>

                this.search(query)

        );

        Events.on(

            "directory:filter",

            (filter: DirectoryFilter) =>

                this.applyFilters(filter)

        );

    }

    /* ======================================================
       LOAD DIRECTORY
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.directory.getEntries();

            const entries =
                response.data as DirectoryEntry[];

            State.set(

                this.DIRECTORY_KEY,

                entries

            );

            Cache.set(

                this.CACHE_KEY,

                entries

            );

            Events.emit(

                "directory:loaded",

                entries

            );

            await Promise.all([

                this.loadFeatured(),

                this.loadCategories(),

                this.loadAnalytics()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       SEARCH
    ====================================================== */

    async search(
        query: string
    ): Promise<void> {

        const response =
            await API.directory.search(
                query
            );

        State.set(

            this.DIRECTORY_KEY,

            response.data ?? []

        );

        Events.emit(

            "directory:updated",

            response.data ?? []

        );

    }

    /* ======================================================
       FILTERS
    ====================================================== */

    async applyFilters(
        filters: DirectoryFilter
    ): Promise<void> {

        const response =
            await API.directory.filter(
                filters
            );

        State.set(

            this.DIRECTORY_KEY,

            response.data ?? []

        );

        State.set(

            this.FILTERS_KEY,

            filters

        );

        Events.emit(

            "directory:updated",

            response.data ?? []

        );

    }

    /* ======================================================
       FEATURED ENTRIES
    ====================================================== */

    async loadFeatured(): Promise<void> {

        const response =
            await API.directory.getFeatured();

        const featured =
            (response.data ?? []) as FeaturedDirectoryEntry[];

        State.set(

            this.FEATURED_KEY,

            featured

        );

        Events.emit(

            "directory:featuredUpdated",

            featured

        );

    }

    /* ======================================================
       CATEGORIES
    ====================================================== */

    async loadCategories(): Promise<void> {

        const response =
            await API.directory.getCategories();

        const categories =
            (response.data ?? []) as DirectoryCategory[];

        State.set(

            this.CATEGORIES_KEY,

            categories

        );

        Events.emit(

            "directory:categoriesUpdated",

            categories

        );

    }

    /* ======================================================
       STUDENTS
    ====================================================== */

    async loadStudents(): Promise<void> {

        const response =
            await API.directory.getStudents();

        State.set(

            "directory.students",

            response.data ?? []

        );

        Events.emit(

            "directory:studentsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       APPRENTICES
    ====================================================== */

    async loadApprentices(): Promise<void> {

        const response =
            await API.directory.getApprentices();

        State.set(

            "directory.apprentices",

            response.data ?? []

        );

        Events.emit(

            "directory:apprenticesUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       BUSINESSES
    ====================================================== */

    async loadBusinesses(): Promise<void> {

        const response =
            await API.directory.getBusinesses();

        State.set(

            "directory.businesses",

            response.data ?? []

        );

        Events.emit(

            "directory:businessesUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       EMPLOYERS
    ====================================================== */

    async loadEmployers(): Promise<void> {

        const response =
            await API.directory.getEmployers();

        State.set(

            "directory.employers",

            response.data ?? []

        );

        Events.emit(

            "directory:employersUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       PROFESSIONALS
    ====================================================== */

    async loadProfessionals(): Promise<void> {

        const response =
            await API.directory.getProfessionals();

        State.set(

            "directory.professionals",

            response.data ?? []

        );

        Events.emit(

            "directory:professionalsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       CREATORS
    ====================================================== */

    async loadCreators(): Promise<void> {

        const response =
            await API.directory.getCreators();

        State.set(

            "directory.creators",

            response.data ?? []

        );

        Events.emit(

            "directory:creatorsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       ORGANIZATIONS
    ====================================================== */

    async loadOrganizations(): Promise<void> {

        const response =
            await API.directory.getOrganizations();

        State.set(

            "directory.organizations",

            response.data ?? []

        );

        Events.emit(

            "directory:organizationsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       SERVICE PROVIDERS
    ====================================================== */

    async loadServiceProviders(): Promise<void> {

        const response =
            await API.directory.getServiceProviders();

        State.set(

            "directory.services",

            response.data ?? []

        );

        Events.emit(

            "directory:servicesUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       ANALYTICS
    ====================================================== */

    async loadAnalytics(): Promise<void> {

        const response =
            await API.directory.getAnalytics();

        const analytics =
            response.data as DirectoryAnalytics;

        State.set(

            this.ANALYTICS_KEY,

            analytics

        );

        Events.emit(

            "directory:analyticsUpdated",

            analytics

        );

    }

    /* ======================================================
       FAVORITES
    ====================================================== */

    async loadFavorites(): Promise<void> {

        const response =
            await API.directory.getFavorites();

        State.set(

            "directory.favorites",

            response.data ?? []

        );

        Events.emit(

            "directory:favoritesUpdated",

            response.data ?? []

        );

    }

    async addFavorite(
        entryId: string
    ): Promise<void> {

        await API.directory.addFavorite(
            entryId
        );

        await this.loadFavorites();

    }

    async removeFavorite(
        entryId: string
    ): Promise<void> {

        await API.directory.removeFavorite(
            entryId
        );

        await this.loadFavorites();

    }

    /* ======================================================
       FOLLOW
    ====================================================== */

    async follow(
        entryId: string
    ): Promise<void> {

        await API.directory.follow(
            entryId
        );

        Events.emit(

            "directory:followed",

            entryId

        );

    }

    async unfollow(
        entryId: string
    ): Promise<void> {

        await API.directory.unfollow(
            entryId
        );

        Events.emit(

            "directory:unfollowed",

            entryId

        );

    }

    /* ======================================================
       RECENTLY VIEWED
    ====================================================== */

    async loadRecent(): Promise<void> {

        const response =
            await API.directory.getRecent();

        State.set(

            "directory.recent",

            response.data ?? []

        );

        Events.emit(

            "directory:recentUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       TRENDING
    ====================================================== */

    async loadTrending(): Promise<void> {

        const response =
            await API.directory.getTrending();

        State.set(

            "directory.trending",

            response.data ?? []

        );

        Events.emit(

            "directory:trendingUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       RECOMMENDATIONS
    ====================================================== */

    async loadRecommendations(): Promise<void> {

        const response =
            await API.directory.getRecommendations();

        State.set(

            "directory.recommendations",

            response.data ?? []

        );

        Events.emit(

            "directory:recommendationsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       NEARBY
    ====================================================== */

    async loadNearby(): Promise<void> {

        const response =
            await API.directory.getNearby();

        State.set(

            "directory.nearby",

            response.data ?? []

        );

        Events.emit(

            "directory:nearbyUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getEntries(): DirectoryEntry[] {

        return (

            State.get(

                this.DIRECTORY_KEY

            ) || []

        );

    }

    getCategories(): DirectoryCategory[] {

        return (

            State.get(

                this.CATEGORIES_KEY

            ) || []

        );

    }

    getFeatured(): FeaturedDirectoryEntry[] {

        return (

            State.get(

                this.FEATURED_KEY

            ) || []

        );

    }

    getAnalytics(): DirectoryAnalytics | null {

        return (

            State.get(

                this.ANALYTICS_KEY

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

            this.DIRECTORY_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.DIRECTORY_KEY

        );

        State.remove(

            this.FEATURED_KEY

        );

        State.remove(

            this.CATEGORIES_KEY

        );

        State.remove(

            this.FILTERS_KEY

        );

        State.remove(

            this.ANALYTICS_KEY

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "directory:cleared"

        );

    }

}

export default new DirectoryModule();

