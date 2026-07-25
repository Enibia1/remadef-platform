/* ============================================================
   REMADEF PLATFORM API CLIENT
   APPWRITE EXECUTION + RESULT POLLING
============================================================ */

const REMADEF_API = "https://appwrite.io";

const PROJECT_ID =
    "6a634fdc00148a907132";

const FUNCTION_ID =
    "6a6380f40035f4b76305";

const MAX_POLL_ATTEMPTS = 30;

const POLL_INTERVAL = 500;


/* ============================================================
   DEBUG HELPER
============================================================ */

function updateDebug(message) {

    const debug =
        document.getElementById("debug");

    if (!debug) return;

    debug.textContent +=
        "\n\n" + message;

}


/* ============================================================
   WAIT
============================================================ */

function sleep(milliseconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            milliseconds
        );

    });

}


/* ============================================================
   PARSE FUNCTION RESPONSE
============================================================ */

function parseResponseBody(responseBody) {

    if (!responseBody) {

        return {

            success: true,

            message:
                "Registration completed successfully."

        };

    }


    if (typeof responseBody === "object") {

        return responseBody;

    }


    try {

        return JSON.parse(
            responseBody
        );

    } catch {

        return {

            success: true,

            raw: responseBody

        };

    }

}


/* ============================================================
   REMADEF API
============================================================ */

const RemadefAPI = {


    /* ========================================================
       EXECUTE FUNCTION AND WAIT FOR RESULT
    ======================================================== */

    async request(

        path = "/",

        options = {}

    ) {


        const debug =
            document.getElementById("debug");


        const functionPath =
            path;


        updateDebug(

            "EXECUTING REMADEF REGISTRATION FUNCTION..."

        );


        /* ====================================================
           STEP 1 — CREATE EXECUTION
        ==================================================== */

        const executionResponse =
            await fetch(

                `${REMADEF_API}/functions/${FUNCTION_ID}/executions`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "X-Appwrite-Project":
                            PROJECT_ID

                    },

                    body: JSON.stringify({

                        body:

                            options.body || {},

                        path:

                            functionPath,

                        method:

                            options.method || "GET",

                        headers: {

                            "Content-Type":
                                "application/json"

                        }

                    })

                }

            );


        if (!executionResponse.ok) {

            throw new Error(

                `Execution creation failed: ${executionResponse.status}`

            );

        }


        const execution =
            await executionResponse.json();


        const executionId =
            execution.$id;


        if (!executionId) {

            throw new Error(

                "Appwrite did not return an execution ID."

            );

        }


        updateDebug(

            "EXECUTION CREATED\nID: " +
            executionId

        );


        /* ====================================================
           STEP 2 — POLL EXECUTION STATUS
        ==================================================== */

        for (

            let attempt = 1;

            attempt <= MAX_POLL_ATTEMPTS;

            attempt++

        ) {


            await sleep(

                POLL_INTERVAL

            );


            updateDebug(

                "CHECKING EXECUTION STATUS...\nATTEMPT: " +
                attempt

            );


            const statusResponse =
                await fetch(

                    `${REMADEF_API}/functions/${FUNCTION_ID}/executions/${executionId}`,

                    {

                        method: "GET",

                        headers: {

                            "X-Appwrite-Project":
                                PROJECT_ID

                        }

                    }

                );


            if (!statusResponse.ok) {

                throw new Error(

                    `Could not retrieve execution status: ${statusResponse.status}`

                );

            }


            const currentExecution =
                await statusResponse.json();


            const status =
                currentExecution.status;


            updateDebug(

                "EXECUTION STATUS: " +
                status

            );


            /* =================================================
               COMPLETED
            ================================================= */

            if (

                status ===
                "completed"

            ) {


                updateDebug(

                    "EXECUTION COMPLETED"

                );


                updateDebug(

                    "HTTP STATUS: " +
                    (

                        currentExecution.responseStatusCode
                        || "unknown"

                    )

                );


                updateDebug(

                    "RESPONSE RECEIVED"

                );


                return parseResponseBody(

                    currentExecution.responseBody

                );

            }


            /* =================================================
               FAILED
            ================================================= */

            if (

                status ===
                "failed"

            ) {


                throw new Error(

                    currentExecution.responseBody

                    ||

                    currentExecution.stderr

                    ||

                    "REMADEF function execution failed."

                );

            }

        }


        /* ====================================================
           TIMEOUT
        ==================================================== */

        throw new Error(

            "The REMADEF function took too long to respond."

        );

    },


    /* ========================================================
       API HEALTH
    ======================================================== */

    async health() {

        return await this.request(

            "/api/health",

            {

                method: "GET"

            }

        );

    },


    /* ========================================================
       API STATUS
    ======================================================== */

    async status() {

        return await this.request(

            "/",

            {

                method: "GET"

            }

        );

    },


    /* ========================================================
       ACCOUNT REGISTRATION
    ======================================================== */

    async register(payload) {

        return await this.request(

            "/api/register",

            {

                method: "POST",

                body: payload

            }

        );

    }

};


/* ============================================================
   GLOBAL EXPORT
============================================================ */

window.RemadefAPI =
    RemadefAPI;


window.REMADEF_API =
    REMADEF_API;


updateDebug(

    "REMADEF API CLIENT LOADED"

);
