"use strict";

/*
============================================================
REMADEF PROFILE MANAGEMENT
============================================================

Responsibilities:

1. Verify the user is logged into Appwrite
2. Load the current Appwrite user
3. Load the user's profile from the REMADEF API
4. Populate the profile form
5. Manage skills
6. Calculate profile completion
7. Save profile to the REMADEF API
8. Redirect to profile.html after saving

============================================================
*/


// ============================================================
// CONFIGURATION
// ============================================================

const PROJECT_ID =
    "6a5bc178003a2529271e";


const APPWRITE_ENDPOINT =
    "https://sfo.cloud.appwrite.io/v1";


const API_URL =
    "https://6a6380f50016f677984e.fra.appwrite.run";


// IMPORTANT:
// Replace the API_URL above with your real deployed
// REMADEF Platform API function URL.
//
// Example:
//
// const API_URL =
//     "https://YOUR-FUNCTION-DOMAIN/api";


// ============================================================
// APPWRITE CLIENT
// ============================================================

const client = new Appwrite.Client();


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

        "profile-form"

    );


const errorBox =

    document.getElementById(

        "error"

    );


const successBox =

    document.getElementById(

        "success"

    );


const emailInput =

    document.getElementById(

        "email"

    );


const phoneInput =

    document.getElementById(

        "phone"

    );


const skillsInput =

    document.getElementById(

        "skills-input"

    );


const addSkillButton =

    document.getElementById(

        "add-skill"

    );


const skillsList =

    document.getElementById(

        "skills-list"

    );


const progressBar =

    document.getElementById(

        "progress-bar"

    );


const progressPercent =

    document.getElementById(

        "progress-percent"

    );


const saveButton =

    document.getElementById(

        "save-profile"

    );


// ============================================================
// STATE
// ============================================================

let currentUser = null;


let skills = [];


// ============================================================
// FORM FIELD IDS
// ============================================================

const FIELD_IDS = [

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


// ============================================================
// MESSAGE HELPERS
// ============================================================

function showError(message) {


    successBox.style.display =

        "none";


    errorBox.textContent =

        message;


    errorBox.style.display =

        "block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


function showSuccess(message) {


    errorBox.style.display =

        "none";


    successBox.textContent =

        message;


    successBox.style.display =

        "block";

}


function clearMessages() {


    errorBox.style.display =

        "none";


    successBox.style.display =

        "none";

}


// ============================================================
// API REQUEST
// ============================================================

async function apiRequest(

    endpoint,

    options = {}

) {


    const response =

        await fetch(

            API_URL + endpoint,

            {

                method:

                    options.method ||

                    "GET",


                headers: {

                    "Content-Type":

                        "application/json"

                },


                body:

                    options.body

                        ? JSON.stringify(

                            options.body

                        )

                        : undefined

            }

        );


    let data;


    try {

        data =

            await response.json();

    }

    catch (error) {

        throw new Error(

            "The server returned an invalid response."

        );

    }


    if (!response.ok) {


        throw new Error(

            data.error ||

            "Unable to complete request."

        );

    }


    return data;

}


// ============================================================
// LOAD CURRENT APPWRITE USER
// ============================================================

async function loadCurrentUser() {


    try {


        currentUser =

            await account.get();


        if (

            emailInput

        ) {

            emailInput.value =

                currentUser.email ||

                "";

        }


    }

    catch (error) {


        console.error(

            "APPWRITE USER ERROR:",

            error

        );


        window.location.replace(

            "login.html"

        );

    }

}


// ============================================================
// LOAD PROFILE FROM API
// ============================================================

async function loadProfile() {


    try {


        const result =

            await apiRequest(

                "/api/profile",

                {

                    method:

                        "GET"

                }

            );


        if (

            result.success &&

            result.profile

        ) {


            populateForm(

                result.profile

            );

        }


    }

    catch (error) {


        // A profile may not exist yet.
        // This is normal for a new account.

        console.info(

            "No existing profile found."

        );

    }

}


// ============================================================
// POPULATE FORM
// ============================================================

function populateForm(

    profile

) {


    FIELD_IDS.forEach(

        function (id) {


            const element =

                document.getElementById(

                    id

                );


            if (!element) {

                return;

            }


            const key =

                element.name;


            if (

                profile[key] !==

                undefined &&

                profile[key] !==

                null

            ) {

                element.value =

                    profile[key];

            }

        }

    );


    if (

        Array.isArray(

            profile.skills

        )

    ) {

        skills =

            profile.skills.slice(

                0,

                20

            );

    }


    renderSkills();


    updateProgress();

}


// ============================================================
// SKILLS
// ============================================================

function addSkill() {


    const value =

        skillsInput.value.trim();


    if (!value) {

        return;

    }


    if (

        skills.some(

            function (skill) {

                return skill.toLowerCase() ===

                    value.toLowerCase();

            }

        )

    ) {


        skillsInput.value = "";


        return;

    }


    if (

        skills.length >= 20

    ) {


        showError(

            "You can add a maximum of 20 skills."

        );


        return;

    }


    skills.push(

        value

    );


    skillsInput.value = "";


    renderSkills();


    updateProgress();

}


function renderSkills() {


    skillsList.innerHTML = "";


    skills.forEach(

        function (

            skill,

            index

        ) {


            const tag =

                document.createElement(

                    "div"

                );


            tag.className =

                "skill-tag";


            const text =

                document.createElement(

                    "span"

                );


            text.textContent =

                skill;


            const removeButton =

                document.createElement(

                    "button"

                );


            removeButton.type =

                "button";


            removeButton.className =

                "remove-skill";


            removeButton.textContent =

                "×";


            removeButton.setAttribute(

                "aria-label",

                "Remove " + skill

            );


            removeButton.addEventListener(

                "click",

                function () {


                    skills.splice(

                        index,

                        1

                    );


                    renderSkills();


                    updateProgress();

                }

            );


            tag.appendChild(

                text

            );


            tag.appendChild(

                removeButton

            );


            skillsList.appendChild(

                tag

            );

        }

    );

}


// ============================================================
// SKILL EVENTS
// ============================================================

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


// ============================================================
// PROFILE COMPLETION
// ============================================================

function updateProgress() {


    let completed = 0;


    FIELD_IDS.forEach(

        function (id) {


            const element =

                document.getElementById(

                    id

                );


            if (

                element &&

                element.value.trim()

            ) {

                completed++;

            }

        }

    );


    if (

        skills.length > 0

    ) {

        completed++;

    }


    const totalFields =

        FIELD_IDS.length + 1;


    const percentage =

        Math.round(

            (

                completed /

                totalFields

            ) * 100

        );


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


// ============================================================
// PROFILE DATA
// ============================================================

function collectProfileData() {


    return {


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

            phoneInput.value.trim(),


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


            skills.slice(),


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

}


// ============================================================
// VALIDATE PROFILE
// ============================================================

function validateProfile(

    data

) {


    if (

        !data.first_name

    ) {


        return (

            "Please enter your first name."

        );

    }


    if (

        !data.last_name

    ) {


        return (

            "Please enter your last name."

        );

    }


    if (

        data.first_name.length < 2

    ) {


        return (

            "First name must be at least 2 characters."

        );

    }


    if (

        data.last_name.length < 2

    ) {


        return (

            "Last name must be at least 2 characters."

        );

    }


    return null;

}


// ============================================================
// SAVE PROFILE
// ============================================================

form.addEventListener(

    "submit",

    async function (event) {


        event.preventDefault();


        clearMessages();


        const profileData =

            collectProfileData();


        const validationError =

            validateProfile(

                profileData

            );


        if (

            validationError

        ) {


            showError(

                validationError

            );


            return;

        }


        saveButton.disabled =

            true;


        saveButton.textContent =

            "Saving...";


        try {


            const result =

                await apiRequest(

                    "/api/profile",

                    {

                        method:

                            "PUT",


                        body:

                            profileData

                    }

                );


            if (

                !result.success

            ) {


                throw new Error(

                    result.error ||

                    "Unable to save profile."

                );

            }


            showSuccess(

                "Your profile has been saved successfully."

            );


            setTimeout(

                function () {


                    window.location.replace(

                        "profile.html"

                    );

                },

                900

            );

        }


        catch (error) {


            console.error(

                "PROFILE SAVE ERROR:",

                error

            );


            showError(

                error.message ||

                "Unable to save your profile."

            );


            saveButton.disabled =

                false;


            saveButton.textContent =

                "Save Profile";

        }

    }

);


// ============================================================
// FORM INPUT EVENTS
// ============================================================

form.addEventListener(

    "input",

    updateProgress

);


form.addEventListener(

    "change",

    updateProgress

);


// ============================================================
// INITIALIZE
// ============================================================

async function initialize() {


    saveButton.disabled =

        true;


    try {


        await loadCurrentUser();


        await loadProfile();


        updateProgress();


        saveButton.disabled =

            false;

    }


    catch (error) {


        console.error(

            "PROFILE INITIALIZATION ERROR:",

            error

        );


        showError(

            "Unable to load your profile."

        );


        saveButton.disabled =

            false;

    }

}


initialize();
