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
