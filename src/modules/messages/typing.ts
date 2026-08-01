/* ==========================================================
   REMADEF PLATFORM
   Typing Module
   File: src/modules/messages/typing.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Events from "../../core/events";

class TypingModule {

    private readonly ACTIVE_KEY =
        "messages.active";

    private readonly TYPING_KEY =
        "messages.typing";

    private timer: number | null = null;

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

            "chat:input",

            () => this.startTyping()

        );

    }

    /* ======================================================
       START TYPING
    ====================================================== */

    async startTyping(): Promise<void> {

        const conversationId =
            this.getConversation();

        if (!conversationId) {

            return;

        }

        await API.messages.startTyping(
            conversationId
        );

        if (this.timer) {

            clearTimeout(this.timer);

        }

        this.timer = window.setTimeout(

            () => {

                this.stopTyping();

            },

            2500

        );

    }

    /* ======================================================
       STOP TYPING
    ====================================================== */

    async stopTyping(): Promise<void> {

        const conversationId =
            this.getConversation();

        if (!conversationId) {

            return;

        }

        await API.messages.stopTyping(
            conversationId
        );

    }

    /* ======================================================
       REFRESH REMOTE TYPING USERS
    ====================================================== */

    async refresh(): Promise<void> {

        const conversationId =
            this.getConversation();

        if (!conversationId) {

            return;

        }

        const response =
            await API.messages.getTypingUsers(
                conversationId
            );

        State.set(

            `${this.TYPING_KEY}:${conversationId}`,

            response.data || []

        );

        Events.emit(

            "typing:updated",

            conversationId

        );

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getTypingUsers(): any[] {

        const conversationId =
            this.getConversation();

        if (!conversationId) {

            return [];

        }

        return (

            State.get(

                `${this.TYPING_KEY}:${conversationId}`

            ) || []

        );

    }

    private getConversation(): string | null {

        return (

            State.get(

                this.ACTIVE_KEY

            ) || null

        );

    }

}

export default new TypingModule();
