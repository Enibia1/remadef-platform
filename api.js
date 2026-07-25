/* ============================================================
   REMADEF PLATFORM API CLIENT
   APPWRITE FUNCTION EXECUTION ROUTING
============================================================ */

"use strict";


/*
============================================================
APPWRITE CONFIGURATION
============================================================
*/

const APPWRITE_ENDPOINT =
    "https://fra.cloud.appwrite.io/v1";


const PROJECT_ID =
    "6a634fdc00148a907132";


const FUNCTION_ID =
    "6a6380f40035f4b76305";


/*
============================================================
APPWRITE SDK
============================================================
*/

const client =
    new Appwrite.Client();


client

    .setEndpoint(
        APPWRITE_ENDPOINT
    )

    .setProject(
        PROJECT_ID
    );


const functions =
    new Appwrite.Functions(
        client
    );


/*
============================================================
DEBUG HELPER
============================================================
*/

function debug(message) {


    const debug =
        document.getElementById(
            "debug"
        );


    if (debug) {

        debug.textContent +=

            "\n\n" +

            message;

    }


    console.log(

        "[REMADEF API]",

        message

    );

}


/*
============================================================
REMADEF API
============================================================
*/

const RemadefAPI = {


    async register(payload) {


        debug(

            "EXECUTING REMADEF REGISTRATION FUNCTION..."

        );


        try {


            const execution =

                await functions.createExecution(

                    FUNCTION_ID,

                    JSON.stringify(

                        payload

                    ),

                    false,

                    "/api/register",

                    "POST",

                    {

                        "Content-Type":

                            "application/json"

                    }

                );


            debug(

                "EXECUTION CREATED\n\n" +

                "ID: " +

                execution.$id

            );


            let responseBody =

                execution.responseBody;


            if (

                typeof responseBody ===

                "string"

            ) {


                try {

                    responseBody =

                        JSON.parse(

                            responseBody

                        );

                }

                catch {

                    responseBody = {

                        raw:

                            responseBody

                    };

                }

            }


            if (

                execution.status ===

                "failed"

            ) {

                throw new Error(

                    responseBody.error ||

                    "Registration function failed."

                );

            }


            return responseBody;


        }

        catch (error) {


            debug(

                "EXECUTION ERROR:\n\n" +

                error.message

            );


            throw error;

        }

    },


    async health() {


        debug(

            "CHECKING API HEALTH..."

        );


        return await functions.createExecution(

            FUNCTION_ID,

            JSON.stringify({}),

            false,

            "/api/health",

            "GET",

            {

                "Content-Type":

                    "application/json"

            }

        );

    },


    async status() {


        debug(

            "CHECKING API STATUS..."

        );


        return await functions.createExecution(

            FUNCTION_ID,

            JSON.stringify({}),

            false,

            "/",

            "GET",

            {

                "Content-Type":

                    "application/json"

            }

        );

    }

};


/*
============================================================
GLOBAL API
============================================================
*/

window.RemadefAPI =
    RemadefAPI;


window.REMADEF_API =
    APPWRITE_ENDPOINT;


debug(

    "REMADEF API CLIENT LOADED"

);
