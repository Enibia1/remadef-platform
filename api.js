const REMADEF_API =
    "https://6a6380f50016f677984e.fra.appwrite.run";


async function apiRequest(endpoint, options = {}) {
    const response = await fetch(
        `${REMADEF_API}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );


    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            `Invalid server response (${response.status})`
        );
    }


    if (!response.ok) {
        throw new Error(
            data.error || "API request failed"
        );
    }


    return data;
}
