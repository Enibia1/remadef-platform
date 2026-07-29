/* ============================================================
   REMADEF PLATFORM API CLIENT
   Appwrite Function Execution API
============================================================ */

"use strict";

/* ============================================================
   CONFIGURATION
============================================================ */

const APPWRITE_ENDPOINT =
    "https://fra.cloud.appwrite.io/v1";

const PROJECT_ID =
    "6a634fdc00148a907132";

const FUNCTION_ID =
    "6a6380f40035f4b76305";

const EXECUTION_URL =
    `${APPWRITE_ENDPOINT}/functions/${FUNCTION_ID}/executions`;

/* ============================================================
   DEBUG LOGGER
============================================================ */

function debugLog(message) {

    const debug =
        document.getElementById("debug");

    if (!debug) return;

    debug.textContent +=
        "\n\n" + message;

}

/* ============================================================
   RESPONSE PARSER
============================================================ */

async function parseResponse(response) {

    const text =
        await response.text();

    let data = {};

    try {

        data = text
            ? JSON.parse(text)
            : {};

    }

    catch {

        data = {

            raw: text

        };

    }

    /* ----------------------------------------------
       Unwrap Appwrite Function response
    ---------------------------------------------- */

    if (

        data.body &&

        typeof data.body === "string"

    ) {

        try {

            data = JSON.parse(

                data.body

            );

        }

        catch {}

    }

    if (

        !response.ok ||

        data.success === false

    ) {

        throw new Error(

            data.message ||

            data.error ||

            data.raw ||

            `Request failed (${response.status})`

        );

    }

    return data;

}

/* ============================================================
   EXECUTE APPWRITE FUNCTION
============================================================ */

async function executeFunction(

    method,

    path,

    payload = null

) {

    const request = {

        method,

        path,

        headers: {

            "Content-Type":
                "application/json"

        },

        async: false

    };

    if (

        payload !== null

    ) {

        request.body =
            JSON.stringify(

                payload

            );

    }

    debugLog(

        "==================================================" +

        "\nREQUEST" +

        "\nMETHOD : " + method +

        "\nPATH   : " + path +

        "\nURL    : " + EXECUTION_URL

    );

    let response;

    try {

        response = await fetch(

            EXECUTION_URL,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "X-Appwrite-Project":
                        PROJECT_ID

                },

                body:
                    JSON.stringify(

                        request

                    )

            }

        );

    }

    catch (error) {

        debugLog(

            "NETWORK ERROR\n" +

            error.message

        );

        throw new Error(

            "Unable to connect to the REMADEF Platform."

        );

    }

    debugLog(

        "HTTP STATUS : " +

        response.status

    );

    const data =

        await parseResponse(

            response

        );

    debugLog(

        "RESPONSE\n" +

        JSON.stringify(

            data,

            null,

            2

        )

    );

    return data;

}

/* ============================================================
   PASSWORD MASKER
============================================================ */

function hidePassword(payload) {

    if (!payload)

        return payload;

    const copy = {

        ...payload

    };

    if (

        copy.password

    ) {

        copy.password =
            "[HIDDEN]";

    }

    return copy;

}
/* ============================================================
   REMADEF API
============================================================ */

const RemadefAPI = {

    /* ========================================================
       REGISTER
    ======================================================== */

    async register(payload) {

        debugLog(

            "REGISTER REQUEST\n" +

            JSON.stringify(

                hidePassword(payload),

                null,

                2

            )

        );

        return executeFunction(

            "POST",

            "/api/register",

            payload

        );

    },

    /* ========================================================
       LOGIN (Future)
    ======================================================== */

    async login(payload) {

        debugLog(

            "LOGIN REQUEST\n" +

            JSON.stringify(

                hidePassword(payload),

                null,

                2

            )

        );

        return executeFunction(

            "POST",

            "/api/login",

            payload

        );

    },

    /* ========================================================
       HEALTH
    ======================================================== */

    async health() {

        return executeFunction(

            "GET",

            "/api/health"

        );

    },

    /* ========================================================
       PROFILE
    ======================================================== */

    async getProfile() {

        return executeFunction(

            "GET",

            "/api/profile"

        );

    },

    async updateProfile(profile) {

        return executeFunction(

            "PUT",

            "/api/profile",

            profile

        );

    },

    /* ========================================================
       HOME DASHBOARD
    ======================================================== */

    async getDashboard() {

        return executeFunction(

            "GET",

            "/api/dashboard"

        );

    },

    /* ========================================================
       NOTIFICATIONS
    ======================================================== */

    async getNotifications() {

        return executeFunction(

            "GET",

            "/api/notifications"

        );

    },

    /* ========================================================
       MESSAGES
    ======================================================== */

    async getMessages() {

        return executeFunction(

            "GET",

            "/api/messages"

        );

    },

    /* ========================================================
       CONVERSATIONS
    ======================================================== */

    async getConversations() {

        return executeFunction(

            "GET",

            "/api/conversations"

        );

    },

    async createConversation(payload) {

        return executeFunction(

            "POST",

            "/api/conversations",

            payload

        );

    },

    /* ========================================================
       SEND MESSAGE
    ======================================================== */

    async sendMessage(payload) {

        return executeFunction(

            "POST",

            "/api/messages",

            payload

        );

    },

    /* ========================================================
       MARK NOTIFICATION READ
    ======================================================== */

    async markNotificationRead(notificationId) {

        return executeFunction(

            "PATCH",

            `/api/notifications/${encodeURIComponent(notificationId)}`

        );

    },

    /* ========================================================
       MARK MESSAGE READ (Future)
    ======================================================== */

    async markMessageRead(messageId) {

        return executeFunction(

            "PATCH",

            `/api/messages/${encodeURIComponent(messageId)}/read`

        );

    }

};
/* ============================================================
   OPPORTUNITIES
============================================================ */

RemadefAPI.getLearning = async function () {

    return executeFunction(

        "GET",

        "/api/learning"

    );

};

RemadefAPI.getApprenticeships = async function () {

    return executeFunction(

        "GET",

        "/api/apprenticeships"

    );

};

RemadefAPI.getJobs = async function () {

    return executeFunction(

        "GET",

        "/api/jobs"

    );

};

RemadefAPI.getBusinesses = async function () {

    return executeFunction(

        "GET",

        "/api/businesses"

    );

};

/* ============================================================
   USER SETTINGS
============================================================ */

RemadefAPI.getSettings = async function () {

    return executeFunction(

        "GET",

        "/api/settings"

    );

};

RemadefAPI.updateSettings = async function (settings) {

    return executeFunction(

        "PUT",

        "/api/settings",

        settings

    );

};

/* ============================================================
   SEARCH
============================================================ */

RemadefAPI.search = async function (query) {

    return executeFunction(

        "GET",

        `/api/search?q=${encodeURIComponent(query)}`

    );

};

/* ============================================================
   ADVERTISEMENTS
============================================================ */

RemadefAPI.getSponsored = async function () {

    return executeFunction(

        "GET",

        "/api/advertisements"

    );

};

/* ============================================================
   USER STATISTICS
============================================================ */

RemadefAPI.getStatistics = async function () {

    return executeFunction(

        "GET",

        "/api/statistics"

    );

};

/* ============================================================
   FILES
============================================================ */

RemadefAPI.uploadAvatar = async function (payload) {

    return executeFunction(

        "POST",

        "/api/avatar",

        payload

    );

};

RemadefAPI.deleteAvatar = async function () {

    return executeFunction(

        "DELETE",

        "/api/avatar"

    );

};

/* ============================================================
   PLATFORM STATUS
============================================================ */

RemadefAPI.getPlatformStatus = async function () {

    return executeFunction(

        "GET",

        "/api/platform"

    );

};

/* ============================================================
   FUTURE MODULES
============================================================ */

RemadefAPI.getMarketplace = async function () {

    return executeFunction(

        "GET",

        "/api/marketplace"

    );

};

RemadefAPI.getEvents = async function () {

    return executeFunction(

        "GET",

        "/api/events"

    );

};

RemadefAPI.getCertificates = async function () {

    return executeFunction(

        "GET",

        "/api/certificates"

    );

};

RemadefAPI.getConnections = async function () {

    return executeFunction(

        "GET",

        "/api/connections"

    );

};

RemadefAPI.getAnalytics = async function () {

    return executeFunction(

        "GET",

        "/api/analytics"

    );

};
/* ============================================================
   GLOBAL EXPORT
============================================================ */

window.RemadefAPI = RemadefAPI;

/* ============================================================
   BACKWARD COMPATIBILITY
============================================================ */

window.REMADEF_API = APPWRITE_ENDPOINT;

window.REMADEF_PROJECT_ID = PROJECT_ID;

window.REMADEF_FUNCTION_ID = FUNCTION_ID;

/* ============================================================
   INITIALIZATION
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        debugLog(

            "========================================"

        );

        debugLog(

            "REMADEF Platform API Ready"

        );

        debugLog(

            "Project ID : " +

            PROJECT_ID

        );

        debugLog(

            "Function ID : " +

            FUNCTION_ID

        );

        debugLog(

            "Endpoint : " +

            APPWRITE_ENDPOINT

        );

    }
);

/* ============================================================
   VERIFY CONNECTION
============================================================ */

(async () => {

    try {

        const result =
            await RemadefAPI.health();

        console.log(

            "REMADEF API Connected",

            result

        );

    }

    catch (error) {

        console.warn(

            "REMADEF API Offline",

            error.message

        );

    }

})();

/* ============================================================
   VERSION
============================================================ */

Object.freeze(RemadefAPI);

console.log(

    "%cREMADEF Platform API Loaded",

    "color:#2563EB;font-weight:bold;font-size:14px;"

);

console.log(

    "Version: 2.0.0"

);

console.log(

    "Project:",

    PROJECT_ID

);

console.log(

    "Function:",

    FUNCTION_ID

);
