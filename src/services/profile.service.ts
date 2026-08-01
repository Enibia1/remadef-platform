/* ==========================================================
   REMADEF PLATFORM
   Profile Service
   File: src/services/profile.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse
} from "../types/api";

import type {
    Profile,
    ProfileCompletion,
    UpdateProfileRequest,
    Education,
    Experience,
    Skill,
    Certification,
    PortfolioItem
} from "../types/profile";

class ProfileService {

    /* ======================================================
       PROFILE
    ====================================================== */

    get(): Promise<ApiResponse<Profile>> {

        return Client.get(

            ENDPOINTS.PROFILE.GET,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    refresh(): Promise<ApiResponse<Profile>> {

        return Client.get(

            ENDPOINTS.PROFILE.GET,

            {
                cache: false
            }

        );

    }

    update(
        data: UpdateProfileRequest
    ): Promise<ApiResponse<Profile>> {

        return Client.put(

            ENDPOINTS.PROFILE.UPDATE,

            data

        );

    }

    completion(): Promise<ApiResponse<ProfileCompletion>> {

        return Client.get(

            ENDPOINTS.PROFILE.COMPLETION

        );

    }

    /* ======================================================
       PROFILE PHOTO
    ====================================================== */

    uploadAvatar(
        fileId: string
    ): Promise<ApiResponse<Profile>> {

        return Client.post(

            ENDPOINTS.PROFILE.AVATAR,

            {
                file_id: fileId
            }

        );

    }

    removeAvatar(): Promise<ApiResponse> {

        return Client.delete(

            ENDPOINTS.PROFILE.AVATAR

        );

    }

    /* ======================================================
       COVER PHOTO
    ====================================================== */

    uploadCover(
        fileId: string
    ): Promise<ApiResponse<Profile>> {

        return Client.post(

            ENDPOINTS.PROFILE.COVER,

            {
                file_id: fileId
            }

        );

    }

    removeCover(): Promise<ApiResponse> {

        return Client.delete(

            ENDPOINTS.PROFILE.COVER

        );

    }
   
    /* ======================================================
       EDUCATION
    ====================================================== */

    getEducation(): Promise<ApiResponse<Education[]>> {

        return Client.get(

            ENDPOINTS.PROFILE.EDUCATION,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    addEducation(
        data: Education
    ): Promise<ApiResponse<Education>> {

        return Client.post(

            ENDPOINTS.PROFILE.EDUCATION,

            data

        );

    }

    updateEducation(
        id: string,
        data: Education
    ): Promise<ApiResponse<Education>> {

        return Client.put(

            `${ENDPOINTS.PROFILE.EDUCATION}/${encodeURIComponent(id)}`,

            data

        );

    }

    deleteEducation(
        id: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.PROFILE.EDUCATION}/${encodeURIComponent(id)}`

        );

    }

    /* ======================================================
       EXPERIENCE
    ====================================================== */

    getExperience(): Promise<ApiResponse<Experience[]>> {

        return Client.get(

            ENDPOINTS.PROFILE.EXPERIENCE,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    addExperience(
        data: Experience
    ): Promise<ApiResponse<Experience>> {

        return Client.post(

            ENDPOINTS.PROFILE.EXPERIENCE,

            data

        );

    }

    updateExperience(
        id: string,
        data: Experience
    ): Promise<ApiResponse<Experience>> {

        return Client.put(

            `${ENDPOINTS.PROFILE.EXPERIENCE}/${encodeURIComponent(id)}`,

            data

        );

    }

    deleteExperience(
        id: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.PROFILE.EXPERIENCE}/${encodeURIComponent(id)}`

        );

    }

    /* ======================================================
       SKILLS
    ====================================================== */

    getSkills(): Promise<ApiResponse<Skill[]>> {

        return Client.get(

            ENDPOINTS.PROFILE.SKILLS,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    updateSkills(
        skills: Skill[]
    ): Promise<ApiResponse<Skill[]>> {

        return Client.put(

            ENDPOINTS.PROFILE.SKILLS,

            {
                skills
            }

        );

    }

    /* ======================================================
       CERTIFICATIONS
    ====================================================== */

    getCertifications(): Promise<ApiResponse<Certification[]>> {

        return Client.get(

            ENDPOINTS.PROFILE.CERTIFICATIONS,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    addCertification(
        data: Certification
    ): Promise<ApiResponse<Certification>> {

        return Client.post(

            ENDPOINTS.PROFILE.CERTIFICATIONS,

            data

        );

    }

    updateCertification(
        id: string,
        data: Certification
    ): Promise<ApiResponse<Certification>> {

        return Client.put(

            `${ENDPOINTS.PROFILE.CERTIFICATIONS}/${encodeURIComponent(id)}`,

            data

        );

    }

    deleteCertification(
        id: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.PROFILE.CERTIFICATIONS}/${encodeURIComponent(id)}`

        );

    }

    /* ======================================================
       PORTFOLIO
    ====================================================== */

    getPortfolio(): Promise<ApiResponse<PortfolioItem[]>> {

        return Client.get(

            ENDPOINTS.PROFILE.PORTFOLIO,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    addPortfolioItem(
        data: PortfolioItem
    ): Promise<ApiResponse<PortfolioItem>> {

        return Client.post(

            ENDPOINTS.PROFILE.PORTFOLIO,

            data

        );

    }

    updatePortfolioItem(
        id: string,
        data: PortfolioItem
    ): Promise<ApiResponse<PortfolioItem>> {

        return Client.put(

            `${ENDPOINTS.PROFILE.PORTFOLIO}/${encodeURIComponent(id)}`,

            data

        );

    }

    deletePortfolioItem(
        id: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.PROFILE.PORTFOLIO}/${encodeURIComponent(id)}`

        );

    }

    /* ======================================================
       SOCIAL LINKS
    ====================================================== */

    getSocialLinks(): Promise<ApiResponse<Record<string, string>>> {

        return Client.get(

            ENDPOINTS.PROFILE.SOCIALS,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    updateSocialLinks(
        data: Record<string, string>
    ): Promise<ApiResponse<Record<string, string>>> {

        return Client.put(

            ENDPOINTS.PROFILE.SOCIALS,

            data

        );

    }
   
/* ======================================================
   COVER PHOTO
====================================================== */

uploadCover(
    fileId: string
): Promise<ApiResponse<Profile>> {

    return Client.post(

        ENDPOINTS.PROFILE.COVER,


    /* ======================================================
       VERIFICATION
    ====================================================== */

    getVerification(): Promise<ApiResponse> {

        return Client.get(

            ENDPOINTS.PROFILE.VERIFICATION,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    submitVerification(
        data: Record<string, any>
    ): Promise<ApiResponse> {

        return Client.post(

            ENDPOINTS.PROFILE.VERIFICATION,

            data

        );

    }

    /* ======================================================
       PRIVACY
    ====================================================== */

    getPrivacy(): Promise<ApiResponse> {

        return Client.get(

            ENDPOINTS.PROFILE.PRIVACY,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    updatePrivacy(
        data: Record<string, any>
    ): Promise<ApiResponse> {

        return Client.put(

            ENDPOINTS.PROFILE.PRIVACY,

            data

        );

    }

    /* ======================================================
       PROFILE VISIBILITY
    ====================================================== */

    updateVisibility(
        visibility: string
    ): Promise<ApiResponse> {

        return Client.patch(

            ENDPOINTS.PROFILE.VISIBILITY,

            {
                visibility
            }

        );

    }

    /* ======================================================
       PROFILE PREFERENCES
    ====================================================== */

    getPreferences(): Promise<ApiResponse> {

        return Client.get(

            ENDPOINTS.PROFILE.PREFERENCES,

            {
                cache: true,
                cacheTTL: 5 * 60 * 1000
            }

        );

    }

    updatePreferences(
        data: Record<string, any>
    ): Promise<ApiResponse> {

        return Client.put(

            ENDPOINTS.PROFILE.PREFERENCES,

            data

        );

    }
}

export default new ProfileService();
