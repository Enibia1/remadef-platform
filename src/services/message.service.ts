/* ==========================================================
   REMADEF PLATFORM
   Message Service
   File: src/services/message.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    Conversation,
    Message,
    SendMessageRequest,
    CreateConversationRequest,
    UpdateConversationRequest,
    ConversationMember,
    MessageReaction,
    TypingStatus,
    MessageSearchFilter
} from "../types/message";

class MessageService {

    /* ======================================================
       CONVERSATIONS
    ====================================================== */

    getConversations(
        page = 1,
        limit = 20
    ): Promise<ListResponse<Conversation>> {

        const params = new URLSearchParams({

            page: String(page),

            limit: String(limit)

        });

        return Client.get(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}?${params.toString()}`,

            {
                cache: true,
                cacheTTL: 30000
            }

        );

    }

    getConversation(
        conversationId: string
    ): Promise<ApiResponse<Conversation>> {

        return Client.get(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}`

        );

    }

    createConversation(
        data: CreateConversationRequest
    ): Promise<ApiResponse<Conversation>> {

        return Client.post(

            ENDPOINTS.MESSAGES.CONVERSATIONS,

            data

        );

    }

    updateConversation(
        conversationId: string,
        data: UpdateConversationRequest
    ): Promise<ApiResponse<Conversation>> {

        return Client.put(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}`,

            data

        );

    }

    deleteConversation(
        conversationId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}`

        );

    }

    /* ======================================================
       MEMBERS
    ====================================================== */

    addMember(
        conversationId: string,
        userId: string
    ): Promise<ApiResponse<ConversationMember>> {

        return Client.post(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}/members`,

            {
                userId
            }

        );

    }

    removeMember(
        conversationId: string,
        userId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}/members/${encodeURIComponent(userId)}`

        );

    }

    /* ======================================================
       MESSAGES
    ====================================================== */

    getMessages(
        conversationId: string,
        page = 1,
        limit = 50
    ): Promise<ListResponse<Message>> {

        const params = new URLSearchParams({

            page: String(page),

            limit: String(limit)

        });

        return Client.get(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}/messages?${params.toString()}`

        );

    }

    sendMessage(
        conversationId: string,
        data: SendMessageRequest
    ): Promise<ApiResponse<Message>> {

        return Client.post(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}/messages`,

            data

        );

    }

    updateMessage(
        messageId: string,
        content: string
    ): Promise<ApiResponse<Message>> {

        return Client.patch(

            `${ENDPOINTS.MESSAGES.MESSAGE}/${encodeURIComponent(messageId)}`,

            {
                content
            }

        );

    }

    deleteMessage(
        messageId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.MESSAGES.MESSAGE}/${encodeURIComponent(messageId)}`

        );

    }

    /* ======================================================
       READ RECEIPTS
    ====================================================== */

    markRead(
        messageId: string
    ): Promise<ApiResponse> {

        return Client.patch(

            `${ENDPOINTS.MESSAGES.MESSAGE}/${encodeURIComponent(messageId)}/read`

        );

    }

    markConversationRead(
        conversationId: string
    ): Promise<ApiResponse> {

        return Client.patch(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}/read`

        );

    }

    /* ======================================================
       REACTIONS
    ====================================================== */

    react(
        messageId: string,
        reaction: MessageReaction
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.MESSAGES.MESSAGE}/${encodeURIComponent(messageId)}/reactions`,

            reaction

        );

    }

    removeReaction(
        messageId: string,
        reactionId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.MESSAGES.MESSAGE}/${encodeURIComponent(messageId)}/reactions/${encodeURIComponent(reactionId)}`

        );

    }

    /* ======================================================
       TYPING
    ====================================================== */

    typing(
        conversationId: string,
        data: TypingStatus
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.MESSAGES.CONVERSATIONS}/${encodeURIComponent(conversationId)}/typing`,

            data

        );

    }

    /* ======================================================
       SEARCH
    ====================================================== */

    search(
        filter: MessageSearchFilter
    ): Promise<ListResponse<Message>> {

        return Client.post(

            ENDPOINTS.MESSAGES.SEARCH,

            filter

        );

    }

}

export default new MessageService();
