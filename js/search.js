/* =====================================================
   REMADEF SEARCH
   search.js
===================================================== */

/* ==========================================
   APPWRITE CONFIGURATION
========================================== */

const PROJECT_ID =
    "6a634fdc00148a907132";

const ENDPOINT =
    "https://fra.cloud.appwrite.io/v1";

const client =
    new Appwrite.Client();

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const account =
    new Appwrite.Account(client);

/*
Future
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);
*/

/* ==========================================
   DOM
========================================== */

const searchInput =
    document.getElementById(
        "global-search"
    );

const clearButton =
    document.getElementById(
        "clear-search"
    );

const resultsContainer =
    document.getElementById(
        "search-results"
    );

const resultsCount =
    document.getElementById(
        "results-count"
    );

const avatar =
    document.getElementById(
        "avatar"
    );

const recentContainer =
    document.getElementById(
        "recent-searches"
    );

const filters =
    document.querySelectorAll(
        ".filter"
    );

/* ==========================================
   STORAGE
========================================== */

const RECENT_KEY =
    "remadef_recent_searches";

/* ==========================================
   CURRENT FILTER
========================================== */

let activeFilter =
    "all";

/* ==========================================
   SAMPLE DATA

Later replaced with
Appwrite Database search.
========================================== */

const SEARCH_DATA = [

{

type:"people",

title:"John Doe",

description:
"Software Developer • Lagos",

avatar:"J"

},

{

type:"learning",

title:"Frontend Development",

description:
"Learn HTML, CSS and JavaScript.",

avatar:"L"

},

{

type:"jobs",

title:"Backend Engineer",

description:
"Full-time opportunity",

avatar:"J"

},

{

type:"business",

title:"ABC Manufacturing",

description:
"Industrial Equipment Supplier",

avatar:"B"

},

{

type:"apprenticeships",

title:"Electrical Apprentice",

description:
"12-month apprenticeship",

avatar:"A"

},

{

type:"groups",

title:"Young Entrepreneurs",

description:
"Business networking community",

avatar:"G"

}

];

/* ==========================================
   USER SESSION
========================================== */

async function loadUser(){

try{

const user =
await account.get();

let initial = "U";

if(user.name){

initial =
user.name
.charAt(0)
.toUpperCase();

}

else if(user.email){

initial =
user.email
.charAt(0)
.toUpperCase();

}

avatar.textContent =
initial;

}

catch(error){

window.location.replace(
"login.html"
);

}

}

/* ==========================================
   RECENT SEARCHES
========================================== */

function getRecent(){

const saved =
localStorage.getItem(
RECENT_KEY
);

if(!saved){

return [];

}

try{

return JSON.parse(saved);

}

catch{

return [];

}

}

function saveRecent(term){

if(!term){

return;

}

let recent =
getRecent();

recent =
recent.filter(

item=>item!==term

);

recent.unshift(term);

recent =
recent.slice(0,10);

localStorage.setItem(

RECENT_KEY,

JSON.stringify(recent)

);

renderRecent();

}

function renderRecent(){

const recent =
getRecent();

recentContainer.innerHTML="";

if(recent.length===0){

recentContainer.innerHTML=

'<div class="recent-item">No recent searches</div>';

return;

}

recent.forEach(

item=>{

const div=
document.createElement("div");

div.className=
"recent-item";

div.innerHTML=

`<span>${item}</span>`;

div.onclick=()=>{

searchInput.value=item;

performSearch(item);

};

recentContainer.appendChild(div);

}

);

}

/* ==========================================
   FILTERS
========================================== */

filters.forEach(

button=>{

button.addEventListener(

"click",

function(){

filters.forEach(

b=>b.classList.remove("active")

);

this.classList.add("active");

activeFilter =

this.dataset.filter;

performSearch(

searchInput.value.trim()

);

}

);

}

);

/* ==========================================
   SEARCH
========================================== */

function performSearch(query){

resultsContainer.innerHTML="";

if(query===""){

resultsCount.textContent=

"Start typing to search.";

return;

}

saveRecent(query);

const lower=

query.toLowerCase();

let results=

SEARCH_DATA.filter(

item=>{

const matchText=

item.title

.toLowerCase()

.includes(lower)

||

item.description

.toLowerCase()

.includes(lower);

const matchFilter=

activeFilter==="all"

||

item.type===activeFilter;

return(

matchText&&

matchFilter

);

}

);

resultsCount.textContent=

results.length+

" result(s) found";

if(results.length===0){

resultsContainer.innerHTML=

`

<div class="placeholder-card">

No matching results found.

</div>

`;

return;

}

results.forEach(

result=>{

const card=

document.createElement("div");

card.className=

"result-card";

card.innerHTML=

`

<div class="result-avatar">

${result.avatar}

</div>

<div class="result-content">

<div class="result-title">

${result.title}

</div>

<div class="result-type">

${result.type}

</div>

<div class="result-description">

${result.description}

</div>

</div>

`;

card.onclick=function(){

console.log(

"Future open:",

result

);

/*

Future routing:

profile.html

learning.html

jobs.html

business.html

etc.

*/

};

resultsContainer.appendChild(

card

);

}

);

}

/* ==========================================
   EVENTS
========================================== */

searchInput.addEventListener(

"input",

function(){

performSearch(

this.value.trim()

);

}

);

searchInput.addEventListener(

"keydown",

function(event){

if(event.key==="Enter"){

event.preventDefault();

performSearch(

this.value.trim()

);

}

}

);

clearButton.addEventListener(

"click",

function(){

searchInput.value="";

performSearch("");

searchInput.focus();

}

);

/* ==========================================
   INITIALIZE
========================================== */

loadUser();

renderRecent();

performSearch("");

/* =====================================================

REMADEF SEARCH ROADMAP

Phase 1 ✅
✔ Authentication
✔ Search UI
✔ Filters
✔ Recent searches
✔ Responsive layout

Phase 2
• Appwrite Database search
• People
• Courses
• Apprenticeships
• Jobs
• Businesses
• Institutions

Phase 3
• AI ranking
• Search suggestions
• Trending searches
• Search history sync
• Voice search
• Global ecosystem search

===================================================== */
