/* ==========================================================
   REMADEF PLATFORM
   CENTRAL API CLIENT
   File: js/api.ts

   RESPONSIBILITIES
   ----------------------------------------------------------
   • Centralize all frontend → backend communication
   • Communicate with the REMADEF Appwrite Function
   • Authentication
   • Profiles
   • Home / infinite feed
   • Notifications
   • Messaging
   • Learning
   • Jobs
   • Apprenticeship
   • Applications
   • Marketplace
   • Business
   • Wallet
   • Escrow
   • Settings

   IMPORTANT
   ----------------------------------------------------------
   UI files should NOT directly call Appwrite Functions.

   UI
      ↓
   Module
      ↓
   RemadefAPI
      ↓
   Appwrite Function
      ↓
   Database / Services
========================================================== */

import CONFIG from "./config";


/* ==========================================================
   TYPES
========================================================== */

export interface APIResponse<T = any> {

    success?: boolean;

    message?: string;

    data?: T;

    user?: any;

    profile?: any;

    accountId?: string;

    [key: string]: any;
}


export interface APIRequestOptions {

    timeout?: number;

    retries?: number;

}


/* ==========================================================
   API CLIENT
========================================================== */

class RemadefAPIClient {


    /* ======================================================
       CONFIGURATION
    ====================================================== */

    private readonly FUNCTION_ID =
        "6a6380f40035f4b76305";


    private readonly timeout =
        CONFIG.api.timeout;


    private readonly retries =
        CONFIG.api.retries;


    /* ======================================================
       APPWRITE FUNCTION EXECUTION
    ====================================================== */

    private async execute(

        path: string,

        method:
            string = "GET",

        data:
            any = null,

        options:
            APIRequestOptions = {}

    ): Promise<APIResponse> {


        const maxRetries =
            options.retries ??
            this.retries;


        let lastError:
            any = null;


        for (
            let attempt = 0;
            attempt <= maxRetries;
            attempt++
        ) {

            try {

                return await this.executeOnce(

                    path,

                    method,

                    data,

                    options.timeout ??
                    this.timeout

                );

            } catch (error) {

                lastError =
                    error;


                if (
                    attempt >=
                    maxRetries
                ) {

                    break;

                }


                await this.delay(

                    500 *
                    (attempt + 1)

                );

            }

        }


        throw lastError ||
            new Error(
                "REMADEF API request failed."
            );

    }


    /* ======================================================
       SINGLE API EXECUTION
    ====================================================== */

    private async executeOnce(

        path:
            string,

        method:
            string,

        data:
            any,

        timeout:
            number

    ): Promise<APIResponse> {


        const appwrite =
            this.getAppwrite();


        const payload = {

            path,

            method:
                method.toUpperCase(),

            body:
                data ?? {}

        };


        const execution =
            await Promise.race([

                appwrite.functions.createExecution(

                    this.FUNCTION_ID,

                    JSON.stringify(
                        payload
                    ),

                    false

                ),

                this.timeoutPromise(
                    timeout
                )

            ]);


        if (
            !execution
        ) {

            throw new Error(
                "No response received from REMADEF API."
            );

        }


        const responseBody =
            (execution as any)
                .responseBody;


        let responseData:
            APIResponse = {};


        if (
            responseBody
        ) {

            try {

                responseData =
                    JSON.parse(
                        responseBody
                    );

            } catch {

                throw new Error(
                    "Invalid JSON response from REMADEF API."
                );

            }

        }


        if (
            (execution as any).status ===
            "failed"
        ) {

            throw new Error(

                responseData.message ||
                "REMADEF API execution failed."

            );

        }


        if (
            responseData.success ===
            false
        ) {

            throw new Error(

                responseData.message ||
                "REMADEF request failed."

            );

        }


        return responseData;

    }


    /* ======================================================
       APPWRITE INSTANCE
    ====================================================== */

    private getAppwrite(): any {

        if (
            typeof window ===
            "undefined"
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
                "Appwrite SDK has not been initialized."
            );

        }


        return appwrite;

    }


    /* ======================================================
       TIMEOUT
    ====================================================== */

    private timeoutPromise(
        milliseconds:
            number
    ): Promise<never> {

        return new Promise(
            (_, reject) => {

                setTimeout(

                    () => {

                        reject(

                            new Error(
                                "REMADEF API request timed out."
                            )

                        );

                    },

                    milliseconds

                );

            }
        );

    }


    /* ======================================================
       DELAY
    ====================================================== */

    private delay(
        milliseconds:
            number
    ): Promise<void> {

        return new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    milliseconds
                );

            }
        );

    }


    /* ======================================================
       GENERIC REQUEST
    ====================================================== */

    async request<T = any>(

        path:
            string,

        method:
            string = "GET",

        data:
            any = null

    ): Promise<APIResponse<T>> {

        return await this.execute(
            path,
            method,
            data
        );

    }


    /* ======================================================
       HEALTH
    ====================================================== */

    async health() {

        return await this.execute(
            "/api/health",
            "GET"
        );

    }


    /* ======================================================
       AUTHENTICATION
    ====================================================== */

    readonly auth = {


        /* --------------------------------------------------
           REGISTER
        -------------------------------------------------- */

        register:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/register",

                    "POST",

                    data

                );

            },


        /* --------------------------------------------------
           LOGIN
        -------------------------------------------------- */

        login:
            async (
                credentials:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/auth/login",

                    "POST",

                    credentials

                );

            },


        /* --------------------------------------------------
           CURRENT SESSION
        -------------------------------------------------- */

        session:
            async () => {

                return await this.execute(

                    "/api/auth/session",

                    "GET"

                );

            },


        /* --------------------------------------------------
           CURRENT USER
        -------------------------------------------------- */

        me:
            async () => {

                return await this.execute(

                    "/api/auth/me",

                    "GET"

                );

            },


        /* --------------------------------------------------
           LOGOUT
        -------------------------------------------------- */

        logout:
            async () => {

                return await this.execute(

                    "/api/auth/logout",

                    "POST"

                );

            },


        /* --------------------------------------------------
           CHANGE PASSWORD
        -------------------------------------------------- */

        changePassword:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/auth/password",

                    "PUT",

                    data

                );

            },


        /* --------------------------------------------------
           VERIFY EMAIL
        -------------------------------------------------- */

        verifyEmail:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/auth/verify-email",

                    "POST",

                    data

                );

            },


        /* --------------------------------------------------
           VERIFY PHONE
        -------------------------------------------------- */

        verifyPhone:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/auth/verify-phone",

                    "POST",

                    data

                );

            }

    };


    /* ======================================================
       PROFILE
    ====================================================== */

    readonly profile = {


        get:
            async () => {

                return await this.execute(

                    "/api/profile",

                    "GET"

                );

            },


        update:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/profile",

                    "PUT",

                    data

                );

            },


        completion:
            async () => {

                return await this.execute(

                    "/api/profile/completion",

                    "GET"

                );

            },


        avatar:
            async (
                data:
                    any
            ) => {

                return await this.execute(

                    "/api/profile/avatar",

                    "POST",

                    data

                );

            }

    };


    /* ======================================================
       HOME / DASHBOARD
    ====================================================== */

    readonly home = {


        dashboard:
            async () => {

                return await this.execute(

                    "/api/dashboard",

                    "GET"

                );

            },


        feed:
            async (
                cursor:
                    string = ""
            ) => {

                const query =
                    cursor
                        ? `?cursor=${encodeURIComponent(cursor)}`
                        : "";

                return await this.execute(

                    `/api/feed${query}`,

                    "GET"

                );

            },


        createPost:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/feed",

                    "POST",

                    data

                );

            },


        deletePost:
            async (
                postId:
                    string
            ) => {

                return await this.execute(

                    `/api/feed/${encodeURIComponent(postId)}`,

                    "DELETE"

                );

            },


        likePost:
            async (
                postId:
                    string
            ) => {

                return await this.execute(

                    `/api/feed/${encodeURIComponent(postId)}/like`,

                    "POST"

                );

            },


        comment:
            async (
                postId:
                    string,

                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    `/api/feed/${encodeURIComponent(postId)}/comments`,

                    "POST",

                    data

                );

            }

    };


    /* ======================================================
       NOTIFICATIONS
    ====================================================== */

    readonly notifications = {


        list:
            async () => {

                return await this.execute(

                    "/api/notifications",

                    "GET"

                );

            },


        markRead:
            async (
                notificationId:
                    string
            ) => {

                return await this.execute(

                    `/api/notifications/${encodeURIComponent(notificationId)}/read`,

                    "PATCH"

                );

            },


        markAllRead:
            async () => {

                return await this.execute(

                    "/api/notifications/read-all",

                    "PATCH"

                );

            }

    };


    /* ======================================================
       MESSAGING
    ====================================================== */

    readonly messages = {


        conversations:
            async () => {

                return await this.execute(

                    "/api/conversations",

                    "GET"

                );

            },


        createConversation:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/conversations",

                    "POST",

                    data

                );

            },


        list:
            async (
                conversationId:
                    string = ""
            ) => {

                const query =
                    conversationId
                        ? `?conversation_id=${encodeURIComponent(conversationId)}`
                        : "";

                return await this.execute(

                    `/api/messages${query}`,

                    "GET"

                );

            },


        send:
            async (

                conversationId:
                    string,

                content:
                    string,

                replyTo:
                    string = ""

            ) => {

                return await this.execute(

                    "/api/messages",

                    "POST",

                    {

                        conversation_id:
                            conversationId,

                        content,

                        reply_to:
                            replyTo

                    }

                );

            },


        delete:
            async (
                messageId:
                    string
            ) => {

                return await this.execute(

                    `/api/messages/${encodeURIComponent(messageId)}`,

                    "DELETE"

                );

            }

    };


    /* ======================================================
       LEARNING
    ====================================================== */

    readonly learning = {


        list:
            async (
                cursor:
                    string = ""
            ) => {

                const query =
                    cursor
                        ? `?cursor=${encodeURIComponent(cursor)}`
                        : "";

                return await this.execute(

                    `/api/learning${query}`,

                    "GET"

                );

            },


        get:
            async (
                learningId:
                    string
            ) => {

                return await this.execute(

                    `/api/learning/${encodeURIComponent(learningId)}`,

                    "GET"

                );

            },


        enroll:
            async (
                learningId:
                    string
            ) => {

                return await this.execute(

                    `/api/learning/${encodeURIComponent(learningId)}/enroll`,

                    "POST"

                );

            },


        progress:
            async (
                learningId:
                    string
            ) => {

                return await this.execute(

                    `/api/learning/${encodeURIComponent(learningId)}/progress`,

                    "GET"

                );

            }

    };


    /* ======================================================
       JOBS
    ====================================================== */

    readonly jobs = {


        list:
            async (
                params:
                    Record<string, any> = {}
            ) => {

                const query =
                    new URLSearchParams(
                        params
                    ).toString();

                return await this.execute(

                    `/api/jobs${query ? `?${query}` : ""}`,

                    "GET"

                );

            },


        get:
            async (
                jobId:
                    string
            ) => {

                return await this.execute(

                    `/api/jobs/${encodeURIComponent(jobId)}`,

                    "GET"

                );

            },


        apply:
            async (
                jobId:
                    string,

                data:
                    Record<string, any> = {}
            ) => {

                return await this.execute(

                    `/api/jobs/${encodeURIComponent(jobId)}/apply`,

                    "POST",

                    data

                );

            }

    };


    /* ======================================================
       APPRENTICESHIP
    ====================================================== */

    readonly apprenticeship = {


        opportunities:
            async () => {

                return await this.execute(

                    "/api/apprenticeship/opportunities",

                    "GET"

                );

            },


        register:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/apprenticeship/register",

                    "POST",

                    data

                );

            },


        applications:
            async () => {

                return await this.execute(

                    "/api/apprenticeship/applications",

                    "GET"

                );

            }

    };


    /* ======================================================
       APPLICATIONS
    ====================================================== */

    readonly applications = {


        list:
            async () => {

                return await this.execute(

                    "/api/applications",

                    "GET"

                );

            },


        get:
            async (
                applicationId:
                    string
            ) => {

                return await this.execute(

                    `/api/applications/${encodeURIComponent(applicationId)}`,

                    "GET"

                );

            },


        withdraw:
            async (
                applicationId:
                    string
            ) => {

                return await this.execute(

                    `/api/applications/${encodeURIComponent(applicationId)}`,

                    "DELETE"

                );

            }

    };


    /* ======================================================
       MARKETPLACE
    ====================================================== */

    readonly marketplace = {


        products:
            async (
                params:
                    Record<string, any> = {}
            ) => {

                const query =
                    new URLSearchParams(
                        params
                    ).toString();

                return await this.execute(

                    `/api/marketplace${query ? `?${query}` : ""}`,

                    "GET"

                );

            },


        product:
            async (
                productId:
                    string
            ) => {

                return await this.execute(

                    `/api/marketplace/${encodeURIComponent(productId)}`,

                    "GET"

                );

            },


        create:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/marketplace",

                    "POST",

                    data

                );

            },


        update:
            async (
                productId:
                    string,

                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    `/api/marketplace/${encodeURIComponent(productId)}`,

                    "PUT",

                    data

                );

            },


        delete:
            async (
                productId:
                    string
            ) => {

                return await this.execute(

                    `/api/marketplace/${encodeURIComponent(productId)}`,

                    "DELETE"

                );

            }

    };


    /* ======================================================
       BUSINESS
    ====================================================== */

    readonly business = {


        list:
            async () => {

                return await this.execute(

                    "/api/businesses",

                    "GET"

                );

            },


        get:
            async (
                businessId:
                    string
            ) => {

                return await this.execute(

                    `/api/businesses/${encodeURIComponent(businessId)}`,

                    "GET"

                );

            },


        create:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/businesses",

                    "POST",

                    data

                );

            },


        update:
            async (
                businessId:
                    string,

                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    `/api/businesses/${encodeURIComponent(businessId)}`,

                    "PUT",

                    data

                );

            }

    };


    /* ======================================================
       WALLET
    ====================================================== */

    readonly wallet = {


        get:
            async () => {

                return await this.execute(

                    "/api/wallet",

                    "GET"

                );

            },


        balance:
            async () => {

                return await this.execute(

                    "/api/wallet/balance",

                    "GET"

                );

            },


        transactions:
            async () => {

                return await this.execute(

                    "/api/wallet/transactions",

                    "GET"

                );

            },


        fund:
            async (
                amount:
                    number,

                email:
                    string,

                metadata:
                    Record<string, any> = {}
            ) => {

                return await this.execute(

                    "/api/wallet/fund/fiat",

                    "POST",

                    {

                        amount,

                        email,

                        metadata

                    }

                );

            },


        withdraw:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/wallet/withdraw",

                    "POST",

                    data

                );

            },


        transfer:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/wallet/transfer",

                    "POST",

                    data

                );

            },


        redeemGiftCard:
            async (
                pinCode:
                    string
            ) => {

                return await this.execute(

                    "/api/wallet/giftcard/redeem",

                    "POST",

                    {

                        pin_code:
                            pinCode

                    }

                );

            }

    };


    /* ======================================================
       ESCROW
    ====================================================== */

    readonly escrow = {


        list:
            async () => {

                return await this.execute(

                    "/api/escrow",

                    "GET"

                );

            },


        get:
            async (
                escrowId:
                    string
            ) => {

                return await this.execute(

                    `/api/escrow/${encodeURIComponent(escrowId)}`,

                    "GET"

                );

            },


        create:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/escrow",

                    "POST",

                    data

                );

            },


        fund:
            async (
                escrowId:
                    string
            ) => {

                return await this.execute(

                    `/api/escrow/${encodeURIComponent(escrowId)}/fund`,

                    "POST"

                );

            },


        release:
            async (
                escrowId:
                    string
            ) => {

                return await this.execute(

                    `/api/escrow/${encodeURIComponent(escrowId)}/release`,

                    "POST"

                );

            },


        dispute:
            async (
                escrowId:
                    string,

                data:
                    Record<string, any> = {}
            ) => {

                return await this.execute(

                    `/api/escrow/${encodeURIComponent(escrowId)}/dispute`,

                    "POST",

                    data

                );

            }

    };


    /* ======================================================
       SEARCH
    ====================================================== */

    readonly search = {


        all:
            async (
                query:
                    string,

                type:
                    string = "all"
            ) => {

                return await this.execute(

                    `/api/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`,

                    "GET"

                );

            }

    };


    /* ======================================================
       SETTINGS
    ====================================================== */

    readonly settings = {


        get:
            async () => {

                return await this.execute(

                    "/api/settings",

                    "GET"

                );

            },


        update:
            async (
                data:
                    Record<string, any>
            ) => {

                return await this.execute(

                    "/api/settings",

                    "PUT",

                    data

                );

            }

    };

}


/* ==========================================================
   CREATE API INSTANCE
========================================================== */

const RemadefAPI =
    new RemadefAPIClient();


/* ==========================================================
   GLOBAL BROWSER ACCESS
========================================================== */

if (
    typeof window !== "undefined"
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
