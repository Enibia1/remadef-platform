/* ============================================================
   REMADEF PLATFORM API CLIENT
   Appwrite Function Execution API
============================================================ */

const APPWRITE_ENDPOINT =
    "https://fra.cloud.appwrite.io/v1";

const PROJECT_ID =
    "6a634fdc00148a907132";

const FUNCTION_ID =
    "6a6380f40035f4b76305";


const RemadefAPI = {

    async register(payload) {

        const debug =
            document.getElementById("debug");


        const url =
            `${APPWRITE_ENDPOINT}/functions/${FUNCTION_ID}/executions`;


        if (debug) {

            debug.textContent +=

                "\n\nAPI REQUEST STARTED" +

                "\nURL: " + url +

                "\nMETHOD: POST" +

                "\nPATH: /api/register" +

                "\nBODY: " +

                JSON.stringify(

                    {

                        ...payload,

                        password: "[HIDDEN]"

                    },

                    null,

                    2

                );

        }


        try {


            const response =
                await fetch(

                    url,

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

                                {

                                    body:
                                        JSON.stringify(
                                            payload
                                        ),


                                    async:
                                        true,


                                    path:
                                        "/api/register",


                                    method:
                                        "POST",


                                    headers:

                                        {

                                            "Content-Type":
                                                "application/json"

                                        }

                                }

                            )

                    }

                );


            if (debug) {

                debug.textContent +=

                    "\n\nHTTP RESPONSE RECEIVED" +

                    "\nSTATUS: " +

                    response.status;

            }


            const text =
                await response.text();


            let data;


            try {

                data =
                    JSON.parse(text);

            }

            catch {

                data =
                    {

                        raw:
                            text

                    };

            }


            if (!response.ok) {

                throw new Error(

                    data.message ||

                    data.error ||

                    `Appwrite request failed: ${response.status}`

                );

            }


            if (debug) {

                debug.textContent +=

                    "\n\nEXECUTION CREATED" +

                    "\nID: " +

                    (

                        data.$id ||

                        data.id ||

                        "UNKNOWN"

                    );

            }


            return data;


        }


        catch (error) {


            if (debug) {

                debug.textContent +=

                    "\n\nFETCH ERROR: " +

                    error.message;

            }


            throw error;

        }

    }

};


window.RemadefAPI =
    RemadefAPI;


window.REMADEF_API =
    APPWRITE_ENDPOINT;


console.log(
    "REMADEF API CLIENT LOADED"
);
