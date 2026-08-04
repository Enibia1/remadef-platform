/* ==========================================================
   REMADEF PLATFORM
   Escrow Controller
   File: src/modules/escrow/escrow.controller.ts
========================================================== */

import EscrowModule from "./escrow.module";
import EscrowView from "./escrow-view";

import Events from "../../core/events";

class EscrowController {

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

        await EscrowModule.initialize();

        EscrowView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindUI(): void {

        /* Refresh */

        document

            .querySelector("[data-escrow-refresh]")

            ?.addEventListener(

                "click",

                () => {

                    EscrowModule.refresh();

                }

            );

        /* Create Escrow */

        document

            .querySelector("[data-create-escrow]")

            ?.addEventListener(

                "click",

                async () => {

                    const buyerId = (

                        document.querySelector(

                            "[data-escrow-buyer]"

                        ) as HTMLInputElement

                    )?.value;

                    const sellerId = (

                        document.querySelector(

                            "[data-escrow-seller]"

                        ) as HTMLInputElement

                    )?.value;

                    const amount = Number(

                        (

                            document.querySelector(

                                "[data-escrow-amount]"

                            ) as HTMLInputElement

                        )?.value || 0

                    );

                    const description = (

                        document.querySelector(

                            "[data-escrow-description]"

                        ) as HTMLInputElement

                    )?.value;

                    if (

                        !buyerId ||

                        !sellerId ||

                        amount <= 0

                    ) {

                        return;

                    }

                    await EscrowModule.create({

                        buyerId,

                        sellerId,

                        amount,

                        description

                    });

                }

            );

        /* Release Funds */

        document

            .querySelector("[data-release-funds]")

            ?.addEventListener(

                "click",

                async () => {

                    const escrowId = (

                        document.querySelector(

                            "[data-escrow-id]"

                        ) as HTMLInputElement

                    )?.value;

                    if (!escrowId) {

                        return;

                    }

                    await EscrowModule.releaseFunds(

                        escrowId

                    );

                }

            );

        /* Cancel Escrow */

        document

            .querySelector("[data-cancel-escrow]")

            ?.addEventListener(

                "click",

                async () => {

                    const escrowId = (

                        document.querySelector(

                            "[data-escrow-id]"

                        ) as HTMLInputElement

                    )?.value;

                    if (!escrowId) {

                        return;

                    }

                    await EscrowModule.cancel(

                        escrowId

                    );

                }

            );

        /* Open Dispute */

        document

            .querySelector("[data-open-dispute]")

            ?.addEventListener(

                "click",

                async () => {

                    const escrowId = (

                        document.querySelector(

                            "[data-escrow-id]"

                        ) as HTMLInputElement

                    )?.value;

                    const reason = (

                        document.querySelector(

                            "[data-dispute-reason]"

                        ) as HTMLInputElement

                    )?.value;

                    if (

                        !escrowId ||

                        !reason

                    ) {

                        return;

                    }

                    await EscrowModule.openDispute(

                        escrowId,

                        reason

                    );

                }

            );

        /* Resolve Dispute */

        document

            .querySelector("[data-resolve-dispute]")

            ?.addEventListener(

                "click",

                async () => {

                    const disputeId = (

                        document.querySelector(

                            "[data-dispute-id]"

                        ) as HTMLInputElement

                    )?.value;

                    const resolution = (

                        document.querySelector(

                            "[data-dispute-resolution]"

                        ) as HTMLInputElement

                    )?.value;

                    if (

                        !disputeId ||

                        !resolution

                    ) {

                        return;

                    }

                    await EscrowModule.resolveDispute(

                        disputeId,

                        resolution

                    );

                }

            );

        /* Approve Milestone */

        document

            .querySelector("[data-approve-milestone]")

            ?.addEventListener(

                "click",

                async () => {

                    const milestoneId = (

                        document.querySelector(

                            "[data-milestone-id]"

                        ) as HTMLInputElement

                    )?.value;

                    if (!milestoneId) {

                        return;

                    }

                    await EscrowModule.approveMilestone(

                        milestoneId

                    );

                }

            );

        /* Reject Milestone */

        document

            .querySelector("[data-reject-milestone]")

            ?.addEventListener(

                "click",

                async () => {

                    const milestoneId = (

                        document.querySelector(

                            "[data-milestone-id]"

                        ) as HTMLInputElement

                    )?.value;

                    if (!milestoneId) {

                        return;

                    }

                    await EscrowModule.rejectMilestone(

                        milestoneId

                    );

                }

            );

        /* Search */

        document

            .querySelector<HTMLInputElement>(

                "[data-escrow-search]"

            )

            ?.addEventListener(

                "input",

                async event => {

                    const query = (

                        event.target as HTMLInputElement

                    ).value.trim();

                    await EscrowModule.search(

                        query

                    );

                }

            );

        /* Escrow Selected */

        document

            .querySelectorAll(

                "[data-escrow-item]"

            )

            .forEach(element => {

                element.addEventListener(

                    "click",

                    () => {

                        Events.emit(

                            "escrow:selected",

                            element.getAttribute(

                                "data-escrow-id"

                            )

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

export default new EscrowController();
