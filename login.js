"use strict";

/*
============================================================
REMADEF LOGIN
Appwrite Web SDK
============================================================
*/

const PROJECT_ID = "6a5bc178003a2529271e";

const APPWRITE_ENDPOINT =
    "https://sfo.cloud.appwrite.io/v1";

const HOME_PAGE = "home.html";


// ============================================================
// APPWRITE CLIENT
// ============================================================

const client = new Appwrite.Client();

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID);

const account = new Appwrite.Account(client);


// ============================================================
// DOM ELEMENTS
// ============================================================

const form = document.getElementById("login-form");

const emailTab = document.getElementById("email-tab");
const phoneTab = document.getElementById("phone-tab");

const emailBox = document.getElementById("email-box");
const phoneBox = document.getElementById("phone-box");

const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");

const submitButton = document.getElementById("submit");

const errorBox = document.getElementById("error");
const successBox = document.getElementById("success");

let loginMethod = "email";


// ============================================================
// MESSAGE HELPERS
// ============================================================

function showError(message) {

    successBox.style.display = "none";

    errorBox.textContent = message;

    errorBox.style.display = "block";

}


function showSuccess(message) {

    errorBox.style.display = "none";

    successBox.textContent = message;

    successBox.style.display = "block";

}


function clearMessages() {

    errorBox.style.display = "none";

    successBox.style.display = "none";

}


// ============================================================
// REGISTRATION METHOD SWITCHING
// ============================================================

emailTab.addEventListener("click", function () {

    loginMethod = "email";

    emailTab.classList.add("active");

    phoneTab.classList.remove("active");

    emailBox.classList.remove("hidden");

    phoneBox.classList.add("hidden");

    emailInput.focus();

    clearMessages();

});


phoneTab.addEventListener("click", function () {

    loginMethod = "phone";

    phoneTab.classList.add("active");

    emailTab.classList.remove("active");

    phoneBox.classList.remove("hidden");

    emailBox.classList.add("hidden");

    phoneInput.focus();

    clearMessages();

});


// ============================================================
// PASSWORD VISIBILITY
// ============================================================

document.addEventListener("click", function (event) {

    const button =
        event.target.closest(".toggle-password");

    if (!button) return;

    const targetId =
        button.dataset.target;

    const input =
        document.getElementById(targetId);

    if (!input) return;

    const isPassword =
        input.type === "password";

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

});


// ============================================================
// PHONE NORMALIZATION
// ============================================================

function normalizePhone(phone) {

    phone = phone.replace(/\D/g, "");

    if (phone.startsWith("0")) {

        return "+234" + phone.slice(1);

    }

    if (phone.startsWith("234")) {

        return "+" + phone;

    }

    if (phone.length === 10) {

        return "+234" + phone;

    }

    return phone;

}


// ============================================================
// LOGIN
// ============================================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearMessages();

    const password =
        passwordInput.value.trim();

    let identifier;


    // --------------------------------------------------------
    // VALIDATE EMAIL
    // --------------------------------------------------------

    if (loginMethod === "email") {

        identifier =
            emailInput.value.trim().toLowerCase();

        if (!identifier) {

            showError("Please enter your email address.");

            emailInput.focus();

            return;

        }

    }


    // --------------------------------------------------------
    // VALIDATE PHONE
    // --------------------------------------------------------

    if (loginMethod === "phone") {

        identifier =
            normalizePhone(phoneInput.value.trim());

        if (!identifier.startsWith("+234")) {

            showError(
                "Please enter a valid Nigerian phone number."
            );

            phoneInput.focus();

            return;

        }

    }


    // --------------------------------------------------------
    // VALIDATE PASSWORD
    // --------------------------------------------------------

    if (!password) {

        showError("Please enter your password.");

        passwordInput.focus();

        return;

    }


    // --------------------------------------------------------
    // DISABLE SUBMIT
    // --------------------------------------------------------

    submitButton.disabled = true;

    submitButton.textContent = "Signing in...";


    try {


        // ====================================================
        // EMAIL LOGIN
        // ====================================================

        if (loginMethod === "email") {

            await account.createEmailPasswordSession(
                identifier,
                password
            );

        }


        // ====================================================
        // PHONE LOGIN
        // ====================================================

        else {

            await account.createPhonePasswordSession(
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


        setTimeout(function () {

            window.location.replace(HOME_PAGE);

        }, 500);


    }


    catch (error) {

        console.error(
            "REMADEF LOGIN ERROR:",
            error
        );


        let message =
            "Unable to sign in. Please check your details and try again.";


        if (
            error &&
            error.message
        ) {

            message =
                error.message;

        }


        showError(message);


        submitButton.disabled = false;

        submitButton.textContent = "Sign In";

    }

});
