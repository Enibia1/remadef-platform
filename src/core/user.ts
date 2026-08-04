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
