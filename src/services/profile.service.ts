/* ==========================================================
   REMADEF PLATFORM
   Profile Service
   File: src/services/profile.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type { ApiResponse } from "../types/api";

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
       EDUCATION
    ====================================================== */

    getEducation(): Promise<ApiResponse<Education[]>> {

        return Client.get(
            ENDPOINTS.PROFILE.EDUCATION,
            {
                cache: true
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
            `${ENDPOINTS.PROFILE.EDUCATION}/${id}`,
            data
        );

    }

    deleteEducation(
        id: string
    ): Promise<ApiResponse> {

        return Client.delete(
            `${ENDPOINTS.PROFILE.EDUCATION}/${id}`
        );

    }

    /* ======================================================
       EXPERIENCE
    ====================================================== */

    getExperience(): Promise<ApiResponse<Experience[]>> {

        return Client.get(
            ENDPOINTS.PROFILE.EXPERIENCE,
            {
                cache: true
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
            `${ENDPOINTS.PROFILE.EXPERIENCE}/${id}`,
            data
        );

    }

    deleteExperience(
        id: string
    ): Promise<ApiResponse> {

        return Client.delete(
            `${ENDPOINTS.PROFILE.EXPERIENCE}/${id}`
        );

    }

    /* ======================================================
       SKILLS
    ====================================================== */

    getSkills(): Promise<ApiResponse<Skill[]>> {

        return Client.get(
            ENDPOINTS.PROFILE.SKILLS,
            {
                cache: true
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
            ENDPOINTS.PROFILE.CERTIFICATIONS
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

    deleteCertification(
        id: string
    ): Promise<ApiResponse> {

        return Client.delete(
            `${ENDPOINTS.PROFILE.CERTIFICATIONS}/${id}`
        );

    }

    /* ======================================================
       PORTFOLIO
    ====================================================== */

    getPortfolio(): Promise<ApiResponse<PortfolioItem[]>> {

        return Client.get(
            ENDPOINTS.PROFILE.PORTFOLIO
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

    deletePortfolioItem(
        id: string
    ): Promise<ApiResponse> {

        return Client.delete(
            `${ENDPOINTS.PROFILE.PORTFOLIO}/${id}`
        );

    }

}

export default new ProfileService();
