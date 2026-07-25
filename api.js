/* ============================================================
   REMADEF PLATFORM API CLIENT
   Appwrite Function Execution API
   ASYNC EXECUTION POLLING
============================================================ */

const APPWRITE_ENDPOINT =
    "https://fra.cloud.appwrite.io/v1";

const PROJECT_ID =
    "6a634fdc00148a907132";

const FUNCTION_ID =
    "6a6380f40035f4b76305";

const EXECUTION_URL =
    `${APPWRITE_ENDPOINT}/functions/${FUNCTION_ID}/executions`;

const MAX_ATTEMPTS = 20;
const POLL_DELAY = 1000;


/* ============================================================
   DEBUG LOGGER
============================================================ */

function debugLog(message) {

    const debug =
        document.getElementById("debug");

    if (debug) {

        debug.textContent +=
            "\n\n" + message;

    }

}


/* ============================================================
   WAIT
============================================================ */

function wait(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}


/* ============================================================
   REGISTER
============================================================ */

const RemadefAPI = {


    async register(payload) {


        const maskedPayload = {

            ...payload,

            password: "[HIDDEN]"

        };


        debugLog(

            "API REQUEST STARTED" +

            "\nURL: " + EXECUTION_URL +

            "\nMETHOD: POST" +

            "\nPATH: /api/register" +

            "\nBODY: " +

            JSON.stringify(

                maskedPayload,

                null,

                2

            )

        );


        try {


            /* =================================================
               1. CREATE APPWRITE FUNCTION EXECUTION
            ================================================= */

            const response =

                await fetch(

                    EXECUTION_URL,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "X-Appwrite-Project":
                                PROJECT_ID

                        },


                        body: JSON.stringify({

                            method: "POST",

                            path: "/api/register",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:

                                JSON.stringify(payload),

                            async: true

                        })

                    }

                );


            debugLog(

                "HTTP RESPONSE RECEIVED" +

                "\nSTATUS: " +

                response.status

            );


            const responseText =

                await response.text();


            let execution;


            try {

                execution =
                    JSON.parse(responseText);

            }

            catch {

                execution = {

                    raw: responseText

                };

            }


            if (!response.ok) {

                throw new Error(

                    execution.message ||

                    execution.error ||

                    `Appwrite request failed: ${response.status}`

                );

            }


            const executionId =

                execution.$id;


            if (!executionId) {

                throw new Error(

                    "Appwrite did not return an execution ID."

                );

            }


            debugLog(

                "EXECUTION CREATED" +

                "\nID: " +

                executionId

            );


            /* =================================================
               2. POLL EXECUTION STATUS
            ================================================= */

            const statusURL =

                `${EXECUTION_URL}/${executionId}`;


            for (

                let attempt = 1;

                attempt <= MAX_ATTEMPTS;

                attempt++

            ) {


                await wait(POLL_DELAY);


                debugLog(

                    "CHECKING EXECUTION" +

                    "\nATTEMPT: " +

                    attempt

                );


                const statusResponse =

                    await fetch(

                        statusURL,

                        {

                            method: "GET",

                            headers: {

                                "X-Appwrite-Project":
                                    PROJECT_ID

                            }

                        }

                    );


                const statusText =

                    await statusResponse.text();


                let result;


                try {

                    result =
                        JSON.parse(statusText);

                }

                catch {

                    result = {

                        raw: statusText

                    };

                }


                if (!statusResponse.ok) {

                    throw new Error(

                        result.message ||

                        result.error ||

                        `Execution status request failed: ${statusResponse.status}`

                    );

                }


                debugLog(

                    "EXECUTION STATUS: " +

                    result.status +

                    "\nFUNCTION STATUS CODE: " +

                    (result.responseStatusCode || "PENDING")

                );


                /* =============================================
                   EXECUTION COMPLETED
                ============================================= */

                if (

                    result.status ===

                    "completed"

                ) {


                    let functionResponse =

                        result.responseBody;


                    try {

                        functionResponse =

                            JSON.parse(

                                result.responseBody

                            );

                    }

                    catch {

                        // Response was not JSON

                    }


                    debugLog(

                        "FUNCTION EXECUTION COMPLETED" +

                        "\nSTATUS CODE: " +

                        result.responseStatusCode +

                        "\nRESPONSE: " +

                        JSON.stringify(

                            functionResponse,

                            null,

                            2

                        )

                    );


                    if (

                        result.responseStatusCode >= 400

                    ) {

                        throw new Error(

                            functionResponse.message ||

                            functionResponse.error ||

                            "Registration failed."

                        );

                    }


                    return functionResponse;

                }


                /* =============================================
                   EXECUTION FAILED
                ============================================= */

                if (

                    result.status ===

                    "failed"

                ) {

                    throw new Error(

                        result.errors ||

                        "Function execution failed."

                    );

                }

            }


            throw new Error(

                "Registration is taking too long. Please try again."

            );


        }


        catch (error) {


            debugLog(

                "FETCH/API ERROR: " +

                error.message

            );


            throw error;

        }

    }

};


/* ============================================================
   GLOBAL API
============================================================ */

window.RemadefAPI =

    RemadefAPI;


window.REMADEF_API =

    APPWRITE_ENDPOINT;


console.log(

    "REMADEF API CLIENT LOADED"

);
