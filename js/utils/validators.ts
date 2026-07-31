/* ==========================================================
   REMADEF PLATFORM
   Validators
   File: js/utils/validators.ts
========================================================== */

import CONFIG from "../config";

/* ==========================================================
   EMAIL
========================================================== */

export function isEmail(value: string): boolean {

    if (!value) return false;

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value.trim()
    );

}

/* ==========================================================
   NIGERIAN PHONE
========================================================== */

export function isPhone(value: string): boolean {

    if (!value) return false;

    let phone = value
        .replace(/\s/g, "")
        .replace(/-/g, "")
        .replace(/\(/g, "")
        .replace(/\)/g, "");

    if (phone.startsWith("0")) {

        phone = "+234" + phone.substring(1);

    }

    if (phone.startsWith("234")) {

        phone = "+" + phone;

    }

    return /^\+234[789][01]\d{8}$/.test(phone);

}

/* ==========================================================
   PASSWORD
========================================================== */

export function isStrongPassword(
    password: string
): boolean {

    if (!password) return false;

    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password)
    );

}

/* ==========================================================
   NAME
========================================================== */

export function isName(value: string): boolean {

    if (!value) return false;

    return value.trim().length >= 2;

}

/* ==========================================================
   REQUIRED
========================================================== */

export function required(value: any): boolean {

    return (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );

}

/* ==========================================================
   URL
========================================================== */

export function isUrl(value: string): boolean {

    try {

        new URL(value);

        return true;

    }

    catch {

        return false;

    }

}

/* ==========================================================
   FILE SIZE
========================================================== */

export function validateImageSize(
    size: number
): boolean {

    return size <= CONFIG.uploads.imageSize;

}

export function validateDocumentSize(
    size: number
): boolean {

    return size <= CONFIG.uploads.documentSize;

}

/* ==========================================================
   PROFILE COMPLETION
========================================================== */

export function profileComplete(
    percentage: number
): boolean {

    return percentage >=
        CONFIG.profile.minimumCompletion;

}

/* ==========================================================
   WALLET
========================================================== */

export function validAmount(
    amount: number
): boolean {

    return amount > 0;

}

/* ==========================================================
   EXPORT
========================================================== */

export default {

    isEmail,

    isPhone,

    isStrongPassword,

    isName,

    required,

    isUrl,

    validateImageSize,

    validateDocumentSize,

    profileComplete,

    validAmount

};
