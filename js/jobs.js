/* ==========================================================
   REMADEF JOBS & GIGS ENGINE (js/jobs.js)
   Upwork-style Freelance & Local Artisan Workspace
   ========================================================== */

// System Constants
const DATABASE_ID = "remadef_db";
const JOBS_TABLE = "jobs";
const PROPOSALS_TABLE = "proposals";
const ESCROW_TABLE = "escrow_contracts";

const PLATFORM_COMMISSION_RATE = 0.035; // Low 3.5% Platform Fee

// Application State Variables
let currentRole = "Client"; // Dual-state mode: "Client" or "Provider"
let isProximityActive = false;
let userCoords = null;
let activeContract = null;

// Initial Mock Dataset for Jobs Feed
let jobsDataset = [
    {
        $id: "job_101",
        title: "Emergency Solar Inverter Wiring & Repair",
        client_name: "Kizito Enterprises",
        type: "Gig",
        state: "Lagos",
        lat: 6.5244,
        lon: 3.3792,
        budget: 45000,
        skill: "Electrical",
        description: "Inverter failure at commercial office in Egbeda, Lagos. Requires urgent diagnostic and wiring fix within 3 hours.",
        created_at: "2026-07-29"
    },
    {
        $id: "job_102",
        title: "Full-Stack Web App Frontend Refactor",
        client_name: "Nexus Global Ltd",
        type: "Fixed",
        state: "Abuja",
        lat: 9.0765,
        lon: 7.3986,
        budget: 250000,
        skill: "JavaScript",
        description: "Refactor existing dashboard layout to align with clean CSS standards and connect Appwrite NoSQL REST API.",
        created_at: "2026-07-28"
    },
    {
        $id: "job_103",
        title: "Commercial Water Pump Installation",
        client_name: "Owerri Retail Center",
        type: "Gig",
        state: "Imo",
        lat: 5.4832,
        lon: 7.0358,
        budget: 35000,
        skill: "Plumbing",
        description: "Installation of 2HP industrial submersible water pump for commercial property.",
        created_at: "2026-07-27"
    }
];

/* ==========================================================
   1. DUAL-STATE ROLE TOGGLE (CLIENT / PROVIDER)
   ========================================================== */
function toggleUserRoleMode() {
    currentRole = (currentRole === "Client") ? "Provider" : "Client";
    
    const roleLabel = document.getElementById("roleLabel");
    const roleToggleBtn = document.getElementById("roleToggleBtn");
    
    if (roleLabel) roleLabel.textContent = currentRole;
    if (roleToggleBtn) {
        roleToggleBtn.textContent = (currentRole === "Client") ? "Switch to Provider" : "Switch to Client";
    }

    renderJobsList();
}

/* ==========================================================
   2. 15KM HAVERSINE PROXIMITY DISPATCH ENGINE
   ========================================================== */
function toggleProximityDispatch() {
    const proximityBtn = document.getElementById("proximityBtn");
    const proximityText = document.getElementById("proximityText");

    if (!isProximityActive) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    userCoords = {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude
                    };
                    isProximityActive = true;

                    if (proximityBtn) {
                        proximityBtn.style.background = "#DCFCE7";
                        proximityBtn.style.color = "#166534";
                    }
                    if (proximityText) proximityText.textContent = "15km Filter Active";

                    renderJobsList();
                },
                (error) => {
                    alert("GPS access denied or unavailable. Displaying all nationwide postings.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser environment.");
        }
    } else {
        isProximityActive = false;
        userCoords = null;

        if (proximityBtn) {
            proximityBtn.style.background = "#FFFFFF";
            proximityBtn.style.color = "var(--text, #0F172A)";
        }
        if (proximityText) proximityText.textContent = "Enable 15km Radius";

        renderJobsList();
    }
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/* ==========================================================
   3. DYNAMIC JOBS FEED RENDERER
   ========================================================== */
function renderJobsList() {
    const keywordInput = document.getElementById("jobKeyword");
    const typeSelect = document.getElementById("jobTypeFilter");
    const stateSelect = document.getElementById("stateFilter");
    const container = document.getElementById("jobsList");

    if (!container) return;

    const keyword = keywordInput ? keywordInput.value.toLowerCase() : "";
    const type = typeSelect ? typeSelect.value : "";
    const state = stateSelect ? stateSelect.value : "";

    container.innerHTML = "";

    let totalEscrow = 0;
    let nearbyCount = 0;

    const filtered = jobsDataset.filter(job => {
        const matchKeyword = job.title.toLowerCase().includes(keyword) || job.skill.toLowerCase().includes(keyword);
        const matchType = type === "" || job.type === type;
        const matchState = state === "" || job.state === state;

        let matchDist = true;
        if (isProximityActive && userCoords && job.lat && job.lon) {
            const dist = calculateDistanceKm(userCoords.lat, userCoords.lon, job.lat, job.lon);
            job.calculatedDist = dist;
            matchDist = dist <= 15;
            if (matchDist) nearbyCount++;
        }

        if (matchKeyword && matchType && matchState && matchDist) {
            totalEscrow += job.budget;
            return true;
        }
        return false;
    });

    // Update Dashboard Metric Cards
    const totalJobsCount = document.getElementById("totalJobsCount");
    const totalEscrowLocked = document.getElementById("totalEscrowLocked");
    const nearbyCountElem = document.getElementById("nearbyCount");

    if (totalJobsCount) totalJobsCount.textContent = filtered.length;
    if (totalEscrowLocked) totalEscrowLocked.textContent = `₦${totalEscrow.toLocaleString()}`;
    if (nearbyCountElem) nearbyCountElem.textContent = nearbyCount;

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:var(--muted, #64748B); padding:20px; text-align:center;">No active jobs match your selected criteria.</p>`;
        return;
    }

    filtered.forEach(job => {
        const card = document.createElement("article");
        card.className = "job-card";

        let badgeClass = "badge-fixed";
        if (job.type === "Gig") badgeClass = "badge-gig";
        if (job.type === "Hourly") badgeClass = "badge-hourly";

        const distText = job.calculatedDist ? `${job.calculatedDist.toFixed(1)} km away` : `${job.state}, NG`;

        card.innerHTML = `
            <div class="job-header-row">
                <div>
                    <div class="job-badges">
                        <span class="badge-tag ${badgeClass}">${job.type}</span>
                        <span style="font-size:12px; color:var(--muted, #64748B);">Posted by ${job.client_name}</span>
                    </div>
                    <h3 class="job-title">${job.title}</h3>
                </div>
                <span class="job-distance">${distText}</span>
            </div>
            <p class="job-description">${job.description}</p>
            <div style="display:flex; gap:8px;">
                <span class="badge-tag" style="background:#F1F5F9; color:#475569;">Skill: ${job.skill}</span>
            </div>
            <div class="job-footer-row">
                <div>
                    <small style="color:var(--muted, #64748B); display:block;">Budget (Escrow Protection)</small>
                    <span class="job-budget">₦${job.budget.toLocaleString()}</span>
                </div>
                <button class="action-btn primary-btn" onclick="openApplyModal('${job.$id}', '${escapeHtml(job.title)}', ${job.budget}, '${escapeHtml(job.client_name)}')">
                    ${currentRole === "Client" ? "View / Manage Details" : "Apply / Submit Proposal"}
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

/* ==========================================================
   4. PROPOSAL SUBMISSION & COMMISSION CALCULATOR
   ========================================================== */
function openApplyModal(jobId, jobTitle, budget, clientName) {
    document.getElementById("applyJobId").value = jobId;
    document.getElementById("applyClientName").value = clientName;
    document.getElementById("applyModalTitle").textContent = `Submit Proposal: ${jobTitle}`;
    document.getElementById("bidAmount").value = budget;

    calculateEarningsBreakdown();
    document.getElementById("applyModal").classList.remove("hidden");
}

function closeApplyModal() {
    document.getElementById("applyModal").classList.add("hidden");
}

function calculateEarningsBreakdown() {
    const bidInput = document.getElementById("bidAmount");
    const bid = parseFloat(bidInput.value) || 0;
    
    const fee = bid * PLATFORM_COMMISSION_RATE;
    const net = bid - fee;

    document.getElementById("breakdownClientPay").textContent = `₦${bid.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("breakdownFee").textContent = `-₦${fee.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("breakdownNetPayout").textContent = `₦${net.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

async function handleProposalSubmit(e) {
    e.preventDefault();

    const jobId = document.getElementById("applyJobId").value;
    const clientName = document.getElementById("applyClientName").value;
    const bidAmount = parseFloat(document.getElementById("bidAmount").value);
    const coverLetter = document.getElementById("applyCoverLetter").value;

    // Convert bid amount to Kobo integer for Monnify/Korapay Escrow Wallet
    const bidAmountKobo = Math.round(bidAmount * 100);

    // Generate 4-Digit Handoff OTP Code
    const handoffOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Construct Payload string for Messages Desk
    const messagePayload = encodeURIComponent(
        `[JOB PROPOSAL & ESCROW LOCK]: I am applying for Job ID #${jobId}. ` +
        `Bid Amount: ₦${bidAmount.toLocaleString()} (${bidAmountKobo} Kobo). Proposal: ${coverLetter}`
    );

    // Update Active Contract State
    activeContract = {
        title: `Job #${jobId}`,
        budget: bidAmount,
        otp: handoffOTP,
        client: clientName
    };

    updateActiveContractUI();
    closeApplyModal();

    alert(`Proposal submitted! ₦${bidAmount.toLocaleString()} held in Escrow lock. Opening discussion with ${clientName}...`);
    window.location.href = `messages.html?recipient=${encodeURIComponent(clientName)}&payload=${messagePayload}`;
}

/* ==========================================================
   5. CLIENT POST-A-JOB WORKFLOW
   ========================================================== */
function openPostJobModal() {
    document.getElementById("postJobModal").classList.remove("hidden");
}

function closePostJobModal() {
    document.getElementById("postJobModal").classList.add("hidden");
}

function handlePostJobSubmit(e) {
    e.preventDefault();

    const newJob = {
        $id: `job_${Date.now()}`,
        title: document.getElementById("postTitle").value,
        client_name: "CurrentUser (Me)",
        type: document.getElementById("postType").value,
        state: document.getElementById("postState").value,
        lat: 6.5244,
        lon: 3.3792,
        budget: parseFloat(document.getElementById("postBudget").value),
        skill: document.getElementById("postSkill").value,
        description: document.getElementById("postDescription").value,
        created_at: new Date().toISOString().split("T")[0]
    };

    jobsDataset.unshift(newJob);
    renderJobsList();
    closePostJobModal();

    alert(`Job published! ₦${newJob.budget.toLocaleString()} reserved in your wallet escrow partition.`);
}

/* ==========================================================
   6. ACTIVE CONTRACT & OTP HANDOFF PANEL
   ========================================================== */
function updateActiveContractUI() {
    if (!activeContract) return;

    const activeContractTitle = document.getElementById("activeContractTitle");
    const activeContractBudget = document.getElementById("activeContractBudget");
    const otpDisplay = document.getElementById("otpDisplay");
    const otpContainer = document.getElementById("otpContainer");
    const openChatBtn = document.getElementById("openChatBtn");

    if (activeContractTitle) activeContractTitle.textContent = activeContract.title;
    if (activeContractBudget) activeContractBudget.textContent = `₦${activeContract.budget.toLocaleString()}`;
    if (otpDisplay) otpDisplay.textContent = activeContract.otp;

    if (otpContainer) otpContainer.classList.remove("hidden");
    if (openChatBtn) openChatBtn.classList.remove("hidden");
}

function openContractMessageDesk() {
    if (!activeContract) return;
    window.location.href = `messages.html?recipient=${encodeURIComponent(activeContract.client)}`;
}

/* Helper Utilities */
function escapeHtml(str) {
    return String(str).replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

/* Initialization */
window.addEventListener("DOMContentLoaded", () => {
    renderJobsList();
});
