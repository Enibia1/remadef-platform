/* ==========================================================
   REMADEF PLATFORM
   Home Module
   File: src/modules/home/home.module.ts
========================================================== */

import API from "../../services/api";

import Router from "../../core/router";
import State from "../../core/state";
import Events from "../../core/events";
import Cache from "../../core/cache";

import type {
    FeedPost,
    FeedResponse,
    CreatePostRequest
} from "../../types/home";

class HomeModule {

    private page = 1;

    private limit = 20;

    private loading = false;

    private hasMore = true;

    private readonly CACHE_KEY =
        "home-feed";

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        this.restoreFeed();

        await this.refreshFeed();

        this.registerEvents();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "feed:refresh",

            () => this.refreshFeed()

        );

        Events.on(

            "feed:load-more",

            () => this.loadMore()

        );

        Events.on(

            "post:created",

            () => this.refreshFeed()

        );

    }

    /* ======================================================
       FEED
    ====================================================== */

    async refreshFeed(): Promise<void> {

        this.page = 1;

        this.hasMore = true;

        await this.load(true);

    }

    async loadMore(): Promise<void> {

        if (
            this.loading ||
            !this.hasMore
        ) {

            return;

        }

        this.page++;

        await this.load(false);

    }

    private async load(
        replace: boolean
    ): Promise<void> {

        this.loading = true;

        try {

            const response =
                await API.home.getFeed(

                    this.page,

                    this.limit

                );

            const feed =
                response.data as FeedResponse;

            if (!feed) {

                return;

            }

            this.hasMore =
                feed.items.length >= this.limit;

            if (replace) {

                State.set(

                    "feed",

                    feed.items

                );

            } else {

                const current =
                    State.get("feed") || [];

                State.set(

                    "feed",

                    [

                        ...current,

                        ...feed.items

                    ]

                );

            }

            Cache.set(

                this.CACHE_KEY,

                State.get("feed")

            );

            Events.emit(

                "feed:updated",

                State.get("feed")

            );

        } finally {

            this.loading = false;

        }

    }

    /* ======================================================
       POSTS
    ====================================================== */

    async createPost(
        data: CreatePostRequest
    ): Promise<void> {

        await API.home.createPost(
            data
        );

        await this.refreshFeed();

    }

    async react(

        postId: string,

        reaction: string

    ): Promise<void> {

        await API.home.react(

            postId,

            reaction

        );

        Events.emit(

            "post:reaction",

            postId

        );

    }

    async comment(

        postId: string,

        content: string

    ): Promise<void> {

        await API.home.addComment(

            postId,

            content

        );

        Events.emit(

            "post:comment",

            postId

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restoreFeed(): void {

        const cached =

            Cache.get(

                this.CACHE_KEY

            );

        if (!cached) {

            return;

        }

        State.set(

            "feed",

            cached

        );

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getFeed(): FeedPost[] {

        return State.get("feed") || [];

    }

    openPost(
        id: string
    ): void {

        Router.navigate(

            `/post/${id}`

        );

    }

}

export default new HomeModule();
