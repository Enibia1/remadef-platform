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

    const response = await fetch(

        `${REMADEF_API}${path}`,

        {

            method:
                options.method || "GET",

            headers: {

                "Content-Type":
                    "application/json",

                ...(options.headers || {})

            },

            body:

                options.body

                    ? JSON.stringify(options.body)

                    : undefined

        }

    );


    let data;


    try {

        data =
            await response.json();

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
