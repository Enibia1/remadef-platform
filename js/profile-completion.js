/* =====================================================
   REMADEF PROFILE COMPLETION JS
   ===================================================== */



// ================================================
// CONFIGURATION
// ================================================


const REMADEF_API = "YOUR_APPWRITE_FUNCTION_URL";



let currentUser = null;





// ================================================
// INITIALIZE
// ================================================


document.addEventListener(
    "DOMContentLoaded",
    async () => {


        await initializeProfile();



        document
        .getElementById("profileForm")
        .addEventListener(
            "submit",
            saveProfile
        );


    }
);






// ================================================
// APP INITIALIZATION
// ================================================


async function initializeProfile(){


    try {


        const { Client, Account } = Appwrite;



        const client = new Client();


        client
        .setEndpoint(
            "https://fra.cloud.appwrite.io/v1"
        )
        .setProject(
            "6a634fdc00148a907132"
        );



        const account = new Account(
            client
        );



        currentUser =
            await account.get();



        await loadProfile();



    }

    catch(error){


        console.error(
            error
        );


        showMessage(
            "Please login to continue."
        );


        window.location.href =
            "login.html";


    }


}







// ================================================
// LOAD PROFILE
// ================================================


async function loadProfile(){


    try{


        const response =
            await fetch(
                `${REMADEF_API}/api/profile`,
                {

                    method:"GET",

                    headers:{

                        "X-Appwrite-Project":
                        "6a634fdc00148a907132"

                    }

                }
            );



        const result =
            await response.json();




        if(
            result.success
        ){


            fillProfile(
                result.data
            );


            updateProgress(
                result.data.profile_completion
            );


        }



    }


    catch(error){


        console.error(
            "Load profile error:",
            error
        );


    }


}








// ================================================
// FILL FORM
// ================================================


function fillProfile(profile){



const fields = [

"first_name",
"last_name",
"display_name",
"date_of_birth",
"gender",
"email",
"phone",
"country",
"state",
"city",
"headline",
"about",
"skills",
"education_level",
"institution"

];



fields.forEach(
    field => {


        const element =
        document.getElementById(
            field
        );


        if(
            element &&
            profile[field] !== undefined
        ){


            element.value =
            profile[field] || "";


        }


    }
);


}








// ================================================
// SAVE PROFILE
// ================================================


async function saveProfile(event){


event.preventDefault();



showLoading();



try{


const profileData = {


first_name:
value("first_name"),


last_name:
value("last_name"),


display_name:
value("display_name"),


date_of_birth:
value("date_of_birth"),


gender:
value("gender"),


email:
value("email"),


phone:
value("phone"),


country:
value("country"),


state:
value("state"),


city:
value("city"),


headline:
value("headline"),


about:
value("about"),


skills:
value("skills"),


education_level:
value("education_level"),


institution:
value("institution")


};





const response =
await fetch(

`${REMADEF_API}/api/profile`,

{

method:"PUT",

headers:{


"Content-Type":
"application/json",


"X-Appwrite-Project":
"6a634fdc00148a907132"


},


body:
JSON.stringify(
    profileData
)

}

);





const result =
await response.json();





if(result.success){


updateProgress(
result.data.profile_completion
);


showMessage(
"Profile saved successfully."
);


}

else{


showMessage(
result.message
);


}



}


catch(error){


console.error(
error
);


showMessage(
"Unable to save profile."
);


}


finally{


hideLoading();


}



}








// ================================================
// HELPERS
// ================================================


function value(id){


const element =
document.getElementById(id);


return element ?
element.value.trim()
:
"";


}





function updateProgress(percent){



const bar =
document.getElementById(
"profileProgress"
);



const text =
document.getElementById(
"progressText"
);



if(bar){

bar.style.width =
percent + "%";

}


if(text){

text.textContent =
percent + "%";

}



}





function showLoading(){


const overlay =
document.getElementById(
"loadingOverlay"
);



if(overlay){

overlay.classList.remove(
"hidden"
);

}


}





function hideLoading(){


const overlay =
document.getElementById(
"loadingOverlay"
);



if(overlay){

overlay.classList.add(
"hidden"
);

}


}





function showMessage(message){


alert(
message
);


}
