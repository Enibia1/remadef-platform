/* ============================================================
   REMADEF PLATFORM API
   Appwrite Function Execution API
   SYNCHRONOUS EXECUTION
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

    if (debug) {

        debug.textContent +=
            "\n\n" + message;

    }

}


/* ============================================================
   REMADEF API
============================================================ */

const RemadefAPI = {


    async register(payload) {


        const maskedPayload = {

            ...payload,

            password: "[HIDDEN]"

        };


        debugLog(

            "API REQUEST STARTED" +

            "\nURL: " +

            EXECUTION_URL +

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
               CREATE SYNCHRONOUS EXECUTION
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


                            /*
                             * IMPORTANT:
                             *
                             * async: false tells Appwrite
                             * to wait for the function to finish.
                             *
                             * Therefore:
                             *
                             * 202 + execution ID
                             * is no longer expected.
                             *
                             * The response should contain
                             * the actual function response.
                             */

                            async: false

                        })

                    }

                );


            debugLog(

                "HTTP RESPONSE RECEIVED" +

                "\nSTATUS: " +

                response.status

            );


            const text =

                await response.text();


            let data;


            try {

                data =

                    JSON.parse(text);

            }

            catch {

                data = {

                    raw: text

                };

            }


            if (!response.ok) {

                throw new Error(

                    data.message ||

                    data.error ||

                    data.raw ||

                    `Registration failed: ${response.status}`

                );

            }


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


        catch (error) {


            debugLog(

                "API ERROR: " +

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
