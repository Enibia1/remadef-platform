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
   DEBUG
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
   PARSE RESPONSE
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
       GENERIC REQUEST
    ======================================================== */

    async request(

        path = "/",

        options = {}

    ) {


        updateDebug(

            "EXECUTING REMADEF REGISTRATION FUNCTION..."

        );


        /*
         * THIS IS THE WORKING EXECUTION CREATION REQUEST
         *
         * Do not replace this with a different request format.
         */

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

                            JSON.stringify(

                                options.body || {}

                            ),

                        path:

                            path,

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

            let errorText = "";

            try {

                errorText =
                    await executionResponse.text();

            } catch {

                errorText =
                    "No error details returned.";

            }


            throw new Error(

                `Execution creation failed: ${executionResponse.status}\n${errorText}`

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
           POLL EXECUTION
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

                    "Could not retrieve execution status: " +

                    statusResponse.status

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

                    currentExecution.stderr

                    ||

                    currentExecution.responseBody

                    ||

                    "REMADEF function execution failed."

                );

            }

        }


        throw new Error(

            "The REMADEF function took too long to respond."

        );

    },


    /* ========================================================
       HEALTH
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
       STATUS
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
       REGISTRATION
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
