"use strict";

/*
============================================================
REMADEF PROFILE COMPLETION
============================================================
*/

const API_URL =
    "https://6a6380f50016f677984e.fra.appwrite.run";

const savedAccount =
    localStorage.getItem("remadef_account");

if (!savedAccount) {

    window.location.href = "index.html";

} else {

    initializeProfile();

}


/* =========================================================
   INITIALIZE
========================================================= */

function initializeProfile() {

    let account;

    try {

        account = JSON.parse(savedAccount);

    } catch (error) {

        window.location.href = "index.html";

        return;

    }


    const form =
        document.getElementById("profile-form");

    const errorBox =
        document.getElementById("error");

    const successBox =
        document.getElementById("success");

    const emailInput =
        document.getElementById("email");

    const phoneInput =
        document.getElementById("phone");

    const skillsInput =
        document.getElementById("skills-input");

    const addSkillButton =
        document.getElementById("add-skill");

    const skillsList =
        document.getElementById("skills-list");

    const progressBar =
        document.getElementById("progress-bar");

    const progressPercent =
        document.getElementById("progress-percent");

    const saveButton =
        document.getElementById("save-profile");


    let skills = [];


    /* =====================================================
       LOAD ACCOUNT CONTACT INFORMATION
    ===================================================== */

    emailInput.value =
        account.email || "";

    phoneInput.value =
        account.phone || "";


    /* =====================================================
       LOAD EXISTING PROFILE
    ===================================================== */

    const savedProfile =
        localStorage.getItem("remadef_profile");


    if (savedProfile) {

        try {

            const profile =
                JSON.parse(savedProfile);


            const fields = [

                "first-name",
                "last-name",
                "display-name",
                "date-of-birth",
                "gender",
                "country",
                "state",
                "city",
                "phone",
                "headline",
                "about",
                "education-level",
                "institution"

            ];


            fields.forEach(function (id) {

                const element =
                    document.getElementById(id);


                if (!element) return;


                const key =
                    element.name;


                if (

                    profile[key] !==
                    undefined

                ) {

                    element.value =
                        profile[key];

                }

            });


            skills =
                Array.isArray(profile.skills)

                    ? profile.skills

                    : [];


            renderSkills();

            updateProgress();

        }

        catch (error) {

            console.warn(
                "Could not load saved profile."
            );

        }

    }


    /* =====================================================
       SKILLS
    ===================================================== */

    function addSkill() {

        const value =
            skillsInput.value.trim();


        if (!value) return;


        if (

            skills.includes(value)

        ) {

            skillsInput.value = "";

            return;

        }


        if (skills.length >= 20) {

            return;

        }


        skills.push(value);

        skillsInput.value = "";

        renderSkills();

        updateProgress();

    }


    function renderSkills() {

        skillsList.innerHTML = "";


        skills.forEach(function (skill, index) {


            const tag =
                document.createElement("div");


            tag.className =
                "skill-tag";


            const text =
                document.createElement("span");


            text.textContent =
                skill;


            const remove =
                document.createElement("button");


            remove.type =
                "button";


            remove.className =
                "remove-skill";


            remove.textContent =
                "×";


            remove.setAttribute(
                "aria-label",
                "Remove " + skill
            );


            remove.addEventListener(
                "click",
                function () {

                    skills.splice(index, 1);

                    renderSkills();

                    updateProgress();

                }
            );


            tag.appendChild(text);

            tag.appendChild(remove);

            skillsList.appendChild(tag);

        });

    }


    addSkillButton.addEventListener(
        "click",
        addSkill
    );


    skillsInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                addSkill();

            }

        }
    );


    /* =====================================================
       PROFILE COMPLETION
    ===================================================== */

    function updateProgress() {

        const fields = [

            "first-name",
            "last-name",
            "display-name",
            "date-of-birth",
            "gender",
            "country",
            "state",
            "city",
            "phone",
            "headline",
            "about",
            "education-level",
            "institution"

        ];


        let completed = 0;


        fields.forEach(function (id) {

            const element =
                document.getElementById(id);


            if (

                element &&
                element.value.trim()

            ) {

                completed++;

            }

        });


        if (skills.length > 0) {

            completed++;

        }


        const percentage =
            Math.round(

                (

                    completed /
                    (fields.length + 1)

                ) * 65

            ) + 35;


        const finalPercentage =
            Math.min(

                percentage,

                100

            );


        progressBar.style.width =
            finalPercentage + "%";


        progressPercent.textContent =
            finalPercentage + "%";

    }


    form.addEventListener(
        "input",
        updateProgress
    );


    /* =====================================================
       ERROR / SUCCESS
    ===================================================== */

    function showError(message) {

        errorBox.textContent =
            message;

        errorBox.style.display =
            "block";


        successBox.style.display =
            "none";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    function showSuccess(message) {

        successBox.textContent =
            message;

        successBox.style.display =
            "block";


        errorBox.style.display =
            "none";

    }


    /* =====================================================
       SUBMIT PROFILE
    ===================================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            errorBox.style.display =
                "none";


            successBox.style.display =
                "none";


            saveButton.disabled =
                true;


            saveButton.textContent =
                "Saving...";


            const profile = {


                account_id:

                    account.id || "",


                email:

                    account.email || "",


                first_name:

                    document

                        .getElementById(
                            "first-name"
                        )

                        .value

                        .trim(),


                last_name:

                    document

                        .getElementById(
                            "last-name"
                        )

                        .value

                        .trim(),


                display_name:

                    document

                        .getElementById(
                            "display-name"
                        )

                        .value

                        .trim(),


                date_of_birth:

                    document

                        .getElementById(
                            "date-of-birth"
                        )

                        .value,


                gender:

                    document

                        .getElementById(
                            "gender"
                        )

                        .value,


                country:

                    document

                        .getElementById(
                            "country"
                        )

                        .value

                        .trim(),


                state:

                    document

                        .getElementById(
                            "state"
                        )

                        .value

                        .trim(),


                city:

                    document

                        .getElementById(
                            "city"
                        )

                        .value

                        .trim(),


                phone:

                    document

                        .getElementById(
                            "phone"
                        )

                        .value

                        .trim(),


                headline:

                    document

                        .getElementById(
                            "headline"
                        )

                        .value

                        .trim(),


                about:

                    document

                        .getElementById(
                            "about"
                        )

                        .value

                        .trim(),


                skills:


                    skills,


                education_level:

                    document

                        .getElementById(
                            "education-level"
                        )

                        .value,


                institution:

                    document

                        .getElementById(
                            "institution"
                        )

                        .value

                        .trim()

            };


            try {


                const response =
                    await fetch(

                        API_URL +
                        "/api/profile",

                        {

                            method:
                                "POST",


                            headers: {

                                "Content-Type":
                                    "application/json"

                            },


                            body:
                                JSON.stringify(
                                    profile
                                )

                        }

                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(

                        data.error ||

                        "Could not save profile."

                    );

                }


                /* =========================================
                   SAVE LOCALLY AS CACHE
                ========================================= */


                localStorage.setItem(

                    "remadef_profile",

                    JSON.stringify(profile)

                );


                showSuccess(

                    "Your profile has been saved successfully."

                );


                saveButton.textContent =
                    "Saved";


                setTimeout(function () {

                    window.location.href =
                        "profile.html";

                }, 1000);


            }

            catch (error) {


                console.error(
                    "Profile save error:",
                    error
                );


                /*
                If API fails, do not silently
                pretend the profile was saved.
                */


                showError(

                    error.message ||

                    "Network error. Please try again."

                );


                saveButton.disabled =
                    false;


                saveButton.textContent =
                    "Save Profile";

            }

        }

    );

}
