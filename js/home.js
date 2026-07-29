"use strict";

/* ==========================================================
   REMADEF HOME
========================================================== */

const PROJECT_ID = "6a634fdc00148a907132";

const ENDPOINT = "https://fra.cloud.appwrite.io/v1";

/* ==========================================================
   APPWRITE
========================================================== */

const client = new Appwrite.Client();

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const account = new Appwrite.Account(client);

/* ==========================================================
   ELEMENTS
========================================================== */

const sidebar = document.getElementById("sidebar");

const sidebarToggle = document.getElementById("sidebarToggle");

const brandButton = document.getElementById("brandButton");

const brandDropdown = document.getElementById("brandDropdown");

const logoutBtn = document.getElementById("logoutBtn");

const avatar = document.getElementById("avatar");

const welcomeTitle = document.getElementById("welcomeTitle");

const apiStatus = document.getElementById("apiStatus");

const notificationBadge =
    document.getElementById("notificationBadge");

const messageBadge =
    document.getElementById("messageBadge");

/* ==========================================================
   LUCIDE
========================================================== */

lucide.createIcons();

/* ==========================================================
   SIDEBAR
========================================================== */

sidebarToggle.addEventListener("click", () => {

    if (window.innerWidth <= 768) {

        sidebar.classList.toggle("show");

    } else {

        sidebar.classList.toggle("collapsed");

    }

});

/* ==========================================================
   DROPDOWN
========================================================== */

brandButton.addEventListener("click", () => {

    brandDropdown.classList.toggle("show");

});

document.addEventListener("click", (event) => {

    if (

        !brandButton.contains(event.target) &&

        !brandDropdown.contains(event.target)

    ) {

        brandDropdown.classList.remove("show");

    }

});

/* ==========================================================
   USER
========================================================== */

async function loadUser() {

    try {

        const user = await account.get();

        let initial = "U";

        if (user.name) {

            initial = user.name.charAt(0).toUpperCase();

            welcomeTitle.textContent =
                `Welcome back, ${user.name.split(" ")[0]}!`;

        }

        else if (user.email) {

            initial = user.email.charAt(0).toUpperCase();

        }

        avatar.textContent = initial;

    }

    catch (error) {

        window.location.href = "login.html";

    }

}

/* ==========================================================
   API HEALTH
========================================================== */

async function checkPlatform() {

    try {

        await RemadefAPI.health();

        apiStatus.textContent =
            "Platform Online";

    }

    catch (error) {

        apiStatus.textContent =
            "Platform Offline";

    }

}

/* ==========================================================
   PROFILE
========================================================== */

function loadProfileProgress() {

    const completion = 0;

    document.getElementById("profileCompletion").textContent =
        completion + "%";

    document.getElementById("sidebarCompletion").textContent =
        completion + "%";

    document.getElementById("progressFill").style.width =
        completion + "%";

}

/* ==========================================================
   DASHBOARD
========================================================== */

function loadDashboard() {

    document.getElementById("learningCount").textContent = 0;

    document.getElementById("applicationCount").textContent = 0;

    document.getElementById("dashboardMessages").textContent = 0;

    document.getElementById("statApplications").textContent = 0;

    document.getElementById("statCertificates").textContent = 0;

    document.getElementById("statConnections").textContent = 0;

    document.getElementById("statHours").textContent = 0;

}

/* ==========================================================
   BADGES
========================================================== */

function updateBadges() {

    const unreadMessages = 0;

    const notifications = 0;

    messageBadge.textContent = unreadMessages;

    notificationBadge.textContent = notifications;

}

/* ==========================================================
   SEARCH
========================================================== */

const search = document.getElementById("globalSearch");

search.addEventListener("keyup", (event) => {

    if (event.key !== "Enter") return;

    const query = search.value.trim();

    if (!query) return;

    console.log("Searching:", query);

});

/* ==========================================================
   SPONSORED
========================================================== */

function initializeSponsored() {

    const section =
        document.getElementById("sponsoredSection");

    section.classList.remove("show");

}

/* ==========================================================
   LOGOUT
========================================================== */

logoutBtn.addEventListener("click", async (event) => {

    event.preventDefault();

    try {

        await account.deleteSession("current");

    }

    catch (error) {

        console.error(error);

    }

    window.location.href = "login.html";

});

/* ==========================================================
   MOBILE
========================================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {

        sidebar.classList.remove("show");

    }

});

/* ==========================================================
   START
========================================================== */

async function initialize() {

    await loadUser();

    await checkPlatform();

    loadProfileProgress();

    loadDashboard();

    updateBadges();

    initializeSponsored();

}

initialize();
/* ==========================================================
   APPWRITE DATABASES
========================================================== */

const databases = new Appwrite.Databases(client);

/* ==========================================================
   DATABASE CONFIGURATION
   (Replace with your actual IDs)
========================================================== */

const DATABASE_ID = "YOUR_DATABASE_ID";

const PROFILES_TABLE = "profiles";

const CONVERSATIONS_TABLE = "conversations";

const MEMBERS_TABLE = "conversation_members";

const MESSAGES_TABLE = "messages";

const NOTIFICATIONS_TABLE = "notifications";

/* ==========================================================
   CURRENT USER
========================================================== */

let currentUser = null;

/* ==========================================================
   LOAD LIVE DASHBOARD
========================================================== */

async function loadLiveDashboard() {

    try {

        currentUser = await account.get();

        await Promise.all([

            loadProfile(),

            loadMessages(),

            loadNotifications(),

            loadApplications(),

            loadLearning(),

            loadStatistics()

        ]);

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   PROFILE
========================================================== */

async function loadProfile() {

    try {

        const response = await databases.listDocuments(

            DATABASE_ID,

            PROFILES_TABLE,

            [

                Appwrite.Query.equal(

                    "account_id",

                    currentUser.$id

                ),

                Appwrite.Query.limit(1)

            ]

        );

        if (response.documents.length === 0)

            return;

        const profile = response.documents[0];

        const completion =

            profile.profile_completion || 0;

        document.getElementById(

            "profileCompletion"

        ).textContent = completion + "%";

        document.getElementById(

            "sidebarCompletion"

        ).textContent = completion + "%";

        document.getElementById(

            "progressFill"

        ).style.width = completion + "%";

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   UNREAD MESSAGES
========================================================== */

async function loadMessages() {

    try {

        const response = await databases.listDocuments(

            DATABASE_ID,

            MEMBERS_TABLE,

            [

                Appwrite.Query.equal(

                    "member_id",

                    currentUser.$id

                )

            ]

        );

        let unread = 0;

        response.documents.forEach(member => {

            unread +=

                member.unread_count || 0;

        });

        document.getElementById(

            "dashboardMessages"

        ).textContent = unread;

        document.getElementById(

            "messageBadge"

        ).textContent = unread;

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   NOTIFICATIONS
========================================================== */

async function loadNotifications() {

    try {

        const response = await databases.listDocuments(

            DATABASE_ID,

            NOTIFICATIONS_TABLE,

            [

                Appwrite.Query.equal(

                    "account_id",

                    currentUser.$id

                ),

                Appwrite.Query.equal(

                    "read",

                    false

                )

            ]

        );

        document.getElementById(

            "notificationBadge"

        ).textContent =

            response.total;

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   APPLICATIONS
========================================================== */

async function loadApplications() {

    document.getElementById(

        "applicationCount"

    ).textContent = 0;

}

/* ==========================================================
   LEARNING
========================================================== */

async function loadLearning() {

    document.getElementById(

        "learningCount"

    ).textContent = 0;

}

/* ==========================================================
   STATISTICS
========================================================== */

async function loadStatistics() {

    document.getElementById(

        "statApplications"

    ).textContent = 0;

    document.getElementById(

        "statCertificates"

    ).textContent = 0;

    document.getElementById(

        "statConnections"

    ).textContent = 0;

    document.getElementById(

        "statHours"

    ).textContent = 0;

}

/* ==========================================================
   REFRESH EVERY 30 SECONDS
========================================================== */

setInterval(

    loadLiveDashboard,

    30000

);

/* ==========================================================
   INITIAL LOAD
========================================================== */

loadLiveDashboard();
/* ==========================================================
   REALTIME UPDATES
========================================================== */

function subscribeRealtime() {

    client.subscribe(

        `databases.${DATABASE_ID}.tables.${MESSAGES_TABLE}.rows`,

        () => {

            loadMessages();

        }

    );

    client.subscribe(

        `databases.${DATABASE_ID}.tables.${NOTIFICATIONS_TABLE}.rows`,

        () => {

            loadNotifications();

        }

    );

}

/* ==========================================================
   PROFILE MENU
========================================================== */

function initializeProfileMenu() {

    const avatar = document.getElementById("avatar");

    avatar.addEventListener("click", () => {

        window.location.href = "profile.html";

    });

}

/* ==========================================================
   GLOBAL SEARCH
========================================================== */

async function globalSearch(query) {

    if (!query) return;

    console.log("Searching:", query);

    // Future:
    // Learning
    // Jobs
    // Businesses
    // Apprenticeships
    // Marketplace
    // Messages

}

/* ==========================================================
   SEARCH EVENTS
========================================================== */

const searchInput =
    document.getElementById("globalSearch");

if (searchInput) {

    searchInput.addEventListener("keypress", event => {

        if (event.key === "Enter") {

            globalSearch(searchInput.value.trim());

        }

    });

}

/* ==========================================================
   SPONSORED PLACEHOLDER
========================================================== */

function initializeSponsoredArea() {

    const sponsored =
        document.getElementById("sponsoredSection");

    if (!sponsored) return;

    // Future:
    // Read advertisements collection
    // Show sponsored opportunities

    sponsored.classList.remove("show");

}

/* ==========================================================
   MOBILE SIDEBAR
========================================================== */

document.addEventListener("click", event => {

    if (

        window.innerWidth > 768 ||

        !sidebar.classList.contains("show")

    ) return;

    if (

        !sidebar.contains(event.target) &&

        !sidebarToggle.contains(event.target)

    ) {

        sidebar.classList.remove("show");

    }

});

/* ==========================================================
   LOGOUT
========================================================== */

async function logout() {

    try {

        await account.deleteSession("current");

    }

    catch (error) {

        console.error(error);

    }

    window.location.href = "login.html";

}

if (logoutBtn) {

    logoutBtn.addEventListener(

        "click",

        logout

    );

}

/* ==========================================================
   PAGE INITIALIZATION
========================================================== */

window.addEventListener(

    "load",

    async () => {

        await loadUser();

        await checkPlatform();

        await loadLiveDashboard();

        initializeProfileMenu();

        initializeSponsoredArea();

        subscribeRealtime();

        lucide.createIcons();

    }

);

/* ==========================================================
   END OF HOME.JS
========================================================== */
