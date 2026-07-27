"use strict";

/*
============================================================
REMADEF PROFILE
Authenticated Profile Controller
============================================================
*/

const API_URL =
    "https://6a6380f50016f677984e.fra.appwrite.run/";
// Replace with your actual deployed REMADEF Platform API URL


// ============================================================
// DOM
// ============================================================

const profileName =
    document.getElementById("profile-name");

const profileEmail =
    document.getElementById("profile-email");

const profileHeadline =
    document.getElementById("profile-headline");

const profileAbout =
    document.getElementById("profile-about");

const profileLocation =
    document.getElementById("profile-location");

const profileSkills =
    document.getElementById("profile-skills");

const profileCompletion =
    document.getElementById("profile-completion");

const editProfileButton =
    document.getElementById("edit-profile");


// ============================================================
// ACCOUNT
// ============================================================

function getAccount() {

    const savedAccount =
        localStorage.getItem(
            "remadef_account"
        );

    if (!savedAccount) {

        window.location.replace(
            "index.html"
        );

        return null;

    }

    try {

        return JSON.parse(
            savedAccount
        );

    }

    catch (error) {

        localStorage.removeItem(
            "remadef_account"
        );

        window.location.replace(
            "index.html"
        );

        return null;

    }

}


const account =
    getAccount();


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
                        "application/json",

                    "X-Appwrite-User-Id":

                        account.id

                },

                body:

                    options.body

                        ? JSON.stringify(
                            options.body
                        )

                        : undefined

            }

        );


    const data =

        await response.json();


    if (!response.ok) {

        throw new Error(

            data.error ||

            "Request failed"

        );

    }


    return data;

}


// ============================================================
// LOAD PROFILE
// ============================================================

async function loadProfile() {

    try {

        const result =

            await apiRequest(

                "/api/profile"

            );


        const profile =

            result.profile;


        renderProfile(

            profile

        );


    }

    catch (error) {

        console.error(

            "PROFILE LOAD ERROR:",

            error

        );


        // Fallback to localStorage

        loadLocalProfile();

    }

}


// ============================================================
// LOCAL PROFILE FALLBACK
// ============================================================

function loadLocalProfile() {

    const savedProfile =

        localStorage.getItem(

            "remadef_profile"

        );


    if (!savedProfile) {

        renderEmptyProfile();

        return;

    }


    try {

        const profile =

            JSON.parse(

                savedProfile

            );


        renderProfile(

            profile

        );

    }

    catch (error) {

        renderEmptyProfile();

    }

}


// ============================================================
// RENDER PROFILE
// ============================================================

function renderProfile(

    profile

) {

    if (!profile) {

        renderEmptyProfile();

        return;

    }


    const firstName =

        profile.first_name ||

        profile.firstName ||

        "";


    const lastName =

        profile.last_name ||

        profile.lastName ||

        "";


    const displayName =

        profile.display_name ||

        profile.displayName ||

        `${firstName} ${lastName}`.trim();


    const headline =

        profile.headline ||

        "";


    const about =

        profile.about ||

        profile.bio ||

        "";


    const city =

        profile.city ||

        "";


    const state =

        profile.state ||

        "";


    const country =

        profile.country ||

        "";


    const skills =

        profile.skills ||

        [];


    if (profileName) {

        profileName.textContent =

            displayName ||

            "REMADEF Member";

    }


    if (profileEmail) {

        profileEmail.textContent =

            profile.email ||

            account.email ||

            "";

    }


    if (profileHeadline) {

        profileHeadline.textContent =

            headline ||

            "Add a professional headline";

    }


    if (profileAbout) {

        profileAbout.textContent =

            about ||

            "Tell the REMADEF ecosystem about yourself.";

    }


    if (profileLocation) {

        profileLocation.textContent =

            [

                city,

                state,

                country

            ]

                .filter(Boolean)

                .join(", ") ||

            "Location not added";

    }


    renderSkills(

        skills

    );


    calculateCompletion(

        profile

    );

}


// ============================================================
// EMPTY PROFILE
// ============================================================

function renderEmptyProfile() {

    if (profileName) {

        profileName.textContent =

            "Complete your profile";

    }


    if (profileEmail) {

        profileEmail.textContent =

            account.email ||

            "";

    }


    if (profileHeadline) {

        profileHeadline.textContent =

            "Add a professional headline";

    }


    if (profileAbout) {

        profileAbout.textContent =

            "Complete your profile to connect with opportunities.";

    }


    if (profileLocation) {

        profileLocation.textContent =

            "Location not added";

    }


    renderSkills([]);

    calculateCompletion({});

}


// ============================================================
// SKILLS
// ============================================================

function renderSkills(

    skills

) {

    if (!profileSkills) return;


    profileSkills.innerHTML = "";


    if (

        !Array.isArray(skills) ||

        skills.length === 0

    ) {

        profileSkills.textContent =

            "No skills added yet.";

        return;

    }


    skills.forEach(

        function (skill) {

            const tag =

                document.createElement(

                    "span"

                );


            tag.className =

                "skill-tag";


            tag.textContent =

                skill;


            profileSkills.appendChild(

                tag

            );

        }

    );

}


// ============================================================
// PROFILE COMPLETION
// ============================================================

function calculateCompletion(

    profile

) {

    const fields = [

        profile.first_name ||

        profile.firstName,


        profile.last_name ||

        profile.lastName,


        profile.display_name ||

        profile.displayName,


        profile.date_of_birth ||

        profile.dateOfBirth,


        profile.gender,


        profile.country,


        profile.state,


        profile.city,


        profile.phone,


        profile.headline,


        profile.about,


        profile.education_level ||

        profile.educationLevel,


        profile.institution,


        profile.skills &&

        profile.skills.length > 0

    ];


    const completed =

        fields.filter(

            Boolean

        ).length;


    const percentage =

        Math.round(

            (

                completed /

                fields.length

            ) *

            100

        );


    if (profileCompletion) {

        profileCompletion.textContent =

            percentage + "%";

    }

}


// ============================================================
// EDIT PROFILE
// ============================================================

if (editProfileButton) {

    editProfileButton.addEventListener(

        "click",

        function () {

            window.location.href =

                "profile-completion.html";

        }

    );

}


// ============================================================
// START
// ============================================================

if (account) {

    loadProfile();

}
