"use strict";

/*

REMADEF LOGIN SYSTEM
Appwrite Web SDK
Project: REMADEF Platform

*/

// ============================================================
// CONFIGURATION
// ============================================================

const PROJECT_ID =
"6a634fdc00148a907132";

const APPWRITE_ENDPOINT =
"https://fra.cloud.appwrite.io/v1";

const HOME_PAGE =
"home.html";

// ============================================================
// APPWRITE CLIENT
// ============================================================

const client =
new Appwrite.Client();

client
.setEndpoint(
APPWRITE_ENDPOINT
)
.setProject(
PROJECT_ID
);

const account =
new Appwrite.Account(
client
);

// ============================================================
// DOM ELEMENTS
// ============================================================

const form =
document.getElementById(
"login-form"
);

const emailTab =
document.getElementById(
"email-tab"
);

const phoneTab =
document.getElementById(
"phone-tab"
);

const emailBox =
document.getElementById(
"email-box"
);

const phoneBox =
document.getElementById(
"phone-box"
);

const emailInput =
document.getElementById(
"email"
);

const phoneInput =
document.getElementById(
"phone"
);

const passwordInput =
document.getElementById(
"password"
);

const submitButton =
document.getElementById(
"submit"
);

const errorBox =
document.getElementById(
"error"
);

const successBox =
document.getElementById(
"success"
);

let loginMethod =
"email";

// ============================================================
// MESSAGE HELPERS
// ============================================================

function showError(
message
) {

if (successBox) {

    successBox.style.display =
        "none";

}


if (errorBox) {

    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";

}

}

function showSuccess(
message
) {

if (errorBox) {

    errorBox.style.display =
        "none";

}


if (successBox) {

    successBox.textContent =
        message;

    successBox.style.display =
        "block";

}

}

function clearMessages() {

if (errorBox) {

    errorBox.style.display =
        "none";

}


if (successBox) {

    successBox.style.display =
        "none";

}

}

// ============================================================
// SWITCH TO EMAIL LOGIN
// ============================================================

if (emailTab) {

emailTab.addEventListener(
    "click",
    function () {

        loginMethod =
            "email";


        emailTab.classList.add(
            "active"
        );


        phoneTab.classList.remove(
            "active"
        );


        emailBox.classList.remove(
            "hidden"
        );


        phoneBox.classList.add(
            "hidden"
        );


        clearMessages();


        emailInput.focus();

    }
);

}

// ============================================================
// SWITCH TO PHONE LOGIN
// ============================================================

if (phoneTab) {

phoneTab.addEventListener(
    "click",
    function () {

        loginMethod =
            "phone";


        phoneTab.classList.add(
            "active"
        );


        emailTab.classList.remove(
            "active"
        );


        phoneBox.classList.remove(
            "hidden"
        );


        emailBox.classList.add(
            "hidden"
        );


        clearMessages();


        phoneInput.focus();

    }
);

}

// ============================================================
// PASSWORD VISIBILITY
// ============================================================

document.addEventListener(
"click",
function (event) {

    const button =
        event.target.closest(
            ".toggle-password"
        );


    if (!button) {

        return;

    }


    const targetId =
        button.dataset.target;


    const input =
        document.getElementById(
            targetId
        );


    if (!input) {

        return;

    }


    const isPassword =
        input.type ===
        "password";


    input.type =
        isPassword
            ? "text"
            : "password";


    button.textContent =
        isPassword
            ? "🙈"
            : "👁";


    button.setAttribute(
        "aria-label",
        isPassword
            ? "Hide password"
            : "Show password"
    );

}

);

// ============================================================
// PHONE NORMALIZATION
// ============================================================

function normalizePhone(
phone
) {

let value =
    String(
        phone || ""
    )
    .trim()
    .replace(
        /\s+/g,
        ""
    );


// Nigerian local format:
// 08037537614
if (
    value.startsWith(
        "0"
    )
) {

    return (
        "+234" +
        value.slice(
            1
        )
    );

}


// Nigerian international format:
// 2348037537614
if (
    value.startsWith(
        "234"
    )
) {

    return (
        "+" +
        value
    );

}


// Already normalized:
// +2348037537614
if (
    value.startsWith(
        "+234"
    )
) {

    return value;

}


return value;

}

// ============================================================
// EMAIL VALIDATION
// ============================================================

function isValidEmail(
email
) {

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(
        email
    );

}

// ============================================================
// PHONE VALIDATION
// ============================================================

function isValidNigerianPhone(
phone
) {

return /^\+234[789][01]\d{8}$/
    .test(
        phone
    );

}

// ============================================================
// LOGIN
// ============================================================

if (form) {

form.addEventListener(
    "submit",
    async function (event) {


        event.preventDefault();


        clearMessages();


        let identifier =
            "";


        const password =
            passwordInput.value;


        // ====================================================
        // EMAIL LOGIN
        // ====================================================

        if (
            loginMethod ===
            "email"
        ) {


            identifier =
                emailInput.value
                .trim()
                .toLowerCase();


            if (
                !identifier
            ) {

                showError(
                    "Please enter your email address."
                );


                emailInput.focus();


                return;

            }


            if (
                !isValidEmail(
                    identifier
                )
            ) {

                showError(
                    "Please enter a valid email address."
                );


                emailInput.focus();


                return;

            }

        }


        // ====================================================
        // PHONE LOGIN
        // ====================================================

        if (
            loginMethod ===
            "phone"
        ) {


            identifier =
                normalizePhone(
                    phoneInput.value
                );


            if (
                !isValidNigerianPhone(
                    identifier
                )
            ) {

                showError(
                    "Please enter a valid Nigerian phone number."
                );


                phoneInput.focus();


                return;

            }

        }


        // ====================================================
        // PASSWORD VALIDATION
        // ====================================================

        if (
            !password
        ) {

            showError(
                "Please enter your password."
            );


            passwordInput.focus();


            return;

        }


        // ====================================================
        // DISABLE BUTTON
        // ====================================================

        submitButton.disabled =
            true;


        submitButton.textContent =
            "Signing in...";


        try {


            // ====================================================
            // EMAIL PASSWORD LOGIN
            // ====================================================

            if (
                loginMethod ===
                "email"
            ) {


                await account
                    .createEmailPasswordSession(
                        identifier,
                        password
                    );

            }


            // ====================================================
            // PHONE PASSWORD LOGIN
            // ====================================================

            else {


                await account
                    .createPhonePasswordSession(
                        identifier,
                        password
                    );

            }


            // ====================================================
            // SUCCESS
            // ====================================================

            showSuccess(
                "Login successful. Redirecting..."
            );


            setTimeout(
                function () {

                    window.location.replace(
                        HOME_PAGE
                    );

                },
                500
            );

        }


        catch (
            error
        ) {


            console.error(
                "REMADEF LOGIN ERROR:",
                error
            );


            let message =
                "Unable to sign in. Please check your login details and try again.";


            if (
                error &&
                error.message
            ) {

                const appwriteMessage =
                    error.message;


                if (
                    appwriteMessage
                        .toLowerCase()
                        .includes(
                            "invalid credentials"
                        )
                ) {

                    message =
                        "Incorrect email/phone number or password.";

                }


                else {

                    message =
                        appwriteMessage;

                }

            }


            showError(
                message
            );


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Sign In";

        }

    }
);

}
