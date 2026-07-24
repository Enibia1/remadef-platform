// ============================================================
// REMADEF PLATFORM API CLIENT
// ============================================================

// Main REMADEF Platform API
const REMADEF_API =
    "https://6a6380f50016f677984e.fra.appwrite.run";


// ============================================================
// REMADEF API
// ============================================================

const RemadefAPI = {

    // --------------------------------------------------------
    // Generic API request
    // --------------------------------------------------------

    async request(path = "/", options = {}) {

        const response = await fetch(
            `${REMADEF_API}${path}`,
            {
                method: options.method || "GET",

                headers: {
                    "Content-Type": "application/json",

                    ...(options.headers || {})
                },

                body: options.body
                    ? JSON.stringify(options.body)
                    : undefined
            }
        );


        let data;


        try {

            data = await response.json();

        } catch (error) {

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


    // --------------------------------------------------------
    // API HEALTH CHECK
    // --------------------------------------------------------

    async health() {

        return await this.request(
            "/api/health"
        );

    },


    // --------------------------------------------------------
    // API STATUS
    // --------------------------------------------------------

    async status() {

        return await this.request(
            "/"
        );

    }


};


// ============================================================
// OPTIONAL GLOBAL ACCESS
// ============================================================

// Makes the API available globally to other JavaScript files

window.RemadefAPI = RemadefAPI;

window.REMADEF_API = REMADEF_API;
