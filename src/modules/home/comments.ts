/* ==========================================================
   REMADEF PLATFORM
   Comments Controller
   File: src/modules/home/comments.ts
========================================================== */

import API from "../../services/api";

import Events from "../../core/events";
import State from "../../core/state";

import type {
    FeedComment,
    CreateCommentRequest
} from "../../types/home";

class CommentsController {

    private readonly storeKey =
        "comments";

    /* ======================================================
       INITIALIZE
    ====================================================== */

    initialize(): void {

        Events.on(

            "comments:open",

            (postId: string) => {

                this.load(postId);

            }

        );

    }

    /* ======================================================
       LOAD COMMENTS
    ====================================================== */

    async load(
        postId: string
    ): Promise<void> {

        const response =
            await API.home.getComments(
                postId
            );

        State.set(

            `${this.storeKey}:${postId}`,

            response.data || []

        );

        Events.emit(

            "comments:updated",

            postId

        );

    }

    /* ======================================================
       ADD COMMENT
    ====================================================== */

    async add(

        postId: string,

        content: string

    ): Promise<void> {

        const request: CreateCommentRequest = {

            content

        };

        await API.home.addComment(

            postId,

            request.content

        );

        await this.load(
            postId
        );

    }

    /* ======================================================
       REPLY
    ====================================================== */

    async reply(

        postId: string,

        parentCommentId: string,

        content: string

    ): Promise<void> {

        await API.home.replyComment(

            postId,

            parentCommentId,

            content

        );

        await this.load(
            postId
        );

    }

    /* ======================================================
       UPDATE COMMENT
    ====================================================== */

    async edit(

        postId: string,

        commentId: string,

        content: string

    ): Promise<void> {

        await API.home.updateComment(

            postId,

            commentId,

            content

        );

        await this.load(
            postId
        );

    }

    /* ======================================================
       DELETE COMMENT
    ====================================================== */

    async remove(

        postId: string,

        commentId: string

    ): Promise<void> {

        await API.home.deleteComment(

            postId,

            commentId

        );

        await this.load(
            postId
        );

    }

    /* ======================================================
       COMMENT REACTION
    ====================================================== */

    async react(

        postId: string,

        commentId: string,

        reaction: string

    ): Promise<void> {

        await API.home.reactToComment(

            postId,

            commentId,

            reaction

        );

        await this.load(
            postId
        );

    }

    /* ======================================================
       LOAD MORE
    ====================================================== */

    async loadMore(
        postId: string,
        page: number
    ): Promise<void> {

        const response =
            await API.home.getComments(

                postId,

                page

            );

        const existing =
            (State.get(

                `${this.storeKey}:${postId}`

            ) || []) as FeedComment[];

        State.set(

            `${this.storeKey}:${postId}`,

            [

                ...existing,

                ...(response.data || [])

            ]

        );

        Events.emit(

            "comments:updated",

            postId

        );

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    get(
        postId: string
    ): FeedComment[] {

        return (

            State.get(

                `${this.storeKey}:${postId}`

            ) || []

        );

    }

    clear(
        postId: string
    ): void {

        State.remove(

            `${this.storeKey}:${postId}`

        );

    }

}

export default new CommentsController();
