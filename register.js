/* ============================================================
   REMADEF ACCOUNT REGISTRATION
============================================================ */

(function () {

    "use strict";


    /* --------------------------------------------------------
       ELEMENTS
    -------------------------------------------------------- */

    const form =
        document.getElementById("form");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const password =
        document.getElementById("password");

    const confirm =
        document.getElementById("confirm");

    const submit =
        document.getElementById("submit");

    const errorBox =
        document.getElementById("error");

    const successBox =
        document.getElementById("success");

    const debug =
        document.getElementById("debug");

    const emailTab =
        document.getElementById("email-tab");

    const phoneTab =
        document.getElementById("phone-tab");

    const emailBox =
        document.getElementById("email-box");

    const phoneBox =
        document.getElementById("phone-box");

    const strengthBar =
        document.getElementById("strength-bar");

    const strengthText =
        document.getElementById("strength-text");


    let method =
        "email";


    /* --------------------------------------------------------
       DEBUG
    -------------------------------------------------------- */

    function log(message) {

        if (!debug) return;

        debug.textContent +=

            "\n\n" +

            message;

    }


    /* --------------------------------------------------------
       MESSAGE HELPERS
    -------------------------------------------------------- */

    function showError(message) {

        errorBox.textContent =
            message;

        errorBox.style.display =
            "block";

        successBox.style.display =
            "none";

    }


    function showSuccess(message) {

        successBox.textContent =
            message;

        successBox.style.display =
            "block";

        errorBox.style.display =
            "none";

    }


    function clearMessages() {

        errorBox.textContent =
            "";

        successBox.textContent =
            "";

        errorBox.style.display =
            "none";

        successBox.style.display =
            "none";

    }


    /* --------------------------------------------------------
       EMAIL / PHONE TABS
    -------------------------------------------------------- */

    emailTab.addEventListener(

        "click",

        function () {

            method =
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


            email.focus();

        }

    );


    phoneTab.addEventListener(

        "click",

        function () {

            method =
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


            phone.focus();

        }

    );


    /* --------------------------------------------------------
       PASSWORD VISIBILITY
    -------------------------------------------------------- */

    document
        .querySelectorAll(
            ".toggle-password"
        )
        .forEach(

            function (button) {

                button.addEventListener(

                    "click",

                    function () {

                        const target =
                            document.getElementById(
                                button.dataset.target
                            );


                        if (

                            target.type ===
                            "password"

                        ) {

                            target.type =
                                "text";

                            button.textContent =
                                "🙈";

                            button.setAttribute(

                                "aria-label",

                                "Hide password"

                            );

                        }

                        else {

                            target.type =
                                "password";

                            button.textContent =
                                "👁";

                            button.setAttribute(

                                "aria-label",

                                "Show password"

                            );

                        }

                    }

                );

            }

        );


    /* --------------------------------------------------------
       PASSWORD STRENGTH
    -------------------------------------------------------- */

    password.addEventListener(

        "input",

        function () {

            const value =
                password.value;


            const hasLength =
                value.length >= 8;

            const hasLower =
                /[a-z]/.test(value);

            const hasUpper =
                /[A-Z]/.test(value);

            const hasNumber =
                /[0-9]/.test(value);


            updateRequirement(

                "length",

                hasLength,

                "8+ characters"

            );


            updateRequirement(

                "lower",

                hasLower,

                "Lowercase"

            );


            updateRequirement(

                "upper",

                hasUpper,

                "Uppercase"

            );


            updateRequirement(

                "number",

                hasNumber,

                "Number"

            );


            let score =
                0;


            if (hasLength)
                score++;


            if (hasLower)
                score++;


            if (hasUpper)
                score++;


            if (hasNumber)
                score++;


            if (score === 0) {

                strengthBar.style.width =
                    "0%";

                strengthText.textContent =
                    "";

            }

            else if (score <= 2) {

                strengthBar.style.width =
                    "35%";

                strengthText.textContent =
                    "Weak";

            }

            else if (score === 3) {

                strengthBar.style.width =
                    "70%";

                strengthText.textContent =
                    "Good";

            }

            else {

                strengthBar.style.width =
                    "100%";

                strengthText.textContent =
                    "Strong";

            }

        }

    );


    function updateRequirement(

        id,

        valid,

        label

    ) {

        const element =
            document.getElementById(
                id
            );


        if (valid) {

            element.textContent =
                "✓ " + label;

            element.classList.add(
                "met"
            );

        }

        else {

            element.textContent =
                "○ " + label;

            element.classList.remove(
                "met"
            );

        }

    }


    /* --------------------------------------------------------
       FORM SUBMISSION
    -------------------------------------------------------- */

    form.addEventListener(

        "submit",

        async function (event) {

            event.preventDefault();


            clearMessages();


            log(
                "REGISTRATION STARTED"
            );


            /* --------------------------------------------
               VALIDATION
            -------------------------------------------- */

            log(
                "VALIDATION STARTED"
            );


            const emailValue =
                email.value.trim();


            const phoneValue =
                phone.value.trim();


            const passwordValue =
                password.value;


            const confirmValue =
                confirm.value;


            if (

                method === "email" &&
                !emailValue

            ) {

                showError(
                    "Please enter your email address."
                );

                return;

            }


            if (

                method === "email" &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(emailValue)

            ) {

                showError(
                    "Please enter a valid email address."
                );

                return;

            }


            if (

                method === "phone" &&
                !phoneValue

            ) {

                showError(
                    "Please enter your phone number."
                );

                return;

            }


            if (

                passwordValue.length < 8

            ) {

                showError(
                    "Password must be at least 8 characters."
                );

                return;

            }


            if (

                !/[a-z]/.test(
                    passwordValue
                )

            ) {

                showError(
                    "Password must contain a lowercase letter."
                );

                return;

            }


            if (

                !/[A-Z]/.test(
                    passwordValue
                )

            ) {

                showError(
                    "Password must contain an uppercase letter."
                );

                return;

            }


            if (

                !/[0-9]/.test(
                    passwordValue
                )

            ) {

                showError(
                    "Password must contain a number."
                );

                return;

            }


            if (

                passwordValue !==
                confirmValue

            ) {

                showError(
                    "Passwords do not match."
                );

                return;

            }


            log(
                "VALIDATION PASSED"
            );


            /* --------------------------------------------
               VERIFY API CLIENT
            -------------------------------------------- */

            if (

                typeof window.RemadefAPI ===
                "undefined"

            ) {

                showError(
                    "REMADEF API is unavailable."
                );

                log(
                    "ERROR: window.RemadefAPI is undefined"
                );

                return;

            }


            log(
                "SENDING REGISTRATION REQUEST"
            );


            submit.disabled =
                true;


            submit.textContent =
                "Creating account...";


            try {


                const payload = {


                    email:

                        method === "email"

                            ? emailValue

                            : null,


                    phone:

                        method === "phone"

                            ? phoneValue

                            : null,


                    password:

                        passwordValue,


                    method:

                        method

                };


                log(

                    "PAYLOAD:\n" +

                    JSON.stringify(

                        {

                            email:
                                payload.email,

                            phone:
                                payload.phone,

                            method:
                                payload.method,

                            password:
                                "[HIDDEN]"

                        },

                        null,

                        2

                    )

                );


                const result =

                    await window.RemadefAPI.register(

                        payload

                    );


                log(
                    "REGISTRATION RESPONSE RECEIVED"
                );


                log(

                    "RESPONSE:\n" +

                    JSON.stringify(

                        result,

                        null,

                        2

                    )

                );


                showSuccess(

                    result.message ||

                    "Your REMADEF account was created successfully."

                );


                form.reset();


                strengthBar.style.width =
                    "0%";


                strengthText.textContent =
                    "";


                document
                    .querySelectorAll(
                        ".requirements span"
                    )
                    .forEach(

                        function (element) {

                            element.classList.remove(
                                "met"
                            );

                        }

                    );


            }

            catch (error) {


                log(

                    "REGISTRATION ERROR\n" +

                    error.message

                );


                showError(

                    error.message ||

                    "Registration failed. Please try again."

                );

            }


            finally {


                submit.disabled =
                    false;


                submit.textContent =
                    "Create REMADEF Account";

            }

        }

    );


    /* --------------------------------------------------------
       READY
    -------------------------------------------------------- */

    log(
        "REGISTRATION SYSTEM READY"
    );


})();
