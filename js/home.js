document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // ==========================================
    // 2. SIDEBAR TOGGLE & COLLAPSE LOGIC
    // ==========================================
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (window.innerWidth <= 768) {
                sidebar.classList.toggle("show");
            } else {
                sidebar.classList.toggle("collapsed");
            }
        });
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove("show");
        }
    });

    // ==========================================
    // 3. BRAND DROPDOWN LOGIC
    // ==========================================
    const brandButton = document.getElementById("brandButton");
    const brandDropdown = document.getElementById("brandDropdown");

    if (brandButton && brandDropdown) {
        brandButton.addEventListener("click", (e) => {
            e.stopPropagation();
            brandDropdown.classList.toggle("show");
        });
    }

    // ==========================================
    // 4. NOTIFICATIONS PANEL TOGGLE
    // ==========================================
    const notificationBtn = document.getElementById("notificationToggle");
    const notificationsPanel = document.getElementById("notificationsPanel");

    if (notificationBtn && notificationsPanel) {
        notificationBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            notificationsPanel.classList.toggle("hidden");
        });
    }

    // ==========================================
    // 5. GLOBAL CLICK HANDLER (CLOSE OUTSIDE)
    // ==========================================
    document.addEventListener("click", (e) => {
        if (brandDropdown && !brandButton.contains(e.target) && !brandDropdown.contains(e.target)) {
            brandDropdown.classList.remove("show");
        }

        if (notificationsPanel && !notificationBtn.contains(e.target) && !notificationsPanel.contains(e.target)) {
            notificationsPanel.classList.add("hidden");
        }

        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains("show")) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove("show");
            }
        }
    });

    // ==========================================
    // 6. UNBLOCKED NAVIGATION CLICKS
    // ==========================================
    const allNavLinks = document.querySelectorAll(".sidebar-nav a, .brand-dropdown a, .action-btn");
    allNavLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });

    // ==========================================
    // 7. INFINITE SCROLL IMPLEMENTATION
    // ==========================================
    const opportunityList = document.querySelector(".opportunity-list");
    let isLoading = false;
    let pageCount = 1;

    function fetchMoreItems() {
        if (isLoading || !opportunityList) return;
        isLoading = true;

        const loader = document.createElement("div");
        loader.className = "scroll-loader";
        loader.innerHTML = "<p style='text-align:center; padding:12px; color:var(--muted); font-size:13px;'>Loading more opportunities...</p>";
        opportunityList.appendChild(loader);

        setTimeout(() => {
            loader.remove();

            for (let i = 1; i <= 2; i++) {
                const itemIndex = pageCount * 2 + i;
                const newItem = document.createElement("div");
                newItem.className = "opportunity-card";
                newItem.setAttribute("onclick", "window.location.href='opportunities.html'");
                newItem.innerHTML = `
                    <div class="opportunity-icon">
                        <i data-lucide="briefcase"></i>
                    </div>
                    <div>
                        <h3>Trade Corridor Expansion Node #${itemIndex}</h3>
                        <p>Consortium fulfillment & regional logistical distribution node model.</p>
                    </div>
                `;
                opportunityList.appendChild(newItem);
            }

            if (window.lucide) {
                lucide.createIcons();
            }

            pageCount++;
            isLoading = false;
        }, 800);
    }

    window.addEventListener("scroll", () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 150) {
            fetchMoreItems();
        }
    });

    // System Status Update
    const apiStatus = document.getElementById("apiStatus");
    if (apiStatus) {
        setTimeout(() => {
            apiStatus.textContent = "Connected to REMADEF";
        }, 1200);
    }
});
