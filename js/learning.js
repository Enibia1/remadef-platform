/* ==========================================================
   REMADEF LEARNING PLATFORM
   js/learning.js
   PART 3A
   App Initialization
   Authentication
   Current User
   Helper Functions
========================================================== */


/* ==========================================================
   CONFIGURATION
========================================================== */

const APPWRITE_ENDPOINT =
    "https://fra.cloud.appwrite.io/v1";

const PROJECT_ID =
    "6a634fdc00148a907132";


/* ==========================================================
   APPWRITE CLIENT
========================================================== */

const client =
    new Appwrite.Client();

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID);

const account =
    new Appwrite.Account(client);

const databases =
    new Appwrite.Databases(client);

const storage =
    new Appwrite.Storage(client);

const functions =
    new Appwrite.Functions(client);

const realtime =
    client;


/* ==========================================================
   GLOBAL STATE
========================================================== */

const LearningState = {

    currentUser: null,

    profile: null,

    enrolledCourses: [],

    recommendedCourses: [],

    categories: [],

    certificates: [],

    liveSessions: [],

    notifications: [],

    statistics: {

        enrolled: 0,

        completed: 0,

        certificates: 0,

        learningHours: 0

    }

};


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const UI = {

    welcome:

        document.getElementById("welcome-name"),

    avatar:

        document.getElementById("avatar"),

    search:

        document.getElementById("learning-search"),

    statsEnrolled:

        document.getElementById("stat-enrolled"),

    statsCompleted:

        document.getElementById("stat-completed"),

    statsCertificates:

        document.getElementById("stat-certificates"),

    statsHours:

        document.getElementById("stat-hours"),

    categories:

        document.getElementById("categories"),

    recommended:

        document.getElementById("recommended-courses"),

    continueLearning:

        document.getElementById("continue-learning"),

    liveSessions:

        document.getElementById("live-sessions"),

    certificates:

        document.getElementById("certificates"),

    notificationBadge:

        document.getElementById("notification-count")

};


/* ==========================================================
   HELPERS
========================================================== */

function $(id) {

    return document.getElementById(id);

}

function create(tag) {

    return document.createElement(tag);

}

function text(value) {

    return document.createTextNode(value);

}

function show(element) {

    if (element) {

        element.hidden = false;

    }

}

function hide(element) {

    if (element) {

        element.hidden = true;

    }

}

function initials(name) {

    if (!name) {

        return "R";

    }

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}

function formatPercent(value) {

    return value + "%";

}

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* ==========================================================
   LOADING
========================================================== */

function showLoading() {

    document.body.classList.add("loading");

}

function hideLoading() {

    document.body.classList.remove("loading");

}


/* ==========================================================
   AUTHENTICATION
========================================================== */

async function loadCurrentUser() {

    try {

        const user =
            await account.get();

        LearningState.currentUser =
            user;

        updateHeader(user);

        return user;

    }

    catch (error) {

        console.error(
            "Authentication Error",
            error
        );

        window.location.replace(
            "login.html"
        );

    }

}


/* ==========================================================
   UPDATE HEADER
========================================================== */

function updateHeader(user) {

    if (UI.welcome) {

        UI.welcome.textContent =
            user.name ||
            "Learner";

    }

    if (UI.avatar) {

        UI.avatar.textContent =
            initials(
                user.name ||
                user.email
            );

    }

}


/* ==========================================================
   LOAD PROFILE
========================================================== */

async function loadProfile() {

    try {

        if (!window.RemadefAPI) {

            return;

        }

        const profile =
            await RemadefAPI.getProfile();

        LearningState.profile =
            profile;

        return profile;

    }

    catch (error) {

        console.warn(
            "Profile not available",
            error
        );

    }

}


/* ==========================================================
   SIGN OUT
========================================================== */

async function logout() {

    try {

        await account.deleteSession(
            "current"
        );

    }

    finally {

        window.location.replace(
            "login.html"
        );

    }

}


/* ==========================================================
   CONNECTION STATUS
========================================================== */

window.addEventListener(

    "online",

    function () {

        console.log(
            "Connection Restored"
        );

    }

);

window.addEventListener(

    "offline",

    function () {

        console.log(
            "Offline Mode"
        );

    }

);


/* ==========================================================
   INITIALIZE
========================================================== */

async function initializeLearning() {

    showLoading();

    await loadCurrentUser();

    await loadProfile();

    hideLoading();

}

document.addEventListener(

    "DOMContentLoaded",

    initializeLearning

);


/* ==========================================================
   PART 3B
   DASHBOARD STATISTICS
   CATEGORIES
   COURSES
   CONTINUE LEARNING
   LIVE SESSIONS
   CERTIFICATES
========================================================== */


/* ==========================================================
   LOAD DASHBOARD STATISTICS
========================================================== */

async function loadDashboardStatistics() {

    try {

        if (window.RemadefAPI &&
            typeof RemadefAPI.getLearningStatistics === "function") {

            LearningState.statistics =
                await RemadefAPI.getLearningStatistics();

        } else {

            LearningState.statistics = {

                enrolled: 8,
                completed: 3,
                certificates: 2,
                learningHours: 126

            };

        }

        renderDashboardStatistics();

    }

    catch (error) {

        console.error(
            "Statistics Error:",
            error
        );

    }

}


/* ==========================================================
   RENDER DASHBOARD
========================================================== */

function renderDashboardStatistics() {

    if (UI.statsEnrolled) {

        UI.statsEnrolled.textContent =
            LearningState.statistics.enrolled;

    }

    if (UI.statsCompleted) {

        UI.statsCompleted.textContent =
            LearningState.statistics.completed;

    }

    if (UI.statsCertificates) {

        UI.statsCertificates.textContent =
            LearningState.statistics.certificates;

    }

    if (UI.statsHours) {

        UI.statsHours.textContent =
            LearningState.statistics.learningHours;

    }

}


/* ==========================================================
   LOAD CATEGORIES
========================================================== */

async function loadCategories() {

    try {

        LearningState.categories = [

            {
                id: 1,
                name: "Business",
                icon: "💼",
                courses: 42
            },

            {
                id: 2,
                name: "Technology",
                icon: "💻",
                courses: 71
            },

            {
                id: 3,
                name: "Finance",
                icon: "💰",
                courses: 31
            },

            {
                id: 4,
                name: "Agriculture",
                icon: "🌾",
                courses: 18
            },

            {
                id: 5,
                name: "Manufacturing",
                icon: "🏭",
                courses: 25
            },

            {
                id: 6,
                name: "Healthcare",
                icon: "🏥",
                courses: 19
            }

        ];

        renderCategories();

    }

    catch (error) {

        console.error(error);

    }

}


/* ==========================================================
   RENDER CATEGORIES
========================================================== */

function renderCategories() {

    if (!UI.categories) return;

    UI.categories.innerHTML = "";

    LearningState.categories.forEach(function (category) {

        const card = create("div");

        card.className = "category-card";

        card.innerHTML = `

            <div class="category-icon">

                ${category.icon}

            </div>

            <h3>${escapeHTML(category.name)}</h3>

            <p>${category.courses} Courses</p>

        `;

        UI.categories.appendChild(card);

    });

}


/* ==========================================================
   LOAD RECOMMENDED COURSES
========================================================== */

async function loadRecommendedCourses() {

    try {

        LearningState.recommendedCourses = [

            {

                id: "BUS001",

                title: "Business Foundations",

                instructor: "REMADEF Academy",

                progress: 0,

                duration: "10 Weeks"

            },

            {

                id: "FIN201",

                title: "Trade Finance",

                instructor: "Finance School",

                progress: 0,

                duration: "8 Weeks"

            },

            {

                id: "TEC301",

                title: "Web Development",

                instructor: "Technology Hub",

                progress: 0,

                duration: "14 Weeks"

            }

        ];

        renderRecommendedCourses();

    }

    catch (error) {

        console.error(error);

    }

}


/* ==========================================================
   RENDER RECOMMENDED COURSES
========================================================== */

function renderRecommendedCourses() {

    if (!UI.recommended) return;

    UI.recommended.innerHTML = "";

    LearningState.recommendedCourses.forEach(function (course) {

        const card = create("div");

        card.className = "course-card";

        card.innerHTML = `

            <h3>${escapeHTML(course.title)}</h3>

            <p>${escapeHTML(course.instructor)}</p>

            <small>${course.duration}</small>

            <button
                class="primary-button"
                data-course="${course.id}">

                Enroll

            </button>

        `;

        UI.recommended.appendChild(card);

    });

}


/* ==========================================================
   LOAD CONTINUE LEARNING
========================================================== */

async function loadContinueLearning() {

    LearningState.enrolledCourses = [

        {

            id: "BUS001",

            title: "Business Foundations",

            progress: 64

        },

        {

            id: "FIN201",

            title: "Trade Finance",

            progress: 31

        }

    ];

    renderContinueLearning();

}


/* ==========================================================
   RENDER CONTINUE LEARNING
========================================================== */

function renderContinueLearning() {

    if (!UI.continueLearning) return;

    UI.continueLearning.innerHTML = "";

    LearningState.enrolledCourses.forEach(function (course) {

        const card = create("div");

        card.className = "continue-card";

        card.innerHTML = `

            <h3>${escapeHTML(course.title)}</h3>

            <div class="progress">

                <div
                    class="progress-fill"
                    style="width:${course.progress}%">

                </div>

            </div>

            <span>

                ${course.progress}% Complete

            </span>

        `;

        UI.continueLearning.appendChild(card);

    });

}


/* ==========================================================
   LOAD LIVE SESSIONS
========================================================== */

async function loadLiveSessions() {

    LearningState.liveSessions = [

        {

            title: "Business Strategy",

            date: "Today",

            time: "6:00 PM"

        },

        {

            title: "Python Programming",

            date: "Tomorrow",

            time: "4:00 PM"

        }

    ];

    renderLiveSessions();

}


/* ==========================================================
   RENDER LIVE SESSIONS
========================================================== */

function renderLiveSessions() {

    if (!UI.liveSessions) return;

    UI.liveSessions.innerHTML = "";

    LearningState.liveSessions.forEach(function (session) {

        const item = create("div");

        item.className = "live-session";

        item.innerHTML = `

            <strong>

                ${escapeHTML(session.title)}

            </strong>

            <p>

                ${session.date}
                •
                ${session.time}

            </p>

        `;

        UI.liveSessions.appendChild(item);

    });

}


/* ==========================================================
   LOAD CERTIFICATES
========================================================== */

async function loadCertificates() {

    LearningState.certificates = [

        {

            title: "Business Foundations",

            issued: "2026"

        },

        {

            title: "Introduction to Finance",

            issued: "2026"

        }

    ];

    renderCertificates();

}


/* ==========================================================
   RENDER CERTIFICATES
========================================================== */

function renderCertificates() {

    if (!UI.certificates) return;

    UI.certificates.innerHTML = "";

    LearningState.certificates.forEach(function (certificate) {

        const card = create("div");

        card.className = "certificate-card";

        card.innerHTML = `

            🏆

            <h3>

                ${escapeHTML(certificate.title)}

            </h3>

            <small>

                Issued ${certificate.issued}

            </small>

        `;

        UI.certificates.appendChild(card);

    });

}


/* ==========================================================
   LOAD ALL LEARNING DATA
========================================================== */

async function loadLearningDashboard() {

    await Promise.all([

        loadDashboardStatistics(),

        loadCategories(),

        loadRecommendedCourses(),

        loadContinueLearning(),

        loadLiveSessions(),

        loadCertificates()

    ]);

}



/* ============================================================
   PART 3C
   COURSE INTERACTIONS
   SEARCH
   FILTERS
   PROGRESS
   LIVE SESSIONS
   CERTIFICATES
============================================================ */

const searchInput =
document.getElementById("learning-search");

const categoryFilter =
document.getElementById("category-filter");

const levelFilter =
document.getElementById("level-filter");

const sortFilter =
document.getElementById("sort-filter");

const coursesContainer =
document.getElementById("courses-grid");

let filteredCourses = [];

function renderCourses(list){

    if(!coursesContainer){
        return;
    }

    coursesContainer.innerHTML = "";

    if(list.length === 0){

        coursesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No courses found</h3>
                <p>Try another search or filter.</p>
            </div>
        `;

        return;
    }

    list.forEach(course=>{

        const card =
        document.createElement("article");

        card.className="course-card";

        card.innerHTML=`

            <div class="course-image">

                <img
                    src="${course.image}"
                    alt="${course.title}"
                >

            </div>

            <div class="course-content">

                <span class="course-category">
                    ${course.category}
                </span>

                <h3>
                    ${course.title}
                </h3>

                <p>
                    ${course.description}
                </p>

                <div class="course-meta">

                    <span>
                        ${course.level}
                    </span>

                    <span>
                        ${course.duration}
                    </span>

                </div>

                <div class="progress">

                    <div
                        class="progress-fill"
                        style="width:${course.progress}%"
                    ></div>

                </div>

                <div class="course-footer">

                    <span>
                        ${course.progress}% Complete
                    </span>

                    <button
                        class="primary-button continue-course"
                        data-id="${course.id}"
                    >

                        Continue

                    </button>

                </div>

            </div>

        `;

        coursesContainer.appendChild(card);

    });

}

function applyFilters(){

    filteredCourses =
    learningCourses.filter(course=>{

        let matchesSearch=true;
        let matchesCategory=true;
        let matchesLevel=true;

        if(searchInput){

            const value =
            searchInput.value
            .trim()
            .toLowerCase();

            matchesSearch =

                course.title.toLowerCase().includes(value)

                ||

                course.description.toLowerCase().includes(value);

        }

        if(categoryFilter){

            if(categoryFilter.value!=="all"){

                matchesCategory=

                course.category===categoryFilter.value;

            }

        }

        if(levelFilter){

            if(levelFilter.value!=="all"){

                matchesLevel=

                course.level===levelFilter.value;

            }

        }

        return(

            matchesSearch

            &&

            matchesCategory

            &&

            matchesLevel

        );

    });

    applySorting();

}

function applySorting(){

    if(sortFilter){

        switch(sortFilter.value){

            case "progress":

                filteredCourses.sort(

                    (a,b)=>

                    b.progress-a.progress

                );

                break;

            case "title":

                filteredCourses.sort(

                    (a,b)=>

                    a.title.localeCompare(b.title)

                );

                break;

            default:

                filteredCourses.sort(

                    (a,b)=>

                    b.updated-a.updated

                );

        }

    }

    renderCourses(filteredCourses);

}

if(searchInput){

    searchInput.addEventListener(

        "input",

        applyFilters

    );

}

if(categoryFilter){

    categoryFilter.addEventListener(

        "change",

        applyFilters

    );

}

if(levelFilter){

    levelFilter.addEventListener(

        "change",

        applyFilters

    );

}

if(sortFilter){

    sortFilter.addEventListener(

        "change",

        applySorting

    );

}

/* ============================================================
   CONTINUE COURSE
============================================================ */

document.addEventListener(

    "click",

    function(event){

        const button =
        event.target.closest(".continue-course");

        if(!button){

            return;

        }

        const id =
        button.dataset.id;

        openCourse(id);

    }

);

function openCourse(id){

    const course =
    learningCourses.find(

        c=>c.id===id

    );

    if(!course){

        return;

    }

    localStorage.setItem(

        "remadef_current_course",

        JSON.stringify(course)

    );

    window.location.href=
    "course.html?id="+id;

}

/* ============================================================
   LIVE SESSION
============================================================ */

const joinButton =
document.getElementById("join-live-session");

if(joinButton){

    joinButton.addEventListener(

        "click",

        function(){

            alert(

                "Live classrooms will be powered by Appwrite Functions and Realtime."

            );

        }

    );

}

/* ============================================================
   CERTIFICATES
============================================================ */

const certificateButton =
document.getElementById("view-certificates");

if(certificateButton){

    certificateButton.addEventListener(

        "click",

        function(){

            window.location.href=

            "certificates.html";

        }

    );

}

/* ============================================================
   INITIAL LOAD
============================================================ */

filteredCourses =
learningCourses;

renderCourses(filteredCourses);

/* ============================================================
   PART 3D
   COURSE ACTIONS, SEARCH, FILTERING,
   LIVE SESSIONS, CERTIFICATES,
   REALTIME UPDATES
============================================================ */

/* ------------------------------------------------------------
   SEARCH COURSES
------------------------------------------------------------ */

function searchCourses(keyword = "") {

    const value = keyword.toLowerCase().trim();

    const filtered = courses.filter(course => {

        return (
            course.title.toLowerCase().includes(value) ||
            course.category.toLowerCase().includes(value) ||
            course.instructor.toLowerCase().includes(value)
        );

    });

    renderCourses(filtered);

}

const searchInput = document.getElementById("course-search");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        searchCourses(this.value);

    });

}

/* ------------------------------------------------------------
   CATEGORY FILTER
------------------------------------------------------------ */

const categoryButtons = document.querySelectorAll(".category-filter");

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        this.classList.add("active");

        const category = this.dataset.category;

        if (category === "all") {

            renderCourses(courses);

            return;

        }

        const filtered = courses.filter(course => {

            return course.category === category;

        });

        renderCourses(filtered);

    });

});

/* ------------------------------------------------------------
   CONTINUE LEARNING
------------------------------------------------------------ */

function continueLearning(courseId) {

    window.location.href =
        "course.html?id=" + courseId;

}

/* ------------------------------------------------------------
   ENROLL COURSE
------------------------------------------------------------ */

async function enrollCourse(courseId) {

    try {

        loading(true);

        console.log("Enroll:", courseId);

        /*
        Future Appwrite Function

        await databases.createDocument(...)

        */

        showToast("Successfully enrolled.");

    }

    catch (error) {

        console.error(error);

        showToast("Unable to enroll.");

    }

    finally {

        loading(false);

    }

}

/* ------------------------------------------------------------
   UPDATE COURSE PROGRESS
------------------------------------------------------------ */

async function updateProgress(courseId, progress) {

    try {

        console.log(courseId, progress);

        /*
        Future:

        databases.updateDocument()

        */

    }

    catch (error) {

        console.error(error);

    }

}

/* ------------------------------------------------------------
   LIVE SESSIONS
------------------------------------------------------------ */

async function loadLiveSessions() {

    const sessions = [

        {

            title:
                "Business Strategy",

            instructor:
                "REMADEF",

            time:
                "Today • 4:00 PM"

        },

        {

            title:
                "Finance Basics",

            instructor:
                "Mentor",

            time:
                "Tomorrow • 11:00 AM"

        }

    ];

    renderLiveSessions(sessions);

}

function renderLiveSessions(list) {

    const container =
        document.getElementById("live-sessions");

    if (!container)
        return;

    container.innerHTML = "";

    list.forEach(session => {

        container.innerHTML += `

<div class="live-card">

<h4>${session.title}</h4>

<p>${session.instructor}</p>

<span>${session.time}</span>

</div>

`;

    });

}

/* ------------------------------------------------------------
   CERTIFICATES
------------------------------------------------------------ */

async function loadCertificates() {

    const certificates = [];

    renderCertificates(certificates);

}

function renderCertificates(list) {

    const container =
        document.getElementById("certificate-list");

    if (!container)
        return;

    if (!list.length) {

        container.innerHTML =
            "<p>No certificates yet.</p>";

        return;

    }

}

/* ------------------------------------------------------------
   RECOMMENDATIONS
------------------------------------------------------------ */

function recommendCourses() {

    return courses
        .slice(0, 4);

}

/* ------------------------------------------------------------
   REALTIME
------------------------------------------------------------ */

function subscribeRealtime() {

    if (!client)
        return;

    try {

        client.subscribe(

            "databases.learning",

            response => {

                console.log(
                    "Realtime:",
                    response
                );

                loadDashboard();

            }

        );

    }

    catch (error) {

        console.error(error);

    }

}

/* ------------------------------------------------------------
   TOAST
------------------------------------------------------------ */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast)
        return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

/* ------------------------------------------------------------
   LOADING
------------------------------------------------------------ */

function loading(state) {

    const loader =
        document.getElementById("loading");

    if (!loader)
        return;

    loader.style.display =
        state ? "flex" : "none";

}

/* ------------------------------------------------------------
   DASHBOARD REFRESH
------------------------------------------------------------ */

async function loadDashboard() {

    await loadStatistics();

    await loadCategories();

    await loadCourses();

    await loadWidgets();

    await loadLiveSessions();

    await loadCertificates();

}

/* ------------------------------------------------------------
   INITIALIZE
------------------------------------------------------------ */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await initializeApp();

        await loadDashboard();

        subscribeRealtime();

    }

);
