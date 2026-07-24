/* ============================================================
   REMADEF PLATFORM API CLIENT
============================================================ */

const REMADEF_API =
    "https://6a6380f50016f677984e.fra.appwrite.run";


const RemadefAPI = {


    async request(path = "/", options = {}) {


        const url =
            `${REMADEF_API}${path}`;


        const debug =
            document.getElementById("debug");


        if (debug) {

            debug.textContent =
                "REQUEST STARTED\n\n" +

                "URL: " + url + "\n" +

                "METHOD: " +
                (options.method || "GET") + "\n\n";

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

                            // ========================================================
                            // CORE APPWRITE SECURITY & FUNCTION ROUTING HEADERS
                            // ========================================================
                            "X-Appwrite-Project":
                                "6a634fdc00148a907132",

                            "X-Appwrite-Function-Path":
                                path,

                            ...(options.headers || {})

                        },

                        body:

                            options.body

                                ? JSON.stringify(
                                    options.body
                                )

                                : undefined
                    }

                );


            if (debug) {

                debug.textContent +=

                    "HTTP RESPONSE RECEIVED\n\n" +

                    "STATUS: " +

                    response.status +

                    "\n\n";

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

                    `API request failed with status ${response.status}`

                );

            }


            return data;


        } catch (error) {


            if (debug) {

                debug.textContent +=

                    "FETCH ERROR:\n\n" +

                    error.message;

            }


            throw error;

        }

    },


    async health() {

        return await this.request(

            "/api/health"

        );

    },


    async status() {

        return await this.request(

            "/"

        );

    },


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
