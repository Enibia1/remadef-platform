/* ==========================================================
   REMADEF APPRENTICESHIPS & PROTECTION ENGINE (js/apprenticeships.js)
   Workforce Placements, Fidelity Tracking & Admission Gateway
   ========================================================== */

// Application State Variables
let currentUserRegistered = true; // Simulated registration state
let activeGuarantors = [
    { name: "Chief Zebedee Ohaeri", role: "Community Leader", status: "Verified", coverage: "₦1,500,000" },
    { name: "Engr. K. Chetachi", role: "Industry Supervisor", status: "Verified", coverage: "₦1,000,000" }
];

// Initial Dataset for Apprenticeship & Practical Trade Programs
let apprenticeshipPrograms = [
    {
        $id: "app_201",
        tradeTitle: "Renewable Energy & Solar Microgrid Installation",
        category: "Renewable Energy",
        pathway: "JAMB-Alternative",
        hostCompany: "Nexus Global Trading (Sourcing Division)",
        location: "Alimosho, Lagos State",
        duration: "6 Months Intensive",
        stipend: "₦45,000 / month",
        description: "Hands-on installation of commercial hybrid inverters, battery balancing, and microgrid solar arrays. Direct transition to regional installation teams.",
        fidelityRequired: "Tier-1 (Guarantor Verified)",
        verifiedBy: "Engr. K. Chetachi"
    },
    {
        $id: "app_202",
        tradeTitle: "CNC Machining, Welding & Industrial Fabrication",
        category: "Industrial Manufacturing",
        pathway: "Direct-Entrepreneurship",
        hostCompany: "Remora Industrial Hub",
        location: "Owerri, Imo State",
        duration: "12 Months Structural",
        stipend: "₦60,000 / month",
        description: "Precision metal turning, automated welding systems, and structural industrial equipment fabrication with business startup coaching.",
        fidelityRequired: "Tier-1 (Anti-Shrinkage Bonded)",
        verifiedBy: "Master Craftsman E. Ohaeri"
    },
    {
        $id: "app_203",
        tradeTitle: "Automotive Diagnostics & Heavy Fleet Mechatronics",
        category: "Automotive & Agro-Tech",
        pathway: "Skill-Upgrade",
        hostCompany: "Logistics Fleet Maintenance Depot",
        location: "Kano State Hub",
        duration: "9 Months Practical",
        stipend: "₦50,000 / month",
        description: "Modern OBD-II computer diagnostics, diesel injector recalibration, and commercial fleet mechatronics repair.",
        fidelityRequired: "Tier-2 (NDA Signed)",
        verifiedBy: "Engr. A. Mustapha"
    }
];

// Initial Skill Verification Logs
let skillLogs = [
    {
        $id: "sk_1",
        title: "5KVA Hybrid Inverter System Assembly",
        mentor: "Engr. K. Chetachi",
        desc: "Assembled, balanced, and load-tested 48V 200Ah Lithium Iron Phosphate battery storage unit according to safety standards.",
        date: "July 24, 2026",
        status: "Verified Sign-off"
    },
    {
        $id: "sk_2",
        title: "Cold-Formed Steel Frame Structural Welding",
        mentor: "Master Craftsman E. Ohaeri",
        desc: "Executed MIG/TIG structural welds on load-bearing warehouse trusses with 0 defect tolerance audit.",
        date: "July 12, 2026",
        status: "Verified Sign-off"
    }
];

/* ==========================================================
   1. TAB SWITCHING ENGINE
   ========================================================== */
function switchApprenticeTab(tabName) {
    const tabs = ["opportunities", "fidelity", "skill-logs", "mentors"];
    
    tabs.forEach(t => {
        const tabEl = document.getElementById(`tab-${t}`);
        if (tabEl) {
            if (t === tabName) {
                tabEl.classList.remove("hidden");
                tabEl.classList.add("active");
            } else {
                tabEl.classList.add("hidden");
                tabEl.classList.remove("active");
            }
        }
    });

    // Update Tab Buttons UI
    const buttons = document.querySelectorAll(".tab-navigation .tab-btn");
    buttons.forEach((btn, index) => {
        if (tabs[index] === tabName) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    if (tabName === "opportunities") renderApprenticeFeed();
    if (tabName === "skill-logs") renderSkillLogs();
    if (tabName === "mentors") renderMentors();
}

/* ==========================================================
   2. SHARED ADMISSION PORTAL GATEWAY CONTROLLER
   ========================================================== */
function checkAdmissionPortalAuth() {
    const portalBtn = document.getElementById("admissionPortalBtn");
    const portalBtnText = document.getElementById("admissionBtnText");

    if (!portalBtn || !portalBtnText) return;

    if (currentUserRegistered) {
        portalBtnText.textContent = "Access Shared Admission Desk";
        portalBtn.classList.remove("disabled");
    } else {
        portalBtnText.textContent = "Register Account to Unlock Admission";
        portalBtn.style.background = "#64748B";
    }
}

function handleAdmissionPortalAccess() {
    if (!currentUserRegistered) {
        alert("Access Restricted: You must register a full account on REMADEF before accessing the Unified Admission Portal.");
        return;
    }

    openEnrollPathwayModal();
}

/* ==========================================================
   3. APPRENTICESHIP FEED RENDER ENGINE
   ========================================================== */
function renderApprenticeFeed() {
    const searchInput = document.getElementById("apprenticeSearch");
    const categorySelect = document.getElementById("tradeCategoryFilter");
    const pathwaySelect = document.getElementById("pathwayFilter");
    const container = document.getElementById("apprenticeFeed");

    if (!container) return;

    const keyword = searchInput ? searchInput.value.toLowerCase() : "";
    const category = categorySelect ? categorySelect.value : "";
    const pathway = pathwaySelect ? pathwaySelect.value : "";

    container.innerHTML = "";

    const filtered = apprenticeshipPrograms.filter(prog => {
        const matchKeyword = prog.tradeTitle.toLowerCase().includes(keyword) || 
                             prog.description.toLowerCase().includes(keyword) || 
                             prog.hostCompany.toLowerCase().includes(keyword);
        const matchCategory = category === "" || prog.category === category;
        const matchPathway = pathway === "" || prog.pathway === pathway;

        return matchKeyword && matchCategory && matchPathway;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:var(--muted, #64748B); padding:20px; text-align:center; grid-column:1/-1;">No trade apprenticeship programs match your current filter selection.</p>`;
        return;
    }

    filtered.forEach(prog => {
        const card = document.createElement("article");
        card.className = "apprentice-card";

        card.innerHTML = `
            <div class="apprentice-card-header">
                <span class="pathway-badge">${prog.pathway}</span>
                <small style="color:var(--muted, #64748B); font-weight:600;"><i data-lucide="shield-check" style="width:14px; height:14px; color:#166534;"></i> ${prog.fidelityRequired}</small>
            </div>
            <div>
                <h3 class="trade-title">${prog.tradeTitle}</h3>
                <p class="host-company">${prog.hostCompany} • ${prog.location}</p>
            </div>
            <p style="font-size:13px; color:var(--text, #0F172A); line-height:1.5;">${prog.description}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #E2E8F0; padding-top:10px; margin-top:4px;">
                <span style="font-size:12px; font-weight:700; color:#1E40AF;"><i data-lucide="clock" style="width:12px; height:12px;"></i> ${prog.duration}</span>
                <button class="action-btn primary-btn" style="padding:6px 14px; font-size:12px;" onclick="handleAdmissionPortalAccess()">Apply Now</button>
            </div>
        `;
        container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

/* ==========================================================
   4. SKILL LOGS & MENTORS RENDERERS
   ========================================================== */
function renderSkillLogs() {
    const container = document.getElementById("skillLogsContainer");
    if (!container) return;

    container.innerHTML = "";

    skillLogs.forEach(sk => {
        const card = document.createElement("div");
        card.className = "skill-log-card";
        card.innerHTML = `
            <div class="skill-log-card-header">
                <span class="verified-signoff"><i data-lucide="badge-check"></i> ${sk.status}</span>
                <small style="color:var(--muted, #64748B);">${sk.date}</small>
            </div>
            <h4 style="font-size:15px; color:var(--navy, #071A3D); font-weight:700;">${sk.title}</h4>
            <p style="font-size:13px; color:var(--muted, #64748B); line-height:1.5;">${sk.desc}</p>
            <div style="font-size:12px; color:var(--text, #0F172A); border-top:1px solid #E2E8F0; padding-top:8px;">
                <strong>Verified Supervisor:</strong> ${sk.mentor}
            </div>
        `;
        container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

function renderMentors() {
    const container = document.getElementById("mentorsContainer");
    if (!container) return;

    container.innerHTML = `
        <div class="mentor-card">
            <h4 style="font-size:16px; font-weight:700; color:var(--navy, #071A3D);">Engr. K. Chetachi</h4>
            <p style="font-size:12px; color:var(--muted, #64748B);">Senior Technical Consultant • Nexus Technical</p>
            <p style="font-size:13px; margin-top:6px;">Specialties: Hybrid Solar Systems, Microgrid Architecture, Heavy Electrical Automation.</p>
            <button class="action-btn secondary-btn" style="margin-top:10px; width:100%; justify-content:center;" onclick="alert('Opening direct mentor dispatch line...')">Contact Mentor</button>
        </div>
        <div class="mentor-card">
            <h4 style="font-size:16px; font-weight:700; color:var(--navy, #071A3D);">Master Craftsman E. Ohaeri</h4>
            <p style="font-size:12px; color:var(--muted, #64748B);">Lead Fabrication Master • Remora Industrial</p>
            <p style="font-size:13px; margin-top:6px;">Specialties: CNC Machining, Cold-Formed Steel Fabrication, Workshop Management.</p>
            <button class="action-btn secondary-btn" style="margin-top:10px; width:100%; justify-content:center;" onclick="alert('Opening direct mentor dispatch line...')">Contact Mentor</button>
        </div>
    `;
}

/* ==========================================================
   5. MODAL HANDLERS & FORM SUBMISSIONS
   ========================================================== */
function openEnrollPathwayModal() {
    document.getElementById("enrollPathwayModal").classList.remove("hidden");
}
function closeEnrollPathwayModal() {
    document.getElementById("enrollPathwayModal").classList.add("hidden");
}

function openGuarantorModal() {
    document.getElementById("guarantorModal").classList.remove("hidden");
}
function closeGuarantorModal() {
    document.getElementById("guarantorModal").classList.add("hidden");
}

function openSkillLogModal() {
    document.getElementById("skillLogModal").classList.remove("hidden");
}
function closeSkillLogModal() {
    document.getElementById("skillLogModal").classList.add("hidden");
}

function handleEnrollSubmit(e) {
    e.preventDefault();
    const trade = document.getElementById("apprenticeTrade").value;
    alert(`Unified Admission Application Submitted successfully for ${trade}! Your application has been linked to your REMADEF Learning & Apprenticeships Transcript.`);
    closeEnrollPathwayModal();
}

function handleGuarantorSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("guarantorName").value;
    const role = document.getElementById("guarantorRole").value;

    activeGuarantors.push({ name, role, status: "Verified", coverage: "₦1,000,000" });

    const guarantorStatus = document.getElementById("guarantorStatus");
    if (guarantorStatus) guarantorStatus.textContent = `${activeGuarantors.length} Verified`;

    alert(`Guarantor ${name} successfully submitted and verified! Your Fidelity Trust Rank has been updated.`);
    closeGuarantorModal();
}

function handleSkillLogSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("skillName").value;
    const mentor = document.getElementById("skillMentor").value;
    const desc = document.getElementById("skillDesc").value;

    skillLogs.unshift({
        $id: `sk_${Date.now()}`,
        title: name,
        mentor: mentor,
        desc: desc,
        date: "Just Now",
        status: "Pending Mentor Sign-off"
    });

    renderSkillLogs();
    closeSkillLogModal();
    alert("Practical Skill Milestone logged! Your supervisor has received the verification sign-off request.");
}

/* INITIALIZATION */
window.addEventListener("DOMContentLoaded", () => {
    checkAdmissionPortalAuth();
    renderApprenticeFeed();
});
