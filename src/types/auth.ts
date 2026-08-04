/* ==========================================================
   REMADEF PLATFORM
   Authentication Types
   File: src/types/auth.ts
========================================================== */

import type {

    User,
    UserAccount,
    SessionUser

} from "./user";

/* ==========================================================
   AUTH PROVIDERS
========================================================== */

export type AuthProvider =

    | "email"
    | "phone"
    | "google"
    | "apple"
    | "facebook"
    | "linkedin"
    | "github";

/* ==========================================================
   AUTH STATUS
========================================================== */

export type AuthStatus =

    | "authenticated"
    | "unauthenticated"
    | "pending"
    | "expired"
    | "locked";

/* ==========================================================
   LOGIN METHOD
========================================================== */

export type LoginMethod =

    | "email"
    | "phone"
    | "username";

/* ==========================================================
   REGISTER REQUEST
========================================================== */

export interface RegisterRequest {

    firstName: string;

    lastName: string;

    username: string;

    email?: string;

    phone?: string;

    password: string;

    referralCode?: string;

    provider?: AuthProvider;

}

/* ==========================================================
   LOGIN REQUEST
========================================================== */

export interface LoginRequest {

    identifier: string;

    password: string;

    method?: LoginMethod;

    rememberMe?: boolean;

}

/* ==========================================================
   LOGIN RESPONSE
========================================================== */

export interface LoginResponse {

    accessToken: string;

    refreshToken: string;

    expiresAt: string;

    session: SessionUser;

    account: UserAccount;

    user: User;

}

/* ==========================================================
   REGISTER RESPONSE
========================================================== */

export interface RegisterResponse {

    accountId: string;

    userId: string;

    requiresVerification: boolean;

    message: string;

}

/* ==========================================================
   AUTH SESSION
========================================================== */

export interface AuthSession {

    sessionId: string;

    accessToken: string;

    refreshToken: string;

    expiresAt: string;

    provider: AuthProvider;

    authenticated: boolean;

}

/* ==========================================================
   PASSWORD MANAGEMENT
========================================================== */

export interface ForgotPasswordRequest {

    identifier: string;

}

export interface ResetPasswordRequest {

    token: string;

    password: string;

    confirmPassword: string;

}

export interface ChangePasswordRequest {

    currentPassword: string;

    newPassword: string;

    confirmPassword: string;

}

/* ==========================================================
   EMAIL VERIFICATION
========================================================== */

export interface VerifyEmailRequest {

    email: string;

    code: string;

}

export interface ResendEmailVerificationRequest {

    email: string;

}

/* ==========================================================
   PHONE VERIFICATION
========================================================== */

export interface VerifyPhoneRequest {

    phone: string;

    code: string;

}

export interface ResendPhoneVerificationRequest {

    phone: string;

}

/* ==========================================================
   OTP
========================================================== */

export interface OTPRequest {

    identifier: string;

    purpose:

        | "login"
        | "register"
        | "reset-password"
        | "verify-email"
        | "verify-phone"
        | "2fa";

}

export interface OTPVerificationRequest {

    identifier: string;

    code: string;

    purpose:

        | "login"
        | "register"
        | "reset-password"
        | "verify-email"
        | "verify-phone"
        | "2fa";

}

/* ==========================================================
   TOKEN
========================================================== */

export interface RefreshTokenRequest {

    refreshToken: string;

}

export interface RefreshTokenResponse {

    accessToken: string;

    refreshToken: string;

    expiresAt: string;

}

/* ==========================================================
   LOGOUT
========================================================== */

export interface LogoutRequest {

    sessionId?: string;

    logoutAllDevices?: boolean;

}

export interface LogoutResponse {

    success: boolean;

    message: string;

}

/* ==========================================================
   TWO FACTOR AUTHENTICATION
========================================================== */

export interface TwoFactorAuthentication {

    enabled: boolean;

    method:

        | "email"
        | "sms"
        | "authenticator";

    backupCodes: string[];

}

export interface EnableTwoFactorRequest {

    method:

        | "email"
        | "sms"
        | "authenticator";

}

export interface DisableTwoFactorRequest {

    password: string;

}

export interface VerifyTwoFactorRequest {

    code: string;

}

  /* ==========================================================
   DEVICE INFORMATION
========================================================== */

export interface AuthDevice {

    id: string;

    name: string;

    type:
        | "desktop"
        | "mobile"
        | "tablet";

    platform: string;

    operatingSystem: string;

    browser?: string;

    ipAddress?: string;

    location?: string;

    trusted: boolean;

    current: boolean;

    firstLogin: string;

    lastActive: string;

}

/* ==========================================================
   LOGIN HISTORY
========================================================== */

export interface LoginHistory {

    id: string;

    deviceId: string;

    loginAt: string;

    logoutAt?: string;

    ipAddress?: string;

    location?: string;

    provider: AuthProvider;

    success: boolean;

}

/* ==========================================================
   AUTH EVENT
========================================================== */

export interface AuthEvent {

    id: string;

    type:

        | "login"
        | "logout"
        | "register"
        | "password_changed"
        | "password_reset"
        | "email_verified"
        | "phone_verified"
        | "2fa_enabled"
        | "2fa_disabled"
        | "device_added"
        | "device_removed";

    timestamp: string;

    ipAddress?: string;

    deviceId?: string;

}

/* ==========================================================
   BIOMETRIC AUTHENTICATION
========================================================== */

export interface BiometricAuthentication {

    enabled: boolean;

    type:

        | "fingerprint"
        | "face"
        | "iris"
        | "device";

}

/* ==========================================================
   SOCIAL AUTHENTICATION
========================================================== */

export interface SocialAccount {

    provider: AuthProvider;

    providerId: string;

    email?: string;

    linkedAt: string;

}

/* ==========================================================
   SECURITY SETTINGS
========================================================== */

export interface SecuritySettings {

    twoFactorEnabled: boolean;

    biometricEnabled: boolean;

    loginAlerts: boolean;

    trustedDevicesOnly: boolean;

    backupCodesGenerated: boolean;

}

/* ==========================================================
   AUTH STATE
========================================================== */

export interface AuthState {

    authenticated: boolean;

    status: AuthStatus;

    loading: boolean;

    user: User | null;

    session: SessionUser | null;

    permissions: Permission[];

}

/* ==========================================================
   PERMISSIONS
========================================================== */

export type Permission =

    | "profile.read"
    | "profile.write"
    | "messages.read"
    | "messages.write"
    | "notifications.read"
    | "wallet.read"
    | "wallet.transfer"
    | "escrow.manage"
    | "learning.access"
    | "learning.manage"
    | "apprenticeship.access"
    | "business.manage"
    | "jobs.manage"
    | "creator.manage"
    | "advertising.manage"
    | "admin.access"
    | "super.admin";

/* ==========================================================
   ROLE PERMISSIONS
========================================================== */

export interface RolePermissions {

    role: string;

    permissions: Permission[];

}

/* ==========================================================
   AUTH CONTEXT
========================================================== */

export interface AuthContext {

    state: AuthState;

    refresh(): Promise<void>;

    logout(): Promise<void>;

}

/* ==========================================================
   DEFAULT EXPORT TYPES
========================================================== */

export type {

    AuthState as DefaultAuthState,

    LoginRequest as DefaultLoginRequest,

    RegisterRequest as DefaultRegisterRequest,

    LoginResponse as DefaultLoginResponse,

    RegisterResponse as DefaultRegisterResponse

};
