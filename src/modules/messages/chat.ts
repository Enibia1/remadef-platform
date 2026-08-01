/* ==========================================================
   REMADEF PLATFORM
   Chat Module
   File: src/modules/messages/chat.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Events from "../../core/events";

import type {
    Message
} from "../../types/message";

class ChatModule {

    private readonly ACTIVE_KEY =
        "messages.active";

    private readonly MESSAGE_KEY =
        "messages.current";

    private loading = false;

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

            "conversation:selected",

            (conversationId: string) => {

                this.open(conversationId);

            }

        );

    }

    /* ======================================================
       OPEN CHAT
    ====================================================== */

    async open(
        conversationId: string
    ): Promise<void> {

        State.set(

            this.ACTIVE_KEY,

            conversationId

        );

        await this.loadMessages(
            conversationId
        );

    }

    /* ======================================================
       LOAD MESSAGES
    ====================================================== */

    async loadMessages(
        conversationId: string
    ): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.messages.getMessages(
                    conversationId
                );

            State.set(

                `${this.MESSAGE_KEY}:${conversationId}`,

                response.data || []

            );

            Events.emit(

                "chat:loaded",

                conversationId

            );

        } finally {

            this.loading = false;

        }

    }

}

    /* ======================================================
       SEND MESSAGE
    ====================================================== */

    async sendMessage(
        content: string,
        replyTo?: string
    ): Promise<void> {

        const conversationId =
            this.getActiveConversation();

        if (!conversationId) {

            throw new Error(
                "No active conversation."
            );

        }

        await API.messages.sendMessage(

            conversationId,

            {
                content,
                replyTo
            }

        );

        await this.loadMessages(
            conversationId
        );

        Events.emit(

            "chat:messageSent",

            conversationId

        );

    }

    /* ======================================================
       REPLY
    ====================================================== */

    async replyMessage(
        messageId: string,
        content: string
    ): Promise<void> {

        const conversationId =
            this.getActiveConversation();

        if (!conversationId) {

            return;

        }

        await API.messages.replyMessage(

            conversationId,

            messageId,

            content

        );

        await this.loadMessages(
            conversationId
        );

    }

    /* ======================================================
       EDIT MESSAGE
    ====================================================== */

    async editMessage(
        messageId: string,
        content: string
    ): Promise<void> {

        const conversationId =
            this.getActiveConversation();

        if (!conversationId) {

            return;

        }

        await API.messages.updateMessage(

            messageId,

            content

        );

        await this.loadMessages(
            conversationId
        );

        Events.emit(

            "chat:messageEdited",

            messageId

        );

    }

    /* ======================================================
       DELETE MESSAGE
    ====================================================== */

    async deleteMessage(
        messageId: string
    ): Promise<void> {

        const conversationId =
            this.getActiveConversation();

        if (!conversationId) {

            return;

        }

        await API.messages.deleteMessage(
            messageId
        );

        await this.loadMessages(
            conversationId
        );

        Events.emit(

            "chat:messageDeleted",

            messageId

        );

        /* ======================================================
       REACTIONS
    ====================================================== */

    async react(
        messageId: string,
        reaction: string
    ): Promise<void> {

        const conversationId =
            this.getActiveConversation();

        if (!conversationId) {

            return;

        }

        await API.messages.react(

            messageId,

            {
                reaction
            }

        );

        await this.loadMessages(
            conversationId
        );

        Events.emit(

            "chat:reactionUpdated",

            messageId

        );

    }

    async removeReaction(
        messageId: string,
        reactionId: string
    ): Promise<void> {

        const conversationId =
            this.getActiveConversation();

        if (!conversationId) {

            return;

        }

        await API.messages.removeReaction(

            messageId,

            reactionId

        );

        await this.loadMessages(
            conversationId
        );

        Events.emit(

            "chat:reactionUpdated",

            messageId

        );

    }

    /* ======================================================
       READ RECEIPTS
    ====================================================== */

    async markRead(
        messageId: string
    ): Promise<void> {

        await API.messages.markRead(
            messageId
        );

    }

    /* ======================================================
       PAGINATION
    ====================================================== */

    async loadOlderMessages(): Promise<void> {

        const conversationId =
            this.getActiveConversation();

        if (!conversationId) {

            return;

        }

        const messages =
            this.getMessages();

        if (!messages.length) {

            return;

        }

        const oldest =
            messages[0];

        const response =
            await API.messages.loadOlderMessages(

                conversationId,

                oldest.id

            );

        State.set(

            `${this.MESSAGE_KEY}:${conversationId}`,

            [

                ...(response.data || []),

                ...messages

            ]

        );

        Events.emit(

            "chat:updated",

            conversationId

        );

    }

    /* ======================================================
       SEARCH
    ====================================================== */

    async search(
        query: string
    ): Promise<Message[]> {

        const response =
            await API.messages.search({

                query

            });

        Events.emit(

            "chat:searchCompleted",

            response.data

        );

        return response.data || [];

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getMessages(): Message[] {

        const conversationId =
            this.getActiveConversation();

        if (!conversationId) {

            return [];

        }

        return (

            State.get(

                `${this.MESSAGE_KEY}:${conversationId}`

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
