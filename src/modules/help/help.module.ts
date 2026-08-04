/* ==========================================================
   REMADEF PLATFORM
   Help & Support Module
   File: src/modules/help/help.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    HelpCategory,
    HelpArticle,
    SupportTicket,
    FAQ,
    ContactOption,
    HelpAnnouncement

} from "../../types/help";

class HelpModule {

    private readonly CATEGORIES_KEY =
        "help.categories";

    private readonly ARTICLES_KEY =
        "help.articles";

    private readonly TICKETS_KEY =
        "help.tickets";

    private readonly FAQ_KEY =
        "help.faq";

    private readonly CONTACT_KEY =
        "help.contact";

    private readonly ANNOUNCEMENTS_KEY =
        "help.announcements";

    private readonly CACHE_KEY =
        "help-cache";

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

            "help:refresh",

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

                this.loadCategories(),

                this.loadArticles(),

                this.loadTickets(),

                this.loadFAQs(),

                this.loadContactOptions(),

                this.loadAnnouncements()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       HELP CATEGORIES
    ====================================================== */

    async loadCategories(): Promise<void> {

        const response =
            await API.help.categories();

        const categories =
            response.data as HelpCategory[];

        State.set(

            this.CATEGORIES_KEY,

            categories

        );

        Cache.set(

            this.CACHE_KEY,

            categories

        );

        Events.emit(

            "help:categoriesUpdated",

            categories

        );

    }

    /* ======================================================
       HELP ARTICLES
    ====================================================== */

    async loadArticles(): Promise<void> {

        const response =
            await API.help.articles();

        const articles =
            response.data as HelpArticle[];

        State.set(

            this.ARTICLES_KEY,

            articles

        );

        Events.emit(

            "help:articlesUpdated",

            articles

        );

    }

    /* ======================================================
       SUPPORT TICKETS
    ====================================================== */

    async loadTickets(): Promise<void> {

        const response =
            await API.help.tickets();

        const tickets =
            response.data as SupportTicket[];

        State.set(

            this.TICKETS_KEY,

            tickets

        );

        Events.emit(

            "help:ticketsUpdated",

            tickets

        );

    }

    /* ======================================================
       FAQs
    ====================================================== */

    async loadFAQs(): Promise<void> {

        const response =
            await API.help.faqs();

        const faqs =
            response.data as FAQ[];

        State.set(

            this.FAQ_KEY,

            faqs

        );

        Events.emit(

            "help:faqsUpdated",

            faqs

        );

    }

    /* ======================================================
       CONTACT OPTIONS
    ====================================================== */

    async loadContactOptions(): Promise<void> {

        const response =
            await API.help.contactOptions();

        const contactOptions =
            response.data as ContactOption[];

        State.set(

            this.CONTACT_KEY,

            contactOptions

        );

        Events.emit(

            "help:contactUpdated",

            contactOptions

        );

    }

    /* ======================================================
       ANNOUNCEMENTS
    ====================================================== */

    async loadAnnouncements(): Promise<void> {

        const response =
            await API.help.announcements();

        const announcements =
            response.data as HelpAnnouncement[];

        State.set(

            this.ANNOUNCEMENTS_KEY,

            announcements

        );

        Events.emit(

            "help:announcementsUpdated",

            announcements

        );

    }

    /* ======================================================
       SEARCH ARTICLES
    ====================================================== */

    async searchArticles(
        query: string
    ): Promise<void> {

        const response =
            await API.help.search(
                query
            );

        State.set(

            "help.searchResults",

            response.data

        );

        Events.emit(

            "help:searchUpdated",

            response.data

        );

    }

    /* ======================================================
       CREATE TICKET
    ====================================================== */

    async createTicket(
        payload: unknown
    ): Promise<void> {

        await API.help.createTicket(
            payload
        );

        await this.loadTickets();

    }

    /* ======================================================
       REPLY TO TICKET
    ====================================================== */

    async replyToTicket(
        ticketId: string,
        message: string
    ): Promise<void> {

        await API.help.replyToTicket(

            ticketId,

            message

        );

        await this.loadTickets();

    }

    /* ======================================================
       CLOSE TICKET
    ====================================================== */

    async closeTicket(
        ticketId: string
    ): Promise<void> {

        await API.help.closeTicket(
            ticketId
        );

        await this.loadTickets();

    }

    /* ======================================================
       LIVE CHAT
    ====================================================== */

    async startLiveChat(): Promise<void> {

        // Placeholder for future
        // Live support integration

        await API.help.liveChat();

    }

    /* ======================================================
       FEEDBACK
    ====================================================== */

    async submitFeedback(
        payload: unknown
    ): Promise<void> {

        await API.help.submitFeedback(
            payload
        );

    }

    /* ======================================================
       REPORT BUG
    ====================================================== */

    async reportBug(
        payload: unknown
    ): Promise<void> {

        await API.help.reportBug(
            payload
        );

    }

    /* ======================================================
       FEATURE REQUEST
    ====================================================== */

    async requestFeature(
        payload: unknown
    ): Promise<void> {

        await API.help.requestFeature(
            payload
        );

    }

    /* ======================================================
       SYNCHRONIZE
    ====================================================== */

    async synchronize(): Promise<void> {

        await this.refresh();

    }

/* ======================================================
   HELPERS
====================================================== */

    getCategories(): HelpCategory[] {

        return (

            State.get(

                this.CATEGORIES_KEY

            ) || []

        );

    }

    getArticles(): HelpArticle[] {

        return (

            State.get(

                this.ARTICLES_KEY

            ) || []

        );

    }

    getTickets(): SupportTicket[] {

        return (

            State.get(

                this.TICKETS_KEY

            ) || []

        );

    }

    getFAQs(): FAQ[] {

        return (

            State.get(

                this.FAQ_KEY

            ) || []

        );

    }

    getContactOptions(): ContactOption[] {

        return (

            State.get(

                this.CONTACT_KEY

            ) || []

        );

    }

    getAnnouncements(): HelpAnnouncement[] {

        return (

            State.get(

                this.ANNOUNCEMENTS_KEY

            ) || []

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

            this.CATEGORIES_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.CATEGORIES_KEY

        );

        State.remove(

            this.ARTICLES_KEY

        );

        State.remove(

            this.TICKETS_KEY

        );

        State.remove(

            this.FAQ_KEY

        );

        State.remove(

            this.CONTACT_KEY

        );

        State.remove(

            this.ANNOUNCEMENTS_KEY

        );

        State.remove(

            "help.searchResults"

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "help:cleared"

        );

    }

}

export default new HelpModModule
