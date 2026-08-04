/* ==========================================================
   REMADEF PLATFORM
   PROFILE TYPES
   File: src/types/profile.ts

   PURPOSE
   ----------------------------------------------------------
   Master Profile types used throughout the platform.

   Every opportunity module extends this profile.

   USED BY
   ----------------------------------------------------------
   • Profile Module
   • Home Feed
   • Learning
   • Apprenticeship
   • Business
   • Jobs
   • Wallet
   • Messaging
========================================================== */

import type {

    ID,
    Timestamp,
    Status,
    ApiResponse

} from "./common";

import type {

    UserRole,
    UserStatus

} from "./user";

/* ==========================================================
   GENDER
========================================================== */

export type Gender =
    | "male"
    | "female"
    | "other"
    | "prefer-not-to-say";

/* ==========================================================
   MARITAL STATUS
========================================================== */

export type MaritalStatus =
    | "single"
    | "married"
    | "divorced"
    | "widowed";

/* ==========================================================
   ADDRESS
========================================================== */

export interface Address {

    country: string;

    state: string;

    city: string;

    district?: string;

    street?: string;

    postalCode?: string;
}

/* ==========================================================
   SOCIAL LINKS
========================================================== */

export interface SocialLinks {

    website?: string;

    facebook?: string;

    instagram?: string;

    x?: string;

    linkedin?: string;

    youtube?: string;

    tiktok?: string;

    github?: string;
}

/* ==========================================================
   EDUCATION
========================================================== */

export interface EducationRecord {

    id: ID;

    institution: string;

    qualification: string;

    course?: string;

    startDate?: string;

    endDate?: string;

    current: boolean;
}

/* ==========================================================
   EXPERIENCE
========================================================== */

export interface ExperienceRecord {

    id: ID;

    company: string;

    position: string;

    startDate?: string;

    endDate?: string;

    current: boolean;

    description?: string;
}

/* ==========================================================
   BUSINESS
========================================================== */

export interface BusinessProfile {

    businessId?: ID;

    businessName?: string;

    industry?: string;

    role?: string;

    verified: boolean;
}

/* ==========================================================
   PROFILE STATS
========================================================== */

export interface ProfileStats {

    followers: number;

    following: number;

    posts: number;

    reactions: number;

    comments: number;

    profileViews: number;

    completion: number;
}

/* ==========================================================
   PROFILE PRIVACY
========================================================== */

export interface ProfilePrivacy {

    publicProfile: boolean;

    showEmail: boolean;

    showPhone: boolean;

    showLocation: boolean;

    allowMessages: boolean;

    searchable: boolean;
}

/* ==========================================================
   PROFILE VERIFICATION
========================================================== */

export interface ProfileVerification {

    emailVerified: boolean;

    phoneVerified: boolean;

    identityVerified: boolean;

    businessVerified: boolean;
}

/* ==========================================================
   MASTER PROFILE
========================================================== */

export interface Profile {

    id: ID;

    userId: ID;

    username: string;

    firstName: string;

    lastName: string;

    displayName: string;

    headline?: string;

    bio?: string;

    avatar?: string;

    coverPhoto?: string;

    gender?: Gender;

    maritalStatus?: MaritalStatus;

    dateOfBirth?: string;

    email: string;

    phone?: string;

    address: Address;

    roles: UserRole[];

    status: UserStatus;

    skills: string[];

    interests: string[];

    education: EducationRecord[];

    experience: ExperienceRecord[];

    business?: BusinessProfile;

    social: SocialLinks;

    privacy: ProfilePrivacy;

    verification: ProfileVerification;

    stats: ProfileStats;

    createdAt: Timestamp;

    updatedAt: Timestamp;
}

/* ==========================================================
   PROFILE UPDATE
========================================================== */

export interface UpdateProfileRequest {

    displayName?: string;

    headline?: string;

    bio?: string;

    avatar?: string;

    coverPhoto?: string;

    phone?: string;

    address?: Partial<Address>;

    skills?: string[];

    interests?: string[];

    social?: Partial<SocialLinks>;

    privacy?: Partial<ProfilePrivacy>;
}

/* ==========================================================
   PROFILE SEARCH
========================================================== */

export interface ProfileSearchResult {

    id: ID;

    username: string;

    displayName: string;

    avatar?: string;

    headline?: string;

    verified: boolean;
}

/* ==========================================================
   PROFILE RESPONSES
========================================================== */

export type ProfileResponse =
    ApiResponse<Profile>;

export type ProfilesResponse =
    ApiResponse<Profile[]>;

export type ProfileSearchResponse =
    ApiResponse<ProfileSearchResult[]>;
