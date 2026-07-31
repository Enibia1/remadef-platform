/* ==========================================================
   REMADEF PLATFORM
   Business Service
   File: src/services/business.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    Business,
    BusinessProfile,
    BusinessCategory,
    BusinessMember,
    BusinessVerification,
    Gig,
    GigApplication,
    BusinessReview,
    BusinessAnalytics,
    BusinessFilter,
    CreateBusinessRequest,
    UpdateBusinessRequest,
    CreateGigRequest,
    UpdateGigRequest
} from "../types/business";

class BusinessService {

    /* ======================================================
       BUSINESSES
    ====================================================== */

    getBusinesses(
        page = 1,
        limit = 20,
        filter?: BusinessFilter
    ): Promise<ListResponse<Business>> {

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

            `${ENDPOINTS.BUSINESS.LIST}?${params.toString()}`,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    getBusiness(
        businessId: string
    ): Promise<ApiResponse<BusinessProfile>> {

        return Client.get(

            `${ENDPOINTS.BUSINESS.LIST}/${encodeURIComponent(businessId)}`

        );

    }

    createBusiness(
        data: CreateBusinessRequest
    ): Promise<ApiResponse<BusinessProfile>> {

        return Client.post(

            ENDPOINTS.BUSINESS.LIST,

            data

        );

    }

    updateBusiness(
        businessId: string,
        data: UpdateBusinessRequest
    ): Promise<ApiResponse<BusinessProfile>> {

        return Client.put(

            `${ENDPOINTS.BUSINESS.LIST}/${encodeURIComponent(businessId)}`,

            data

        );

    }

    deleteBusiness(
        businessId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.BUSINESS.LIST}/${encodeURIComponent(businessId)}`

        );

    }

    /* ======================================================
       CATEGORIES
    ====================================================== */

    getCategories(): Promise<ApiResponse<BusinessCategory[]>> {

        return Client.get(

            ENDPOINTS.BUSINESS.CATEGORIES,

            {
                cache: true,
                cacheTTL: 300000
            }

        );

    }

    /* ======================================================
       VERIFICATION
    ====================================================== */

    getVerificationStatus(
        businessId: string
    ): Promise<ApiResponse<BusinessVerification>> {

        return Client.get(

            `${ENDPOINTS.BUSINESS.LIST}/${encodeURIComponent(businessId)}/verification`

        );

    }

    submitVerification(
        businessId: string,
        data: BusinessVerification
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.BUSINESS.LIST}/${encodeURIComponent(businessId)}/verification`,

            data

        );

    }

    /* ======================================================
       MEMBERS
    ====================================================== */

    getMembers(
        businessId: string
    ): Promise<ApiResponse<BusinessMember[]>> {

        return Client.get(

            `${ENDPOINTS.BUSINESS.LIST}/${encodeURIComponent(businessId)}/members`

        );

    }

    /* ======================================================
       GIGS
    ====================================================== */

    getGigs(
        page = 1,
        limit = 20
    ): Promise<ListResponse<Gig>> {

        return Client.get(

            `${ENDPOINTS.BUSINESS.GIGS}?page=${page}&limit=${limit}`

        );

    }

    getGig(
        gigId: string
    ): Promise<ApiResponse<Gig>> {

        return Client.get(

            `${ENDPOINTS.BUSINESS.GIGS}/${encodeURIComponent(gigId)}`

        );

    }

    createGig(
        data: CreateGigRequest
    ): Promise<ApiResponse<Gig>> {

        return Client.post(

            ENDPOINTS.BUSINESS.GIGS,

            data

        );

    }

    updateGig(
        gigId: string,
        data: UpdateGigRequest
    ): Promise<ApiResponse<Gig>> {

        return Client.put(

            `${ENDPOINTS.BUSINESS.GIGS}/${encodeURIComponent(gigId)}`,

            data

        );

    }

    deleteGig(
        gigId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.BUSINESS.GIGS}/${encodeURIComponent(gigId)}`

        );

    }

    applyForGig(
        gigId: string
    ): Promise<ApiResponse<GigApplication>> {

        return Client.post(

            `${ENDPOINTS.BUSINESS.GIGS}/${encodeURIComponent(gigId)}/apply`

        );

    }

    /* ======================================================
       REVIEWS
    ====================================================== */

    getReviews(
        businessId: string
    ): Promise<ApiResponse<BusinessReview[]>> {

        return Client.get(

            `${ENDPOINTS.BUSINESS.LIST}/${encodeURIComponent(businessId)}/reviews`

        );

    }

    /* ======================================================
       ANALYTICS
    ====================================================== */

    getAnalytics(
        businessId: string
    ): Promise<ApiResponse<BusinessAnalytics>> {

        return Client.get(

            `${ENDPOINTS.BUSINESS.LIST}/${encodeURIComponent(businessId)}/analytics`

        );

    }

}

export default new BusinessService();
