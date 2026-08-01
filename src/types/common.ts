/* ==========================================================
   REMADEF PLATFORM
   Common Types
   File: src/types/common.ts
========================================================== */

/* ==========================================================
   PRIMITIVES
========================================================== */

export type ID = string;
export type UUID = string;
export type ISODate = string;
export type Timestamp = number;

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

/* ==========================================================
   ENTITY
========================================================== */

export interface BaseEntity {

    id: ID;

    createdAt: ISODate;

    updatedAt: ISODate;

}

export interface AuditableEntity
    extends BaseEntity {

    createdBy: ID;

    updatedBy?: ID;

}

/* ==========================================================
   API
========================================================== */

export interface Pagination {

    page: number;

    limit: number;

    total: number;

    totalPages: number;

}

export interface PaginatedResult<T> {

    data: T[];

    pagination: Pagination;

}

export interface Sort {

    field: string;

    direction:
        | "asc"
        | "desc";

}

export interface Filter {

    field: string;

    operator:
        | "="
        | "!="
        | ">"
        | "<"
        | ">="
        | "<="
        | "contains"
        | "startsWith"
        | "endsWith"
        | "in";

    value: unknown;

}

/* ==========================================================
   STATUS
========================================================== */

export type Status =
    | "active"
    | "inactive"
    | "pending"
    | "draft"
    | "approved"
    | "rejected"
    | "archived"
    | "deleted";

export type VerificationStatus =
    | "unverified"
    | "pending"
    | "verified"
    | "rejected";

export type Visibility =
    | "public"
    | "private"
    | "connections";

export type AccountStatus =
    | "active"
    | "inactive"
    | "suspended"
    | "deleted";

/* ==========================================================
   ACCOUNT
========================================================== */

export type AccountType =
    | "student"
    | "apprentice"
    | "mentor"
    | "employer"
    | "business"
    | "creator"
    | "ambassador"
    | "partner"
    | "admin";

export type Gender =
    | "male"
    | "female"
    | "other"
    | "prefer_not_to_say";

export type Currency =
    | "NGN"
    | "USD"
    | "EUR"
    | "GBP";

/* ==========================================================
   FILES
========================================================== */

export interface FileReference {

    id: ID;

    name: string;

    url: string;

    size: number;

    mimeType: string;

    extension?: string;

    uploadedAt?: ISODate;

}

/* ==========================================================
   LOCATION
========================================================== */

export interface Coordinates {

    latitude: number;

    longitude: number;

}

export interface Address {

    country: string;

    state: string;

    city: string;

    lga?: string;

    addressLine1?: string;

    addressLine2?: string;

    postalCode?: string;

    coordinates?: Coordinates;

}

/* ==========================================================
   CONTACT
========================================================== */

export interface Contact {

    email?: string;

    phone?: string;

    website?: string;

}

/* ==========================================================
   SOCIAL
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

    snapchat?: string;

}

/* ==========================================================
   STATISTICS
========================================================== */

export interface Statistics {

    followers: number;

    following: number;

    posts: number;

    likes: number;

    comments: number;

    shares: number;

    saves: number;

    views: number;

}

/* ==========================================================
   MEDIA
========================================================== */

export interface Image {

    id: ID;

    url: string;

    thumbnail?: string;

    width?: number;

    height?: number;

}

export interface Video {

    id: ID;

    url: string;

    thumbnail?: string;

    duration?: number;

}

/* ==========================================================
   METADATA
========================================================== */

export interface Metadata {

    [key: string]:
        | string
        | number
        | boolean
        | null
        | Metadata
        | Metadata[];

}

/* ==========================================================
   OPTIONS
========================================================== */

export interface SelectOption<T = string> {

    label: string;

    value: T;

}

/* ==========================================================
   GENERIC RESULT
========================================================== */

export interface Result<T = unknown> {

    success: boolean;

    message?: string;

    data?: T;

}
