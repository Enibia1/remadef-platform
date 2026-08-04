/* ==========================================================
   REMADEF PLATFORM
   Verification Controller
   File: src/modules/verification/verification.controller.ts
========================================================== */

import VerificationModule from "./verification.module";
import VerificationView from "./verification-view";

class VerificationController {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.bindEvents();

        await VerificationModule.initialize();

        VerificationView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindEvents(): void {

        /* ==================================================
           DOCUMENT UPLOAD
        ================================================== */

        document

            .querySelector<HTMLInputElement>(
                "[data-verification-upload]"
            )

            ?.addEventListener(

                "change",

                async event => {

                    const input =

                        event.target as HTMLInputElement;

                    const file =

                        input.files?.[0];

                    if (!file) {

                        return;

                    }

                    const type =

                        input.dataset.type ??
                        "identity";

                    await VerificationModule.uploadDocument(

                        file,

                        type

                    );

                }

            );

        /* ==================================================
           SUBMIT VERIFICATION
        ================================================== */

        document

            .querySelector(
                "[data-submit-verification]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await VerificationModule.submit({

                        type: "identity"

                    });

                }

            );

        /* ==================================================
           EMAIL
        ================================================== */

        document

            .querySelector(
                "[data-verify-email]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const code = (

                        document.querySelector(

                            "[data-email-code]"

                        ) as HTMLInputElement

                    ).value;

                    await VerificationModule.verifyEmail(

                        code

                    );

                }

            );

        /* ==================================================
           PHONE
        ================================================== */

        document

            .querySelector(
                "[data-verify-phone]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const code = (

                        document.querySelector(

                            "[data-phone-code]"

                        ) as HTMLInputElement

                    ).value;

                    await VerificationModule.verifyPhone(

                        code

                    );

                }

            );

        /* ==================================================
           IDENTITY
        ================================================== */

        document

            .querySelector(
                "[data-verify-identity]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.documentId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyIdentity(

                        id

                    );

                }

            );

        /* ==================================================
           STUDENT
        ================================================== */

        document

            .querySelector(
                "[data-verify-student]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const institutionId = (

                        event.currentTarget as HTMLElement

                    ).dataset.institutionId;

                    if (!institutionId) {

                        return;

                    }

                    await VerificationModule.verifyStudent(

                        institutionId

                    );

                }

            );

        /* ==================================================
           APPRENTICESHIP
        ================================================== */

        document

            .querySelector(
                "[data-verify-apprenticeship]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.apprenticeshipId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyApprenticeship(

                        id

                    );

                }

            );

        /* ==================================================
           BUSINESS
        ================================================== */

        document

            .querySelector(
                "[data-verify-business]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.businessId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyBusiness(

                        id

                    );

                }

            );

        /* ==================================================
           EMPLOYER
        ================================================== */

        document

            .querySelector(
                "[data-verify-employer]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.employerId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyEmployer(

                        id

                    );

                }

            );

        /* ==================================================
           CREATOR
        ================================================== */

        document

            .querySelector(
                "[data-verify-creator]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.creatorId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyCreator(

                        id

                    );

                }

            );

        /* ==================================================
           REFRESH
        ================================================== */

        document

            .querySelector(
                "[data-refresh-verification]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await VerificationModule.refresh();

                }

            );

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        this.initialized = false;

    }

}

export default new VerificationController();

/* ==========================================================
   REMADEF PLATFORM
   Verification Controller
   File: src/modules/verification/verification.controller.ts
========================================================== */

import VerificationModule from "./verification.module";
import VerificationView from "./verification-view";

class VerificationController {

    private initialized = false;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    async initialize(): Promise<void> {

        if (this.initialized) {

            return;

        }

        this.initialized = true;

        this.bindEvents();

        await VerificationModule.initialize();

        VerificationView.initialize();

    }

    /* ======================================================
       UI EVENTS
    ====================================================== */

    private bindEvents(): void {

        /* ==================================================
           DOCUMENT UPLOAD
        ================================================== */

        document

            .querySelector<HTMLInputElement>(
                "[data-verification-upload]"
            )

            ?.addEventListener(

                "change",

                async event => {

                    const input =

                        event.target as HTMLInputElement;

                    const file =

                        input.files?.[0];

                    if (!file) {

                        return;

                    }

                    const type =

                        input.dataset.type ??
                        "identity";

                    await VerificationModule.uploadDocument(

                        file,

                        type

                    );

                }

            );

        /* ==================================================
           SUBMIT VERIFICATION
        ================================================== */

        document

            .querySelector(
                "[data-submit-verification]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await VerificationModule.submit({

                        type: "identity"

                    });

                }

            );

        /* ==================================================
           EMAIL
        ================================================== */

        document

            .querySelector(
                "[data-verify-email]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const code = (

                        document.querySelector(

                            "[data-email-code]"

                        ) as HTMLInputElement

                    ).value;

                    await VerificationModule.verifyEmail(

                        code

                    );

                }

            );

        /* ==================================================
           PHONE
        ================================================== */

        document

            .querySelector(
                "[data-verify-phone]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    const code = (

                        document.querySelector(

                            "[data-phone-code]"

                        ) as HTMLInputElement

                    ).value;

                    await VerificationModule.verifyPhone(

                        code

                    );

                }

            );

        /* ==================================================
           IDENTITY
        ================================================== */

        document

            .querySelector(
                "[data-verify-identity]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.documentId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyIdentity(

                        id

                    );

                }

            );

        /* ==================================================
           STUDENT
        ================================================== */

        document

            .querySelector(
                "[data-verify-student]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const institutionId = (

                        event.currentTarget as HTMLElement

                    ).dataset.institutionId;

                    if (!institutionId) {

                        return;

                    }

                    await VerificationModule.verifyStudent(

                        institutionId

                    );

                }

            );

        /* ==================================================
           APPRENTICESHIP
        ================================================== */

        document

            .querySelector(
                "[data-verify-apprenticeship]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.apprenticeshipId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyApprenticeship(

                        id

                    );

                }

            );

        /* ==================================================
           BUSINESS
        ================================================== */

        document

            .querySelector(
                "[data-verify-business]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.businessId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyBusiness(

                        id

                    );

                }

            );

        /* ==================================================
           EMPLOYER
        ================================================== */

        document

            .querySelector(
                "[data-verify-employer]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.employerId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyEmployer(

                        id

                    );

                }

            );

        /* ==================================================
           CREATOR
        ================================================== */

        document

            .querySelector(
                "[data-verify-creator]"
            )

            ?.addEventListener(

                "click",

                async event => {

                    const id = (

                        event.currentTarget as HTMLElement

                    ).dataset.creatorId;

                    if (!id) {

                        return;

                    }

                    await VerificationModule.verifyCreator(

                        id

                    );

                }

            );

        /* ==================================================
           REFRESH
        ================================================== */

        document

            .querySelector(
                "[data-refresh-verification]"
            )

            ?.addEventListener(

                "click",

                async () => {

                    await VerificationModule.refresh();

                }

            );

    }

    /* ======================================================
       DESTROY
    ====================================================== */

    destroy(): void {

        this.initialized = false;

    }

}

export default new VerificationController();
