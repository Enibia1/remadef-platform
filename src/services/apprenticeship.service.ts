/* ==========================================================
   REMADEF PLATFORM
   Apprenticeship Service
   File: src/services/apprenticeship.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    ApprenticeshipOpportunity,
    ApprenticeshipApplication,
    ApprenticeshipProgress,
    ApprenticeshipAssessment,
    Mentor,
    AttendanceRecord,
    LogbookEntry,
    OpportunityFilter,
    ApplyRequest
} from "../types/apprenticeship";

class ApprenticeshipService {

    /* ======================================================
       OPPORTUNITIES
    ====================================================== */

    getOpportunities(
        page = 1,
        limit = 20,
        filter?: OpportunityFilter
    ): Promise<ListResponse<ApprenticeshipOpportunity>> {

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

            `${ENDPOINTS.APPRENTICESHIP.OPPORTUNITIES}?${params.toString()}`,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    getOpportunity(
        opportunityId: string
    ): Promise<ApiResponse<ApprenticeshipOpportunity>> {

        return Client.get(

            `${ENDPOINTS.APPRENTICESHIP.OPPORTUNITIES}/${encodeURIComponent(opportunityId)}`

        );

    }

    /* ======================================================
       APPLICATIONS
    ====================================================== */

    apply(
        opportunityId: string,
        data: ApplyRequest
    ): Promise<ApiResponse<ApprenticeshipApplication>> {

        return Client.post(

            `${ENDPOINTS.APPRENTICESHIP.OPPORTUNITIES}/${encodeURIComponent(opportunityId)}/apply`,

            data

        );

    }

    getApplications(): Promise<ListResponse<ApprenticeshipApplication>> {

        return Client.get(

            ENDPOINTS.APPRENTICESHIP.APPLICATIONS

        );

    }

    getApplication(
        applicationId: string
    ): Promise<ApiResponse<ApprenticeshipApplication>> {

        return Client.get(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}`

        );

    }

    withdrawApplication(
        applicationId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}`

        );

    }

    /* ======================================================
       PROGRESS
    ====================================================== */

    getProgress(
        applicationId: string
    ): Promise<ApiResponse<ApprenticeshipProgress>> {

        return Client.get(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}/progress`

        );

    }

    updateProgress(
        applicationId: string,
        progress: Partial<ApprenticeshipProgress>
    ): Promise<ApiResponse<ApprenticeshipProgress>> {

        return Client.put(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}/progress`,

            progress

        );

    }

    /* ======================================================
       LOGBOOK
    ====================================================== */

    getLogbook(
        applicationId: string
    ): Promise<ApiResponse<LogbookEntry[]>> {

        return Client.get(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}/logbook`

        );

    }

    addLogbookEntry(
        applicationId: string,
        entry: LogbookEntry
    ): Promise<ApiResponse<LogbookEntry>> {

        return Client.post(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}/logbook`,

            entry

        );

    }

    /* ======================================================
       ATTENDANCE
    ====================================================== */

    getAttendance(
        applicationId: string
    ): Promise<ApiResponse<AttendanceRecord[]>> {

        return Client.get(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}/attendance`

        );

    }

    /* ======================================================
       MENTOR
    ====================================================== */

    getMentor(
        applicationId: string
    ): Promise<ApiResponse<Mentor>> {

        return Client.get(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}/mentor`

        );

    }

    /* ======================================================
       ASSESSMENTS
    ====================================================== */

    getAssessments(
        applicationId: string
    ): Promise<ApiResponse<ApprenticeshipAssessment[]>> {

        return Client.get(

            `${ENDPOINTS.APPRENTICESHIP.APPLICATIONS}/${encodeURIComponent(applicationId)}/assessments`

        );

    }

}

export default new ApprenticeshipService();
