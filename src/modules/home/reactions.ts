/* ==========================================================
   REMADEF PLATFORM
   Reactions Controller
   File: src/modules/home/reactions.ts
========================================================== */

import API from "../../services/api";

import Events from "../../core/events";
import State from "../../core/state";

import type {
    FeedPost,
    ReactionType
} from "../../types/home";

class ReactionsController {

    /* ======================================================
       AVAILABLE REACTIONS
    ====================================================== */

    readonly reactions: ReactionType[] = [

        "like",

        "love",

        "celebrate",

        "support",

        "insightful",

        "funny"

    ];

    /* ======================================================
       REACT
    ====================================================== */

    async react(

        postId: string,

        reaction: ReactionType

    ): Promise<void> {

        this.optimisticReact(

            postId,

            reaction

        );

        try {

            await API.home.react(

                postId,

                reaction

            );

            Events.emit(

                "reaction:synced",

                postId

            );

        } catch (error) {

            await this.refresh(postId);

            throw error;

        }

    }

    /* ======================================================
       REMOVE REACTION
    ====================================================== */

    async removeReaction(
        postId: string
    ): Promise<void> {

        try {

            await API.home.removeReaction(
                postId
            );

        } finally {

            await this.refresh(
                postId
            );

        }

    }

    /* ======================================================
       REACTION USERS
    ====================================================== */

    async getUsers(
        postId: string
    ) {

        return API.home.getReactionUsers(
            postId
        );

    }

    /* ======================================================
       LOCAL UPDATE
    ====================================================== */

    private optimisticReact(

        postId: string,

        reaction: ReactionType

    ): void {

        const posts =
            (State.get("feed") || []) as FeedPost[];

        const updated =
            posts.map(post => {

                if (
                    post.id !== postId
                ) {

                    return post;

                }

                return {

                    ...post,

                    myReaction:
                        reaction,

                    reactionCount:
                        (post.reactionCount || 0) + 1

                };

            });

        State.set(

            "feed",

            updated

        );

        Events.emit(

            "feed:updated"

        );

    }

    /* ======================================================
       REFRESH SINGLE POST
    ====================================================== */

    private async refresh(
        postId: string
    ): Promise<void> {

        const response =
            await API.home.getFeedItem(
                postId
            );

        const updated =
            response.data;

        const posts =
            (State.get("feed") || []) as FeedPost[];

        State.set(

            "feed",

            posts.map(post =>

                post.id === postId

                    ? updated

                    : post

            )

        );

        Events.emit(

            "feed:updated"

        );

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    hasReacted(
        post: FeedPost
    ): boolean {

        return !!post.myReaction;

    }

    currentReaction(
        post: FeedPost
    ): ReactionType | null {

        return post.myReaction || null;

    }

}

export default new ReactionsController();
