// ============================================================
// REMADEF PLATFORM API CLIENT
// Appwrite Function Web Bridge
// ============================================================

const RemadefAPI = {
    // ============================================================
    // CONFIGURATION
    // ============================================================
    FUNCTION_ID: '6a6380f40035f4b76305',

    // Helper: Execute Appwrite Cloud Function with dynamic payload routing
    async _execute(path, method = 'GET', data = null) {
        try {
            if (typeof appwrite === 'undefined' || !appwrite.functions) {
                throw new Error('Appwrite SDK not initialized.');
            }

            const payload = {
                path: path,
                method: method.toUpperCase(),
                body: data ? data : {}
            };

            const execution = await appwrite.functions.createExecution(
                this.FUNCTION_ID,
                JSON.stringify(payload),
                false // Synchronous execution
            );

            let responseData = {};
            if (execution.responseBody) {
                try {
                    responseData = JSON.parse(execution.responseBody);
                } catch (e) {
                    console.error('Failed to parse function response body:', execution.responseBody);
                    throw new Error('Invalid JSON response from server.');
                }
            }

            if (execution.status === 'failed' || (responseData.success === false)) {
                throw new Error(responseData.message || 'API Execution failed.');
            }

            return responseData;
        } catch (err) {
            console.error(`API Error [${method} ${path}]:`, err);
            throw err;
        }
    },

    // ============================================================
    // HEALTH CHECK
    // ============================================================
    async checkHealth() {
        return await this._execute('/api/health', 'GET');
    },

    // ============================================================
    // AUTHENTICATION & USER REGISTRATION
    // ============================================================
    async register(userData) {
        return await this._execute('/api/register', 'POST', userData);
    },

    // ============================================================
    // PROFILE MANAGEMENT
    // ============================================================
    async getProfile() {
        return await this._execute('/api/profile', 'GET');
    },

    async updateProfile(profileData) {
        return await this._execute('/api/profile', 'PUT', profileData);
    },

    // ============================================================
    // DASHBOARD & NOTIFICATIONS
    // ============================================================
    async getDashboard() {
        return await this._execute('/api/dashboard', 'GET');
    },

    async getNotifications() {
        return await this._execute('/api/notifications', 'GET');
    },

    // ============================================================
    // MESSAGING & CONVERSATIONS
    // ============================================================
    async getConversations() {
        return await this._execute('/api/conversations', 'GET');
    },

    async createConversation(data) {
        return await this._execute('/api/conversations', 'POST', data);
    },

    async getMessages(conversationId) {
        const path = conversationId 
            ? `/api/messages?conversation_id=${encodeURIComponent(conversationId)}`
            : '/api/messages';
        return await this._execute(path, 'GET');
    },

    async sendMessage(conversationId, content, replyTo = null) {
        const payload = {
            conversation_id: conversationId,
            content: content,
            reply_to: replyTo || ''
        };
        return await this._execute('/api/messages', 'POST', payload);
    }
};

// Export or attach to global context
if (typeof window !== 'undefined') {
    window.RemadefAPI = RemadefAPI;
}
