/* ==========================================================
   REMADEF PLATFORM
   MESSAGES MODULE
   Version 1.0
========================================================== */

/* ==========================================================
   CONFIGURATION
========================================================== */

const APPWRITE_ENDPOINT =
"https://fra.cloud.appwrite.io/v1";

const PROJECT_ID =
"6a634fdc00148a907132";

const DEFAULT_RETENTION =
"72h";

const ENCRYPTION_VERSION =
"REMADEF-E2EE-v1";

const DEVICE_COPY_KEY =
"remadef_message_settings";

const DRAFT_KEY =
"remadef_message_draft";

/* ==========================================================
   APPWRITE
========================================================== */

let client = null;

let account = null;

let databases = null;

let storage = null;

let realtime = null;

/* ==========================================================
   CURRENT STATE
========================================================== */

let currentUser = null;

let currentConversation = null;

let conversations = [];

let messages = [];

let replyingTo = null;

let editingMessage = null;

let unsubscribeRealtime = null;

let typingTimeout = null;

let pendingMessages = [];

/* ==========================================================
   DOM REFERENCES
========================================================== */

const conversationList =
document.getElementById(
"conversationList"
);

const conversationSearch =
document.getElementById(
"conversationSearch"
);

const chatMessages =
document.getElementById(
"chatMessages"
);

const messageInput =
document.getElementById(
"messageInput"
);

const sendButton =
document.getElementById(
"sendButton"
);

const profileAvatar =
document.getElementById(
"profileAvatar"
);

const chatAvatar =
document.getElementById(
"chatAvatar"
);

const chatName =
document.getElementById(
"chatName"
);

const chatStatus =
document.getElementById(
"chatStatus"
);

const typingIndicator =
document.getElementById(
"typingIndicator"
);

const loadingOverlay =
document.getElementById(
"loadingOverlay"
);

const replyPreview =
document.getElementById(
"replyPreview"
);

const replyText =
document.getElementById(
"replyText"
);

const cancelReply =
document.getElementById(
"cancelReply"
);

const keepLocalCopies =
document.getElementById(
"keepLocalCopies"
);

const attachmentMenu =
document.getElementById(
"attachmentMenu"
);

const emojiPicker =
document.getElementById(
"emojiPicker"
);

const emojiButton =
document.getElementById(
"emojiButton"
);

const attachmentButton =
document.getElementById(
"attachmentButton"
);

const chatInfoButton =
document.getElementById(
"chatInfoButton"
);

const conversationInfo =
document.getElementById(
"conversationInfo"
);

/* ==========================================================
   START APPLICATION
========================================================== */

document.addEventListener(

"DOMContentLoaded",

initializeMessages

);

/* ==========================================================
   INITIALIZE APPLICATION
========================================================== */

async function initializeMessages(){

showLoading();

try{

initializeAppwrite();

await ensureAuthenticated();

loadPrivacySettings();

loadDraft();

registerEvents();

await loadConversations();

}
catch(error){

console.error(error);

alert(

"Unable to load REMADEF Messages."

);

window.location.href="login.html";

}
finally{

hideLoading();

}

}

/* ==========================================================
   APPWRITE INITIALIZATION
========================================================== */

function initializeAppwrite(){

const{

Client,

Account,

Databases,

Storage,

Realtime

}=Appwrite;

client=

new Client()

.setEndpoint(

APPWRITE_ENDPOINT

)

.setProject(

PROJECT_ID

);

account=

new Account(client);

databases=

new Databases(client);

storage=

new Storage(client);

realtime=

new Realtime(client);

}

/* ==========================================================
   AUTHENTICATION
========================================================== */

async function ensureAuthenticated(){

currentUser=

await account.get();

if(profileAvatar){

profileAvatar.textContent=

initials(

currentUser.name||

currentUser.email||

"U"

);

}

}

/* ==========================================================
   REGISTER EVENTS
========================================================== */

function registerEvents(){

conversationSearch?.addEventListener(

"input",

filterConversations

);

sendButton?.addEventListener(

"click",

sendMessage

);

messageInput?.addEventListener(

"keydown",

handleKeyDown

);

messageInput?.addEventListener(

"input",

handleTyping

);

cancelReply?.addEventListener(

"click",

cancelReplyMode

);

emojiButton?.addEventListener(

"click",

toggleEmojiPicker

);

attachmentButton?.addEventListener(

"click",

toggleAttachmentMenu

);

chatInfoButton?.addEventListener(

"click",

toggleConversationInfo

);

window.addEventListener(

"online",

networkOnline

);

window.addEventListener(

"offline",

networkOffline

);

}

/* ==========================================================
   PART 2 CONTINUES
========================================================== *//* ==========================================================
   PART 2
   Conversations • Search • Open Conversation • Realtime
========================================================== */

/* ==========================================================
   LOAD CONVERSATIONS
========================================================== */

async function loadConversations(){

showLoading();

try{

const result =
await RemadefAPI.getConversations();

if(!result.success){

throw new Error(result.message);

}

conversations =
result.data || [];

renderConversationList();

}
catch(error){

handleApiError(error);

conversationList.innerHTML=

`
<div class="empty-state">

<h3>No conversations</h3>

<p>

Your conversations will appear here.

</p>

</div>

`;

}
finally{

hideLoading();

}

}

/* ==========================================================
   RENDER CONVERSATION LIST
========================================================== */

function renderConversationList(){

conversationList.innerHTML="";

if(conversations.length===0){

conversationList.innerHTML=

`
<div class="empty-state">

<h3>No conversations</h3>

<p>

Start a new conversation.

</p>

</div>

`;

return;

}

conversations.forEach(conversation=>{

const unread =
conversation.unread || 0;

const item =
document.createElement("div");

item.className="conversation";

item.dataset.id=
conversation.id;

item.innerHTML=

`

<div class="conversation-avatar">

${initials(

conversation.name

)}

</div>

<div class="conversation-body">

<div class="conversation-top">

<h3>

${escapeHtml(

conversation.name

)}

</h3>

<span>

${formatConversationTime(

conversation.updated_at

)}

</span>

</div>

<div class="conversation-bottom">

<p>

${escapeHtml(

conversation.last_message ||

"Start chatting..."

)}

</p>

${

unread>0

?

`

<div class="conversation-unread">

${unread}

</div>

`

:

""

}

</div>

</div>

`;

item.onclick=()=>{

openConversation(

conversation.id

);

};

conversationList.appendChild(item);

});

}

/* ==========================================================
   SEARCH
========================================================== */

function filterConversations(){

const keyword=

conversationSearch.value

.toLowerCase()

.trim();

document

.querySelectorAll(".conversation")

.forEach(item=>{

const text=

item.textContent

.toLowerCase();

item.style.display=

text.includes(keyword)

?

"flex"

:

"none";

});

}

/* ==========================================================
   OPEN CONVERSATION
========================================================== */

async function openConversation(

conversationId

){

currentConversation=

conversationId;

document

.querySelectorAll(".conversation")

.forEach(item=>{

item.classList.remove(

"active"

);

});

const active=

document.querySelector(

`[data-id="${conversationId}"]`

);

if(active){

active.classList.add(

"active"

);

}

await loadConversationDetails(

conversationId

);

await loadMessages(

conversationId

);

subscribeConversation(

conversationId

);

}

/* ==========================================================
   LOAD CONVERSATION DETAILS
========================================================== */

async function loadConversationDetails(

conversationId

){

try{

const result=

await RemadefAPI.getConversation(

conversationId

);

if(!result.success){

return;

}

const conversation=

result.data;

chatName.textContent=

conversation.name;

chatStatus.textContent=

conversation.status ||

"Secure conversation";

if(chatAvatar){

chatAvatar.textContent=

initials(

conversation.name

);

}

}
catch(error){

console.error(error);

}

}

/* ==========================================================
   MARK READ
========================================================== */

async function markConversationRead(

conversationId

){

try{

await RemadefAPI.markConversationRead(

conversationId

);

}
catch(error){

console.error(error);

}

}

/* ==========================================================
   REALTIME
========================================================== */

function subscribeConversation(

conversationId

){

if(unsubscribeRealtime){

unsubscribeRealtime();

}

unsubscribeRealtime=

client.subscribe(

`conversations.${conversationId}`,

response=>{

handleRealtimeEvent(

response

);

}

);

}

/* ==========================================================
   HANDLE REALTIME EVENTS
========================================================== */

async function handleRealtimeEvent(

event

){

switch(event.events?.[0]){

case "messages.create":

await loadMessages(

currentConversation

);

break;

case "messages.update":

await loadMessages(

currentConversation

);

break;

case "messages.delete":

await loadMessages(

currentConversation

);

break;

case "typing.start":

showTyping();

break;

case "typing.stop":

hideTyping();

break;

default:

console.log(

event

);

}

}

/* ==========================================================
   FORMAT CONVERSATION TIME
========================================================== */

function formatConversationTime(

date

){

if(!date){

return "";

}

const d=

new Date(date);

const now=

new Date();

if(

d.toDateString()===

now.toDateString()

){

return d.toLocaleTimeString(

[],

{

hour:"2-digit",

minute:"2-digit"

}

);

}

return d.toLocaleDateString();

}

/* ==========================================================
   UPDATE UNREAD BADGE
========================================================== */

function updateUnreadBadge(

count

){

const badge=

document.getElementById(

"messageBadge"

);

if(!badge){

return;

}

if(count>0){

badge.classList.remove(

"hidden"

);

badge.textContent=

count;

}else{

badge.classList.add(

"hidden"

);

}

}

/* ==========================================================
   PART 3
   Message Rendering & Sending
========================================================== *//* ==========================================================
   PART 3
   Messages • Render • Send • Reply • Edit • Delete
========================================================== */

/* ==========================================================
   LOAD MESSAGES
========================================================== */

async function loadMessages(conversationId){

showLoading();

try{

const result=

await RemadefAPI.getMessages(

conversationId

);

if(!result.success){

throw new Error(

result.message

);

}

messages=

result.data || [];

renderMessages();

await markConversationRead(

conversationId

);

}
catch(error){

handleApiError(error);

chatMessages.innerHTML=

`
<div class="empty-state">

<h3>

Unable to load messages

</h3>

</div>
`;

}
finally{

hideLoading();

}

}

/* ==========================================================
   RENDER MESSAGES
========================================================== */

function renderMessages(){

chatMessages.innerHTML="";

if(messages.length===0){

chatMessages.innerHTML=

`
<div class="empty-state">

<h3>

No messages yet

</h3>

<p>

Start the conversation.

</p>

</div>
`;

return;

}

messages.forEach(message=>{

const mine=

message.sender_id===currentUser.$id;

const wrapper=

document.createElement("div");

wrapper.className=

mine

?

"message sent"

:

"message received";

wrapper.dataset.id=

message.$id;

wrapper.innerHTML=

`

<div class="bubble">

${

message.reply_preview

?

`

<div class="reply-reference">

${escapeHtml(

message.reply_preview

)}

</div>

`

:

""

}

<div class="message-text">

${escapeHtml(

message.content

)}

</div>

<div class="message-footer">

<span>

${formatTime(

message.created_at

)}

</span>

${

mine

?

`

<span>

${message.status || "Sent"}

</span>

`

:

""

}

</div>

</div>

`;

wrapper.addEventListener(

"contextmenu",

event=>{

event.preventDefault();

openMessageMenu(

message,

event.clientX,

event.clientY

);

}

);

chatMessages.appendChild(

wrapper

);

});

scrollToBottom();

}

/* ==========================================================
   SEND MESSAGE
========================================================== */

async function sendMessage(){

const text=

messageInput.value.trim();

if(text===""){

return;

}

if(!currentConversation){

alert(

"Select a conversation first."

);

return;

}

try{

sendButton.disabled=true;

const payload={

content:text,

reply_to:replyingTo,

retention:getRetention(),

encryption_version:

ENCRYPTION_VERSION

};

const result=

await RemadefAPI.sendMessage(

currentConversation,

payload

);

if(!result.success){

throw new Error(

result.message

);

}

messageInput.value="";

clearDraft();

replyingTo=null;

replyPreview.classList.add(

"hidden"

);

await loadMessages(

currentConversation

);

}
catch(error){

if(

navigator.onLine===false

){

MessageModules

.offlineQueue

.add(

text

);

}

handleApiError(error);

}
finally{

sendButton.disabled=false;

messageInput.focus();

}

}

/* ==========================================================
   KEYBOARD
========================================================== */

function handleKeyDown(event){

if(

event.key==="Enter"

&&

!event.shiftKey

){

event.preventDefault();

sendMessage();

}

}

/* ==========================================================
   REPLY
========================================================== */

function startReply(

message

){

replyingTo=

message.$id;

replyPreview.classList.remove(

"hidden"

);

replyText.textContent=

message.content;

messageInput.focus();

}

function cancelReplyMode(){

replyingTo=null;

replyPreview.classList.add(

"hidden"

);

replyText.textContent="";

}

/* ==========================================================
   EDIT MESSAGE
========================================================== */

async function editMessage(message){

const updated=

prompt(

"Edit message",

message.content

);

if(

updated===null ||

updated.trim()===""

){

return;

}

try{

await RemadefAPI.editMessage(

message.$id,

{

content:updated.trim()

}

);

await loadMessages(

currentConversation

);

}
catch(error){

handleApiError(error);

}

}

/* ==========================================================
   DELETE MESSAGE
========================================================== */

async function deleteMessage(

messageId

){

if(

!confirm(

"Delete this message?"

)

){

return;

}

try{

await RemadefAPI.deleteMessage(

messageId

);

await loadMessages(

currentConversation

);

}
catch(error){

handleApiError(error);

}

}

/* ==========================================================
   PIN MESSAGE
========================================================== */

async function pinMessage(

messageId

){

try{

await RemadefAPI.pinMessage(

messageId

);

}
catch(error){

handleApiError(error);

}

}

/* ==========================================================
   REACTION
========================================================== */

async function reactToMessage(

messageId,

emoji

){

try{

await RemadefAPI.reactToMessage(

messageId,

emoji

);

}
catch(error){

handleApiError(error);

}

}

/* ==========================================================
   COPY MESSAGE
========================================================== */

async function copyMessage(text){

try{

await navigator.clipboard.writeText(

text

);

}
catch(error){

console.error(error);

}

}

/* ==========================================================
   SCROLL
========================================================== */

function scrollToBottom(){

chatMessages.scrollTop=

chatMessages.scrollHeight;

}

/* ==========================================================
   PART 4
   Typing • Privacy • Drafts • Emoji • Attachments
========================================================== *//* ==========================================================
   PART 4
   Typing • Privacy • Drafts • Emoji • Attachments
   Offline • Utilities • Future Modules
========================================================== */

/* ==========================================================
   TYPING INDICATOR
========================================================== */

function handleTyping(){

if(!currentConversation){

return;

}

clearTimeout(

typingTimeout

);

RemadefAPI.sendTyping(

currentConversation

);

messageInput.dispatchEvent(

new Event("draft")

);

typingTimeout=

setTimeout(()=>{

RemadefAPI.stopTyping(

currentConversation

);

},3000);

}

function showTyping(){

typingIndicator?.classList.remove(

"hidden"

);

}

function hideTyping(){

typingIndicator?.classList.add(

"hidden"

);

}

/* ==========================================================
   PRIVACY SETTINGS
========================================================== */

keepLocalCopies?.addEventListener(

"change",

savePrivacySettings

);

function savePrivacySettings(){

const settings={

keepEncryptedCopies:

keepLocalCopies.checked

};

localStorage.setItem(

DEVICE_COPY_KEY,

JSON.stringify(settings)

);

}

function loadPrivacySettings(){

const saved=

localStorage.getItem(

DEVICE_COPY_KEY

);

if(!saved){

return;

}

try{

const settings=

JSON.parse(saved);

keepLocalCopies.checked=

settings.keepEncryptedCopies;

}
catch(error){

console.error(error);

}

}

/* ==========================================================
   DRAFTS
========================================================== */

messageInput?.addEventListener(

"draft",

saveDraft

);

function saveDraft(){

localStorage.setItem(

DRAFT_KEY,

messageInput.value

);

}

function loadDraft(){

const draft=

localStorage.getItem(

DRAFT_KEY

);

if(draft){

messageInput.value=draft;

}

}

function clearDraft(){

localStorage.removeItem(

DRAFT_KEY

);

}

/* ==========================================================
   EMOJI PICKER
========================================================== */

function toggleEmojiPicker(){

emojiPicker?.classList.toggle(

"hidden"

);

attachmentMenu?.classList.add(

"hidden"

);

}

emojiPicker?.addEventListener(

"click",

event=>{

if(

!event.target.dataset.emoji

){

return;

}

messageInput.value+=

event.target.dataset.emoji;

messageInput.focus();

saveDraft();

});

/* ==========================================================
   ATTACHMENTS
========================================================== */

function toggleAttachmentMenu(){

attachmentMenu?.classList.toggle(

"hidden"

);

emojiPicker?.classList.add(

"hidden"

);

}

async function uploadAttachment(file){

return MessageModules

.attachments

.upload(file);

}

/* ==========================================================
   CONVERSATION INFO
========================================================== */

function toggleConversationInfo(){

conversationInfo?.classList.toggle(

"hidden"

);

}

/* ==========================================================
   NETWORK STATUS
========================================================== */

function networkOnline(){

console.log(

"Network Connected"

);

MessageModules

.offlineQueue

.flush();

}

function networkOffline(){

console.log(

"Offline Mode"

);

}

/* ==========================================================
   API ERROR HANDLER
========================================================== */

function handleApiError(error){

console.error(error);

alert(

error.message ||

"Something went wrong."

);

}

/* ==========================================================
   LOADING
========================================================== */

function showLoading(){

loadingOverlay?.classList.remove(

"hidden"

);

}

function hideLoading(){

loadingOverlay?.classList.add(

"hidden"

);

}

/* ==========================================================
   UTILITIES
========================================================== */

function initials(text){

if(!text){

return "U";

}

return text

.trim()

.split(" ")

.map(

word=>word.charAt(0)

)

.join("")

.substring(0,2)

.toUpperCase();

}

function escapeHtml(text){

if(!text){

return "";

}

return text

.replace(/&/g,"&amp;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;")

.replace(/'/g,"&#039;");

}

function formatTime(date){

if(!date){

return "";

}

return new Date(date)

.toLocaleTimeString(

[],

{

hour:"2-digit",

minute:"2-digit"

}

);

}

function getRetention(){

return DEFAULT_RETENTION;

}

/* ==========================================================
   INTERNAL PLACEHOLDER MODULES
   Hidden from users
========================================================== */

const MessageModules={

encryption:{

version:

ENCRYPTION_VERSION,

async encrypt(message){

return message;

},

async decrypt(message){

return message;

}

},

offlineQueue:{

queue:[],

add(message){

this.queue.push(message);

},

async flush(){

/* Backend */

}

},

attachments:{

async upload(file){

/* Future:
Photos
Videos
Audio
Documents
Location
Contacts
*/

return null;

}

},

voiceCalls:{

async start(){

/* Future */

}

},

videoCalls:{

async start(){

/* Future */

}

},

screenShare:{

async start(){

/* Future */

}

},

translation:{

async translate(

text,

language

){

return text;

}

},

payments:{

async send(){

/* Future */

}

},

aiAssistant:{

async suggestReply(){

return[];

}

}

};

/* ==========================================================
   CLEANUP
========================================================== */

window.addEventListener(

"beforeunload",

()=>{

if(

unsubscribeRealtime

){

unsubscribeRealtime();

}

}

/* ==========================================================
   END OF FILE
========================================================== */
);
