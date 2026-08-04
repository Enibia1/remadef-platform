/* ==========================================================
   REMADEF PLATFORM
   Wallet Module
   File: src/modules/wallet/wallet.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    Wallet,
    WalletBalance,
    Transaction,
    BankAccount,
    Beneficiary,
    VirtualAccount

} from "../../types/wallet";

class WalletModule {

    private readonly WALLET_KEY =
        "wallet.data";

    private readonly BALANCE_KEY =
        "wallet.balance";

    private readonly TRANSACTIONS_KEY =
        "wallet.transactions";

    private readonly BANKS_KEY =
        "wallet.bankAccounts";

    private readonly BENEFICIARIES_KEY =
        "wallet.beneficiaries";

    private readonly VIRTUAL_ACCOUNT_KEY =
        "wallet.virtualAccount";

    private readonly CACHE_KEY =
        "wallet-cache";

    private loading = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        this.restore();

        this.registerEvents();

        await this.refresh();

    }

    /* ======================================================
       EVENTS
    ====================================================== */

    private registerEvents(): void {

        Events.on(

            "wallet:refresh",

            () => this.refresh()

        );

        Events.on(

            "wallet:transactions",

            () => this.reloadTransactions()

        );

        Events.on(

            "wallet:bankAccounts",

            () => this.reloadBankAccounts()

        );

        Events.on(

            "wallet:beneficiaries",

            () => this.reloadBeneficiaries()

        );

    }

    /* ======================================================
       DASHBOARD
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.wallet.getWallet();

            const wallet =
                response.data as Wallet;

            State.set(

                this.WALLET_KEY,

                wallet

            );

            Cache.set(

                this.CACHE_KEY,

                wallet

            );

            Events.emit(

                "wallet:loaded",

                wallet

            );

            await Promise.all([

                this.reloadBalance(),

                this.reloadTransactions(),

                this.reloadBankAccounts(),

                this.reloadBeneficiaries(),

                this.reloadVirtualAccount()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       BALANCE
    ====================================================== */

    async reloadBalance(): Promise<void> {

        const response =
            await API.wallet.getBalance();

        const balance =
            response.data as WalletBalance;

        State.set(

            this.BALANCE_KEY,

            balance

        );

        Events.emit(

            "wallet:balanceUpdated",

            balance

        );

    }

    /* ======================================================
       TRANSACTIONS
    ====================================================== */

    async reloadTransactions(): Promise<void> {

        const response =
            await API.wallet.getTransactions();

        State.set(

            this.TRANSACTIONS_KEY,

            response.data ?? []

        );

        Events.emit(

            "wallet:transactionsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       BANK ACCOUNTS
    ====================================================== */

    async reloadBankAccounts(): Promise<void> {

        const response =
            await API.wallet.getBankAccounts();

        const accounts =
            (response.data ?? []) as BankAccount[];

        State.set(

            this.BANKS_KEY,

            accounts

        );

        Events.emit(

            "wallet:bankAccountsUpdated",

            accounts

        );

    }

    /* ======================================================
       BENEFICIARIES
    ====================================================== */

    async reloadBeneficiaries(): Promise<void> {

        const response =
            await API.wallet.getBeneficiaries();

        const beneficiaries =
            (response.data ?? []) as Beneficiary[];

        State.set(

            this.BENEFICIARIES_KEY,

            beneficiaries

        );

        Events.emit(

            "wallet:beneficiariesUpdated",

            beneficiaries

        );

    }

    /* ======================================================
       VIRTUAL ACCOUNT
    ====================================================== */

    async reloadVirtualAccount(): Promise<void> {

        const response =
            await API.wallet.getVirtualAccount();

        const account =
            response.data as VirtualAccount;

        State.set(

            this.VIRTUAL_ACCOUNT_KEY,

            account

        );

        Events.emit(

            "wallet:virtualAccountUpdated",

            account

        );

    }

    /* ======================================================
       DEPOSIT
    ====================================================== */

    async deposit(
        amount: number
    ): Promise<void> {

        await API.wallet.deposit({

            amount

        });

        await this.refresh();

    }

    /* ======================================================
       WITHDRAW
    ====================================================== */

    async withdraw(
        amount: number,
        bankAccountId: string
    ): Promise<void> {

        await API.wallet.withdraw({

            amount,

            bankAccountId

        });

        await this.refresh();

    }

    /* ======================================================
       TRANSFER
    ====================================================== */

    async transfer(
        recipientId: string,
        amount: number,
        narration?: string
    ): Promise<void> {

        await API.wallet.transfer({

            recipientId,

            amount,

            narration

        });

        await this.refresh();

    }

    /* ======================================================
       BANK ACCOUNT
    ====================================================== */

    async addBankAccount(
        data: Record<string, unknown>
    ): Promise<void> {

        await API.wallet.addBankAccount(
            data
        );

        await this.reloadBankAccounts();

    }

    async removeBankAccount(
        bankAccountId: string
    ): Promise<void> {

        await API.wallet.removeBankAccount(
            bankAccountId
        );

        await this.reloadBankAccounts();

    }

    /* ======================================================
       BENEFICIARIES
    ====================================================== */

    async addBeneficiary(
        data: Record<string, unknown>
    ): Promise<void> {

        await API.wallet.addBeneficiary(
            data
        );

        await this.reloadBeneficiaries();

    }

    async removeBeneficiary(
        beneficiaryId: string
    ): Promise<void> {

        await API.wallet.removeBeneficiary(
            beneficiaryId
        );

        await this.reloadBeneficiaries();

    }

    /* ======================================================
       GIFT CARDS
    ====================================================== */

    async redeemGiftCard(
        code: string
    ): Promise<void> {

        await API.wallet.redeemGiftCard({

            code

        });

        await this.refresh();

    }

    /* ======================================================
       TRANSACTIONS
    ====================================================== */

    async searchTransactions(
        query: string
    ): Promise<void> {

        const response =
            await API.wallet.searchTransactions(
                query
            );

        State.set(

            "wallet.search",

            response.data ?? []

        );

        Events.emit(

            "wallet:searchUpdated",

            response.data ?? []

        );

    } 

     /* ======================================================
       HELPERS
    ====================================================== */

    getWallet(): Wallet | null {

        return (

            State.get(

                this.WALLET_KEY

            ) || null

        );

    }

    getBalance(): WalletBalance | null {

        return (

            State.get(

                this.BALANCE_KEY

            ) || null

        );

    }

    getTransactions(): Transaction[] {

        return (

            State.get(

                this.TRANSACTIONS_KEY

            ) || []

        );

    }

    getBankAccounts(): BankAccount[] {

        return (

            State.get(

                this.BANKS_KEY

            ) || []

        );

    }

    getBeneficiaries(): Beneficiary[] {

        return (

            State.get(

                this.BENEFICIARIES_KEY

            ) || []

        );

    }

    getVirtualAccount(): VirtualAccount | null {

        return (

            State.get(

                this.VIRTUAL_ACCOUNT_KEY

            ) || null

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restore(): void {

        const cached =

            Cache.get(

                this.CACHE_KEY

            );

        if (!cached) {

            return;

        }

        State.set(

            this.WALLET_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.WALLET_KEY

        );

        State.remove(

            this.BALANCE_KEY

        );

        State.remove(

            this.TRANSACTIONS_KEY

        );

        State.remove(

            this.BANKS_KEY

        );

        State.remove(

            this.BENEFICIARIES_KEY

        );

        State.remove(

            this.VIRTUAL_ACCOUNT_KEY

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "wallet:cleared"

        );

    }

}

export default new WalletModule();
