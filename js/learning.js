/* ==========================================================
   REMADEF LEARNING PLATFORM (js/learning.js)
   Synchronized with learning.html & Appwrite Cloud
========================================================== */

/* ----------------------------------------------------------
   1. CONFIGURATION & APPWRITE CLIENT
   ---------------------------------------------------------- */
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = "6a634fdc00148a907132";

const client = new Appwrite.Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);
const functions = new Appwrite.Functions(client);

/* ----------------------------------------------------------
   2. GLOBAL STATE & MASTER COURSE DATABASE
   ---------------------------------------------------------- */
const LearningState = {
    currentUser: null,
    profile: null,
    courses: [
        {
            id: "SOL-101",
            title: "5KVA Hybrid Solar Microgrid System Installation & Diagnostics",
            category: "Solar & Renewable Energy",
            instructor: "REMADEF Engineering Desk",
            level: "Intermediate",
            description: "Practical wiring, load balancing, inverter mounting, and battery array setup for residential and commercial hubs.",
            duration: "6 Weeks",
            progress: 65,
            linkedPlacement: "Solar Microgrid Installation Track"
        },
        {
            id: "BUS-204",
            title: "Commercial Sourcing Hub Sourcing & Prep-Kit Fulfilment",
            category: "Commercial & Business Growth",
            instructor: "Nexus Trading & Sourcing",
            level: "Beginner",
            description: "High-velocity B2B inventory optimization, bulk prep-kit assembly, and consortium-based logistics management.",
            duration: "4 Weeks",
            progress: 30,
            linkedPlacement: "Supply Chain & Hub Operations"
        },
        {
            id: "MFG-301",
            title: "Precision Metal Fabrication & Machine Tool Servicing",
            category: "Industrial Manufacturing",
            instructor: "Alimosho Industrial Workshop",
            level: "Advanced",
            description: "Safety protocols, lathe machine operations, structural welding techniques, and preventive tool maintenance.",
            duration: "8 Weeks",
            progress: 0,
            linkedPlacement: "Industrial Workshop Placement"
        },
        {
            id: "TRD-102",
            title: "Commercial Refrigeration & Cold Storage Maintenance",
            category: "Technical & Handyman Trades",
            instructor: "Remora Technical Services",
            level: "Intermediate",
            description: "Compressor troubleshooting, eco-refrigerant recovery, and cold-room electrical control wiring.",
            duration: "5 Weeks",
            progress: 0,
            linkedPlacement: "Cold-Chain Apprenticeship Desk"
        }
    ],
    categories: [
        { name: "Solar & Renewable Energy", icon: "sun", count: "14 Modules" },
        { name: "Industrial Manufacturing", icon: "factory", count: "19 Modules" },
        { name: "Commercial & Business Growth", icon: "trending-up", count: "22 Modules" },
        { name: "Technical & Handyman Trades", icon: "wrench", count: "18 Modules" }
    ],
    liveSessions: [
        {
            title: "Microgrid Installation Diagnostics & Fault Resolution",
            instructor: "Engr. A. Mustapha",
            date: "Today",
            time: "4:00 PM WAT"
        },
        {
            title: "Consortium Buying & Group Purchasing Architecture",
            instructor: "Remora Operations Team",
            date: "Tomorrow",
            time: "11:00 AM WAT"
        }
    ],
    certificates: [
        {
            id: "CERT-2026-8841",
            title: "Verified Commercial Microgrid Technician",
            issued: "July 2026",
            issuer: "REMADEF / Remora Foundation"
        }
    ]
};

/* ----------------------------------------------------------
   3. DOM ELEMENT CACHE (Matches learning.html exact IDs)
   ---------------------------------------------------------- */
const UI = {
    avatar: document.getElementById("avatar"),
    search: document.getElementById("courseSearch"),
    categoryFilter: document.getElementById("courseCategoryFilter"),
    coursesGrid: document.getElementById("coursesGrid"),
    categoriesContainer: document.getElementById("learningCategoriesContainer"),
    liveSessionsContainer: document.getElementById("liveSessionsContainer"),
    certificatesContainer: document.getElementById("certificatesContainer"),
    enrolledCount: document.getElementById("activeEnrolledCount"),
    certsCount: document.getElementById("certsEarnedCount"),
    messageBadge: document.getElementById("messageBadge"),
    notificationBadge: document.getElementById("notificationBadge")
};

/* ----------------------------------------------------------
   4. UTILITIES
   ---------------------------------------------------------- */
function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function initials(name) {
    if (!name) return "R";
    return name.trim().charAt(0).toUpperCase();
}

/* ----------------------------------------------------------
   5. AUTHENTICATION & HEADER
   ---------------------------------------------------------- */
async function loadCurrentUser() {
    try {
        const user = await account.get();
        LearningState.currentUser = user;
        if (UI.avatar) {
            UI.avatar.textContent = initials(user.name || user.email);
        }
        return user;
    } catch (error) {
        console.warn("User not authenticated with Appwrite:", error);
    }
}

/* ----------------------------------------------------------
   6. DYNAMIC RENDERING FUNCTIONS
   ---------------------------------------------------------- */

// RENDER CATEGORIES
function renderCategories() {
    if (!UI.categoriesContainer) return;
    UI.categoriesContainer.innerHTML = "";

    LearningState.categories.forEach(cat => {
        const card = document.createElement("div");
        card.className = "category-card";
        card.onclick = () => {
            if (UI.categoryFilter) {
                UI.categoryFilter.value = cat.name;
                renderCourses();
            }
        };

        card.innerHTML = `
            <div class="category-icon">
                <i data-lucide="${cat.icon}"></i>
            </div>
            <h3>${escapeHTML(cat.name)}</h3>
            <p>${escapeHTML(cat.count)}</p>
        `;
        UI.categoriesContainer.appendChild(card);
    });
}

// RENDER COURSES (Called by onkeyup and onchange in HTML)
function renderCourses() {
    if (!UI.coursesGrid) return;

    const query = UI.search ? UI.search.value.toLowerCase().trim() : "";
    const selectedCategory = UI.categoryFilter ? UI.categoryFilter.value : "";

    const filtered = LearningState.courses.filter(course => {
        const matchesQuery = course.title.toLowerCase().includes(query) ||
                             course.description.toLowerCase().includes(query) ||
                             course.category.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === "" || course.category === selectedCategory;
        return matchesQuery && matchesCategory;
    });

    UI.coursesGrid.innerHTML = "";

    if (filtered.length === 0) {
        UI.coursesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 32px; background: #FFFFFF; border-radius: 12px; border: 1px dashed #CBD5E1;">
                <i data-lucide="book-open-check" style="width: 36px; height: 36px; color: #94A3B8; margin-bottom: 8px;"></i>
                <h3 style="font-size: 15px; color: #071A3D; font-weight: 700;">No courses matched your query</h3>
                <p style="font-size: 13px; color: #64748B;">Try selecting another domain or clearing your search term.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    filtered.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";

        card.innerHTML = `
            <div class="course-card-header">
                <span class="course-level-badge">${escapeHTML(course.level)}</span>
                <span class="admission-badge">
                    <i data-lucide="link-2" style="width:12px; height:12px;"></i>
                    ${escapeHTML(course.linkedPlacement)}
                </span>
            </div>
            <h3 class="course-title">${escapeHTML(course.title)}</h3>
            <div class="course-instructor">
                <i data-lucide="user-check" style="width: 14px; height: 14px;"></i>
                <span>${escapeHTML(course.instructor)}</span>
            </div>
            <p class="course-desc">${escapeHTML(course.description)}</p>
            
            ${course.progress > 0 ? `
                <div style="margin-top: 4px;">
                    <div style="display:flex; justify-between; font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 4px;">
                        <span>Course Progress</span>
                        <span>${course.progress}%</span>
                    </div>
                    <div style="background: #F1F5F9; height: 6px; border-radius: 4px; overflow: hidden;">
                        <div style="background: #2563EB; height: 100%; width: ${course.progress}%;"></div>
                    </div>
                </div>
            ` : ''}

            <div class="course-footer">
                <span>Duration: ${escapeHTML(course.duration)}</span>
                <button class="action-btn primary-btn btn-sm" onclick="handleCourseAction('${course.id}')" style="padding: 6px 14px; font-size: 12px; border-radius: 8px; border:none; cursor:pointer;">
                    ${course.progress > 0 ? "Continue Module" : "Enroll & Start"}
                </button>
            </div>
        `;

        UI.coursesGrid.appendChild(card);
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

// RENDER LIVE SESSIONS
function renderLiveSessions() {
    if (!UI.liveSessionsContainer) return;
    UI.liveSessionsContainer.innerHTML = "";

    LearningState.liveSessions.forEach(session => {
        const item = document.createElement("div");
        item.className = "live-session-item";
        item.innerHTML = `
            <div>
                <h4 style="font-size: 14px; font-weight: 700; color: #071A3D; margin-bottom: 4px;">${escapeHTML(session.title)}</h4>
                <p style="font-size: 12px; color: #64748B;">Instructor: ${escapeHTML(session.instructor)} • <strong>${escapeHTML(session.date)} (${escapeHTML(session.time)})</strong></p>
            </div>
            <button class="action-btn secondary-btn btn-sm" onclick="alert('Live Classroom stream will connect when active.')" style="padding: 6px 12px; font-size: 12px;">
                Join Session
            </button>
        `;
        UI.liveSessionsContainer.appendChild(item);
    });
}

// RENDER CERTIFICATES
function renderCertificates() {
    if (!UI.certificatesContainer) return;
    UI.certificatesContainer.innerHTML = "";

    if (LearningState.certificates.length === 0) {
        UI.certificatesContainer.innerHTML = `<p style="font-size: 13px; color: #64748B;">No verified certificates available yet.</p>`;
        return;
    }

    LearningState.certificates.forEach(cert => {
        const card = document.createElement("div");
        card.className = "certificate-card";
        card.innerHTML = `
            <div style="width: 100%;">
                <div class="cert-header">
                    <span class="cert-id">${escapeHTML(cert.id)}</span>
                    <small style="font-size: 11px; color: #64748B;">${escapeHTML(cert.issued)}</small>
                </div>
                <h4 style="font-size: 14px; font-weight: 700; color: #071A3D;">${escapeHTML(cert.title)}</h4>
                <p style="font-size: 12px; color: #64748B; margin-top: 2px;">Issuer: ${escapeHTML(cert.issuer)}</p>
            </div>
        `;
        UI.certificatesContainer.appendChild(card);
    });
}

// UPDATE STATS COUNTERS
function updateStatsCounters() {
    const activeEnrolled = LearningState.courses.filter(c => c.progress > 0).length;
    if (UI.enrolledCount) UI.enrolledCount.textContent = `${activeEnrolled} Active`;
    if (UI.certsCount) UI.certsCount.textContent = `${LearningState.certificates.length} Verified`;
}

// COURSE ACTION HANDLER
function handleCourseAction(courseId) {
    const course = LearningState.courses.find(c => c.id === courseId);
    if (!course) return;

    if (course.progress === 0) {
        course.progress = 5; // Mark enrolled
        updateStatsCounters();
        renderCourses();
    }
    
    localStorage.setItem("remadef_current_course", JSON.stringify(course));
    window.location.href = `course.html?id=${courseId}`;
}

/* ----------------------------------------------------------
   7. INITIALIZATION
   ---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
    await loadCurrentUser();
    renderCategories();
    renderCourses();
    renderLiveSessions();
    renderCertificates();
    updateStatsCounters();

    if (window.lucide) {
        lucide.createIcons();
    }
});
