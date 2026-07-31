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

export interface AuditableEntity extends BaseEntity {
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
    direction: "asc" | "desc";

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

/* ==========================================================
   FILES
========================================================== */

export interface FileReference {

    id: ID;
    name: string;
    url: string;
    size: number;
    mimeType: string;

}

/* ==========================================================
   LOCATION
========================================================== */

export interface Address {

    country: string;
    state: string;
    city: string;
    lga?: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;

}

export interface Coordinates {

    latitude: number;
    longitude: number;

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
   OPTION
========================================================== */

export interface SelectOption<T = string> {

    label: string;
    value: T;

}

/* ==========================================================
   RESPONSE
========================================================== */

export interface Result<T = unknown> {

    success: boolean;
    message?: string;
    data?: T;

}
