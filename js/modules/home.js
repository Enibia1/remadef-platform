        // 3. WALLET & ESCROW DATA LOADER INTEGRATION
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
                            <div class="transaction-item" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                                <div>
                                    <p style="margin: 0; font-weight: 500;">${tx.description || tx.type || 'Transaction'}</p>
                                    <small style="color: var(--text-muted);">${new Date(tx.created_at || tx.$createdAt).toLocaleDateString()}</small>
                                </div>
                                <div style="text-align: right; font-weight: 600; color: ${tx.amount < 0 ? '#ef4444' : '#10b981'};">
                                    ${tx.amount < 0 ? '-' : '+'}₦${Math.abs(tx.amount || 0).toLocaleString()}
                                </div>
                            </div>
                        `).join('');
                    }
                }

                if (escrowRes.ok) {
                    const escrowJson = await escrowRes.json();
                    const escrows = escrowJson.data || escrowJson;

                    if (escrowListEl && Array.isArray(escrows) && escrows.length > 0) {
                        escrowListEl.innerHTML = escrows.map(esc => `
                            <div class="escrow-item-row" style="margin-bottom: 8px;">
                                <span class="escrow-label"><i data-lucide="shield" style="width: 16px; height: 16px; color: var(--primary);"></i> ${esc.title || 'Escrow Agreement'}</span>
                                <span class="escrow-count">₦${(esc.amount || 0).toLocaleString()}</span>
                            </div>
                        `).join('');
                        if (window.lucide) lucide.createIcons();
                    }
                }
            } catch (err) {
                console.error("Failed to sync wallet and escrow data:", err);
            }
        }

        fetchWalletAndEscrow();
