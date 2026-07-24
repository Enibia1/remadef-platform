/* ============================================================
   REMADEF PLATFORM API CLIENT (MASTER CLOUD ROUTING)
============================================================ */

// Point directly to Appwrite's Core Cloud Engine to bypass domain CORS blocks
const REMADEF_API = "https://appwrite.io";
const PROJECT_ID = "6a634fdc00148a907132";
const FUNCTION_ID = "6a6380f40035f4b76305";

const RemadefAPI = {

    async request(path = "/", options = {}) {
        const url = `${REMADEF_API}${path}`;
        const debug = document.getElementById("debug");

        if (debug) {
            debug.textContent =
                "REQUEST STARTED\n\n" +
                "URL: " + url + "\n" +
                "METHOD: " + (options.method || "GET") + "\n\n";
        }

        try {
            const response = await fetch(
                url,
                {
                    method: options.method || "GET",
                    headers: {
                        "Content-Type": "application/json",
                        // Identify your project to the Appwrite master gateway
                        "X-Appwrite-Project": PROJECT_ID,
                        ...(options.headers || {})
                    },
                    body: options.body ? JSON.stringify(options.body) : undefined
                }
            );

            if (debug) {
                debug.textContent +=
                    "HTTP RESPONSE RECEIVED\n\n" +
                    "STATUS: " + response.status + "\n\n";
            }

            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error("Server returned invalid JSON.");
            }

            if (!response.ok) {
                throw new Error(
                    data.message || data.error || `API request failed with status ${response.status}`
                );
            }

            // If executing a function via core API, Appwrite returns execution details.
            // We parse the internal response string sent back by your Python script.
            if (data.responseBody) {
                try {
                    return JSON.parse(data.responseBody);
                } catch {
                    return { success: true, raw: data.responseBody };
                }
            }

            return data;

        } catch (error) {
            if (debug) {
                debug.textContent += "FETCH ERROR:\n\n" + error.message;
            }
            throw error;
        }
    },

    async health() {
        // Routes through core function execution engine
        return await this.request(`/functions/${FUNCTION_ID}/executions`, {
            method: "POST",
            headers: { "X-Appwrite-Function-Path": "/api/health" },
            body: {}
        });
    },

    async status() {
        return await this.request(`/functions/${FUNCTION_ID}/executions`, {
            method: "POST",
            headers: { "X-Appwrite-Function-Path": "/" },
            body: {}
        });
    },

    async register(payload) {
        // Execute the REMADEF Python function through Appwrite core routing securely
        return await this.request(`/functions/${FUNCTION_ID}/executions`, {
            method: "POST",
            headers: { "X-Appwrite-Function-Path": "/api/register" },
            body: payload
        });
    }
};

window.RemadefAPI = RemadefAPI;
window.REMADEF_API = REMADEF_API;
