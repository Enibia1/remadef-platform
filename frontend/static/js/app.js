// ==============================================================================
// REMADEF PLATFORM - FRONTEND UTILITY SCRIPT (app.js)
// ==============================================================================

/**
 * Perform authenticated API requests with automatic JSON parsing and error handling.
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-JWT': localStorage.getItem('appwrite_jwt') || ''
        }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(endpoint, options);
        const text = await response.text();
        const result = text ? JSON.parse(text) : {};
        
        if (!response.ok) {
            throw new Error(result.message || result.error || 'An unexpected error occurred.');
        }
        
        if (result.success === false) {
            throw new Error(result.message || 'Request failed.');
        }

        // Return nested data if present, otherwise return the full result object
        return result.data !== undefined ? result.data : result;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

/**
 * Format numeric values into standard Nigerian Naira (₦) currency strings.
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    }).format(amount || 0);
}

/**
 * Display clean toast or browser alerts.
 */
function notifyUser(message, isError = false) {
    alert(message);
}
