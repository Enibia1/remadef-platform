/* ==========================================================
   REMADEF BUSINESS PAGES & ENTERPRISE ENGINE (js/business.js)
   LinkedIn-Style Company Directory & Showcases
   ========================================================== */

// System Constants
const DATABASE_ID = "remadef_db";
const COMPANIES_TABLE = "companies";

// Application State Variables
let selectedCompany = null;
let followingCompanies = new Set();

// Initial Dataset for Enterprise Directory
let companiesDataset = [
    {
        $id: "comp_101",
        title: "Nexus Global Trading Limited",
        tagline: "Vertically Integrated Trade Corridors, SEZ Industrial Models & Commodity Hubs",
        industry: "Trade & Logistics",
        state: "Lagos",
        address: "Egbeda, Alimosho, Lagos State",
        size: "11-50 employees",
        email: "office@remadef.com",
        phone: "+2348037537614",
        website: "https://remadef.com",
        services: ["Group Purchasing", "Dry Ports", "Commodity Sourcing", "Supply Chain Architecture"],
        about: "Nexus Global Trading Limited is an enterprise trade entity focused on high-velocity B2B supply systems, consortium-based sourcing hubs, and multi-national trade corridor operations across West Africa.",
        verified: true,
        logoText: "NGT",
        followersCount: 1420,
        created_at: "2026-07-04"
    },
    {
        $id: "comp_102",
        title: "Remora Limited",
        tagline: "Commercial Operations, Vocational Real Estate & Strategic Joint Venture Partnerships",
        industry: "Real Estate & Infrastructure",
        state: "Imo",
        address: "Commercial Layout, Owerri, Imo State",
        size: "51-200 employees",
        email: "remorahldcoltd@gmail.com",
        phone: "+2348037537614",
        website: "https://remadef.com",
        services: ["Joint Venture Structuring", "Land Valuations", "Apprenticeship Real Estate", "Institutional Financing"],
        about: "Remora Limited provides strategic asset allocations, commercial mortgage payment architectures, and property brokerage systems integrated with workforce scaling pipelines.",
        verified: true,
        logoText: "RL",
        followersCount: 2890,
        created_at: "2026-06-15"
    },
    {
        $id: "comp_103",
        title: "Remora Apprenticeship Development Foundation (REMADEF)",
        tagline: "Decentralized Youth Apprenticeships & Alternative Human Capital Infrastructure",
        industry: "Vocational Training",
        state: "Abuja",
        address: "Central Business District, FCT Abuja",
        size: "51-200 employees",
        email: "KIZITO@remadef.com",
        phone: "+2348037537614",
        website: "https://remadef.com",
        services: ["Youth Vocational Training", "Grant Blueprint Execution", "Small Business Acceleration", "Campus Real Estate Optimization"],
        about: "REMADEF is a non-profit foundation embedding youth directly into active operational small business environments to build scalable, practical workforce pipelines.",
        verified: true,
        logoText: "RAD",
        followersCount: 5400,
        created_at: "2026-05-10"
    }
];

/* ==========================================================
   1. DIRECTORY RENDER ENGINE
   ========================================================== */
function renderBusinessDirectory() {
    const searchInput = document.getElementById("bizSearchKeyword");
    const industrySelect = document.getElementById("industryFilter");
    const stateSelect = document.getElementById("bizStateFilter");
    const container = document.getElementById("companyList");

    if (!container) return;

    const keyword = searchInput ? searchInput.value.toLowerCase() : "";
    const industry = industrySelect ? industrySelect.value : "";
    const state = stateSelect ? stateSelect.value : "";

    container.innerHTML = "";

    let totalWorkforce = 0;

    const filtered = companiesDataset.filter(comp => {
        const matchKeyword = comp.title.toLowerCase().includes(keyword) || 
                             comp.tagline.toLowerCase().includes(keyword) || 
                             comp.services.some(s => s.toLowerCase().includes(keyword));
        const matchIndustry = industry === "" || comp.industry === industry;
        const matchState = state === "" || comp.state === state;

        if (matchKeyword && matchIndustry && matchState) {
            return true;
        }
        return false;
    });

    // Update Dashboard Metrics
    const totalCompaniesCount = document.getElementById("totalCompaniesCount");
    const tradePartnersCount = document.getElementById("tradePartnersCount");
    const workforceCount = document.getElementById("workforceCount");

    if (totalCompaniesCount) totalCompaniesCount.textContent = filtered.length;
    if (tradePartnersCount) tradePartnersCount.textContent = filtered.filter(c => c.industry === "Trade & Logistics" || c.industry === "Manufacturing & Sourcing").length;
    if (workforceCount) workforceCount.textContent = `${(filtered.length * 45)}+`;

    if (filtered.length === 0) {
        container.innerHTML = `<p style="color:var(--muted, #64748B); padding:20px; text-align:center; grid-column:1/-1;">No companies match your current filter parameters.</p>`;
        return;
    }

    filtered.forEach(comp => {
        const card = document.createElement("article");
        card.className = "company-card";
        card.onclick = () => openCompanyPage(comp.$id);

        card.innerHTML = `
            <div class="company-card-header">
                <div class="company-card-logo">${comp.logoText || "CO"}</div>
                <div class="company-card-meta">
                    <h3>
                        ${comp.title}
                        ${comp.verified ? '<i data-lucide="badge-check" style="width:16px; height:16px; color:#166534; fill:#DCFCE7;"></i>' : ''}
                    </h3>
                    <p>${comp.industry} • ${comp.state}, NG</p>
                </div>
            </div>
            <p class="company-card-body">${comp.tagline}</p>
            <div class="company-card-footer">
                <span><i data-lucide="users" style="width:12px; height:12px;"></i> ${comp.size}</span>
                <span style="color:#2563EB; font-weight:600;">View Company →</span>
            </div>
        `;
        container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
}

/* ==========================================================
   2. LINKEDIN-STYLE COMPANY PAGE SWITCHING
   ========================================================== */
function openCompanyPage(companyId) {
    const comp = companiesDataset.find(c => c.$id === companyId);
    if (!comp) return;

    selectedCompany = comp;

    // Populate Page Header Data
    document.getElementById("pageTitle").textContent = comp.title;
    document.getElementById("pageTagline").textContent = comp.tagline;
    document.getElementById("pageIndustry").textContent = comp.industry;
    document.getElementById("pageLocation").textContent = `${comp.state}, Nigeria`;
    document.getElementById("pageEmployees").textContent = comp.size;
    
    const pageWebsite = document.getElementById("pageWebsite");
    if (pageWebsite) {
        pageWebsite.href = comp.website;
        pageWebsite.textContent = comp.website.replace("https://", "");
    }

    // Populate About & Sidebar
    document.getElementById("pageAbout").textContent = comp.about;
    document.getElementById("pageAddress").textContent = comp.address;
    document.getElementById("pageEmail").textContent = comp.email;
    document.getElementById("pagePhone").textContent = comp.phone;

    // Populate Services / Specialties
    const servicesContainer = document.getElementById("pageServices");
    if (servicesContainer) {
        servicesContainer.innerHTML = "";
        comp.services.forEach(srv => {
            const chip = document.createElement("span");
            chip.className = "service-chip";
            chip.textContent = srv;
            servicesContainer.appendChild(chip);
        });
    }

    // Update Follow Button State
    updateFollowBtnUI();

    // Toggle Visibility Views
    document.getElementById("directoryViewContainer").classList.add("hidden");
    document.getElementById("companyPageContainer").classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lucide) lucide.createIcons();
}

function closeCompanyPage() {
    selectedCompany = null;
    document.getElementById("companyPageContainer").classList.add("hidden");
    document.getElementById("directoryViewContainer").classList.remove("hidden");
}

/* ==========================================================
   3. COMPANY PAGE CREATION & PERSISTENCE
   ========================================================== */
function openCreateBusinessModal() {
    document.getElementById("createBusinessModal").classList.remove("hidden");
}

function closeCreateBusinessModal() {
    document.getElementById("createBusinessModal").classList.add("hidden");
}

function handleCreateBusinessSubmit(e) {
    e.preventDefault();

    const title = document.getElementById("bizTitle").value;
    const servicesRaw = document.getElementById("bizServices").value;
    const servicesList = servicesRaw.split(",").map(s => s.trim()).filter(s => s.length > 0);

    // Compute initials for logo badge
    const initials = title.split(" ").map(word => word[0]).join("").substring(0, 3).toUpperCase();

    const newCompany = {
        $id: `comp_${Date.now()}`,
        title: title,
        tagline: document.getElementById("bizTagline").value,
        industry: document.getElementById("bizIndustry").value,
        state: document.getElementById("bizState").value,
        address: document.getElementById("bizAddress").value,
        size: document.getElementById("bizSize").value,
        email: document.getElementById("bizEmail").value,
        phone: document.getElementById("bizPhone").value,
        website: "https://remadef.com",
        services: servicesList.length > 0 ? servicesList : ["General Enterprise Services"],
        about: document.getElementById("bizAbout").value,
        verified: true,
        logoText: initials || "CO",
        followersCount: 1,
        created_at: new Date().toISOString().split("T")[0]
    };

    companiesDataset.unshift(newCompany);
    renderBusinessDirectory();
    closeCreateBusinessModal();

    alert(`Company Page "${newCompany.title}" successfully created and verified on the REMADEF Network!`);
    openCompanyPage(newCompany.$id);
}

/* ==========================================================
   4. B2B INQUIRY & FOLLOW ACTIONS
   ========================================================== */
function initiateB2BInquiry() {
    if (!selectedCompany) return;

    const payload = encodeURIComponent(
        `[B2B SOURCING INQUIRY]: Hello ${selectedCompany.title}, we are reaching out via your REMADEF Company Page regarding procurement and commercial partnership.`
    );

    alert(`Redirecting to Message Desk with ${selectedCompany.title}...`);
    window.location.href = `messages.html?recipient=${encodeURIComponent(selectedCompany.title)}&payload=${payload}`;
}

function toggleFollowCompany() {
    if (!selectedCompany) return;

    if (followingCompanies.has(selectedCompany.$id)) {
        followingCompanies.delete(selectedCompany.$id);
    } else {
        followingCompanies.add(selectedCompany.$id);
    }

    updateFollowBtnUI();
}

function updateFollowBtnUI() {
    if (!selectedCompany) return;

    const followBtnText = document.getElementById("followBtnText");
    const followBtn = document.getElementById("followCompanyBtn");

    if (followingCompanies.has(selectedCompany.$id)) {
        if (followBtnText) followBtnText.textContent = "Following";
        if (followBtn) {
            followBtn.style.background = "#DCFCE7";
            followBtn.style.color = "#166534";
        }
    } else {
        if (followBtnText) followBtnText.textContent = "Follow";
        if (followBtn) {
            followBtn.style.background = "transparent";
            followBtn.style.color = "var(--text, #0F172A)";
        }
    }
}

function toggleCompanyPageMode() {
    // Navigates directly to the user's primary company page (Nexus Global)
    openCompanyPage("comp_101");
}

/* INITIALIZATION */
window.addEventListener("DOMContentLoaded", () => {
    renderBusinessDirectory();
});
