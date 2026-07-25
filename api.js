/* ============================================================
   REMADEF PLATFORM API CLIENT
   FINAL DEBUG VERSION
============================================================ */

(function () {

    "use strict";

    /* --------------------------------------------------------
       CONFIGURATION
    -------------------------------------------------------- */

    const API_URL =
        "https://6a6380f50016f677984e.fra.appwrite.run";

    const debug = () =>
        document.getElementById("debug");


    /* --------------------------------------------------------
       DEBUG LOGGER
    -------------------------------------------------------- */

    function log(message) {

        const box = debug();

        if (!box) return;

        box.textContent += "\n\n" + message;

    }


    /* --------------------------------------------------------
       API CLIENT
    -------------------------------------------------------- */

    const RemadefAPI = {

        async register(payload) {

            log("API REQUEST STARTED");

            log(
                "URL:\n" +
                API_URL +
                "/api/register"
            );

            log(
                "METHOD:\nPOST"
            );

            log(
                "BODY:\n" +
                JSON.stringify(payload, null, 2)
            );


            let response;


            try {

                response = await fetch(

                    API_URL + "/api/register",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(payload)

                    }

                );

            }

            catch (error) {

                log(
                    "FETCH ERROR:\n" +
                    error.message
                );

                throw error;

            }


            log(

                "HTTP RESPONSE RECEIVED\n" +

                "STATUS: " +

                response.status

            );


            const text =
                await response.text();


            log(

                "RAW RESPONSE:\n" +

                text

            );


            let data;


            try {

                data =
                    text
                        ? JSON.parse(text)
                        : {};

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

                    "Registration request failed. HTTP " +

                    response.status

                );

            }


            return data;

        }

    };


    /* --------------------------------------------------------
       EXPOSE GLOBALLY
    -------------------------------------------------------- */

    window.RemadefAPI =
        RemadefAPI;


    window.REMADEF_API =
        API_URL;


    /* --------------------------------------------------------
       CONFIRM LOADING
    -------------------------------------------------------- */

    console.log(
        "REMADEF API CLIENT LOADED"
    );


})();
