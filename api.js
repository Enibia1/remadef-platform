/* ============================================================
   REMADEF PLATFORM API CLIENT
   MINIMAL WORKING VERSION
============================================================ */

const REMADEF_API =
    "https://6a6380f50016f677984e.fra.appwrite.run";


const RemadefAPI = {


    /* ========================================================
       GENERIC REQUEST
    ======================================================== */

    async request(path = "/", options = {}) {


        const url =
            `${REMADEF_API}${path}`;


        const debug =
            document.getElementById("debug");


        if (debug) {

            debug.textContent =
                "REQUEST STARTED\n\n" +

                "URL: " +
                url +

                "\n\nMETHOD: " +

                (options.method || "GET");

        }


        try {


            const response =
                await fetch(

                    url,

                    {

                        method:
                            options.method || "GET",


                        headers: {

                            "Content-Type":
                                "application/json",

                            ...(options.headers || {})

                        },


                        body:

                            options.body !== undefined

                                ? JSON.stringify(
                                    options.body
                                )

                                : undefined

                    }

                );


            if (debug) {

                debug.textContent +=

                    "\n\nHTTP RESPONSE RECEIVED" +

                    "\n\nSTATUS: " +

                    response.status;

            }


            let data;


            try {

                data =
                    await response.json();

            } catch {

                throw new Error(
                    "Server returned invalid JSON."
                );

            }


            if (!response.ok) {

                throw new Error(

                    data.error ||

                    data.message ||

                    `API request failed with status ${response.status}`

                );

            }


            return data;


        } catch (error) {


            if (debug) {

                debug.textContent +=

                    "\n\nFETCH ERROR\n\n" +

                    error.message;

            }


            throw error;

        }

    },


    /* ========================================================
       API STATUS
    ======================================================== */

    async status() {

        return await this.request(
            "/"
        );

    },


    /* ========================================================
       API HEALTH
    ======================================================== */

    async health() {

        return await this.request(
            "/api/health"
        );

    },


    /* ========================================================
       ACCOUNT REGISTRATION
    ======================================================== */

    async register(payload) {

        return await this.request(

            "/api/register",

            {

                method:
                    "POST",

                body:
                    payload

            }

        );

    }

};


window.RemadefAPI =
    RemadefAPI;


window.REMADEF_API =
    REMADEF_API;
