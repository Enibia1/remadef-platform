/* ==========================================================
   REMADEF PLATFORM
   Conversations Controller
   File: src/modules/messages/conversations.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Events from "../../core/events";
import Router from "../../core/router";

import type {
    Conversation,
    ConversationFilter
} from "../../types/messages";

class ConversationsController {

    private readonly STORE_KEY =
        "messages.conversations";

    /* ======================================================
       INITIALIZE
    ====================================================== */

    initialize(): void {

        this.registerEvents();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "messages:refresh",

            () => {

                this.load();

            }

        );

        Events.on(

            "conversation:reload",

            () => {

                this.load();

            }

        );

    }

    /* ======================================================
       LOAD CONVERSATIONS
    ====================================================== */

    async load(): Promise<void> {

        const response =
            await API.messages.getConversations();

        State.set(

            this.STORE_KEY,

            response.data || []

        );

        Events.emit(

            "conversations:updated",

            response.data

        );

    }

    /* ======================================================
       OPEN CONVERSATION
    ====================================================== */

    open(
        conversationId: string
    ): void {

        State.set(

            "messages.active",

            conversationId

        );

        Events.emit(

            "conversation:selected",

            conversationId

        );

        Router.navigate(

            `/messages/${conversationId}`

        );

    }

    /* ======================================================
       CREATE CONVERSATION
    ====================================================== */

    async create(
        members: string[]
    ): Promise<void> {

        await API.messages.createConversation({

            members

        });

        await this.load();

    }

    /* ======================================================
       DELETE CONVERSATION
    ====================================================== */

    async delete(
        conversationId: string
    ): Promise<void> {

        await API.messages.deleteConversation(

            conversationId

        );

        await this.load();

    }

    /* ======================================================
       ARCHIVE
    ====================================================== */

    async archive(
        conversationId: string
    ): Promise<void> {

        await API.messages.archiveConversation(

            conversationId

        );

        await this.load();

    }

    /* ======================================================
       UNARCHIVE
    ====================================================== */

    async unarchive(
        conversationId: string
    ): Promise<void> {

        await API.messages.unarchiveConversation(

            conversationId

        );

        await this.load();

    }

    /* ======================================================
       MUTE
    ====================================================== */

    async mute(
        conversationId: string
    ): Promise
