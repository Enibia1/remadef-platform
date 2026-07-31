/* ==========================================================
   REMADEF PLATFORM
   PERMISSIONS & ROLES
   File: src/config/permissions.ts

   PURPOSE
   ----------------------------------------------------------
   Master permission registry.

   Every user may have multiple roles.

   Permissions determine what a user can do,
   not which app they use.
========================================================== */

/* ==========================================================
   PERMISSIONS
========================================================== */

export const PERMISSIONS = {

    /* ========= PROFILE ========= */

    PROFILE_VIEW: "profile:view",
    PROFILE_EDIT: "profile:edit",
    PROFILE_DELETE: "profile:delete",

    /* ========= SOCIAL ========= */

    POST_CREATE: "post:create",
    POST_EDIT: "post:edit",
    POST_DELETE: "post:delete",

    COMMENT_CREATE: "comment:create",
    COMMENT_DELETE: "comment:delete",

    MESSAGE_SEND: "message:send",
    MESSAGE_DELETE: "message:delete",

    /* ========= LEARNING ========= */

    COURSE_ENROLL: "course:enroll",
    COURSE_CREATE: "course:create",
    COURSE_EDIT: "course:edit",

    /* ========= APPRENTICESHIP ========= */

    APPRENTICE_APPLY: "apprentice:apply",
    APPRENTICE_APPROVE: "apprentice:approve",

    /* ========= JOBS ========= */

    JOB_APPLY: "job:apply",
    JOB_CREATE: "job:create",
    JOB_EDIT: "job:edit",

    /* ========= BUSINESS ========= */

    BUSINESS_CREATE: "business:create",
    BUSINESS_EDIT: "business:edit",

    PRODUCT_CREATE: "product:create",
    PRODUCT_EDIT: "product:edit",

    /* ========= WALLET ========= */

    WALLET_VIEW: "wallet:view",
    WALLET_TRANSFER: "wallet:transfer",
    WALLET_WITHDRAW: "wallet:withdraw",

    ESCROW_CREATE: "escrow:create",
    ESCROW_RELEASE: "escrow:release",

    /* ========= ADMIN ========= */

    USER_MANAGE: "user:manage",
    CONTENT_MODERATE: "content:moderate",
    SYSTEM_ADMIN: "system:admin"

} as const;


/* ==========================================================
   ROLES
========================================================== */

export const ROLES = {

    STUDENT: "student",

    APPRENTICE: "apprentice",

    TEACHER: "teacher",

    EMPLOYER: "employer",

    EMPLOYEE: "employee",

    RECRUITER: "recruiter",

    FREELANCER: "freelancer",

    BUSINESS_OWNER: "business-owner",

    BUYER: "buyer",

    SELLER: "seller",

    NGO: "ngo",

    GOVERNMENT: "government",

    BANK: "bank",

    INSURANCE: "insurance",

    HOSPITAL: "hospital",

    MODERATOR: "moderator",

    ADMIN: "admin",

    SUPER_ADMIN: "super-admin"

} as const;


/* ==========================================================
   ROLE → PERMISSIONS
========================================================== */

export const ROLE_PERMISSIONS = {

    [ROLES.STUDENT]: [

        PERMISSIONS.PROFILE_VIEW,
        PERMISSIONS.PROFILE_EDIT,

        PERMISSIONS.POST_CREATE,

        PERMISSIONS.COMMENT_CREATE,

        PERMISSIONS.MESSAGE_SEND,

        PERMISSIONS.COURSE_ENROLL,

        PERMISSIONS.JOB_APPLY
    ],

    [ROLES.APPRENTICE]: [

        PERMISSIONS.APPRENTICE_APPLY,

        PERMISSIONS.COURSE_ENROLL,

        PERMISSIONS.MESSAGE_SEND
    ],

    [ROLES.TEACHER]: [

        PERMISSIONS.COURSE_CREATE,

        PERMISSIONS.COURSE_EDIT
    ],

    [ROLES.BUSINESS_OWNER]: [

        PERMISSIONS.BUSINESS_CREATE,

        PERMISSIONS.BUSINESS_EDIT,

        PERMISSIONS.PRODUCT_CREATE,

        PERMISSIONS.PRODUCT_EDIT
    ],

    [ROLES.ADMIN]: [

        PERMISSIONS.USER_MANAGE,

        PERMISSIONS.CONTENT_MODERATE
    ],

    [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS)

} as const;


/* ==========================================================
   HELPERS
========================================================== */

export function hasPermission(

    roles: string[],

    permission: string

): boolean {

    for (const role of roles) {

        const permissions =
            ROLE_PERMISSIONS[
                role as keyof typeof ROLE_PERMISSIONS
            ];

        if (

            permissions &&

            permissions.includes(permission as never)

        ) {

            return true;

        }

    }

    return false;
}


export default {

    PERMISSIONS,

    ROLES,

    ROLE_PERMISSIONS,

    hasPermission

};
