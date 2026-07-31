/* ==========================================================
   REMADEF PLATFORM
   Authentication Service
   File: src/services/auth.service.ts
========================================================== */

import Client from "./client";

import ENDPOINTS from "../config/endpoints";

import type {
    ApiResponse
} from "../types/api";

import type {
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SessionResponse,
    UserResponse
} from "../types/auth";

class AuthService {

    /* ======================================================
       REGISTER
    ====================================================== */

    register(
        data: RegisterRequest
    ): Promise<ApiResponse<UserResponse>> {

        return Client.post(
            ENDPOINTS.AUTH.REGISTER,
            data
        );

    }

    /* ======================================================
       LOGIN
    ====================================================== */

    login(
        data: LoginRequest
    ): Promise<ApiResponse<SessionResponse>> {

        return Client.post(
            ENDPOINTS.AUTH.LOGIN,
            data
        );

    }

    /* ======================================================
       LOGOUT
    ====================================================== */

    logout(): Promise<ApiResponse> {

        return Client.post(
            ENDPOINTS.AUTH.LOGOUT
        );

    }

    /* ======================================================
       CURRENT USER
    ====================================================== */

    me(): Promise<ApiResponse<UserResponse>> {

        return Client.get(
            ENDPOINTS.AUTH.ME,
            {
                cache: true,
                cacheTTL: 60000
            }
        );

    }

    /* ======================================================
       SESSION
    ====================================================== */

    session(): Promise<ApiResponse<SessionResponse>> {

        return Client.get(
            ENDPOINTS.AUTH.SESSION
        );

    }

    /* ======================================================
       REFRESH
    ====================================================== */

    refresh(): Promise<ApiResponse<SessionResponse>> {

        return Client.post(
            ENDPOINTS.AUTH.REFRESH
        );

    }

    /* ======================================================
       FORGOT PASSWORD
    ====================================================== */

    forgotPassword(
        data: ForgotPasswordRequest
    ): Promise<ApiResponse> {

        return Client.post(
            ENDPOINTS.AUTH.FORGOT_PASSWORD,
            data
        );

    }

    /* ======================================================
       RESET PASSWORD
    ====================================================== */

    resetPassword(
        data: ResetPasswordRequest
    ): Promise<ApiResponse> {

        return Client.post(
            ENDPOINTS.AUTH.RESET_PASSWORD,
            data
        );

    }

    /* ======================================================
       VERIFY EMAIL
    ====================================================== */

    verifyEmail(
        token: string
    ): Promise<ApiResponse> {

        return Client.post(
            ENDPOINTS.AUTH.VERIFY_EMAIL,
            {
                token
            }
        );

    }

    /* ======================================================
       RESEND VERIFICATION
    ====================================================== */

    resendVerification(): Promise<ApiResponse> {

        return Client.post(
            ENDPOINTS.AUTH.RESEND_VERIFICATION
        );

    }

}

export default new AuthService();
