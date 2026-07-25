/* ============================================================
   REMADEF ACCOUNT REGISTRATION
   FULL WORKING VERSION WITH EXECUTION RESULT POLLING
============================================================ */

(() => {

    "use strict";


    /* ========================================================
       DOM ELEMENTS
    ======================================================== */

    const $ = id =>
        document.getElementById(id);


    const form =
        $("form");


    const errorBox =
        $("error");


    const successBox =
        $("success");


    const emailBox =
        $("email-box");


    const phoneBox =
        $("phone-box");


    const emailTab =
        $("email-tab");


    const phoneTab =
        $("phone-tab");


    const emailInput =
        $("email");


    const phoneInput =
        $("phone");


    const passwordInput =
        $("password");


    const confirmInput =
        $("confirm");


    const submitButton =
        $("submit");


    const strengthBar =
        $("strength-bar");


    const strengthText =
        $("strength-text");


    const lengthRequirement =
        $("length");


    const lowerRequirement =
        $("lower");


    const upperRequirement =
        $("upper");


    const numberRequirement =
        $("number");


    const debug =
        $("debug");


    let registrationMethod =
        "email";


    /* ========================================================
       DEBUG
    ======================================================== */

    function debugLog(message) {

        if (!debug) return;

        debug.textContent +=
            "\n\n" + message;

    }


    function debugReplace(message) {

        if (!debug) return;

        debug.textContent =
            message;

    }


    /* ========================================================
       MESSAGE HELPERS
    ======================================================== */

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


    /* ========================================================
       REGISTRATION METHOD
    ======================================================== */

    function setMethod(method) {


        registrationMethod =
            method;


        if (method === "email") {


            emailBox.classList.remove(
                "hidden"
            );


            phoneBox.classList.add(
                "hidden"
            );


            emailTab.classList.add(
                "active"
            );


            phoneTab.classList.remove(
                "active"
            );


            emailInput.required =
                true;


            phoneInput.required =
                false;


        } else {


            emailBox.classList.add(
                "hidden"
            );


            phoneBox.classList.remove(
                "hidden"
            );


            emailTab.classList.remove(
                "active"
            );


            phoneTab.classList.add(
                "active"
            );


            emailInput.required =
                false;


            phoneInput.required =
                true;

        }


        clearMessages();

    }


    emailTab.addEventListener(

        "click",

        () => {

            setMethod(
                "email"
            );

        }

    );


    phoneTab.addEventListener(

        "click",

        () => {

            setMethod(
                "phone"
            );

        }

    );


    /* ========================================================
       PASSWORD STRENGTH
    ======================================================== */

    function updatePasswordStrength() {


        const password =
            passwordInput.value;


        const hasLength =
            password.length >= 8;


        const hasLower =
            /[a-z]/.test(password);


        const hasUpper =
            /[A-Z]/.test(password);


        const hasNumber =
            /[0-9]/.test(password);


        const score =

            Number(hasLength) +

            Number(hasLower) +

            Number(hasUpper) +

            Number(hasNumber);


        lengthRequirement.textContent =

            `${hasLength ? "✓" : "○"} 8+ characters`;


        lowerRequirement.textContent =

            `${hasLower ? "✓" : "○"} Lowercase`;


        upperRequirement.textContent =

            `${hasUpper ? "✓" : "○"} Uppercase`;


        numberRequirement.textContent =

            `${hasNumber ? "✓" : "○"} Number`;


        lengthRequirement.classList.toggle(

            "met",

            hasLength

        );


        lowerRequirement.classList.toggle(

            "met",

            hasLower

        );


        upperRequirement.classList.toggle(

            "met",

            hasUpper

        );


        numberRequirement.classList.toggle(

            "met",

            hasNumber

        );


        const widths = [

            "0%",

            "25%",

            "50%",

            "75%",

            "100%"

        ];


        const labels = [

            "",

            "Weak",

            "Fair",

            "Good",

            "Strong"

        ];


        strengthBar.style.width =
            widths[score];


        strengthText.textContent =
            labels[score];


        if (score === 0) {

            strengthBar.style.background =
                "transparent";

        }

        else if (score <= 1) {

            strengthBar.style.background =
                "#B42318";

        }

        else if (score <= 2) {

            strengthBar.style.background =
                "#B8892D";

        }

        else {

            strengthBar.style.background =
                "#198754";

        }

    }


    passwordInput.addEventListener(

        "input",

        updatePasswordStrength

    );


    /* ========================================================
       SHOW / HIDE PASSWORD
    ======================================================== */

    document
        .querySelectorAll(
            ".toggle-password"
        )
        .forEach(button => {


            button.addEventListener(

                "click",

                () => {


                    const target =
                        $(button.dataset.target);


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
                            "
