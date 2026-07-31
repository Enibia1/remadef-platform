/* ==========================================================
   REMADEF PLATFORM
   Feed Controller
   File: src/modules/home/feed.ts
========================================================== */

import HomeModule from "./home.module";

import Events from "../../core/events";
import State from "../../core/state";

import type {
    FeedPost
} from "../../types/home";

class FeedController {

    private container: HTMLElement | null = null;

    private observer?: IntersectionObserver;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    initialize(
        selector = "#feed"
    ): void {

        this.container =
            document.querySelector(selector);

        if (!this.container) {

            console.warn(
                "Feed container not found."
            );

            return;

        }

        this.registerEvents();

        this.render();

        this.setupInfiniteScroll();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "feed:updated",

            () => this.render()

        );

        Events.on(

            "post:reaction",

            () => this.render()

        );

        Events.on(

            "post:comment",

            () => this.render()

        );

    }

    /* ======================================================
       RENDER
    ====================================================== */

    render(): void {

        if (!this.container) {

            return;

        }

        const posts =
            (State.get("feed") || []) as FeedPost[];

        this.container.innerHTML =
            posts
                .map(post => this.renderPost(post))
                .join("");

        this.attachEvents();

    }

    /* ======================================================
       POST TEMPLATE
    ====================================================== */

    private renderPost(
        post: FeedPost
    ): string {

        return `

<article
class="feed-post"
data-post-id="${post.id}">

    <div class="feed-post__header">

        <img
            class="feed-avatar"
            src="${post.authorAvatar || ""}"
            alt="${post.authorName}">

        <div>

            <h4>${post.authorName}</h4>

            <small>${post.createdAt}</small>

        </div>

    </div>

    <div class="feed-post__body">

        ${post.content}

    </div>

    <div class="feed-post__actions">

        <button
            class="feed-like">

            👍 ${post.likes ?? 0}

        </button>

        <button
            class="feed-comment">

            💬 ${post.comments ?? 0}

        </button>

        <button
            class="feed-share">

            Share

        </button>

    </div>

</article>

`;

    }

    /* ======================================================
       DOM EVENTS
    ====================================================== */

    private attachEvents(): void {

        document

            .querySelectorAll(".feed-like")

            .forEach(button => {

                button.addEventListener(

                    "click",

                    async event => {

                        const article =
                            (event.currentTarget as HTMLElement)

                            .closest(".feed-post");

                        if (!article) {

                            return;

                        }

                        await HomeModule.react(

                            article.dataset.postId!,

                            "like"

                        );

                    }

                );

            });

        document

            .querySelectorAll(".feed-comment")

            .forEach(button => {

                button.addEventListener(

                    "click",

                    event => {

                        const article =
                            (event.currentTarget as HTMLElement)

                            .closest(".feed-post");

                        if (!article) {

                            return;

                        }

                        Events.emit(

                            "comments:open",

                            article.dataset.postId

                        );

                    }

                );

            });

    }

    /* ======================================================
       INFINITE SCROLL
    ====================================================== */

    private setupInfiniteScroll(): void {

        const sentinel =
            document.querySelector(

                "#feed-load-more"

            );

        if (!sentinel) {

            return;

        }

        this.observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(

                        entry => {

                            if (

                                entry.isIntersecting

                            ) {

                                HomeModule.loadMore();

                            }

                        }

                    );

                },

                {

                    threshold: 0.5

                }

            );

        this.observer.observe(
            sentinel
        );

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        this.observer?.disconnect();

    }

}

export default new FeedController();
