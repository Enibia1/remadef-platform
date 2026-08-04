/* ==========================================================
   REMADEF PLATFORM
   User Types
   File: src/types/user.ts
========================================================== */

/* ==========================================================
   USER ROLES
========================================================== */

export type UserRole =

    | "student"
    | "applicant"
    | "apprentice"
    | "master"
    | "mentor"
    | "instructor"
    | "creator"
    | "business"
    | "employer"
    | "recruiter"
    | "freelancer"
    | "professional"
    | "partner"
    | "ambassador"
    | "moderator"
    | "administrator"
    | "super_admin";

/* ==========================================================
   ACCOUNT STATUS
========================================================== */

export type UserStatus =

    | "active"
    | "inactive"
    | "pending"
    | "blocked"
    | "suspended"
    | "deleted";

/* ==========================================================
   GENDER
========================================================== */

export type Gender =

    | "male"
    | "female"
    | "other"
    | "prefer_not_to_say";

/* ==========================================================
   ONLINE STATUS
========================================================== */

export type OnlineStatus =

    | "online"
    | "offline"
    | "away"
    | "busy";

/* ==========================================================
   ACCOUNT
========================================================== */

export interface UserAccount {

    id: string;

    email: string;

    phone?: string;

    username: string;

    role: UserRole;

    status: UserStatus;

    createdAt: string;

    updatedAt: string;

    lastLogin?: string;

}

/* ==========================================================
   BASIC PROFILE
========================================================== */

export interface User {

    id: string;

    username: string;

    displayName: string;

    firstName: string;

    lastName: string;

    middleName?: string;

    email: string;

    phone?: string;

    avatar?: string;

    coverPhoto?: string;

    bio?: string;

    gender?: Gender;

    dateOfBirth?: string;

    nationality?: string;

    state?: string;

    city?: string;

    address?: string;

    role: UserRole;

    status: UserStatus;

    onlineStatus?: OnlineStatus;

    verified: boolean;

    createdAt: string;

    updatedAt: string;

}

/* ==========================================================
   PUBLIC PROFILE
========================================================== */

export interface PublicUser {

    id: string;

    username: string;

    displayName: string;

    avatar?: string;

    headline?: string;

    verified: boolean;

    followers: number;

    following: number;

    profileViews: number;

}

/* ==========================================================
   USER LOCATION
========================================================== */

export interface UserLocation {

    country: string;

    state: string;

    city: string;

    localGovernment?: string;

    postalCode?: string;

    address?: string;

    latitude?: number;

    longitude?: number;

    timezone?: string;

}

/* ==========================================================
   USER CONTACT
========================================================== */

export interface UserContact {

    primaryEmail: string;

    secondaryEmail?: string;

    primaryPhone: string;

    secondaryPhone?: string;

    whatsapp?: string;

    telegram?: string;

    website?: string;

}

/* ==========================================================
   EMERGENCY CONTACT
========================================================== */

export interface UserEmergencyContact {

    fullName: string;

    relationship: string;

    phone: string;

    email?: string;

    address?: string;

}

/* ==========================================================
   USER STATISTICS
========================================================== */

export interface UserStatistics {

    followers: number;

    following: number;

    connections: number;

    profileViews: number;

    postViews: number;

    postLikes: number;

    comments: number;

    shares: number;

    reputation: number;

    completion: number;

    coursesCompleted: number;

    apprenticeshipsCompleted: number;

    certifications: number;

    businesses: number;

    jobsApplied: number;

    gigsCompleted: number;

}

/* ==========================================================
   USER BADGE
========================================================== */

export interface UserBadge {

    id: string;

    name: string;

    description?: string;

    icon?: string;

    color?: string;

    earnedAt: string;

    expiresAt?: string;

}

/* ==========================================================
   USER VERIFICATION
========================================================== */

export interface UserVerification {

    verified: boolean;

    emailVerified: boolean;

    phoneVerified: boolean;

    identityVerified: boolean;

    addressVerified: boolean;

    studentVerified: boolean;

    apprenticeVerified: boolean;

    employerVerified: boolean;

    businessVerified: boolean;

    creatorVerified: boolean;

    ambassadorVerified: boolean;

    verificationLevel: number;

    verifiedAt?: string;

}

/* ==========================================================
   USER PREFERENCES
========================================================== */

export interface UserPreferences {

    language: string;

    theme: "light" | "dark" | "system";

    notifications: boolean;

    marketingEmails: boolean;

    autoplayVideos: boolean;

    showOnlineStatus: boolean;

    contentLanguage: string;

}

/* ==========================================================
   USER PRIVACY
========================================================== */

export interface UserPrivacy {

    profileVisibility: "public" | "connections" | "private";

    phoneVisibility: boolean;

    emailVisibility: boolean;

    showFollowers: boolean;

    showFollowing: boolean;

    searchable: boolean;

    allowMessages: boolean;

    allowMentions: boolean;

}

/* ==========================================================
   USER SETTINGS
========================================================== */

export interface UserSettings {

    preferences: UserPreferences;

    privacy: UserPrivacy;

}

/* ==========================================================
   USER LANGUAGE
========================================================== */

export interface UserLanguage {

    language: string;

    proficiency:

        | "beginner"
        | "intermediate"
        | "advanced"
        | "native";

}

/* ==========================================================
   USER SOCIAL LINKS
========================================================== */

export interface UserSocialLinks {

    website?: string;

    linkedin?: string;

    github?: string;

    x?: string;

    facebook?: string;

    instagram?: string;

    youtube?: string;

    tiktok?: string;

    snapchat?: string;

    telegram?: string;

    whatsapp?: string;

}

 /* ==========================================================
   USER EDUCATION
========================================================== */

export interface UserEducation {

    id: string;

    institution: string;

    faculty?: string;

    department?: string;

    program: string;

    degree?: string;

    level?: string;

    startDate: string;

    endDate?: string;

    current: boolean;

    description?: string;

}

/* ==========================================================
   USER EXPERIENCE
========================================================== */

export interface UserExperience {

    id: string;

    organization: string;

    position: string;

    employmentType?:
        | "full-time"
        | "part-time"
        | "contract"
        | "internship"
        | "apprenticeship"
        | "freelance"
        | "volunteer";

    location?: string;

    startDate: string;

    endDate?: string;

    current: boolean;

    description?: string;

}

/* ==========================================================
   USER SKILL
========================================================== */

export interface UserSkill {

    id: string;

    name: string;

    category?: string;

    proficiency:
        | "beginner"
        | "intermediate"
        | "advanced"
        | "expert";

    yearsOfExperience?: number;

    verified: boolean;

}

/* ==========================================================
   USER CERTIFICATION
========================================================== */

export interface UserCertification {

    id: string;

    title: string;

    issuer: string;

    issueDate: string;

    expiryDate?: string;

    credentialId?: string;

    credentialUrl?: string;

    verified: boolean;

}

/* ==========================================================
   USER PORTFOLIO
========================================================== */

export interface UserPortfolio {

    id: string;

    title: string;

    description?: string;

    image?: string;

    video?: string;

    website?: string;

    repository?: string;

    createdAt: string;

}

/* ==========================================================
   USER RESUME
========================================================== */

export interface UserResume {

    id: string;

    fileId: string;

    fileName: string;

    fileSize: number;

    uploadedAt: string;

    isDefault: boolean;

}

/* ==========================================================
   USER INTEREST
========================================================== */

export interface UserInterest {

    id: string;

    name: string;

    category?: string;

}

/* ==========================================================
   USER ACHIEVEMENT
========================================================== */

export interface UserAchievement {

    id: string;

    title: string;

    description?: string;

    icon?: string;

    awardedAt: string;

}

/* ==========================================================
   USER CONNECTION
========================================================== */

export interface UserConnection {

    id: string;

    userId: string;

    connectedUserId: string;

    status:
        | "pending"
        | "accepted"
        | "blocked";

    connectedAt?: string;

}

/* ==========================================================
   USER FOLLOWER
========================================================== */

export interface UserFollower {

    id: string;

    followerId: string;

    followingId: string;

    followedAt: string;

}

/* ==========================================================
   AUTHENTICATED USER
========================================================== */

export interface AuthenticatedUser {

    account: UserAccount;

    profile: User;

    statistics: UserStatistics;

    verification: UserVerification;

    settings: UserSettings;

    badges: UserBadge[];

}

/* ==========================================================
   SESSION USER
========================================================== */

export interface SessionUser {

    token: string;

    refreshToken?: string;

    expiresAt: string;

    authenticated: boolean;

    user: AuthenticatedUser;

}

/* ==========================================================
   CURRENT USER
========================================================== */

export interface CurrentUser {

    session: SessionUser;

    online: boolean;

    lastSeen?: string;

}

/* ==========================================================
   REMADEF PLATFORM
   MASTER USER PROFILE
========================================================== */

export interface UserProfile {

    account: UserAccount;

    profile: User;

    location?: UserLocation;

    contact?: UserContact;

    emergencyContact?: UserEmergencyContact;

    education: UserEducation[];

    experience: UserExperience[];

    skills: UserSkill[];

    certifications: UserCertification[];

    portfolio: UserPortfolio[];

    resume?: UserResume;

    interests: UserInterest[];

    achievements: UserAchievement[];

    statistics: UserStatistics;

    verification: UserVerification;

    settings: UserSettings;

    socialLinks: UserSocialLinks;

    languages: UserLanguage[];

    badges: UserBadge[];

    createdAt: string;

    updatedAt: string;

}

/* ==========================================================
   USER SUMMARY
========================================================== */

export interface UserSummary {

    id: string;

    username: string;

    displayName: string;

    avatar?: string;

    headline?: string;

    role: UserRole;

    verified: boolean;

    onlineStatus?: OnlineStatus;

    location?: string;

}

/* ==========================================================
   USER SEARCH RESULT
========================================================== */

export interface UserSearchResult {

    score: number;

    user: UserSummary;

    matchedFields: string[];

}

/* ==========================================================
   USER PROFILE COMPLETION
========================================================== */

export interface UserProfileCompletion {

    percentage: number;

    completed: string[];

    remaining: string[];

    nextRecommendedStep?: string;

}

/* ==========================================================
   USER SESSION
========================================================== */

export interface UserSession {

    sessionId: string;

    deviceId?: string;

    deviceName?: string;

    platform?: string;

    browser?: string;

    ipAddress?: string;

    location?: string;

    createdAt: string;

    lastActiveAt: string;

    expiresAt: string;

    current: boolean;

}

/* ==========================================================
   USER NOTIFICATION PREFERENCES
========================================================== */

export interface UserNotificationPreferences {

    push: boolean;

    email: boolean;

    sms: boolean;

    inApp: boolean;

    marketing: boolean;

    security: boolean;

    messages: boolean;

    jobs: boolean;

    learning: boolean;

    apprenticeship: boolean;

    business: boolean;

}

/* ==========================================================
   USER SECURITY
========================================================== */

export interface UserSecurity {

    twoFactorEnabled: boolean;

    backupCodesEnabled: boolean;

    loginAlerts: boolean;

    biometricEnabled: boolean;

    lastPasswordChange?: string;

}

/* ==========================================================
   USER WALLET SUMMARY
========================================================== */

export interface UserWalletSummary {

    walletId?: string;

    availableBalance: number;

    pendingBalance: number;

    escrowBalance: number;

    currency: string;

}

/* ==========================================================
   USER DASHBOARD
========================================================== */

export interface UserDashboard {

    profileCompletion: UserProfileCompletion;

    wallet?: UserWalletSummary;

    statistics: UserStatistics;

    recommendations: string[];

    quickActions: string[];

}

/* ==========================================================
   TYPE HELPERS
========================================================== */

export type UserID = string;

export type Username = string;

export type EmailAddress = string;

export type PhoneNumber = string;

export type VerificationLevel =

    | 0
    | 1
    | 2
    | 3
    | 4
    | 5;

/* ==========================================================
   DEFAULT EXPORT TYPES
========================================================== */

export type {

    User as DefaultUser,

    UserProfile as DefaultUserProfile,

    UserAccount as DefaultUserAccount,

    UserSettings as DefaultUserSettings,

    UserVerification as DefaultUserVerification

};
