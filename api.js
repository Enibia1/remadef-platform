/* ============================================================
   REMADEF PLATFORM API CLIENT
   ============================================================ */

const REMADEF_API =
    "https://6a6380f50016f677984e.fra.appwrite.run";


const RemadefAPI = {

    /*
     * Generic API request
     */

    async request(path = "/", options = {}) {

        const url =
            `${REMADEF_API}${path}`;


        const method =
            options.method || "GET";


        const body =
            options.body || null;


        /*
         * Visible browser debug
         */

        const debug =
            document.getElementById("debug");


        if (debug) {

            debug.textContent =
                "REQUEST STARTED\n\n" +

                "URL:\n" +
                url +

                "\n\nMETHOD:\n" +
                method +

                "\n\nBODY:\n" +

                JSON.stringify(
                    body,
                    null,
                    2
                );

        }


        console.log(
            "REMADEF API REQUEST:",
            {
                url,
                method,
                body
            }
        );


        let response;


        try {

            response =
                await fetch(

                    url,

                    {

                        method: method,


                        headers: {

                            "Content-Type":
                                "application/json",

                            "Accept":
                                "application/json"

                        },


                        body:

                            body

                                ? JSON.stringify(body)

                                : undefined

                    }

                );


        } catch (error) {


            if (debug) {

                debug.textContent +=

                    "\n\nFETCH ERROR:\n" +

                    error.message;

            }


            console.error(
                "REMADEF FETCH ERROR:",
                error
            );


            throw new Error(
                "Failed to connect to the REMADEF API."
            );

        }


        if (debug) {

            debug.textContent +=

                "\n\nRESPONSE STATUS:\n" +

                response.status +

                " " +

                response.statusText;

        }


        console.log(
            "REMADEF API RESPONSE:",
            response.status,
            response.statusText
        );


        const rawResponse =
            await response.text();


        if (debug) {

            debug.textContent +=

                "\n\nRAW RESPONSE:\n" +

                rawResponse;

        }


        console.log(
            "REMADEF API RAW RESPONSE:",
            rawResponse
        );


        let data;


        try {

            data =
                JSON.parse(
                    rawResponse
                );

        } catch {


            throw new Error(
                "The server returned an invalid response."
            );

        }


        if (!response.ok) {


            throw new Error(

                data.error ||

                `API request failed with status ${response.status}`

            );

        }


        return data;

    },


    /*
     * API HEALTH
     */

    async health() {

        return await this.request(
            "/api/health"
        );

    },


    /*
     * API STATUS
     */

    async status() {

        return await this.request(
            "/"
        );

    },


    /*
     * ACCOUNT REGISTRATION
     */

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


window.RemadefAPI =
    RemadefAPI;


window.REMADEF_API =
    REMADEF_API;
