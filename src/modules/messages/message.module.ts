/* ==========================================================
   REMADEF PLATFORM
   Messages Module
   File: src/modules/messages/message.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Events from "../../core/events";
import Cache from "../../core/cache";
import Router from "../../core/router";

import type {
    Conversation,
    Message
} from "../../types/messages";

class MessageModule {

    private readonly CONVERSATIONS_KEY =
        "messages.conversations";

    private readonly ACTIVE_KEY =
        "messages.active";

    private readonly CACHE_KEY =
        "messages-cache";

    private loading = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        this.restore();

        this.registerEvents();

        await this.loadConversations();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "messages:refresh",

            () => this.loadConversations()

        );

        Events.on(

            "conversation:selected",

            (id: string) => {

                this.openConversation(id);

            }

        );

    }

    /* ======================================================
       CONVERSATIONS
    ====================================================== */

    async loadConversations(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.messages.getConversations();

            const conversations =
                response.data || [];

            State.set(

                this.CONVERSATIONS_KEY,

                conversations

            );

            Cache.set(

                this.CACHE_KEY,

                conversations

            );

            Events.emit(

                "conversations:updated",

                conversations

            );

        } finally {

            this.loading = false;

        }

    }

    async openConversation(
        conversationId: string
    ): Promise<void> {

        State.set(

            this.ACTIVE_KEY,

            conversationId

        );

        Router.navigate(

            `/messages/${conversationId}`

        );

        await this.loadMessages(
            conversationId
        );

    }

    /* ======================================================
       MESSAGES
    ====================================================== */

    async loadMessages(
        conversationId: string
    ): Promise<void> {

        const response =
            await API.messages.getMessages(
                conversationId
            );

        State.set(

            `messages:${conversationId}`,

            response.data || []

        );

        Events.emit(

            "messages:updated",

            conversationId

        );

    }

    async sendMessage(

        conversationId: string,

        content: string,

        replyTo?: string

    ): Promise<void> {

        await API.messages.sendMessage(

            conversationId,

            content,

            replyTo

        );

        await this.loadMessages(
            conversationId
        );

    }

    async markRead(
        messageId: string
    ): Promise<void> {

        await API.messages.markRead(
            messageId
        );

    }

    /* ======================================================
       NEW CONVERSATION
    ====================================================== */

    async createConversation(
        members: string[]
    ): Promise<void> {

        const response =
            await API.messages.createConversation({

                members

            });

        Events.emit(

            "conversation:created",

            response.data

        );

        await this.loadConversations();

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getConversations(): Conversation[] {

        return (

            State.get(

                this.CONVERSATIONS_KEY

            ) || []

        );

    }

    getMessages(
        conversationId: string
    ): Message[] {

        return (

            State.get(

                `messages:${conversationId}`

            ) || []

        );

    }

    getActiveConversation(): string | null {

        return (

            State.get(

                this.ACTIVE_KEY

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

            this.CONVERSATIONS_KEY,

            cached

        );

    }

}

export default new MessageModule();
