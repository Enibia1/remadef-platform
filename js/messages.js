/* ==========================================================
   REMADEF MESSAGES
   Part 1
   Initialization • Authentication • Conversations
========================================================== */

/* ==========================================================
   CONFIGURATION
========================================================== */

const PROJECT_ID = "6a634fdc00148a907132";

const ENDPOINT = "https://fra.cloud.appwrite.io/v1";

let client = null;
let account = null;
let realtime = null;

let currentUser = null;

let currentConversation = null;

let conversations = [];

let unsubscribeRealtime = null;

/* ==========================================================
   DOM
========================================================== */

const conversationList =
document.getElementById("conversationList");

const searchInput =
document.getElementById("conversationSearch");

const loadingOverlay =
document.getElementById("loadingOverlay");

const emptyState =
document.getElementById("emptyState");

const profileAvatar =
document.getElementById("profileAvatar");

/* ==========================================================
   START APPLICATION
========================================================== */

document.addEventListener(
"DOMContentLoaded",
initializeMessages
);

/* ==========================================================
   INITIALIZE
========================================================== */

async function initializeMessages(){

showLoading();

try{

initializeAppwrite();

await authenticateUser();

await loadConversations();

registerEvents();

}
catch(error){

console.error(error);

alert(
"Unable to load messages."
);

window.location.href =
"login.html";

}
finally{

hideLoading();

}

}

/* ==========================================================
   APPWRITE
========================================================== */

function initializeAppwrite(){

const {
Client,
Account,
Realtime
} = Appwrite;

client =
new Client();

client
.setEndpoint(ENDPOINT)
.setProject(PROJECT_ID);

account =
new Account(client);

realtime =
new Realtime(client);

}

/* ==========================================================
   AUTHENTICATE
========================================================== */

async function authenticateUser(){

currentUser =
await account.get();

if(profileAvatar){

profileAvatar.textContent =

initials(

currentUser.name ||

currentUser.email ||

"U"

);

}

}

/* ==========================================================
   LOAD CONVERSATIONS
========================================================== */

async function loadConversations(){

try{

const result =

await RemadefAPI.getConversations();

if(result.success){

conversations =

result.data || [];

renderConversationList();

}
else{

throw new Error(

result.message

);

}

}
catch(error){

console.error(

"Conversation load error",

error

);

conversationList.innerHTML =

`
<div class="empty-list">

Unable to load conversations.

</div>
`;

}

}

/* ==========================================================
   RENDER CONVERSATIONS
========================================================== */

function renderConversationList(){

conversationList.innerHTML = "";

if(conversations.length===0){

conversationList.innerHTML =

`
<div class="empty-list">

No conversations yet.

</div>
`;

return;

}

conversations.forEach(

conversation=>{

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

<div class="conversation-details">

<div class="conversation-title">

<span>

${escapeHtml(
conversation.name
)}

</span>

<span class="conversation-time">

${formatTime(
conversation.updated_at
)}

</span>

</div>

<div class="conversation-preview">

${escapeHtml(

conversation.last_message ||

"Start chatting..."

)}

</div>

</div>

<div class="conversation-meta">

${
conversation.unread>0

?

`<span class="unread-badge">

${conversation.unread}

</span>`

:

""

}

</div>

`;

item.addEventListener(

"click",

()=>{

openConversation(

conversation.id

);

}

);

conversationList.appendChild(

item

);

}

);

}

/* ==========================================================
   SEARCH
========================================================== */

function registerEvents(){

searchInput.addEventListener(

"input",

filterConversations

);

}

function filterConversations(){

const keyword =

searchInput.value

.toLowerCase()

.trim();

document

.querySelectorAll(

".conversation"

)

.forEach(

item=>{

const text=

item.textContent

.toLowerCase();

item.style.display=

text.includes(keyword)

?

"flex"

:

"none";

}

);

}

/* ==========================================================
   LOADING
========================================================== */

function showLoading(){

loadingOverlay

.classList.remove(

"hidden"

);

}

function hideLoading(){

loadingOverlay

.classList.add(

"hidden"

);

}

/* ==========================================================
   HELPERS
========================================================== */

function initials(text){

if(!text)

return "U";

return text

.trim()

.split(" ")

.map(

word=>word[0]

)

.join("")

.substring(0,2)

.toUpperCase();

}

function formatTime(date){

if(!date)

return "";

return new Date(date)

.toLocaleTimeString(

[],

{

hour:"2-digit",

minute:"2-digit"

}

);

}

function escapeHtml(text){

if(!text)

return "";

return text

.replace(/&/g,"&amp;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;")

.replace(/'/g,"&#039;");

}

/* ==========================================================
   PART 2 CONTINUES
========================================================== */
/* ==========================================================
   REMADEF MESSAGES
   Part 2
   Open Conversation • Load Messages • Render • Send
========================================================== */

const chatMessages =
document.getElementById("chatMessages");

const chatName =
document.getElementById("chatName");

const chatStatus =
document.getElementById("chatStatus");

const chatAvatar =
document.getElementById("chatAvatar");

const messageInput =
document.getElementById("messageInput");

const sendButton =
document.getElementById("sendButton");

/* ==========================================================
   OPEN CONVERSATION
========================================================== */

async function openConversation(conversationId){

showLoading();

try{

currentConversation =
conversationId;

document
.querySelectorAll(".conversation")
.forEach(item=>{

item.classList.remove("active");

if(item.dataset.id===conversationId){

item.classList.add("active");

}

});

await loadMessages(conversationId);

}
catch(error){

console.error(error);

alert("Unable to open conversation.");

}
finally{

hideLoading();

}

}

/* ==========================================================
   LOAD MESSAGES
========================================================== */

async function loadMessages(conversationId){

try{

const result =

await RemadefAPI.getMessages(
conversationId
);

if(!result.success){

throw new Error(result.message);

}

renderMessages(result.data);

}
catch(error){

console.error(error);

chatMessages.innerHTML=

`
<div class="empty-list">

Unable to load messages.

</div>
`;

}

}

/* ==========================================================
   RENDER MESSAGES
========================================================== */

function renderMessages(messages){

chatMessages.innerHTML="";

if(!messages ||
messages.length===0){

chatMessages.innerHTML=

`
<div class="empty-list">

No messages yet.

Say hello 👋

</div>
`;

return;

}

messages.forEach(message=>{

const wrapper=

document.createElement("div");

wrapper.className=

message.sender_id===currentUser.$id

?

"message sent"

:

"message received";

wrapper.dataset.id=

message.$id;

wrapper.innerHTML=

`

<div class="message-content">

<div class="bubble">

${escapeHtml(
message.content
)}

</div>

<div class="message-meta">

<span>

${formatTime(
message.created_at
)}

</span>

${
message.sender_id===currentUser.$id

?

`<span>

${message.status||"Sent"}

</span>`

:

""

}

</div>

</div>

`;

chatMessages.appendChild(wrapper);

});

scrollToBottom();

}

/* ==========================================================
   SEND MESSAGE
========================================================== */

sendButton.addEventListener(

"click",

sendMessage

);

messageInput.addEventListener(

"keydown",

event=>{

if(

event.key==="Enter"

&&

!event.shiftKey

){

event.preventDefault();

sendMessage();

}

}

);

async function sendMessage(){

const text=

messageInput.value.trim();

if(text===""){

return;

}

if(!currentConversation){

alert(

"Select a conversation."

);

return;

}

try{

sendButton.disabled=true;

const result=

await RemadefAPI.sendMessage(

currentConversation,

{

content:text

}

);

if(!result.success){

throw new Error(

result.message

);

}

messageInput.value="";

await loadMessages(

currentConversation

);

}
catch(error){

console.error(error);

alert(

"Unable to send message."

);

}
finally{

sendButton.disabled=false;

messageInput.focus();

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
   PART 3 CONTINUES
========================================================== *//* ==========================================================
   REMADEF MESSAGES
   Part 3
   Typing • Reply • Reactions • Pin • Edit • Delete
========================================================== */

const typingIndicator =
document.getElementById("typingIndicator");

const replyPreview =
document.getElementById("replyPreview");

const replyText =
document.getElementById("replyText");

const cancelReply =
document.getElementById("cancelReply");

let replyingTo = null;

let typingTimeout = null;

/* ==========================================================
   TYPING INDICATOR
========================================================== */

messageInput.addEventListener(
"input",
handleTyping
);

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

typingTimeout =
setTimeout(()=>{

RemadefAPI.stopTyping(
currentConversation
);

},3000);

}

/* ==========================================================
   SHOW REMOTE TYPING
========================================================== */

function showTyping(){

typingIndicator.classList.remove(
"hidden"
);

}

function hideTyping(){

typingIndicator.classList.add(
"hidden"
);

}

/* ==========================================================
   REPLY
========================================================== */

function startReply(messageId,text){

replyingTo =
messageId;

replyPreview.classList.remove(
"hidden"
);

replyText.textContent =
text;

messageInput.focus();

}

cancelReply.addEventListener(

"click",

()=>{

replyingTo=null;

replyPreview.classList.add(
"hidden"
);

replyText.textContent="";

}

);

/* ==========================================================
   MESSAGE MENU
========================================================== */

function messageMenu(message){

return [

{

title:"Reply",

action:()=>{

startReply(

message.$id,

message.content

);

}

},

{

title:"Copy",

action:()=>{

navigator.clipboard.writeText(

message.content

);

}

},

{

title:"Pin",

action:()=>{

pinMessage(

message.$id

);

}

},

{

title:"React",

action:()=>{

reactToMessage(

message.$id,

"👍"

);

}

},

{

title:"Edit",

action:()=>{

editMessage(

message

);

}

},

{

title:"Delete",

action:()=>{

deleteMessage(

message.$id

);

}

}

];

}

/* ==========================================================
   SEND REPLY
========================================================== */

async function sendReply(message){

await RemadefAPI.sendMessage(

currentConversation,

{

content:message,

reply_to:replyingTo

}

);

replyingTo=null;

replyPreview.classList.add(
"hidden"
);

}

/* ==========================================================
   REACTIONS
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

console.error(error);

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

alert(
"Message pinned."
);

}
catch(error){

console.error(error);

}

}

/* ==========================================================
   EDIT MESSAGE
========================================================== */

async function editMessage(message){

const updated =

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

console.error(error);

}

}

/* ==========================================================
   DELETE MESSAGE
========================================================== */

async function deleteMessage(messageId){

const confirmed =

confirm(

"Delete this message?"

);

if(!confirmed){

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

console.error(error);

alert(

"Unable to delete message."

);

}

}

/* ==========================================================
   CONTEXT MENU
========================================================== */

chatMessages.addEventListener(

"contextmenu",

event=>{

event.preventDefault();

const bubble =

event.target.closest(

".message"

);

if(!bubble){

return;

}

const messageId =

bubble.dataset.id;

console.log(

"Open context menu:",

messageId

);

/* Custom context menu UI
   will be implemented later */

});

/* ==========================================================
   PART 4 CONTINUES
========================================================== *//* ==========================================================
   REMADEF MESSAGES
   Part 4
   Privacy • Device Copies • Retention • Realtime
   Utilities • Initialization Complete
========================================================== */

/* ==========================================================
   DOM
========================================================== */

const keepLocalCopies =
document.getElementById(
"keepLocalCopies"
);

const conversationInfo =
document.getElementById(
"conversationInfo"
);

const chatInfoButton =
document.getElementById(
"chatInfoButton"
);

const attachmentButton =
document.getElementById(
"attachmentButton"
);

const attachmentMenu =
document.getElementById(
"attachmentMenu"
);

const emojiButton =
document.getElementById(
"emojiButton"
);

const emojiPicker =
document.getElementById(
"emojiPicker"
);

/* ==========================================================
   PRIVACY
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

"remadef_message_settings",

JSON.stringify(settings)

);

}

function loadPrivacySettings(){

const saved=

localStorage.getItem(

"remadef_message_settings"

);

if(!saved){

return;

}

const settings=

JSON.parse(saved);

keepLocalCopies.checked=

settings.keepEncryptedCopies;

}

/* ==========================================================
   CONVERSATION INFO
========================================================== */

chatInfoButton?.addEventListener(

"click",

()=>{

conversationInfo.classList.toggle(

"hidden"

);

}

);

/* ==========================================================
   EMOJI PICKER
========================================================== */

emojiButton?.addEventListener(

"click",

()=>{

emojiPicker.classList.toggle(

"hidden"

);

attachmentMenu.classList.add(

"hidden"

);

}

);

emojiPicker?.addEventListener(

"click",

event=>{

const emoji=

event.target.textContent.trim();

if(!emoji){

return;

}

messageInput.value+=emoji;

emojiPicker.classList.add(

"hidden"

);

messageInput.focus();

}

);

/* ==========================================================
   ATTACHMENTS
========================================================== */

attachmentButton?.addEventListener(

"click",

()=>{

attachmentMenu.classList.toggle(

"hidden"

);

emojiPicker.classList.add(

"hidden"

);

});

/* Future:
Photo
Video
Audio
Document
Location
Contact */

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

`databases.messages.documents`,

response=>{

handleRealtime(

response

);

}

);

}

function handleRealtime(

response

){

console.log(

"Realtime",

response

);

if(

currentConversation

){

loadMessages(

currentConversation

);

}

}

/* ==========================================================
   ONLINE STATUS
========================================================== */

window.addEventListener(

"online",

()=>{

console.log(

"Online"

);

}

);

window.addEventListener(

"offline",

()=>{

console.log(

"Offline"

);

}

);

/* ==========================================================
   CLOSE MENUS
========================================================== */

document.addEventListener(

"click",

event=>{

if(

!emojiButton.contains(

event.target

)

&&

!emojiPicker.contains(

event.target

)

){

emojiPicker.classList.add(

"hidden"

);

}

if(

!attachmentButton.contains(

event.target

)

&&

!attachmentMenu.contains(

event.target

)

){

attachmentMenu.classList.add(

"hidden"

);

}

}

);

/* ==========================================================
   MESSAGE RETENTION
========================================================== */

function getRetention(){

return "72h";

}

/* Future:
24 Hours
72 Hours
7 Days
Custom */

/* ==========================================================
   AUTO SAVE DRAFT
========================================================== */

messageInput.addEventListener(

"input",

()=>{

localStorage.setItem(

"remadef_message_draft",

messageInput.value

);

}

);

function loadDraft(){

const draft=

localStorage.getItem(

"remadef_message_draft"

);

if(draft){

messageInput.value=draft;

}

}

/* ==========================================================
   CLEAR DRAFT
========================================================== */

function clearDraft(){

localStorage.removeItem(

"remadef_message_draft"

);

}

/* ==========================================================
   INITIALIZATION
========================================================== */

window.addEventListener(

"load",

()=>{

loadPrivacySettings();

loadDraft();

});

/* ==========================================================
   CLEANUP
========================================================== */

window.addEventListener(

"beforeunload",

()=>{

if(unsubscribeRealtime){

unsubscribeRealtime();

}

});

/* ==========================================================
   END OF messages.js
========================================================== */
