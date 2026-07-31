/* ==========================================================
   REMADEF PLATFORM
   Wallet Service
   File: src/services/wallet.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    Wallet,
    WalletBalance,
    Transaction,
    DepositRequest,
    WithdrawRequest,
    TransferRequest,
    FiatFundingRequest,
    GiftCardRedemptionRequest,
    BankAccount,
    Beneficiary,
    TransactionFilter,
    VirtualAccount
} from "../types/wallet";

class WalletService {

    /* ======================================================
       WALLET
    ====================================================== */

    getWallet(): Promise<ApiResponse<Wallet>> {

        return Client.get(
            ENDPOINTS.WALLET.ROOT,
            {
                cache: true,
                cacheTTL: 30000
            }
        );

    }

    getBalance(): Promise<ApiResponse<WalletBalance>> {

        return Client.get(
            ENDPOINTS.WALLET.BALANCE,
            {
                cache: true,
                cacheTTL: 10000
            }
        );

    }

    /* ======================================================
       TRANSACTIONS
    ====================================================== */

    getTransactions(
        page = 1,
        limit = 20,
        filter?: TransactionFilter
    ): Promise<ListResponse<Transaction>> {

        const params = new URLSearchParams({

            page: String(page),

            limit: String(limit)

        });

        if (filter) {

            Object.entries(filter).forEach(([key, value]) => {

                if (
                    value !== undefined &&
                    value !== null
                ) {

                    params.append(
                        key,
                        String(value)
                    );

                }

            });

        }

        return Client.get(

            `${ENDPOINTS.WALLET.TRANSACTIONS}?${params.toString()}`

        );

    }

    getTransaction(
        transactionId: string
    ): Promise<ApiResponse<Transaction>> {

        return Client.get(

            `${ENDPOINTS.WALLET.TRANSACTIONS}/${encodeURIComponent(transactionId)}`

        );

    }

    /* ======================================================
       FUNDING
    ====================================================== */

    fundFiat(
        data: FiatFundingRequest
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.WALLET.FUND_FIAT,

            data

        );

    }

    deposit(
        data: DepositRequest
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.WALLET.DEPOSIT,

            data

        );

    }

    getDepositStatus(
        transactionId: string
    ): Promise<ApiResponse<Transaction>> {

        return Client.get(

            `${ENDPOINTS.WALLET.DEPOSIT}/${encodeURIComponent(transactionId)}`

        );

    }

    /* ======================================================
       WITHDRAWALS
    ====================================================== */

    withdraw(
        data: WithdrawRequest
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.WALLET.WITHDRAW,

            data

        );

    }

    /* ======================================================
       TRANSFERS
    ====================================================== */

    transfer(
        data: TransferRequest
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.WALLET.TRANSFER,

            data

        );

    }

    /* ======================================================
       GIFT CARDS
    ====================================================== */

    redeemGiftCard(
        data: GiftCardRedemptionRequest
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.WALLET.GIFT_CARD,

            data

        );

    }

    /* ======================================================
       BANK ACCOUNTS
    ====================================================== */

    getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {

        return Client.get(

            ENDPOINTS.WALLET.BANK_ACCOUNTS

        );

    }

    addBankAccount(
        account: BankAccount
    ): Promise<ApiResponse<BankAccount>> {

        return Client.post(

            ENDPOINTS.WALLET.BANK_ACCOUNTS,

            account

        );

    }

    deleteBankAccount(
        accountId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.WALLET.BANK_ACCOUNTS}/${encodeURIComponent(accountId)}`

        );

    }

    /* ======================================================
       BENEFICIARIES
    ====================================================== */

    getBeneficiaries(): Promise<ApiResponse<Beneficiary[]>> {

        return Client.get(

            ENDPOINTS.WALLET.BENEFICIARIES

        );

    }

    addBeneficiary(
        beneficiary: Beneficiary
    ): Promise<ApiResponse<Beneficiary>> {

        return Client.post(

            ENDPOINTS.WALLET.BENEFICIARIES,

            beneficiary

        );

    }

    /* ======================================================
       VIRTUAL ACCOUNT
    ====================================================== */

    getVirtualAccount(): Promise<ApiResponse<VirtualAccount>> {

        return Client.get(

            ENDPOINTS.WALLET.VIRTUAL_ACCOUNT

        );

    }

}

export default new WalletService();
