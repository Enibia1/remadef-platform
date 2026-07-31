/* ==========================================================
   REMADEF PLATFORM
   CENTRAL API CLIENT
   File: js/api.ts

   Architecture:

   UI MODULE
       ↓
   api.ts
       ↓
   Appwrite Function
       ↓
   REMADEF Platform API
       ↓
   Appwrite Database / Auth / Storage

   IMPORTANT:
   - Do NOT call Appwrite Functions directly from modules.
   - Modules should use this API client.
   - Backend routes must exist before their methods are used.
========================================================== */


/* ==========================================================
   TYPES
========================================================== */

export type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";


export interface ApiResponse<T = any> {

    success?: boolean;

    message?: string;

    data?: T;

    error?: string;

    [key: string]: any;
}


export interface ApiError {

    message: string;

    status?: number;

    response?: any;
}


/* ==========================================================
   CONFIGURATION
========================================================== */

const API_CONFIG = {

    /*
     * Existing REMADEF Platform Appwrite Function.
     */
    functionId:
        "6a6380f40035f4b76305",

    /*
     * Existing project.
     */
    projectId:
        "6a634fdc00148a907132",

    /*
     * Default request settings.
     */
    timeout:
        30000,

    retries:
        2
};


/* ==========================================================
   APPWRITE SDK ACCESS
========================================================== */

function getAppwrite() {

    if (
        typeof window === "undefined"
    ) {

        throw new Error(
            "REMADEF API requires a browser environment."
        );
    }


    const appwrite =
        (window as any).appwrite;


    if (
        !appwrite ||
        !appwrite.functions
    ) {

        throw new Error(
            "Appwrite SDK is not initialized."
        );
    }


    return appwrite;
}


/* ==========================================================
   REQUEST ID
========================================================== */

function createRequestId(): string {

    return (
        "remadef-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}


/* ==========================================================
   DELAY
========================================================== */

function delay(
    milliseconds: number
): Promise<void> {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


/* ==========================================================
   RETRY POLICY
========================================================== */

function shouldRetry(
    error: any,
    attempt: number
): boolean {

    if (
        attempt >=
        API_CONFIG.retries
    ) {

        return false;
    }


    /*
     * Validation / authentication /
     * permission errors should not
     * automatically repeat.
     */

    const status =
        error?.status;


    if (
        status === 400 ||
        status === 401 ||
        status === 403 ||
        status === 404 ||
        status === 409 ||
        status === 422
    ) {

        return false;
    }


    return true;
}


/* ==========================================================
   RESPONSE PARSER
========================================================== */

function parseResponse(
    execution: any
): ApiResponse {

    if (
        !execution
    ) {

        throw new Error(
            "No response received from REMADEF API."
        );
    }


    if (
        execution.responseBody
    ) {

        try {

            return JSON.parse(
                execution.responseBody
            );

        } catch {

            throw new Error(
                "Invalid JSON response from REMADEF server."
            );
        }
    }


    return {};
}


/* ==========================================================
   CENTRAL EXECUTION ENGINE
========================================================== */

async function execute<T = any>(
    path: string,
    method: HttpMethod = "GET",
    data: any = null
): Promise<ApiResponse<T>> {

    const requestId =
        createRequestId();


    let attempt = 0;


    while (true) {

        try {

            const appwrite =
                getAppwrite();


            /*
             * REMADEF Function payload.
             *
             * This preserves the structure
             * already used by your working api.js.
             */

            const payload = {

                path,

                method:
                    method.toUpperCase(),

                body:
                    data ?? {},

                request_id:
                    requestId
            };


            /*
             * Execute existing Appwrite Function.
             */

            const execution =
                await appwrite.functions.createExecution(

                    API_CONFIG.functionId,

                    JSON.stringify(payload),

                    false
                );


            /*
             * Appwrite execution failure.
             */

            if (
                execution.status ===
                "failed"
            ) {

                const error: any =
                    new Error(
                        "REMADEF API execution failed."
                    );

                error.status =
                    execution.responseStatusCode;

                throw error;
            }


            /*
             * Parse response.
             */

            const response =
                parseResponse(
                    execution
                );


            /*
             * Backend explicitly
             * returned failure.
             */

            if (
                response.success === false
            ) {

                const error: any =
                    new Error(
                        response.message ||
                        response.error ||
                        "REMADEF API request failed."
                    );

                error.status =
                    execution.responseStatusCode;

                error.response =
                    response;

                throw error;
            }


            return response;


        } catch (error: any) {

            console.error(
                `[REMADEF API] ${method} ${path}`,
                error
            );


            if (
                !shouldRetry(
                    error,
                    attempt
                )
            ) {

                throw error;
            }


            attempt++;


            await delay(
                500 * attempt
            );
        }
    }
}


/* ==========================================================
   HEALTH
========================================================== */

export async function checkHealth() {

    return execute(
        "/api/health",
        "GET"
    );
}


/* ==========================================================
   AUTHENTICATION
========================================================== */

export const AuthAPI = {

    /*
     * Registration
     */
    async register(
        userData: Record<string, any>
    ) {

        return execute(
            "/api/register",
            "POST",
            userData
        );
    },


    /*
     * Login
     *
     * Backend route must be implemented
     * if not already present.
     */
    async login(
        credentials: Record<string, any>
    ) {

        return execute(
            "/api/login",
            "POST",
            credentials
        );
    },


    /*
     * Current authenticated user.
     */
    async me() {

        return execute(
            "/api/auth/me",
            "GET"
        );
    },


    /*
     * Session validation.
     */
    async session() {

        return execute(
            "/api/auth/session",
            "GET"
        );
    },


    /*
     * Logout.
     */
    async logout() {

        return execute(
            "/api/logout",
            "POST"
        );
    },


    /*
     * Password reset request.
     */
    async forgotPassword(
        data: Record<string, any>
    ) {

        return execute(
            "/api/auth/forgot-password",
            "POST",
            data
        );
    },


    /*
     * Password reset confirmation.
     */
    async resetPassword(
        data: Record<string, any>
    ) {

        return execute(
            "/api/auth/reset-password",
            "POST",
            data
        );
    }
};


/* ==========================================================
   PROFILE
========================================================== */

export const ProfileAPI = {

    async get() {

        return execute(
            "/api/profile",
            "GET"
        );
    },


    async update(
        profileData: Record<string, any>
    ) {

        return execute(
            "/api/profile",
            "PUT",
            profileData
        );
    },


    async completion() {

        return execute(
            "/api/profile/completion",
            "GET"
        );
    }
};


/* ==========================================================
   DASHBOARD / HOME
========================================================== */

export const HomeAPI = {

    async getDashboard() {

        return execute(
            "/api/dashboard",
            "GET"
        );
    },


    /*
     * Main infinite social/community feed.
     */
    async getFeed(
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/feed?page=${page}&limit=${limit}`,
            "GET"
        );
    },


    /*
     * Individual feed item.
     */
    async getFeedItem(
        id: string
    ) {

        return execute(
            `/api/feed/${encodeURIComponent(id)}`,
            "GET"
        );
    },


    /*
     * Create a feed post.
     */
    async createPost(
        data: Record<string, any>
    ) {

        return execute(
            "/api/feed",
            "POST",
            data
        );
    },


    /*
     * Like / react.
     */
    async react(
        postId: string,
        reaction: string
    ) {

        return execute(
            `/api/feed/${encodeURIComponent(postId)}/react`,
            "POST",
            {
                reaction
            }
        );
    },


    /*
     * Comments.
     */
    async getComments(
        postId: string
    ) {

        return execute(
            `/api/feed/${encodeURIComponent(postId)}/comments`,
            "GET"
        );
    },


    async addComment(
        postId: string,
        content: string
    ) {

        return execute(
            `/api/feed/${encodeURIComponent(postId)}/comments`,
            "POST",
            {
                content
            }
        );
    }
};


/* ==========================================================
   NOTIFICATIONS
========================================================== */

export const NotificationsAPI = {

    async get() {

        return execute(
            "/api/notifications",
            "GET"
        );
    },


    async unreadCount() {

        return execute(
            "/api/notifications/unread",
            "GET"
        );
    },


    async markRead(
        notificationId: string
    ) {

        return execute(
            `/api/notifications/${encodeURIComponent(notificationId)}/read`,
            "PATCH"
        );
    },


    async markAllRead() {

        return execute(
            "/api/notifications/read-all",
            "PATCH"
        );
    }
};


/* ==========================================================
   MESSAGES
========================================================== */

export const MessagesAPI = {

    /*
     * Conversations
     */

    async getConversations() {

        return execute(
            "/api/conversations",
            "GET"
        );
    },


    async createConversation(
        data: Record<string, any>
    ) {

        return execute(
            "/api/conversations",
            "POST",
            data
        );
    },


    /*
     * Messages
     */

    async getMessages(
        conversationId?: string
    ) {

        const path =
            conversationId

                ? `/api/messages?conversation_id=${encodeURIComponent(conversationId)}`

                : "/api/messages";


        return execute(
            path,
            "GET"
        );
    },


    async sendMessage(
        conversationId: string,
        content: string,
        replyTo: string | null = null
    ) {

        return execute(
            "/api/messages",
            "POST",
            {
                conversation_id:
                    conversationId,

                content,

                reply_to:
                    replyTo || ""
            }
        );
    },


    async markRead(
        messageId: string
    ) {

        return execute(
            `/api/messages/${encodeURIComponent(messageId)}/read`,
            "PATCH"
        );
    },


    async deleteMessage(
        messageId: string
    ) {

        return execute(
            `/api/messages/${encodeURIComponent(messageId)}`,
            "DELETE"
        );
    },


    async deleteConversation(
        conversationId: string
    ) {

        return execute(
            `/api/conversations/${encodeURIComponent(conversationId)}`,
            "DELETE"
        );
    }
};


/* ==========================================================
   LEARNING
========================================================== */

export const LearningAPI = {

    async getCourses(
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/learning/courses?page=${page}&limit=${limit}`,
            "GET"
        );
    },


    async getCourse(
        courseId: string
    ) {

        return execute(
            `/api/learning/courses/${encodeURIComponent(courseId)}`,
            "GET"
        );
    },


    async enroll(
        courseId: string
    ) {

        return execute(
            `/api/learning/courses/${encodeURIComponent(courseId)}/enroll`,
            "POST"
        );
    },


    async getProgress(
        courseId: string
    ) {

        return execute(
            `/api/learning/courses/${encodeURIComponent(courseId)}/progress`,
            "GET"
        );
    },


    async updateProgress(
        courseId: string,
        data: Record<string, any>
    ) {

        return execute(
            `/api/learning/courses/${encodeURIComponent(courseId)}/progress`,
            "PUT",
            data
        );
    }
};


/* ==========================================================
   APPRENTICESHIP
========================================================== */

export const ApprenticeshipAPI = {

    async getOpportunities(
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/apprenticeship/opportunities?page=${page}&limit=${limit}`,
            "GET"
        );
    },


    async getOpportunity(
        opportunityId: string
    ) {

        return execute(
            `/api/apprenticeship/opportunities/${encodeURIComponent(opportunityId)}`,
            "GET"
        );
    },


    async apply(
        opportunityId: string,
        data: Record<string, any> = {}
    ) {

        return execute(
            `/api/apprenticeship/opportunities/${encodeURIComponent(opportunityId)}/apply`,
            "POST",
            data
        );
    },


    async getApplications() {

        return execute(
            "/api/apprenticeship/applications",
            "GET"
        );
    },


    async getProgress(
        applicationId: string
    ) {

        return execute(
            `/api/apprenticeship/applications/${encodeURIComponent(applicationId)}/progress`,
            "GET"
        );
    }
};


/* ==========================================================
   BUSINESS
========================================================== */

export const BusinessAPI = {

    async getBusinesses(
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/business?page=${page}&limit=${limit}`,
            "GET"
        );
    },


    async getBusiness(
        businessId: string
    ) {

        return execute(
            `/api/business/${encodeURIComponent(businessId)}`,
            "GET"
        );
    },


    async createBusiness(
        data: Record<string, any>
    ) {

        return execute(
            "/api/business",
            "POST",
            data
        );
    },


    async updateBusiness(
        businessId: string,
        data: Record<string, any>
    ) {

        return execute(
            `/api/business/${encodeURIComponent(businessId)}`,
            "PUT",
            data
        );
    },


    async getGigs(
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/gigs?page=${page}&limit=${limit}`,
            "GET"
        );
    },


    async createGig(
        data: Record<string, any>
    ) {

        return execute(
            "/api/gigs",
            "POST",
            data
        );
    }
};


/* ==========================================================
   MARKETPLACE
==========================================================

   Marketplace remains DORMANT in the current platform plan.

   These endpoints are reserved for future activation.
========================================================== */

export const MarketplaceAPI = {

    async getProducts(
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/marketplace/products?page=${page}&limit=${limit}`,
            "GET"
        );
    },


    async getProduct(
        productId: string
    ) {

        return execute(
            `/api/marketplace/products/${encodeURIComponent(productId)}`,
            "GET"
        );
    }
};


/* ==========================================================
   SEARCH
========================================================== */

export const SearchAPI = {

    async search(
        query: string,
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
            "GET"
        );
    }
};


/* ==========================================================
   WALLET
========================================================== */

export const WalletAPI = {

    async getBalance() {

        return execute(
            "/api/wallet/balance",
            "GET"
        );
    },


    async getTransactions(
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/wallet/transactions?page=${page}&limit=${limit}`,
            "GET"
        );
    },


    /*
     * Existing working fiat funding endpoint.
     */
    async fundWalletFiat(
        amount: number,
        email: string,
        metadata: Record<string, any> = {}
    ) {

        return execute(
            "/api/wallet/fund/fiat",
            "POST",
            {
                amount,

                email,

                metadata
            }
        );
    },


    /*
     * Existing gift card endpoint.
     */
    async redeemGiftCard(
        pinCode: string
    ) {

        return execute(
            "/api/wallet/giftcard/redeem",
            "POST",
            {
                pin_code:
                    pinCode
            }
        );
    },


    async withdraw(
        data: Record<string, any>
    ) {

        return execute(
            "/api/wallet/withdraw",
            "POST",
            data
        );
    },


    async getDepositStatus(
        transactionId: string
    ) {

        return execute(
            `/api/wallet/deposit/${encodeURIComponent(transactionId)}`,
            "GET"
        );
    }
};


/* ==========================================================
   ESCROW
========================================================== */

export const EscrowAPI = {

    async getActive() {

        return execute(
            "/api/escrow",
            "GET"
        );
    },


    async getEscrow(
        escrowId: string
    ) {

        return execute(
            `/api/escrow/${encodeURIComponent(escrowId)}`,
            "GET"
        );
    },


    async create(
        data: Record<string, any>
    ) {

        return execute(
            "/api/escrow",
            "POST",
            data
        );
    },


    async release(
        escrowId: string
    ) {

        return execute(
            `/api/escrow/${encodeURIComponent(escrowId)}/release`,
            "POST"
        );
    },


    async dispute(
        escrowId: string,
        data: Record<string, any>
    ) {

        return execute(
            `/api/escrow/${encodeURIComponent(escrowId)}/dispute`,
            "POST",
            data
        );
    },


    async history(
        page = 1,
        limit = 20
    ) {

        return execute(
            `/api/escrow/history?page=${page}&limit=${limit}`,
            "GET"
        );
    }
};


/* ==========================================================
   SETTINGS
========================================================== */

export const SettingsAPI = {

    async get() {

        return execute(
            "/api/settings",
            "GET"
        );
    },


    async update(
        data: Record<string, any>
    ) {

        return execute(
            "/api/settings",
            "PUT",
            data
        );
    },


    async updatePreferences(
        data: Record<string, any>
    ) {

        return execute(
            "/api/settings/preferences",
            "PUT",
            data
        );
    },


    async updateSecurity(
        data: Record<string, any>
    ) {

        return execute(
            "/api/settings/security",
            "PUT",
            data
        );
    }
};


/* ==========================================================
   FILES / MEDIA
========================================================== */

export const FilesAPI = {

    async upload(
        data: Record<string, any>
    ) {

        return execute(
            "/api/files/upload",
            "POST",
            data
        );
    },


    async delete(
        fileId: string
    ) {

        return execute(
            `/api/files/${encodeURIComponent(fileId)}`,
            "DELETE"
        );
    }
};


/* ==========================================================
   ADMIN / SYSTEM
========================================================== */

export const SystemAPI = {

    async health() {

        return execute(
            "/api/health",
            "GET"
        );
    }
};


/* ==========================================================
   COMPLETE API OBJECT
========================================================== */

const RemadefAPI = {

    /*
     * Core
     */
    execute,

    checkHealth,


    /*
     * Authentication
     */
    auth:
        AuthAPI,


    /*
     * Profile
     */
    profile:
        ProfileAPI,


    /*
     * Home
     */
    home:
        HomeAPI,


    dashboard:
        HomeAPI,


    /*
     * Notifications
     */
    notifications:
        NotificationsAPI,


    /*
     * Messages
     */
    messages:
        MessagesAPI,


    /*
     * Learning
     */
    learning:
        LearningAPI,


    /*
     * Apprenticeship
     */
    apprenticeship:
        ApprenticeshipAPI,


    /*
     * Business
     */
    business:
        BusinessAPI,


    /*
     * Marketplace
     */
    marketplace:
        MarketplaceAPI,


    /*
     * Search
     */
    search:
        SearchAPI,


    /*
     * Wallet
     */
    wallet:
        WalletAPI,


    /*
     * Escrow
     */
    escrow:
        EscrowAPI,


    /*
     * Settings
     */
    settings:
        SettingsAPI,


    /*
     * Files
     */
    files:
        FilesAPI,


    /*
     * System
     */
    system:
        SystemAPI
};


/* ==========================================================
   BROWSER GLOBAL
========================================================== */

if (
    typeof window !==
    "undefined"
) {

    (
        window as any
    ).RemadefAPI =
        RemadefAPI;
}


/* ==========================================================
   DEFAULT EXPORT
========================================================== */

export default RemadefAPI;
