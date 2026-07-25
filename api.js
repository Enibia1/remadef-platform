/* ============================================================
   REMADEF PLATFORM API CLIENT
============================================================ */

const REMADEF_API =
    "https://fra.cloud.appwrite.io/v1";

const PROJECT_ID =
    "6a634fdc00148a907132";

const FUNCTION_ID =
    "6a6380f40035f4b76305";


const client =
    new Appwrite.Client();


client
    .setEndpoint(REMADEF_API)
    .setProject(PROJECT_ID);


const functions =
    new Appwrite.Functions(client);


const RemadefAPI = {

    async register(payload) {

        const debug =
            document.getElementById("debug");


        if (debug) {

            debug.textContent +=

                "\n\nEXECUTING REMADEF REGISTRATION FUNCTION...";

        }


        const execution =
            await functions.createExecution(

                FUNCTION_ID,

                JSON.stringify(payload),

                false,

                "/api/register"

            );


        if (debug) {

            debug.textContent +=

                "\n\nEXECUTION CREATED" +

                "\nID: " +

                execution.$id;

        }


        return execution;

    }

};


window.RemadefAPI =
    RemadefAPI;


window.REMADEF_API =
    REMADEF_API;
