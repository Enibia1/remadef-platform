/* ============================================================
REMADEF PLATFORM
API CLIENT
File: js/api.ts

Purpose:

- Central API communication layer
- Appwrite Function Web Bridge
- Typed request/response handling
- Authentication-aware requests
- Shared by all REMADEF modules
  ============================================================ */

/* ============================================================
TYPES
============================================================ */

export type HttpMethod =
| "GET"
| "POST"
| "PUT"
| "PATCH"
| "DELETE"
| "OPTIONS";

export interface ApiResponse<T = unknown> {
success: boolean;
message?: string;
data?: T;
account?: AccountData;
profile?: Profile;
[key: string]: unknown;
}

export interface AccountData {
id: string;
email?: string;
phone?: string;
}

export interface Profile {
$id?: string;
account_id?: string;
email?: string;
phone?: string;
first_name?: string;
last_name?: string;
display_name?: string;
date_of_birth?: string;
gender?: string;
country?: string;
state?: string;
city?: string;
headline?: string;
about?: string;
skills?: string | string[];
education_level?: string;
institution?: string;
profile_completion?: number;
created_at?: string;
updated_at?: string;
[key: string]: unknown;
}

export interface DashboardData {
profile_completion: number;
learning: number;
applications: number;
opportunities: number;
messages: number;
notifications: number;
[key: string]: unknown;
}

export interface Conversation {
$id?: string;
name?: string;
status?: string;
last_message?: string;
updated_at?: string;
created_at?: string;
[key: string]: unknown;
}

export interface Message {
$id?: string;
conversation_id?: string;
sender_id?: string;
content?: string;
reply_preview?: string;
status?: string;
created_at?: string;
[key: string]: unknown;
}

export interface Wallet {
$id?: string;
account_id?: string;
balance?: number;
currency?: string;
status?: string;
created_at?: string;
updated_at?: string;
[key: string]: unknown;
}

export interface Transaction {
$id?: string;
account_id?: string;
amount?: number;
type?: string;
status?: string;
reference?: string;
created_at?: string;
[key: string]: unknown;
}

export interface Escrow {
$id?: string;
account_id?: string;
amount?: number;
status?: string;
created_at?: string;
updated_at?: string;
[key: string]: unknown;
}

export interface WalletData {
wallet: Wallet;
transactions: Transaction[];
}

export interface FeedItem {
$id?: string;
author_id?: string;
content?: string;
media_url?: string;
created_at?: string;
likes?: number;
comments?: number;
shares?: number;
[key: string]: unknown;
}

export interface Notification {
$id?: string;
user_id?: string;
type?: string;
title?: string;
message?: string;
read?: boolean;
created_at?: string;
[key: string]: unknown;
}

/* ============================================================
API CONFIGURATION
============================================================ */

const API_CONFIG = {

functionId:
    "6a6380f40035f4b76305",

timeout:
    30000,

retries:
    2

} as const;

/* ============================================================
ERROR CLASS
============================================================ */

export class RemadefApiError extends Error {

status?: number;

code?: string;

response?: unknown;

constructor(
    message: string,
    status?: number,
    code?: string,
    response?: unknown
) {

    super(message);

    this.name =
        "RemadefApiError";

    this.status =
        status;

    this.code =
        code;

    this.response =
        response;
}

}

/* ============================================================
APPWRITE GLOBAL TYPE
============================================================ */

declare global {

interface Window {

    appwrite?: {

        functions?: {

            createExecution: (

                functionId: string,

                data?: string,

                async?: boolean

            ) => Promise<{

                $id?: string;

                status?: string;

                responseStatusCode?: number;

                responseBody?: string;

                [key: string]: unknown;

            }>;

        };

    };

    RemadefAPI?: typeof RemadefAPI;

}

}

/* ============================================================
API CLIENT
============================================================ */

const RemadefAPI = {

/* ========================================================
   INTERNAL REQUEST ENGINE
======================================================== */

async _execute<T = unknown>(

    path: string,

    method: HttpMethod = "GET",

    data: Record<string, unknown> | null = null,

    attempt = 0

): Promise<ApiResponse<T>> {

    try {

        if (
            typeof window === "undefined" ||
            !window.appwrite ||
            !window.appwrite.functions
        ) {

            throw new RemadefApiError(
                "Appwrite SDK is not initialized."
            );

        }

        const payload = {

            path,

            method,

            body:
                data || {}

        };

        const execution =
            await this.withTimeout(

                window.appwrite.functions.createExecution(

                    API_CONFIG.functionId,

                    JSON.stringify(payload),

                    false

                ),

                API_CONFIG.timeout

            );

        let responseData:
            ApiResponse<T> = {

                success: false

            };

        if (
            execution.responseBody
        ) {

            try {

                responseData =
                    JSON.parse(
                        execution.responseBody
                    );

            } catch {

                throw new RemadefApiError(
                    "Invalid JSON response from server.",
                    execution.responseStatusCode,
                    "INVALID_JSON",
                    execution.responseBody
                );

            }

        }

        const failed =
            execution.status === "failed" ||
            execution.responseStatusCode !== undefined &&
            execution.responseStatusCode >= 400 ||
            responseData.success === false;

        if (failed) {

            throw new RemadefApiError(

                responseData.message ||
                "API request failed.",

                execution.responseStatusCode,

                typeof responseData.code === "string"
                    ? responseData.code
                    : undefined,

                responseData

            );

        }

        return responseData;

    } catch (error) {

        if (
            attempt <
            API_CONFIG.retries
        ) {

            await this.delay(
                500 * (attempt + 1)
            );

            return this._execute<T>(

                path,

                method,

                data,

                attempt + 1

            );

        }

        console.error(

            `[REMADEF API] ${method} ${path}`,

            error

        );

        if (
            error instanceof RemadefApiError
        ) {

            throw error;

        }

        throw new RemadefApiError(

            error instanceof Error
                ? error.message
                : "Unexpected API error."

        );

    }

},

/* ========================================================
   TIMEOUT
======================================================== */

async withTimeout<T>(

    promise: Promise<T>,

    timeout: number

): Promise<T> {

    let timer: ReturnType<typeof setTimeout>;

    const timeoutPromise =
        new Promise<T>((_, reject) => {

            timer =
                setTimeout(() => {

                    reject(

                        new RemadefApiError(
                            "Request timed out.",
                            408,
                            "TIMEOUT"
                        )

                    );

                }, timeout);

        });

    try {

        return await Promise.race([

            promise,

            timeoutPromise

        ]);

    } finally {

        clearTimeout(timer!);

    }

},

/* ========================================================
   DELAY
======================================================== */

async delay(
    ms: number
): Promise<void> {

    await new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

},

/* ========================================================
   HEALTH
======================================================== */

async checkHealth() {

    return this._execute<{

        service: string;

        status: string;

    }>(

        "/api/health",

        "GET"

    );

},

/* ========================================================
   AUTHENTICATION / REGISTRATION
======================================================== */

async register(

    userData: Record<string, unknown>

) {

    return this._execute(

        "/api/register",

        "POST",

        userData

    );

},

async getCurrentUser() {

    return this._execute(

        "/api/auth/me",

        "GET"

    );

},

async logout() {

    return this._execute(

        "/api/auth/logout",

        "POST"

    );

},

async validateSession() {

    return this._execute(

        "/api/auth/session",

        "GET"

    );

},

/* ========================================================
   PROFILE
======================================================== */

async getProfile() {

    return this._execute<Profile>(

        "/api/profile",

        "GET"

    );

},

async updateProfile(

    profileData:
        Partial<Profile>

) {

    return this._execute<Profile>(

        "/api/profile",

        "PUT",

        profileData as Record<string, unknown>

    );

},

/* ========================================================
   DASHBOARD / HOME
======================================================== */

async getDashboard() {

    return this._execute<DashboardData>(

        "/api/dashboard",

        "GET"

    );

},

/* ========================================================
   INFINITE HOME FEED
======================================================== */

async getFeed(

    cursor?: string,

    limit = 20

) {

    const params =
        new URLSearchParams();

    params.set(
        "limit",
        String(limit)
    );

    if (cursor) {

        params.set(
            "cursor",
            cursor
        );

    }

    return this._execute<{

        items: FeedItem[];

        next_cursor?: string;

        has_more?: boolean;

    }>(

        `/api/feed?${params.toString()}`,

        "GET"

    );

},

async createPost(

    content: string,

    mediaUrl?: string

) {

    return this._execute(

        "/api/feed",

        "POST",

        {

            content,

            media_url:
                mediaUrl || ""

        }

    );

},

async likePost(

    postId: string

) {

    return this._execute(

        `/api/feed/${encodeURIComponent(postId)}/like`,

        "POST"

    );

},

async commentPost(

    postId: string,

    content: string

) {

    return this._execute(

        `/api/feed/${encodeURIComponent(postId)}/comments`,

        "POST",

        {

            content

        }

    );

},

/* ========================================================
   NOTIFICATIONS
======================================================== */

async getNotifications(

    cursor?: string

) {

    const query =
        cursor
            ? `?cursor=${encodeURIComponent(cursor)}`
            : "";

    return this._execute<{

        items: Notification[];

        next_cursor?: string;

        has_more?: boolean;

    }>(

        `/api/notifications${query}`,

        "GET"

    );

},

async markNotificationRead(

    notificationId: string

) {

    return this._execute(

        `/api/notifications/${encodeURIComponent(notificationId)}/read`,

        "PATCH"

    );

},

/* ========================================================
   CONVERSATIONS
======================================================== */

async getConversations() {

    return this._execute<Conversation[]>(

        "/api/conversations",

        "GET"

    );

},

async createConversation(

    data: Record<string, unknown>

) {

    return this._execute<Conversation>(

        "/api/conversations",

        "POST",

        data

    );

},

/* ========================================================
   MESSAGES
======================================================== */

async getMessages(

    conversationId: string,

    cursor?: string,

    limit = 50

) {

    const params =
        new URLSearchParams();

    params.set(

        "conversation_id",

        conversationId

    );

    params.set(

        "limit",

        String(limit)

    );

    if (cursor) {

        params.set(

            "cursor",

            cursor

        );

    }

    return this._execute<{

        items: Message[];

        next_cursor?: string;

        has_more?: boolean;

    }>(

        `/api/messages?${params.toString()}`,

        "GET"

    );

},

async sendMessage(

    conversationId: string,

    content: string,

    replyTo: string | null = null

) {

    return this._execute<Message>(

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

async deleteMessage(

    messageId: string

) {

    return this._execute(

        `/api/messages/${encodeURIComponent(messageId)}`,

        "DELETE"

    );

},

/* ========================================================
   LEARNING
======================================================== */

async getLearning(

    cursor?: string

) {

    const query =
        cursor
            ? `?cursor=${encodeURIComponent(cursor)}`
            : "";

    return this._execute(

        `/api/learning${query}`,

        "GET"

    );

},

async getLearningProgram(

    programId: string

) {

    return this._execute(

        `/api/learning/${encodeURIComponent(programId)}`,

        "GET"

    );

},

async enrollLearning(

    programId: string

) {

    return this._execute(

        `/api/learning/${encodeURIComponent(programId)}/enroll`,

        "POST"

    );

},

async updateLearningProgress(

    programId: string,

    progress: number

) {

    return this._execute(

        `/api/learning/${encodeURIComponent(programId)}/progress`,

        "PATCH",

        {

            progress

        }

    );

},

/* ========================================================
   APPRENTICESHIP
======================================================== */

async getApprenticeships(

    cursor?: string

) {

    const query =
        cursor
            ? `?cursor=${encodeURIComponent(cursor)}`
            : "";

    return this._execute(

        `/api/apprenticeships${query}`,

        "GET"

    );

},

async getApprenticeship(

    apprenticeshipId: string

) {

    return this._execute(

        `/api/apprenticeships/${encodeURIComponent(apprenticeshipId)}`,

        "GET"

    );

},

async applyApprenticeship(

    apprenticeshipId: string

) {

    return this._execute(

        `/api/apprenticeships/${encodeURIComponent(apprenticeshipId)}/apply`,

        "POST"

    );

},

/* ========================================================
   BUSINESS
======================================================== */

async getBusinesses(

    cursor?: string

) {

    const query =
        cursor
            ? `?cursor=${encodeURIComponent(cursor)}`
            : "";

    return this._execute(

        `/api/businesses${query}`,

        "GET"

    );

},

async getBusiness(

    businessId: string

) {

    return this._execute(

        `/api/businesses/${encodeURIComponent(businessId)}`,

        "GET"

    );

},

async createBusiness(

    businessData:
        Record<string, unknown>

) {

    return this._execute(

        "/api/businesses",

        "POST",

        businessData

    );

},

/* ========================================================
   GIGS / JOBS
======================================================== */

async getGigs(

    cursor?: string

) {

    const query =
        cursor
            ? `?cursor=${encodeURIComponent(cursor)}`
            : "";

    return this._execute(

        `/api/gigs${query}`,

        "GET"

    );

},

async getJobs(

    cursor?: string

) {

    const query =
        cursor
            ? `?cursor=${encodeURIComponent(cursor)}`
            : "";

    return this._execute(

        `/api/jobs${query}`,

        "GET"

    );

},

async applyForJob(

    jobId: string

) {

    return this._execute(

        `/api/jobs/${encodeURIComponent(jobId)}/apply`,

        "POST"

    );

},

/* ========================================================
   APPLICATIONS
======================================================== */

async getApplications() {

    return this._execute(

        "/api/applications",

        "GET"

    );

},

async getApplication(

    applicationId: string

) {

    return this._execute(

        `/api/applications/${encodeURIComponent(applicationId)}`,

        "GET"

    );

},

/* ========================================================
   WALLET
======================================================== */

async getWallet() {

    return this._execute<WalletData>(

        "/api/wallet",

        "GET"

    );

},

async getWalletBalance() {

    return this._execute<{

        balance: number;

        currency: string;

    }>(

        "/api/wallet/balance",

        "GET"

    );

},

async fundWalletFiat(

    amount: number,

    email: string,

    metadata:
        Record<string, unknown> = {}

) {

    return this._execute(

        "/api/wallet/fund/fiat",

        "POST",

        {

            amount,

            email,

            metadata

        }

    );

},

async getTransactions(

    cursor?: string

) {

    const query =
        cursor
            ? `?cursor=${encodeURIComponent(cursor)}`
            : "";

    return this._execute(

        `/api/wallet/transactions${query}`,

        "GET"

    );

},

async transferWallet(

    recipientId: string,

    amount: number,

    description = ""

) {

    return this._execute(

        "/api/wallet/transfer",

        "POST",

        {

            recipient_id:
                recipientId,

            amount,

            description

        }

    );

},

async withdrawWallet(

    amount: number,

    destination:
        Record<string, unknown>

) {

    return this._execute(

        "/api/wallet/withdraw",

        "POST",

        {

            amount,

            destination

        }

    );

},

async redeemGiftCard(

    pinCode: string

) {

    return this._execute(

        "/api/wallet/giftcard/redeem",

        "POST",

        {

            pin_code:
                pinCode

        }

    );

},

/* ========================================================
   ESCROW
======================================================== */

async getEscrows() {

    return this._execute<Escrow[]>(

        "/api/escrow",

        "GET"

    );

},

async createEscrow(

    data:
        Record<string, unknown>

) {

    return this._execute(

        "/api/escrow",

        "POST",

        data

    );

},

async fundEscrow(

    escrowId: string

) {

    return this._execute(

        `/api/escrow/${encodeURIComponent(escrowId)}/fund`,

        "POST"

    );

},

async releaseEscrow(

    escrowId: string

) {

    return this._execute(

        `/api/escrow/${encodeURIComponent(escrowId)}/release`,

        "POST"

    );

},

async cancelEscrow(

    escrowId: string

) {

    return this._execute(

        `/api/escrow/${encodeURIComponent(escrowId)}/cancel`,

        "POST"

    );

},

async disputeEscrow(

    escrowId: string,

    reason: string

) {

    return this._execute(

        `/api/escrow/${encodeURIComponent(escrowId)}/dispute`,

        "POST",

        {

            reason

        }

    );

},

/* ========================================================
   SEARCH
======================================================== */

async search(

    query: string,

    type = "all",

    limit = 20

) {

    const params =
        new URLSearchParams();

    params.set(
        "q",
        query
    );

    params.set(
        "type",
        type
    );

    params.set(
        "limit",
        String(limit)
    );

    return this._execute(

        `/api/search?${params.toString()}`,

        "GET"

    );

}

};

/* ============================================================
GLOBAL EXPORT
============================================================ */

if (
typeof window !== "undefined"
) {

window.RemadefAPI =
    RemadefAPI;

}

/* ============================================================
MODULE EXPORT
============================================================ */

export default RemadefAPI;
export { RemadefAPI };
