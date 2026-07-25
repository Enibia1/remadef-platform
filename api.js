/* ============================================================
   REMADEF PLATFORM API CLIENT
   Appwrite Web SDK
============================================================ */

const PROJECT_ID =
    "6a634fdc00148a907132";

const FUNCTION_ID =
    "6a6380f40035f4b76305";


/*
 * Appwrite client
 */

const client =
    new Appwrite.Client();


client
    .setEndpoint(
        "https://fra.cloud.appwrite.io/v1"
    )
    .setProject(
        PROJECT_ID
    );


const functions =
    new Appwrite.Functions();


const RemadefAPI = {


    /*
     * DEBUG HELPER
     */

    debug(message) {

        const debug =
            document.getElementById(
                "debug"
            );


        if (!debug) return;


        debug.textContent +=
            "\n" + message;

    },


    /*
     * ACCOUNT REGISTRATION
     */

    async register(payload) {


        this.debug(
            "EXECUTING REMADEF REGISTRATION FUNCTION..."
        );


        try {


            const execution =
                await functions.createExecution(
                    FUNCTION_ID,
                    JSON.stringify(payload),
                    false,
                    "/api/register",
                    "POST",
                    {
                        "Content-Type":
                            "application/json"
                    }
                );


            this.debug(
                "EXECUTION CREATED"
            );


            this.debug(
                "ID: " +
                execution.$id
            );


            return execution;


        } catch (error) {


            this.debug(
                "EXECUTION ERROR"
            );


            this.debug(
                error.message
            );


            throw error;

        }

    }

};


window.RemadefAPI =
    RemadefAPI;
