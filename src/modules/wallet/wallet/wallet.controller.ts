/* ==========================================================
   REMADEF PLATFORM
   Wallet Controller
   File: src/modules/wallet/wallet.controller.ts
========================================================== */

import WalletModule from "./wallet.module";
import WalletView from "./wallet-view";

import Events from "../../core/events";

class WalletController {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.bindUI();

        await WalletModule.initialize();

        WalletView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindUI(): void {

        /* Refresh */

        document

            .querySelector("[data-wallet-refresh]")

            ?.addEventListener(

                "click",

                () => {

                    WalletModule.refresh();

                }

            );

        /* Deposit */

        document

            .querySelector("[data-wallet-deposit]")

            ?.addEventListener(

                "click",

                async () => {

                    const amount = Number(

                        (

                            document.querySelector(

                                "[data-wallet-deposit-amount]"

                            ) as HTMLInputElement

                        )?.value || 0

                    );

                    if (amount <= 0) {

                        return;

                    }

                    await WalletModule.deposit(

                        amount

                    );

                }

            );

        /* Withdraw */

        document

            .querySelector("[data-wallet-withdraw]")

            ?.addEventListener(

                "click",

                async () => {

                    const amount = Number(

                        (

                            document.querySelector(

                                "[data-wallet-withdraw-amount]"

                            ) as HTMLInputElement

                        )?.value || 0

                    );

                    const bankAccountId =

                        (

                            document.querySelector(

                                "[data-wallet-bank]"

                            ) as HTMLSelectElement

                        )?.value;

                    if (

                        amount <= 0 ||

                        !bankAccountId

                    ) {

                        return;

                    }

                    await WalletModule.withdraw(

                        amount,

                        bankAccountId

                    );

                }

            );

        /* Transfer */

        document

            .querySelector("[data-wallet-transfer]")

            ?.addEventListener(

                "click",

                async () => {

                    const recipientId =

                        (

                            document.querySelector(

                                "[data-wallet-recipient]"

                            ) as HTMLInputElement

                        )?.value;

                    const amount = Number(

                        (

                            document.querySelector(

                                "[data-wallet-transfer-amount]"

                            ) as HTMLInputElement

                        )?.value || 0

                    );

                    const narration =

                        (

                            document.querySelector(

                                "[data-wallet-narration]"

                            ) as HTMLInputElement

                        )?.value;

                    if (

                        !recipientId ||

                        amount <= 0

                    ) {

                        return;

                    }

                    await WalletModule.transfer(

                        recipientId,

                        amount,

                        narration

                    );

                }

            );

        /* Gift Card */

        document

            .querySelector("[data-wallet-redeem]")

            ?.addEventListener(

                "click",

                async () => {

                    const code =

                        (

                            document.querySelector(

                                "[data-wallet-giftcard]"

                            ) as HTMLInputElement

                        )?.value;

                    if (!code) {

                        return;

                    }

                    await WalletModule.redeemGiftCard(

                        code

                    );

                }

            );

        /* Search */

        document

            .querySelector<HTMLInputElement>(

                "[data-wallet-search]"

            )

            ?.addEventListener(

                "input",

                async event => {

                    const query =

                        (

                            event.target as HTMLInputElement

                        ).value.trim();

                    if (!query) {

                        return;

                    }

                    await WalletModule.searchTransactions(

                        query

                    );

                }

            );

        /* Add Bank */

        document

            .querySelector("[data-wallet-add-bank]")

            ?.addEventListener(

                "click",

                () => {

                    Events.emit(

                        "wallet:addBank"

                    );

                }

            );

        /* Add Beneficiary */

        document

            .querySelector(

                "[data-wallet-add-beneficiary]"

            )

            ?.addEventListener(

                "click",

                () => {

                    Events.emit(

                        "wallet:addBeneficiary"

                    );

                }

            );

        /* Transaction */

        document

            .querySelectorAll(

                "[data-wallet-transaction]"

            )

            .forEach(element => {

                element.addEventListener(

                    "click",

                    () => {

                        const id =

                            element.getAttribute(

                                "data-transaction-id"

                            );

                        Events.emit(

                            "wallet:transactionSelected",

                            id

                        );

                    }

                );

            });

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        this.initialized = false;

    }

}

export default new WalletController();
