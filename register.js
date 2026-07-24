// ============================================================
// REMADEF ACCOUNT REGISTRATION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

// --------------------------------------------------------
// ELEMENTS
// --------------------------------------------------------

const form = document.getElementById("register-form");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirm-password");

const submitButton =
    document.getElementById("register-button");

const errorBox =
    document.getElementById("error");

const successBox =
    document.getElementById("success");


// --------------------------------------------------------
// REGISTRATION METHOD
// --------------------------------------------------------

let registrationMethod = "email";


const emailTab =
    document.getElementById("email-tab");

const phoneTab =
    document.getElementById("phone-tab");

const emailBox =
    document.getElementById("email-box");

const phoneBox =
    document.getElementById("phone-box");


// --------------------------------------------------------
// HELPER: SHOW ERROR
// --------------------------------------------------------

function showError(message) {

    if (errorBox) {

        errorBox.textContent = message;

        errorBox.style.display = "block";

    }

    if (successBox) {

        successBox.style.display = "none";

    }

}


// --------------------------------------------------------
// HELPER: SHOW SUCCESS
// --------------------------------------------------------

function showSuccess(message) {

    if (successBox) {

        successBox.textContent = message;

        successBox.style.display = "block";

    }

    if (errorBox) {

        errorBox.style.display = "none";

    }

}


// --------------------------------------------------------
// EMAIL / PHONE SWITCH
// --------------------------------------------------------

if (emailTab) {

    emailTab.addEventListener("click", () => {

        registrationMethod = "email";

        if (emailBox) {
            emailBox.style.display = "block";
        }

        if (phoneBox) {
            phoneBox.style.display = "none";
        }

        emailTab.classList.add("active");

        if (phoneTab) {
            phoneTab.classList.remove("active");
        }

    });

}


if (phoneTab) {

    phoneTab.addEventListener("click", () => {

        registrationMethod = "phone";

        if (phoneBox) {
            phoneBox.style.display = "block";
        }

        if (emailBox) {
            emailBox.style.display = "none";
        }

        phoneTab.classList.add("active");

        if (emailTab) {
            emailTab.classList.remove("active");
        }

    });

}


// --------------------------------------------------------
// PASSWORD STRENGTH
// --------------------------------------------------------

if (passwordInput) {

    passwordInput.addEventListener("input", () => {

        const password =
            passwordInput.value;

        let strength = 0;

        if (password.length >= 8) {
            strength++;
        }

        if (/[A-Z]/.test(password)) {
            strength++;
        }

        if (/[a-z]/.test(password)) {
            strength++;
        }

        if (/[0-9]/.test(password)) {
            strength++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength++;
        }

        const strengthBar =
            document.getElementById("password-strength");

        if (strengthBar) {

            strengthBar.value = strength;

        }

    });

}


// --------------------------------------------------------
// FORM SUBMISSION
// --------------------------------------------------------

if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        // Clear previous messages

        if (errorBox) {

            errorBox.style.display = "none";

        }

        if (successBox) {

            successBox.style.display = "none";

        }


        // Prevent duplicate submissions

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Creating account...";

        }


        try {

            const password =
                passwordInput?.value.trim();


            const confirmPassword =
                confirmPasswordInput?.value.trim();


            // ------------------------------------------------
            // VALIDATE PASSWORD
            // ------------------------------------------------

            if (!password) {

                throw new Error(
                    "Please enter a password."
                );

            }


            if (password.length < 8) {

                throw new Error(
                    "Password must be at least 8 characters."
                );

            }


            if (password !== confirmPassword) {

                throw new Error(
                    "Passwords do not match."
                );

            }


            // ------------------------------------------------
            // BUILD REGISTRATION DATA
            // ------------------------------------------------

            const registrationData = {

                password: password

            };


            if (registrationMethod === "email") {

                const email =
                    emailInput?.value.trim();


                if (!email) {

                    throw new Error(
                        "Please enter your email address."
                    );

                }


                registrationData.email =
                    email;

            }


            if (registrationMethod === "phone") {

                const phone =
                    phoneInput?.value.trim();


                if (!phone) {

                    throw new Error(
                        "Please enter your phone number."
                    );

                }


                registrationData.phone =
                    phone;

            }


            // ------------------------------------------------
            // SEND TO REMADEF PLATFORM API
            // ------------------------------------------------

            const response =
                await RemadefAPI.register(
                    registrationData
                );


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            showSuccess(

                response.message ||

                "Account created successfully."

            );


            // Optional redirect

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1500);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showError(

                error.message ||

                "Registration failed. Please try again."

            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Create Account";

            }

        }

    });

}

});
