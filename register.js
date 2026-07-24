"use strict";

/*
============================================================
REMADEF ACCOUNT REGISTRATION
Frontend Registration Controller
============================================================
*/


// ============================================================
// CONFIGURATION
// ============================================================

const API_URL =
    "https://6a60f589000c366da0d3.sfo.appwrite.run";

const LOGIN_PAGE =
    "login.html";


// ============================================================
// DOM ELEMENTS
// ============================================================

const form =
    document.getElementById("form");

const emailTab =
    document.getElementById("email-tab");

const phoneTab =
    document.getElementById("phone-tab");

const emailBox =
    document.getElementById("email-box");

const phoneBox =
    document.getElementById("phone-box");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const passwordInput =
    document.getElementById("password");

const confirmInput =
    document.getElementById("confirm");

const submitButton =
    document.getElementById("submit");

const errorBox =
    document.getElementById("error");

const successBox =
    document.getElementById("success");

const traineeIdBox =
    document.getElementById("trainee-id");

const countdownBox =
    document.getElementById("countdown");


// ============================================================
// PASSWORD REQUIREMENT ELEMENTS
// ============================================================

const lengthRequirement =
    document.getElementById("length");

const lowerRequirement =
    document.getElementById("lower");

const upperRequirement =
    document.getElementById("upper");

const numberRequirement =
    document.getElementById("number");

const strengthBar =
    document.getElementById("strength-bar");

const strengthText =
    document.getElementById("strength-text");


// ============================================================
// STATE
// ============================================================

let registrationMethod =
    "email";

let isSubmitting =
    false;


// ============================================================
// EMAIL VALIDATION
// ============================================================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// ============================================================
// PHONE NORMALIZATION
// ============================================================

function normalizePhone(phone) {

    phone =
        phone.replace(/\D/g, "");

    if (phone.startsWith("0")) {

        return "+234" +
            phone.slice(1);

    }

    if (phone.startsWith("234")) {

        return "+" +
            phone;

    }

    if (phone.length === 10) {

        return "+234" +
            phone;

    }

    return phone;

}


// ============================================================
// PASSWORD REQUIREMENTS
// ============================================================

function getPasswordRequirements(password) {

    return {

        length:
            password.length >= 8,

        lower:
            /[a-z]/.test(password),

        upper:
            /[A-Z]/.test(password),

        number:
            /\d/.test(password)

    };

}


// ============================================================
// UPDATE PASSWORD STRENGTH
// ============================================================

function updatePasswordStrength() {

    const password =
        passwordInput.value;

    const requirements =
        getPasswordRequirements(password);

    let score =
        0;

    if (requirements.length) {

        score++;

    }

    if (requirements.lower) {

        score++;

    }

    if (requirements.upper) {

        score++;

    }

    if (requirements.number) {

        score++;

    }


    // --------------------------------------------------------
    // UPDATE REQUIREMENT DISPLAY
    // --------------------------------------------------------

    lengthRequirement.textContent =
        requirements.length
            ? "🟢 8+ chars"
            : "🔴 8+ chars";

    lowerRequirement.textContent =
        requirements.lower
            ? "🟢 Lowercase"
            : "🔴 Lowercase";

    upperRequirement.textContent =
        requirements.upper
            ? "🟢 Uppercase"
            : "🔴 Uppercase";

    numberRequirement.textContent =
        requirements.number
            ? "🟢 Number"
            : "🔴 Number";


    // --------------------------------------------------------
    // UPDATE STRENGTH BAR
    // --------------------------------------------------------

    const percentage =
        (score / 4) * 100;

    strengthBar.style.width =
        percentage + "%";


    if (!password) {

        strengthText.textContent =
            "";

        return;

    }


    if (score <= 1) {

        strengthText.textContent =
            "Weak password";

    }

    else if (score === 2) {

        strengthText.textContent =
            "Fair password";

    }

    else if (score === 3) {

        strengthText.textContent =
            "Good password";

    }

    else {

        strengthText.textContent =
            "Strong password";

    }

}


// ============================================================
// PASSWORD VISIBILITY
// ============================================================

function togglePassword(inputId) {

    const input =
        document.getElementById(inputId);

    if (!input) {

        return;

    }

    input.type =
        input.type === "password"
            ? "text"
            : "password";

}


// ============================================================
// REGISTRATION METHOD SWITCHING
// ============================================================

emailTab.addEventListener(
    "click",
    function () {

        registrationMethod =
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

        emailInput.focus();

        hideError();

    }
);


phoneTab.addEventListener(
    "click",
    function () {

        registrationMethod =
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

        phoneInput.focus();

        hideError();

    }
);


// ============================================================
// PASSWORD EVENTS
// ============================================================

passwordInput.addEventListener(
    "input",
    updatePasswordStrength
);


// ============================================================
// ERROR HANDLING
// ============================================================

function showError(message) {

    errorBox.textContent =
        message;

    errorBox.style.display =
        "block";

    errorBox.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


function hideError() {

    errorBox.textContent =
        "";

    errorBox.style.display =
        "none";

}


// ============================================================
// SUCCESS SCREEN
// ============================================================

function showSuccess(data) {

    form.classList.add(
        "hidden"
    );

    successBox.style.display =
        "block";


    if (
        data &&
        data.trainee_id
    ) {

        traineeIdBox.textContent =
            data.trainee_id;

    }


    let seconds =
        3;

    countdownBox.textContent =
        seconds;


    const countdown =
        setInterval(
            function () {

                seconds--;

                countdownBox.textContent =
                    seconds;


                if (seconds <= 0) {

                    clearInterval(
                        countdown
                    );

                    window.location.replace(
                        LOGIN_PAGE
                    );

                }

            },
            1000
        );

}


// ============================================================
// FORM SUBMISSION
// ============================================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ----------------------------------------------------
        // PREVENT DOUBLE SUBMISSION
        // ----------------------------------------------------

        if (isSubmitting) {

            return;

        }


        hideError();


        const password =
            passwordInput.value;

        const confirmPassword =
            confirmInput.value;


        // ----------------------------------------------------
        // PASSWORD VALIDATION
        // ----------------------------------------------------

        const requirements =
            getPasswordRequirements(
                password
            );


        if (!requirements.length) {

            showError(
                "Password must be at least 8 characters."
            );

            passwordInput.focus();

            return;

        }


        if (!requirements.lower) {

            showError(
                "Password must contain a lowercase letter."
            );

            passwordInput.focus();

            return;

        }


        if (!requirements.upper) {

            showError(
                "Password must contain an uppercase letter."
            );

            passwordInput.focus();

            return;

        }


        if (!requirements.number) {

            showError(
                "Password must contain a number."
            );

            passwordInput.focus();

            return;

        }


        // ----------------------------------------------------
        // CONFIRM PASSWORD
        // ----------------------------------------------------

        if (
            password !==
            confirmPassword
        ) {

            showError(
                "Passwords do not match."
            );

            confirmInput.focus();

            return;

        }


        // ----------------------------------------------------
        // PREPARE REQUEST
        // ----------------------------------------------------

        const payload = {

            method:
                registrationMethod,

            password:
                password

        };


        // ----------------------------------------------------
        // EMAIL
        // ----------------------------------------------------

        if (
            registrationMethod ===
            "email"
        ) {

            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            if (!email) {

                showError(
                    "Please enter your email address."
                );

                emailInput.focus();

                return;

            }


            if (!isValidEmail(email)) {

                showError(
                    "Please enter a valid email address."
                );

                emailInput.focus();

                return;

            }


            payload.email =
                email;

        }


        // ----------------------------------------------------
        // PHONE
        // ----------------------------------------------------

        if (
            registrationMethod ===
            "phone"
        ) {

            const phone =
                normalizePhone(
                    phoneInput.value
                );


            if (
                !phone.startsWith(
                    "+234"
                )
            ) {

                showError(
                    "Please enter a valid Nigerian phone number."
                );

                phoneInput.focus();

                return;

            }


            payload.phone =
                phone;

        }


        // ----------------------------------------------------
        // START REQUEST
        // ----------------------------------------------------

        isSubmitting =
            true;

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Creating account...";


        try {


            const response =
                await fetch(
                    API_URL,
                    {

                        method:
                            "POST",

                        headers:
                            {

                                "Content-Type":
                                    "application/json"

                            },

                        body:
                            JSON.stringify(
                                payload
                            )

                    }
                );


            // ------------------------------------------------
            // READ RESPONSE SAFELY
            // ------------------------------------------------

            const text =
                await response.text();

            let result;


            try {

                result =
                    JSON.parse(
                        text
                    );

            }

            catch {

                result =
                    {};

            }


            // ------------------------------------------------
            // HANDLE ERROR RESPONSE
            // ------------------------------------------------

            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(

                    result.error ||
                    "Account creation failed."

                );

            }


            // ------------------------------------------------
            // ACCOUNT CREATED
            // ------------------------------------------------

            showSuccess(
                result.data
            );


        }


        catch (error) {

            console.error(
                "REMADEF REGISTRATION ERROR:",
                error
            );


            showError(
                error.message ||
                "Unable to create account. Please try again."
            );


            isSubmitting =
                false;

            submitButton.disabled =
                false;

            submitButton.textContent =
                "🚀 Create Account";

        }

    }
);
