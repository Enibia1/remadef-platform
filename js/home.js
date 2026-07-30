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
   MENU DRAWER & SETTINGS ELEMENTS
========================================================== */

const menuButton = document.getElementById("menuButton");

const menuDrawer = document.getElementById("menuDrawer");

const menuOverlay = document.getElementById("menuOverlay");

const closeMenuBtn = document.getElementById("closeMenuBtn");

const drawerNotificationsBtn = document.getElementById("drawerNotificationsBtn");

const drawerSettingsBtn = document.getElementById("drawerSettingsBtn");

const settingsModal = document.getElementById("settingsModal");

const closeSettingsBtn = document.getElementById("closeSettingsBtn");

const saveSettingsBtn = document.getElementById("saveSettingsBtn");

const notificationsPanel = document.getElementById("notificationsPanel");

/* ==========================================================
   LUCIDE
========================================================== */

if (window.lucide) {
    lucide.createIcons();
}

/* ==========================================================
   SIDEBAR
========================================================== */

if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {

        if (window.innerWidth <= 768) {

            sidebar.classList.toggle("show");

        } else {

            sidebar.classList.toggle("collapsed");

        }

    });
}

/* ==========================================================
   MENU DRAWER & MODAL CONTROLLERS
========================================================== */

function toggleMenu(show) {

    if (!menuDrawer || !menuOverlay) return;

    if (show) {

        menuDrawer.classList.remove("hidden");

        menuOverlay.classList.remove("hidden");

        if (window.lucide) lucide.createIcons();

    } else {

        menuDrawer.classList.add("hidden");

        menuOverlay.classList.add("hidden");

    }

}

function toggleSettings(show) {

    if (!settingsModal) return;

    if (show) {

        settingsModal.classList.remove("hidden");

        toggleMenu(false);

        if (window.lucide) lucide.createIcons();

    } else {

        settingsModal.classList.add("hidden");

    }

}

function initializeMenuSystem() {

    if (menuButton) {

        menuButton.addEventListener("click", () => toggleMenu(true));

    }

    if (closeMenuBtn) {

        closeMenuBtn.addEventListener("click", () => toggleMenu(false));

    }

    if (menuOverlay) {

        menuOverlay.addEventListener("click", () => toggleMenu(false));

    }

    if (drawerNotificationsBtn) {

        drawerNotificationsBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            toggleMenu(false);

            if (notificationsPanel) {

                notificationsPanel.classList.toggle("hidden");

            }

        });

    }

    if (drawerSettingsBtn) {

        drawerSettingsBtn.addEventListener("click", () => toggleSettings(true));

    }

    if (closeSettingsBtn) {

        closeSettingsBtn.addEventListener("click", () => toggleSettings(false));

    }

    if (saveSettingsBtn) {

        saveSettingsBtn.addEventListener("click", () => {

            const retention = document.getElementById("settingRetention")?.value;

            const realtime = document.getElementById("settingRealtimeAlerts")?.checked;

            const sound = document.getElementById("settingSoundAlerts")?.checked;

            localStorage.setItem("remadef_settings", JSON.stringify({ retention, realtime, sound }));

            alert("Platform settings saved!");

            toggleSettings(false);

        });

    }

}

/* ==========================================================
   DROPDOWN
========================================================== */

if (brandButton && brandDropdown) {

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

}

/* ==========================================================
   USER
========================================================== */

async function loadUser() {

    try {

        const user = await account.get();

        let initial = "U";

        if (user.name) {

            initial = user.name.charAt(0).toUpperCase();

            if (welcomeTitle) {

                welcomeTitle.textContent =
                    `Welcome back, ${user.name.split(" ")[0]}!`;

            }

            const drawerUserName = document.getElementById("drawerUserName");

            if (drawerUserName) {

                drawerUserName.textContent = user.name;

            }

        }

        else if (user.email) {

            initial = user.email.charAt(0).toUpperCase();

        }

        if (avatar) avatar.textContent = initial;

        const drawerAvatar = document.getElementById("drawerAvatar");

        if (drawerAvatar) drawerAvatar.textContent = initial;

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

        if (window.RemadefAPI && typeof window.RemadefAPI.health === "function") {

            await RemadefAPI.health();

        }

        if (apiStatus) apiStatus.textContent = "Platform Online";

    }

    catch (error) {

        if (apiStatus) apiStatus.textContent = "Platform Offline";

    }

}

/* ==========================================================
   PROFILE
========================================================== */

function loadProfileProgress() {

    const completion = 0;

    const profileComp = document.getElementById("profileCompletion");

    const sidebarComp = document.getElementById("sidebarCompletion");

    const progressFill = document.getElementById("progressFill");

    if (profileComp) profileComp.textContent = completion + "%";

    if (sidebarComp) sidebarComp.textContent = completion + "%";

    if (progressFill) progressFill.style.width = completion + "%";

}

/* ==========================================================
   DASHBOARD
========================================================== */

function loadDashboard() {

    const learningCount = document.getElementById("learningCount");

    const applicationCount = document.getElementById("applicationCount");

    const dashboardMessages = document.getElementById("dashboardMessages");

    const statApplications = document.getElementById("statApplications");

    const statCertificates = document.getElementById("statCertificates");

    const statConnections = document.getElementById("statConnections");

    const statHours = document.getElementById("statHours");

    if (learningCount) learningCount.textContent = 0;

    if (applicationCount) applicationCount.textContent = 0;

    if (dashboardMessages) dashboardMessages.textContent = 0;

    if (statApplications) statApplications.textContent = 0;

    if (statCertificates) statCertificates.textContent = 0;

    if (statConnections) statConnections.textContent = 0;

    if (statHours) statHours.textContent = 0;

}

/* ==========================================================
   BADGES
========================================================== */

function updateBadges() {

    const unreadMessages = 0;

    const notifications = 0;

    if (messageBadge) messageBadge.textContent = unreadMessages;

    if (notificationBadge) notificationBadge.textContent = notifications;

    const drawerBadge = document.getElementById("drawerBadge");

    if (drawerBadge) drawerBadge.textContent = notifications;

}

/* ==========================================================
   SEARCH
========================================================== */

const search = document.getElementById("globalSearch");

if (search) {

    search.addEventListener("keyup", (event) => {

        if (event.key !== "Enter") return;

        const query = search.value.trim();

        if (!query) return;

        console.log("Searching:", query);

    });

}

/* ==========================================================
   SPONSORED
========================================================== */

function initializeSponsored() {

    const section =
        document.getElementById("sponsoredSection");

    if (section) section.classList.remove("show");

}

/* ==========================================================
   LOGOUT
========================================================== */

if (logoutBtn) {

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

}

/* ==========================================================
   MOBILE
========================================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth > 768 && sidebar) {

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

    initializeMenuSystem();

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

    if (!DATABASE_ID || DATABASE_ID === "YOUR_DATABASE_ID") return;

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

    if (!DATABASE_ID || DATABASE_ID === "YOUR_DATABASE_ID") return;

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

        const profileComp = document.getElementById("profileCompletion");

        const sidebarComp = document.getElementById("sidebarCompletion");

        const progressFill = document.getElementById("progressFill");

        if (profileComp) profileComp.textContent = completion + "%";

        if (sidebarComp) sidebarComp.textContent = completion + "%";

        if (progressFill) progressFill.style.width = completion + "%";

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   UNREAD MESSAGES
========================================================== */

async function loadMessages() {

    if (!DATABASE_ID || DATABASE_ID === "YOUR_DATABASE_ID") return;

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

        const dashMessages = document.getElementById("dashboardMessages");

        if (dashMessages) dashMessages.textContent = unread;

        if (messageBadge) messageBadge.textContent = unread;

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   NOTIFICATIONS
========================================================== */

async function loadNotifications() {

    if (!DATABASE_ID || DATABASE_ID === "YOUR_DATABASE_ID") return;

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

        if (notificationBadge) notificationBadge.textContent = response.total;

        const drawerBadge = document.getElementById("drawerBadge");

        if (drawerBadge) {

            drawerBadge.textContent = response.total;

            if (response.total > 0) {

                drawerBadge.classList.remove("hidden");

            }

        }

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================================================
   APPLICATIONS
========================================================== */

async function loadApplications() {

    const appCount = document.getElementById("applicationCount");

    if (appCount) appCount.textContent = 0;

}

/* ==========================================================
   LEARNING
========================================================== */

async function loadLearning() {

    const learnCount = document.getElementById("learningCount");

    if (learnCount) learnCount.textContent = 0;

}

/* ==========================================================
   STATISTICS
========================================================== */

async function loadStatistics() {

    const statApps = document.getElementById("statApplications");

    const statCerts = document.getElementById("statCertificates");

    const statConns = document.getElementById("statConnections");

    const statHrs = document.getElementById("statHours");

    if (statApps) statApps.textContent = 0;

    if (statCerts) statCerts.textContent = 0;

    if (statConns) statConns.textContent = 0;

    if (statHrs) statHrs.textContent = 0;

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

    if (!DATABASE_ID || DATABASE_ID === "YOUR_DATABASE_ID") return;

    client.subscribe(

        `databases.${DATABASE_ID}.collections.${MESSAGES_TABLE}.documents`,

        () => {

            loadMessages();

        }

    );

    client.subscribe(

        `databases.${DATABASE_ID}.collections.${NOTIFICATIONS_TABLE}.documents`,

        () => {

            loadNotifications();

        }

    );

}

/* ==========================================================
   PROFILE MENU
========================================================== */

function initializeProfileMenu() {

    if (avatar) {

        avatar.addEventListener("click", () => {

            window.location.href = "profile.html";

        });

    }

}

/* ==========================================================
   GLOBAL SEARCH
========================================================== */

async function globalSearch(query) {

    if (!query) return;

    console.log("Searching:", query);

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

    sponsored.classList.remove("show");

}

/* ==========================================================
   MOBILE SIDEBAR
========================================================== */

document.addEventListener("click", event => {

    if (

        !sidebar ||

        window.innerWidth > 768 ||

        !sidebar.classList.contains("show")

    ) return;

    if (

        !sidebar.contains(event.target) &&

        sidebarToggle &&

        !sidebarToggle.contains(event.target)

    ) {

        sidebar.classList.remove("show");

    }

});

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

        if (window.lucide) {

            lucide.createIcons();

        }

    }

);

/* ==========================================================
   END OF HOME.JS
========================================================== */
