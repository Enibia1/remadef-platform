/* ==========================================================
   REMADEF PLATFORM
   Post Controller
   File: src/modules/home/post.ts
========================================================== */

import API from "../../services/api";

import Events from "../../core/events";
import State from "../../core/state";
import Cache from "../../core/cache";

import type {
    CreatePostRequest,
    FeedPost,
    PostAudience
} from "../../types/home";

class PostController {

    private readonly DRAFT_KEY =
        "post-draft";

    /* ======================================================
       INITIALIZE
    ====================================================== */

    initialize(): void {

        this.restoreDraft();

        this.registerEvents();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "post:create",

            (data: CreatePostRequest) => {

                this.publish(data);

            }

        );

    }

    /* ======================================================
       CREATE POST
    ====================================================== */

    async publish(
        data: CreatePostRequest
    ): Promise<void> {

        const response =
            await API.home.createPost(data);

        Cache.remove(this.DRAFT_KEY);

        Events.emit(
            "post:published",
            response.data
        );

        Events.emit(
            "feed:refresh"
        );

    }

    /* ======================================================
       EDIT POST
    ====================================================== */

    async edit(
        postId: string,
        data: Partial<CreatePostRequest>
    ): Promise<void> {

        await API.client.put(

            `/api/feed/${encodeURIComponent(postId)}`,

            data

        );

        Events.emit(
            "feed:refresh"
        );

    }

    /* ======================================================
       DELETE POST
    ====================================================== */

    async delete(
        postId: string
    ): Promise<void> {

        await API.client.delete(

            `/api/feed/${encodeURIComponent(postId)}`

        );

        Events.emit(
            "feed:refresh"
        );

    }

    /* ======================================================
       SAVE DRAFT
    ====================================================== */

    saveDraft(
        draft: Partial<CreatePostRequest>
    ): void {

        Cache.set(

            this.DRAFT_KEY,

            draft

        );

    }

    restoreDraft(): Partial<CreatePostRequest> | null {

        return Cache.get(

            this.DRAFT_KEY

        );

    }

    clearDraft(): void {

        Cache.remove(

            this.DRAFT_KEY

        );

    }

    /* ======================================================
       ATTACHMENTS
    ====================================================== */

    async uploadMedia(
        file: File
    ): Promise<string> {

        const response =
            await API.files.upload(file);

        return response.data.url;

    }

    /* ======================================================
       AUDIENCE
    ====================================================== */

    getAudiences(): PostAudience[] {

        return [

            "public",

            "followers",

            "connections",

            "private"

        ];

    }

    /* ======================================================
       SHARE
    ====================================================== */

    async share(
        postId: string
    ): Promise<void> {

        await API.client.post(

            `/api/feed/${encodeURIComponent(postId)}/share`

        );

        Events.emit(

            "post:shared",

            postId

        );

    }

    /* ======================================================
       BOOKMARK
    ====================================================== */

    async bookmark(
        postId: string
    ): Promise<void> {

        await API.client.post(

            `/api/feed/${encodeURIComponent(postId)}/bookmark`

        );

        Events.emit(

            "post:bookmarked",

            postId

        );

    }

    /* ======================================================
       PIN
    ====================================================== */

    async pin(
        postId: string
    ): Promise<void> {

        await API.client.post(

            `/api/feed/${encodeURIComponent(postId)}/pin`

        );

        Events.emit(

            "post:pinned",

            postId

        );

    }

    /* ======================================================
       LOCAL HELPERS
    ====================================================== */

    updateLocalPost(
        updated: FeedPost
    ): void {

        const posts =
            (State.get("feed") || []) as FeedPost[];

        const next =
            posts.map(post =>

                post.id === updated.id

                    ? updated

                    : post

            );

        State.set(
            "feed",
            next
        );

        Events.emit(
            "feed:updated"
        );

    }

}

export default new PostController();
