Document.addEventListener("DOMContentLoaded", () => {
    
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

    // ==========================================
    // 8. WALLET & ESCROW DATA LOADER INTEGRATION
    // ==========================================
    const walletBalanceEl = document.getElementById("walletBalance");
    const transactionListEl = document.getElementById("transactionList");
    const escrowListEl = document.getElementById("escrowList");

    async function fetchWalletAndEscrow() {
        try {
            const [walletRes, escrowRes] = await Promise.all([
                fetch("/api/wallet", { headers: { "Content-Type": "application/json" } }),
                fetch("/api/escrow", { headers: { "Content-Type": "application/json" } })
            ]);

            if (walletRes.ok) {
                const walletJson = await walletRes.json();
                const walletData = walletJson.data || walletJson;
                const wallet = walletData.wallet;
                const transactions = walletData.transactions || [];

                if (walletBalanceEl && wallet) {
                    const formattedBalance = new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: wallet.currency || 'NGN'
                    }).format(wallet.balance || 0);
                    walletBalanceEl.textContent = formattedBalance;
                }

                if (transactionListEl && transactions.length > 0) {
                    transactionListEl.innerHTML = transactions.map(tx => `
                        <div class="transaction-item" style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color, #eee);">
                            <div>
                                <p style="margin: 0; font-weight: 500;">${tx.description || tx.type || 'Transaction'}</p>
                                <small style="color: var(--muted);">${new Date(tx.created_at || tx.$createdAt).toLocaleDateString()}</small>
                            </div>
                            <div style="text-align: right; font-weight: 600; color: ${tx.amount < 0 ? '#e74c3c' : '#2ecc71'};">
                                ${tx.amount < 0 ? '-' : '+'}₦${Math.abs(tx.amount || 0).toLocaleString()}
                            </div>
                        </div>
                    `).join('');
                } else if (transactionListEl) {
                    transactionListEl.innerHTML = "<p style='color: var(--muted); font-size: 13px;'>No recent transactions found.</p>";
                }
            }

            if (escrowRes.ok) {
                const escrowJson = await escrowRes.json();
                const escrows = escrowJson.data || escrowJson;

                if (escrowListEl && Array.isArray(escrows) && escrows.length > 0) {
                    escrowListEl.innerHTML = escrows.map(esc => `
                        <div class="escrow-item" style="padding: 12px; margin-bottom: 8px; border: 1px solid var(--border-color, #eee); border-radius: 6px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <strong style="font-size: 14px;">${esc.title || 'Escrow Agreement'}</strong>
                                <span style="font-size: 12px; padding: 2px 6px; border-radius: 4px; background: #eef2f7; color: #333;">${esc.status || 'Active'}</span>
                            </div>
                            <p style="margin: 0; font-size: 13px; color: var(--muted);">Amount: ₦${(esc.amount || 0).toLocaleString()}</p>
                        </div>
                    `).join('');
                } else if (escrowListEl) {
                    escrowListEl.innerHTML = "<p style='color: var(--muted); font-size: 13px;'>No active escrow agreements found.</p>";
                }
            }
        } catch (err) {
            console.error("Failed to sync wallet and escrow data:", err);
        }
    }

    fetchWalletAndEscrow();
});
