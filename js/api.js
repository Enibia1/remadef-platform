/* ============================================================
   REMADEF PLATFORM API CLIENT
   Appwrite Function Execution API
============================================================ */


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

        document.getElementById(

            "debug"

        );


    if (

        debug

    ) {


        debug.textContent +=

            "\n\n" +

            message;

    }

}


/* ============================================================
   RESPONSE PARSER
============================================================ */

async function parseResponse(response) {


    const text =

        await response.text();


    let data;


    try {


        data =

            text

                ? JSON.parse(text)

                : {};


    }


    catch {


        data = {


            raw:

                text

        };

    }


    if (

        !response.ok

    ) {


        throw new Error(


            data.message ||

            data.error ||

            data.raw ||

            `Request failed with status ${response.status}`

        );

    }


    return data;

}


/* ============================================================
   EXECUTE FUNCTION
============================================================ */

async function executeFunction(

    method,

    path,

    payload = null

) {


    const requestBody = {


        method:


            method,


        path:


            path,


        headers:


            {


                "Content-Type":

                    "application/json"

            },


        async:


            false

    };


    if (

        payload !== null

    ) {


        requestBody.body =

            JSON.stringify(

                payload

            );

    }


    debugLog(


        "API REQUEST STARTED" +

        "\nURL: " +

        EXECUTION_URL +

        "\nMETHOD: " +

        method +

        "\nPATH: " +

        path

    );


    let response;


    try {


        response =

            await fetch(


                EXECUTION_URL,


                {


                    method:

                        "POST",


                    headers:


                        {


                            "Content-Type":

                                "application/json",


                            "X-Appwrite-Project":

                                PROJECT_ID

                        },


                    body:


                        JSON.stringify(

                            requestBody

                        )

                }

            );


    }


    catch (

        error

    ) {


        debugLog(


            "NETWORK ERROR: " +

            error.message

        );


        throw new Error(


            "Unable to connect to the REMADEF server. Please check your internet connection or try again."

        );

    }


    debugLog(


        "HTTP RESPONSE RECEIVED" +

        "\nSTATUS: " +

        response.status

    );


    const data =

        await parseResponse(

            response

        );


    debugLog(


        "FUNCTION EXECUTION COMPLETED" +

        "\nRESPONSE: " +

        JSON.stringify(

            data,

            null,

            2

        )

    );


    return data;

}


/* ============================================================
   REMADEF API
============================================================ */

const RemadefAPI = {


    /* ========================================================
       REGISTER
    ======================================================== */

    async register(payload) {


        const maskedPayload = {


            ...payload,


            password:

                "[HIDDEN]"

        };


        debugLog(


            "REGISTER REQUEST" +

            "\nBODY: " +

            JSON.stringify(

                maskedPayload,

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
       LOGIN
    ======================================================== */

    async login(payload) {


        const maskedPayload = {


            ...payload,


            password:

                "[HIDDEN]"

        };


        debugLog(


            "LOGIN REQUEST" +

            "\nBODY: " +

            JSON.stringify(

                maskedPayload,

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
       HEALTH CHECK
    ======================================================== */

    async health() {


        return executeFunction(


            "GET",


            "/api/health"

        );

    },


    /* ========================================================
       GET PROFILE
    ======================================================== */

    async getProfile(accountId) {


        return executeFunction(


            "GET",


            `/api/profile/${encodeURIComponent(accountId)}`

        );

    },


    /* ========================================================
       UPDATE PROFILE
    ======================================================== */

    async updateProfile(

        accountId,

        profile

    ) {


        return executeFunction(


            "PUT",


            `/api/profile/${encodeURIComponent(accountId)}`,


            profile

        );

    }

};


/* ============================================================
   GLOBAL EXPORT
============================================================ */

window.RemadefAPI =

    RemadefAPI;


/* ============================================================
   BACKWARD COMPATIBILITY
============================================================ */

window.REMADEF_API =

    APPWRITE_ENDPOINT;


/* ============================================================
   CONFIRMATION
============================================================ */

console.log(

    "REMADEF API CLIENT LOADED"

);


console.log(

    "Function ID:",

    FUNCTION_ID

);


console.log(

    "Execution URL:",

    EXECUTION_URL

);
