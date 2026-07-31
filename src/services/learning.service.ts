/* ==========================================================
   REMADEF PLATFORM
   Learning Service
   File: src/services/learning.service.ts
========================================================== */

import Client from "./client";
import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse,
    ListResponse
} from "../types/api";

import type {
    Course,
    CourseCategory,
    CourseProgress,
    Lesson,
    Quiz,
    QuizSubmission,
    Certificate,
    Enrollment,
    CourseFilter
} from "../types/learning";

class LearningService {

    /* ======================================================
       COURSES
    ====================================================== */

    getCourses(
        page = 1,
        limit = 20,
        filter?: CourseFilter
    ): Promise<ListResponse<Course>> {

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

            `${ENDPOINTS.LEARNING.COURSES}?${params.toString()}`,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    getCourse(
        courseId: string
    ): Promise<ApiResponse<Course>> {

        return Client.get(

            `${ENDPOINTS.LEARNING.COURSES}/${encodeURIComponent(courseId)}`

        );

    }

    getCategories(): Promise<ApiResponse<CourseCategory[]>> {

        return Client.get(

            ENDPOINTS.LEARNING.CATEGORIES,

            {
                cache: true,
                cacheTTL: 300000
            }

        );

    }

    /* ======================================================
       ENROLLMENT
    ====================================================== */

    enroll(
        courseId: string
    ): Promise<ApiResponse<Enrollment>> {

        return Client.post(

            `${ENDPOINTS.LEARNING.COURSES}/${encodeURIComponent(courseId)}/enroll`

        );

    }

    unenroll(
        courseId: string
    ): Promise<ApiResponse> {

        return Client.delete(

            `${ENDPOINTS.LEARNING.COURSES}/${encodeURIComponent(courseId)}/enroll`

        );

    }

    getMyCourses(): Promise<ListResponse<Enrollment>> {

        return Client.get(

            ENDPOINTS.LEARNING.MY_COURSES

        );

    }

    /* ======================================================
       LESSONS
    ====================================================== */

    getLesson(
        lessonId: string
    ): Promise<ApiResponse<Lesson>> {

        return Client.get(

            `${ENDPOINTS.LEARNING.LESSONS}/${encodeURIComponent(lessonId)}`

        );

    }

    completeLesson(
        lessonId: string
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.LEARNING.LESSONS}/${encodeURIComponent(lessonId)}/complete`

        );

    }

    /* ======================================================
       COURSE PROGRESS
    ====================================================== */

    getProgress(
        courseId: string
    ): Promise<ApiResponse<CourseProgress>> {

        return Client.get(

            `${ENDPOINTS.LEARNING.COURSES}/${encodeURIComponent(courseId)}/progress`

        );

    }

    updateProgress(
        courseId: string,
        progress: Partial<CourseProgress>
    ): Promise<ApiResponse<CourseProgress>> {

        return Client.put(

            `${ENDPOINTS.LEARNING.COURSES}/${encodeURIComponent(courseId)}/progress`,

            progress

        );

    }

    /* ======================================================
       QUIZZES
    ====================================================== */

    getQuiz(
        quizId: string
    ): Promise<ApiResponse<Quiz>> {

        return Client.get(

            `${ENDPOINTS.LEARNING.QUIZZES}/${encodeURIComponent(quizId)}`

        );

    }

    submitQuiz(
        quizId: string,
        submission: QuizSubmission
    ): Promise<ApiResponse> {

        return Client.post(

            `${ENDPOINTS.LEARNING.QUIZZES}/${encodeURIComponent(quizId)}/submit`,

            submission

        );

    }

    /* ======================================================
       CERTIFICATES
    ====================================================== */

    getCertificates(): Promise<ListResponse<Certificate>> {

        return Client.get(

            ENDPOINTS.LEARNING.CERTIFICATES,

            {
                cache: true,
                cacheTTL: 60000
            }

        );

    }

    getCertificate(
        certificateId: string
    ): Promise<ApiResponse<Certificate>> {

        return Client.get(

            `${ENDPOINTS.LEARNING.CERTIFICATES}/${encodeURIComponent(certificateId)}`

        );

    }

    verifyCertificate(
        certificateNumber: string
    ): Promise<ApiResponse<Certificate>> {

        return Client.get(

            `${ENDPOINTS.LEARNING.CERTIFICATES}/verify/${encodeURIComponent(certificateNumber)}`

        );

    }

}

export default new LearningService();
