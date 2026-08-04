/* ==========================================================
   REMADEF PLATFORM
   User Types
   File: src/types/user.ts
========================================================== */

import type {
    BaseEntity,
    UserReference
} from "./common";

/* ==========================================================
   USER STATUS
========================================================== */

export type UserStatus =
    | "active"
    | "inactive"
    | "pending"
    | "suspended"
    | "blocked"
    | "deleted";

/* ==========================================================
   USER ROLE
========================================================== */

export type UserRole =
    | "student"
    | "apprentice"
    | "teacher"
    | "employer"
    | "employee"
    | "recruiter"
    | "freelancer"
    | "business-owner"
    | "buyer"
    | "seller"
    | "ngo"
    | "government"
    | "bank"
    | "insurance"
    | "hospital"
    | "moderator"
    | "admin"
    | "super-admin";

/* ==========================================================
   USER
========================================================== */

export interface User extends BaseEntity {

    firstName: string;

    lastName: string;

    fullName: string;

    username: string;

    email: string;

    phone?: string;

    avatar?: string;

    cover?: string;

    bio?: string;

    status: UserStatus;

    roles: UserRole[];

    verified: boolean;

    emailVerified: boolean;

    phoneVerified: boolean;

    profileCompletion: number;

    lastSeen?: string;

}

/* ==========================================================
   PUBLIC USER
========================================================== */

export interface PublicUser {

    id: string;

    fullName: string;

    username: string;

    avatar?: string;

    verified: boolean;

}

/* ==========================================================
   USER SUMMARY
========================================================== */

export interface UserSummary {

    totalFollowers: number;

    totalFollowing: number;

    totalConnections: number;

    totalPosts: number;

    totalBusinesses: number;

    totalCourses: number;

    totalJobs: number;

    totalCertificates: number;

}

/* ==========================================================
   USER STATISTICS
========================================================== */

export interface UserStatistics {

    profileViews: number;

    searchAppearances: number;

    engagements: number;

    opportunitiesApplied: number;

    messagesSent: number;

}

/* ==========================================================
   FOLLOW
========================================================== */

export interface UserFollow {

    follower: UserReference;

    following: UserReference;

    followedAt: string;

}

/* ==========================================================
   BLOCKED USER
========================================================== */

export interface BlockedUser {

    user: UserReference;

    blockedAt: string;

    reason?: string;

}

/* ==========================================================
   USER PREFERENCE
========================================================== */

export interface UserPreference {

    language: string;

    timezone: string;

    theme: string;

    emailNotifications: boolean;

    pushNotifications: boolean;

}

/* ==========================================================
   USER SESSION
========================================================== */

export interface UserSession {

    id: string;

    device: string;

    platform: string;

    ipAddress?: string;

    location?: string;

    current: boolean;

    loginAt: string;

    lastActive: string;

}
