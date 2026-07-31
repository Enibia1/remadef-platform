/* ==========================================================
   REMADEF PLATFORM
   Messages Module Controller
========================================================== */

let activeConversationId = null;
let activeReplyMessage = null;
let currentUserId = null;

document.addEventListener("DOMContentLoaded", async () => {
    showLoading(true);
    try {
        await RemadefAPI.initializeAppwrite();
        const user = await RemadefAPI.getCurrentUser();
        if (user) {
            currentUserId = user.$id;
            updateUserProfileUI(user);
        }
        await loadConversations();
        registerEvents();
        setupRealtimeSubscriptions();
    } catch (err) {
        console.error("Initialization error:", err);
    } finally {
        showLoading(false);
    }
});

/* ==========================================================
   UI UTILITIES
========================================================== */

function showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
        if (show) overlay.classList.remove("hidden");
        else overlay.classList.add("hidden");
    }
}

function updateUserProfileUI(user) {
    const profileAvatar = document.getElementById("profileAvatar");
    if (profileAvatar && user.name) {
        profileAvatar.textContent = user.name.charAt(0).toUpperCase();
    }
}

/* ==========================================================
   CONVERSATIONS LOGIC
========================================================== */

async function loadConversations() {
    const listContainer = document.getElementById("conversationList");
    if (!listContainer) return;

    try {
        const response = await RemadefAPI.getConversations();
        const conversations = response.documents || response.data || [];

        if (conversations.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No Conversations</h3>
                    <p>Your conversations will appear here.</p>
                </div>`;
            return;
        }

        listContainer.innerHTML = "";
        conversations.forEach((conv) => {
            const el = createConversationItem(conv);
            listContainer.appendChild(el);
        });
    } catch (err) {
        console.error("Error loading conversations:", err);
    }
}

function createConversationItem(conv) {
    const div = document.createElement("div");
    div.className = `conversation ${conv.$id === activeConversationId ? "active" : ""}`;
    div.dataset.id = conv.$id;

    const title = conv.name || conv.title || "Secure Chat";
    const initial = title.charAt(0).toUpperCase();
    const lastMsg = conv.lastMessage || "No messages yet";
    const time = conv.$updatedAt ? new Date(conv.$updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

    div.innerHTML = `
        <div class="conversation-avatar">${initial}</div>
        <div class="conversation-body">
            <div class="conversation-top">
                <h3>${title}</h3>
                <span>${time}</span>
            </div>
            <div class="conversation-bottom">
                <p>${lastMsg}</p>
                ${conv.unreadCount ? `<span class="conversation-unread">${conv.unreadCount}</span>` : ""}
            </div>
        </div>`;

    div.addEventListener("click", () => openConversation(conv.$id, title, initial));
    return div;
}

async function openConversation(id, name = "Secure Chat", avatarText = "RM") {
    activeConversationId = id;
    
    // Highlight Active
    document.querySelectorAll(".conversation").forEach(c => c.classList.remove("active"));
    const selected = document.querySelector(`.conversation[data-id="${id}"]`);
    if (selected) selected.classList.add("active");

    // Header Updates
    document.getElementById("chatName").textContent = name;
    document.getElementById("chatAvatar").textContent = avatarText;
    document.getElementById("chatStatus").textContent = "End-to-End Encrypted";

    await loadMessages(id);
}

/* ==========================================================
   MESSAGES LOGIC
========================================================== */

async function loadMessages(conversationId) {
    const messagesContainer = document.getElementById("chatMessages");
    if (!messagesContainer) return;

    try {
        const response = await RemadefAPI.getMessages(conversationId);
        const messages = response.documents || response.data || [];

        messagesContainer.innerHTML = "";
        if (messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="empty-state">
                    <h2>No messages in this chat</h2>
                    <p>Send a message below to start the conversation.</p>
                </div>`;
            return;
        }

        messages.forEach(msg => appendMessageUI(msg));
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (err) {
        console.error("Error loading messages:", err);
    }
}

function appendMessageUI(msg) {
    const messagesContainer = document.getElementById("chatMessages");
    if (!messagesContainer) return;

    const emptyState = messagesContainer.querySelector(".empty-state");
    if (emptyState) emptyState.remove();

    const isSent = msg.senderId === currentUserId;
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${isSent ? "sent" : "received"}`;

    const time = msg.$createdAt ? new Date(msg.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

    msgDiv.innerHTML = `
        <div class="bubble">
            ${msg.replyToText ? `<div class="reply-reference"><strong>Replying to:</strong> ${msg.replyToText}</div>` : ""}
            <div class="message-text">${escapeHTML(msg.content)}</div>
            <div class="message-footer">
                <span>${time}</span>
            </div>
        </div>`;

    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("messageInput");
    const content = input.value.trim();
    if (!content || !activeConversationId) return;

    const payload = {
        conversationId: activeConversationId,
        content: content,
        senderId: currentUserId,
        replyToText: activeReplyMessage ? activeReplyMessage.content : null
    };

    input.value = "";
    cancelReply();

    try {
        const newMsg = await RemadefAPI.sendMessage(payload);
        appendMessageUI(newMsg.data || newMsg);
    } catch (err) {
        alert("Failed to send message: " + err.message);
    }
}

/* ==========================================================
   EVENT LISTENERS & HANDLERS
========================================================== */

function registerEvents() {
    // Send Button & Enter Key
    const sendBtn = document.getElementById("sendButton");
    const messageInput = document.getElementById("messageInput");

    sendBtn?.addEventListener("click", sendMessage);
    messageInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // New Conversation Handler
    const newConversationBtn = document.getElementById("newConversation");
    newConversationBtn?.addEventListener("click", async () => {
        const recipient = prompt("Enter User ID or Email to start a chat:");
        if (recipient) {
            try {
                const res = await RemadefAPI.createConversation({ target_user: recipient });
                if (res.success || res.$id) {
                    await loadConversations();
                    openConversation(res.$id || res.data.$id);
                }
            } catch (err) {
                alert("Could not create conversation: " + err.message);
            }
        }
    });

    // Toggle Panels & Modals
    const infoBtn = document.getElementById("chatInfoButton");
    const convInfo = document.getElementById("conversationInfo");
    infoBtn?.addEventListener("click", () => convInfo?.classList.toggle("hidden"));

    const emojiBtn = document.getElementById("emojiButton");
    const emojiPicker = document.getElementById("emojiPicker");
    emojiBtn?.addEventListener("click", () => emojiPicker?.classList.toggle("hidden"));

    // Emoji Selection
    emojiPicker?.addEventListener("click", (e) => {
        if (e.target.dataset.emoji) {
            messageInput.value += e.target.dataset.emoji;
            emojiPicker.classList.add("hidden");
            messageInput.focus();
        }
    });

    // Attachment Menu Toggle
    const attachBtn = document.getElementById("attachmentButton");
    const attachMenu = document.getElementById("attachmentMenu");
    attachBtn?.addEventListener("click", () => attachMenu?.classList.toggle("hidden"));

    // Cancel Reply Button
    document.getElementById("cancelReply")?.addEventListener("click", cancelReply);
}

function cancelReply() {
    activeReplyMessage = null;
    document.getElementById("replyPreview")?.classList.add("hidden");
}

function setupRealtimeSubscriptions() {
    if (typeof RemadefAPI.subscribeToMessages === "function") {
        RemadefAPI.subscribeToMessages((msg) => {
            if (msg.conversationId === activeConversationId) {
                appendMessageUI(msg);
            }
            loadConversations();
        });
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
