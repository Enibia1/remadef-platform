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

        });


    /* ========================================================
       VALIDATION
    ======================================================== */

    function validateForm() {


        const password =
            passwordInput.value;


        const confirm =
            confirmInput.value;


        if (

            registrationMethod ===
            "email"

        ) {


            const email =
                emailInput.value.trim();


            if (!email) {

                throw new Error(

                    "Please enter your email address."

                );

            }


            if (

                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/

                    .test(email)

            ) {

                throw new Error(

                    "Please enter a valid email address."

                );

            }

        }


        if (

            registrationMethod ===
            "phone"

        ) {


            const phone =
                phoneInput.value.trim();


            if (!phone) {

                throw new Error(

                    "Please enter your phone number."

                );

            }


            if (

                !/^[0-9]{10,15}$/

                    .test(phone)

            ) {

                throw new Error(

                    "Please enter a valid phone number."

                );

            }

        }


        if (password.length < 8) {

            throw new Error(

                "Password must be at least 8 characters."

            );

        }


        if (!/[a-z]/.test(password)) {

            throw new Error(

                "Password must contain a lowercase letter."

            );

        }


        if (!/[A-Z]/.test(password)) {

            throw new Error(

                "Password must contain an uppercase letter."

            );

        }


        if (!/[0-9]/.test(password)) {

            throw new Error(

                "Password must contain a number."

            );

        }


        if (password !== confirm) {

            throw new Error(

                "Passwords do not match."

            );

        }


        return {

            email:

                registrationMethod ===
                "email"

                    ? emailInput.value.trim()

                    : null,


            phone:

                registrationMethod ===
                "phone"

                    ? phoneInput.value.trim()

                    : null,


            password:

                password,


            method:

                registrationMethod

        };

    }


    /* ========================================================
       POLL APPWRITE EXECUTION RESULT
    ======================================================== */

    async function pollExecution(

        executionId,

        maxAttempts = 20,

        delay = 1000

    ) {


        debugLog(

            "POLLING EXECUTION RESULT..."

        );


        for (

            let attempt = 1;

            attempt <= maxAttempts;

            attempt++

        ) {


            debugLog(

                `POLL ATTEMPT ${attempt}/${maxAttempts}`

            );


            try {


                const result =

                    await RemadefAPI.getExecution(

                        executionId

                    );


                debugLog(

                    "EXECUTION STATUS: " +

                    (

                        result.status ||
                        "UNKNOWN"

                    )

                );


                if (

                    result.status ===
                    "completed"

                ) {


                    debugLog(

                        "EXECUTION COMPLETED"

                    );


                    let body =
                        result.responseBody;


                    if (

                        typeof body ===
                        "string"

                    ) {


                        try {

                            body =
                                JSON.parse(body);

                        }

                        catch {

                            body = {

                                success:
                                    true,

                                message:
                                    body

                            };

                        }

                    }


                    return body;

                }


                if (

                    result.status ===
                    "failed"

                ) {

                    throw new Error(

                        "Registration execution failed."

                    );

                }


            }

            catch (error) {


                debugLog(

                    "POLL ERROR: " +
                    error.message

                );


                throw error;

            }


            await new Promise(

                resolve =>

                    setTimeout(

                        resolve,

                        delay

                    )

            );

        }


        throw new Error(

            "Registration is taking too long. Please check again."

        );

    }


    /* ========================================================
       FORM SUBMISSION
    ======================================================== */

    form.addEventListener(

        "submit",

        async event => {


            event.preventDefault();


            clearMessages();


            submitButton.disabled =
                true;


            submitButton.textContent =
                "Creating account...";


            debugReplace(

                "REGISTRATION STARTED"

            );


            try {


                const payload =
                    validateForm();


                debugLog(

                    "VALIDATION PASSED"

                );


                debugLog(

                    "SENDING REGISTRATION REQUEST"

                );


                const execution =

                    await RemadefAPI.register(

                        payload

                    );


                debugLog(

                    "EXECUTION CREATED"

                );


                debugLog(

                    "ID: " +

                    (

                        execution.$id ||

                        execution.id ||

                        "UNKNOWN"

                    )

                );


                const executionId =

                    execution.$id ||

                    execution.id;


                if (!executionId) {

                    throw new Error(

                        "No execution ID was returned by Appwrite."

                    );

                }


                const response =

                    await pollExecution(

                        executionId

                    );


                if (

                    response &&
                    response.success === false

                ) {

                    throw new Error(

                        response.error ||

                        "Registration failed."

                    );

                }


                showSuccess(

                    response.message ||

                    "Your REMADEF account was created successfully."

                );


                debugLog(

                    "REGISTRATION COMPLETED SUCCESSFULLY"

                );


                form.reset();


                setMethod(

                    "email"

                );


                updatePasswordStrength();


            }

            catch (error) {


                debugLog(

                    "REGISTRATION ERROR"

                );


                debugLog(

                    error.message

                );


                showError(

                    error.message ||

                    "Registration failed. Please try again."

                );

            }

            finally {


                submitButton.disabled =
                    false;


                submitButton.textContent =

                    "Create REMADEF Account";

            }

        }

    );


    /* ========================================================
       INITIAL STATE
    ======================================================== */

    setMethod(

        "email"

    );


    updatePasswordStrength();


    debugReplace(

        "REMADEF REGISTRATION READY"

    );


})();
