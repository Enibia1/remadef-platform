/* ==========================================================
   REMADEF PLATFORM
   Verification Module
   File: src/modules/verification/verification.module.ts
========================================================== */

import API from "../../services/api";

import State from "../../core/state";
import Cache from "../../core/cache";
import Events from "../../core/events";

import type {

    VerificationProfile,
    VerificationDocument,
    VerificationStatus,
    VerificationLevel,
    VerificationRequest,
    VerificationAnalytics

} from "../../types/verification";

class VerificationModule {

    private readonly PROFILE_KEY =
        "verification.profile";

    private readonly DOCUMENTS_KEY =
        "verification.documents";

    private readonly REQUESTS_KEY =
        "verification.requests";

    private readonly ANALYTICS_KEY =
        "verification.analytics";

    private readonly CACHE_KEY =
        "verification-cache";

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

            "verification:refresh",

            () => this.refresh()

        );

        Events.on(

            "verification:submit",

            (request: VerificationRequest) =>

                this.submit(request)

        );

    }

    /* ======================================================
       LOAD PROFILE
    ====================================================== */

    async refresh(): Promise<void> {

        if (this.loading) {

            return;

        }

        this.loading = true;

        try {

            const response =
                await API.verification.profile();

            const profile =
                response.data as VerificationProfile;

            State.set(

                this.PROFILE_KEY,

                profile

            );

            Cache.set(

                this.CACHE_KEY,

                profile

            );

            Events.emit(

                "verification:loaded",

                profile

            );

            await Promise.all([

                this.loadDocuments(),

                this.loadRequests(),

                this.loadAnalytics()

            ]);

        }

        finally {

            this.loading = false;

        }

    }

    /* ======================================================
       SUBMIT REQUEST
    ====================================================== */

    async submit(
        request: VerificationRequest
    ): Promise<void> {

        await API.verification.submit(
            request
        );

        await this.refresh();

    }

    /* ======================================================
       DOCUMENTS
    ====================================================== */

    async loadDocuments(): Promise<void> {

        const response =
            await API.verification.documents();

        const documents =
            response.data as VerificationDocument[];

        State.set(

            this.DOCUMENTS_KEY,

            documents

        );

        Events.emit(

            "verification:documentsUpdated",

            documents

        );

    }

    /* ======================================================
       REQUEST HISTORY
    ====================================================== */

    async loadRequests(): Promise<void> {

        const response =
            await API.verification.requests();

        State.set(

            this.REQUESTS_KEY,

            response.data ?? []

        );

        Events.emit(

            "verification:requestsUpdated",

            response.data ?? []

        );

    }

    /* ======================================================
       IDENTITY VERIFICATION
    ====================================================== */

    async verifyIdentity(
        documentId: string
    ): Promise<void> {

        await API.verification.verifyIdentity(
            documentId
        );

        await this.refresh();

    }

    /* ======================================================
       EMAIL VERIFICATION
    ====================================================== */

    async verifyEmail(
        code: string
    ): Promise<void> {

        await API.verification.verifyEmail(
            code
        );

        await this.refresh();

    }

    /* ======================================================
       PHONE VERIFICATION
    ====================================================== */

    async verifyPhone(
        code: string
    ): Promise<void> {

        await API.verification.verifyPhone(
            code
        );

        await this.refresh();

    }

    /* ======================================================
       STUDENT VERIFICATION
    ====================================================== */

    async verifyStudent(
        institutionId: string
    ): Promise<void> {

        await API.verification.verifyStudent(
            institutionId
        );

        await this.refresh();

    }

    /* ======================================================
       APPRENTICESHIP VERIFICATION
    ====================================================== */

    async verifyApprenticeship(
        apprenticeshipId: string
    ): Promise<void> {

        await API.verification.verifyApprenticeship(
            apprenticeshipId
        );

        await this.refresh();

    }

    /* ======================================================
       BUSINESS VERIFICATION
    ====================================================== */

    async verifyBusiness(
        businessId: string
    ): Promise<void> {

        await API.verification.verifyBusiness(
            businessId
        );

        await this.refresh();

    }

    /* ======================================================
       EMPLOYER VERIFICATION
    ====================================================== */

    async verifyEmployer(
        employerId: string
    ): Promise<void> {

        await API.verification.verifyEmployer(
            employerId
        );

        await this.refresh();

    }

    /* ======================================================
       CREATOR VERIFICATION
    ====================================================== */

    async verifyCreator(
        creatorId: string
    ): Promise<void> {

        await API.verification.verifyCreator(
            creatorId
        );

        await this.refresh();

    }

    /* ======================================================
       ADDRESS VERIFICATION
    ====================================================== */

    async verifyAddress(
        documentId: string
    ): Promise<void> {

        await API.verification.verifyAddress(
            documentId
        );

        await this.refresh();

    }

    /* ======================================================
       CAC VERIFICATION
    ====================================================== */

    async verifyCAC(
        registrationNumber: string
    ): Promise<void> {

        await API.verification.verifyCAC(
            registrationNumber
        );

        await this.refresh();

    }

    /* ======================================================
       NIN PLACEHOLDER
    ====================================================== */

    async verifyNIN(
        nin: string
    ): Promise<void> {

        await API.verification.verifyNIN(
            nin
        );

        await this.refresh();

    }

    /* ======================================================
       BVN PLACEHOLDER
    ====================================================== */

    async verifyBVN(
        bvn: string
    ): Promise<void> {

        await API.verification.verifyBVN(
            bvn
        );

        await this.refresh();

    }

    /* ======================================================
       ANALYTICS
    ====================================================== */

    async loadAnalytics(): Promise<void> {

        const response =
            await API.verification.analytics();

        const analytics =
            response.data as VerificationAnalytics;

        State.set(

            this.ANALYTICS_KEY,

            analytics

        );

        Events.emit(

            "verification:analyticsUpdated",

            analytics

        );

    }

    /* ======================================================
       STATUS
    ====================================================== */

    getStatus(): VerificationStatus | null {

        return (

            State.get(

                this.PROFILE_KEY

            )?.status || null

        );

    }

    getLevel(): VerificationLevel | null {

        return (

            State.get(

                this.PROFILE_KEY

            )?.level || null

        );

    }

    /* ======================================================
       UPLOAD DOCUMENT
    ====================================================== */

    async uploadDocument(
        file: File,
        type: string
    ): Promise<void> {

        await API.verification.uploadDocument(
            file,
            type
        );

        await this.loadDocuments();

    }

    /* ======================================================
       DELETE DOCUMENT
    ====================================================== */

    async deleteDocument(
        documentId: string
    ): Promise<void> {

        await API.verification.deleteDocument(
            documentId
        );

        await this.loadDocuments();

    }

    /* ======================================================
       DOWNLOAD DOCUMENT
    ====================================================== */

    async downloadDocument(
        documentId: string
    ): Promise<void> {

        await API.verification.downloadDocument(
            documentId
        );

    }

    /* ======================================================
       RESUBMIT
    ====================================================== */

    async resubmit(
        requestId: string
    ): Promise<void> {

        await API.verification.resubmit(
            requestId
        );

        await this.loadRequests();

    }

    /* ======================================================
       CANCEL REQUEST
    ====================================================== */

    async cancelRequest(
        requestId: string
    ): Promise<void> {

        await API.verification.cancelRequest(
            requestId
        );

        await this.loadRequests();

    }

    /* ======================================================
       HELPERS
    ====================================================== */

    getProfile(): VerificationProfile | null {

        return (

            State.get(

                this.PROFILE_KEY

            ) || null

        );

    }

    getDocuments(): VerificationDocument[] {

        return (

            State.get(

                this.DOCUMENTS_KEY

            ) || []

        );

    }

    getRequests(): VerificationRequest[] {

        return (

            State.get(

                this.REQUESTS_KEY

            ) || []

        );

    }

    getAnalytics(): VerificationAnalytics | null {

        return (

            State.get(

                this.ANALYTICS_KEY

            ) || null

        );

    }

    /* ======================================================
       CACHE
    ====================================================== */

    private restore(): void {

        const cached = Cache.get(

            this.CACHE_KEY

        );

        if (!cached) {

            return;

        }

        State.set(

            this.PROFILE_KEY,

            cached

        );

    }

    /* ======================================================
       CLEAR
    ====================================================== */

    clear(): void {

        State.remove(

            this.PROFILE_KEY

        );

        State.remove(

            this.DOCUMENTS_KEY

        );

        State.remove(

            this.REQUESTS_KEY

        );

        State.remove(

            this.ANALYTICS_KEY

        );

        Cache.remove(

            this.CACHE_KEY

        );

        Events.emit(

            "verification:cleared"

        );

    }

}

export default new VerificationModule();
