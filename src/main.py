# ============================================================
# REMADEF PLATFORM API
# ============================================================

import json

from appwrite.services.users import Users

from profile import (

    get_profile_by_account_id,

    create_profile,

    update_profile,

    calculate_profile_completion

)


# ============================================================
# RESPONSE HELPERS
# ============================================================

def response(
    data,
    status=200
):

    return {

        "statusCode":
            status,

        "headers": {

            "Content-Type":
                "application/json",

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Headers":
                "Content-Type",

            "Access-Control-Allow-Methods":
                "GET, POST, PUT, OPTIONS"

        },

        "body":
            json.dumps(

                data,

                default=str

            )

    }


# ============================================================
# REQUEST BODY
# ============================================================

def get_body(
    req
):

    body = req.get(
        "body"
    )

    if not body:

        return {}

    if isinstance(
        body,
        dict
    ):

        return body

    try:

        return json.loads(
            body
        )

    except Exception:

        return {}


# ============================================================
# GET CURRENT USER
# ============================================================

def get_current_user():

    # The function's dynamic API key
    # allows the function to use Appwrite
    # server-side services.

    from appwrite.client import Client

    import os

    client = Client()

    client.set_endpoint(

        os.environ.get(

            "APPWRITE_FUNCTION_ENDPOINT",

            "https://fra.cloud.appwrite.io/v1"

        )

    )

    client.set_project(

        os.environ.get(

            "APPWRITE_PROJECT_ID",

            "6a634fdc00148a907132"

        )

    )

    client.set_key(

        os.environ.get(

            "APPWRITE_FUNCTION_API_KEY"

        )

    )

    users = Users(
        client
    )

    return users


# ============================================================
# MAIN FUNCTION
# ============================================================

def main(
    req,
    res
):

    method = (

        req.get(
            "method"
        )

        or "GET"

    ).upper()


    path = (

        req.get(
            "path"
        )

        or "/"

    )


    # --------------------------------------------------------
    # CORS PREFLIGHT
    # --------------------------------------------------------

    if method == "OPTIONS":

        return response(
            {
                "success":
                    True
            }
        )


    # --------------------------------------------------------
    # HEALTH CHECK
    # --------------------------------------------------------

    if (

        path == "/"

        or path == "/api/health"

    ):

        return response(

            {

                "success":
                    True,

                "service":
                    "REMADEF Platform API",

                "status":
                    "online"

            }

        )


    # --------------------------------------------------------
    # GET PROFILE
    # --------------------------------------------------------

    if (

        path == "/api/profile"

        and method == "GET"

    ):

        account_id = (

            req.get(
                "headers",
                {}
            ).get(
                "x-account-id"
            )

        )


        if not account_id:

            return response(

                {

                    "success":
                        False,

                    "error":
                        "Account ID is required."

                },

                400

            )


        profile = (

            get_profile_by_account_id(

                account_id

            )

        )


        if not profile:

            return response(

                {

                    "success":
                        True,

                    "profile":
                        None

                }

            )


        return response(

            {

                "success":
                    True,

                "profile":
                    profile

            }

        )


    # --------------------------------------------------------
    # UPDATE PROFILE
    # --------------------------------------------------------

    if (

        path == "/api/profile"

        and method == "PUT"

    ):

        account_id = (

            req.get(
                "headers",
                {}
            ).get(
                "x-account-id"
            )

        )


        if not account_id:

            return response(

                {

                    "success":
                        False,

                    "error":
                        "Account ID is required."

                },

                400

            )


        profile_data = get_body(
            req
        )


        if not profile_data:

            return response(

                {

                    "success":
                        False,

                    "error":
                        "Profile data is required."

                },

                400

            )


        completion = (

            calculate_profile_completion(

                profile_data

            )

        )


        profile_data[

            "profile_completion"

        ] = completion


        saved_profile = (

            update_profile(

                account_id,

                profile_data

            )

        )


        return response(

            {

                "success":
                    True,

                "message":
                    "Profile saved successfully.",

                "profile":
                    saved_profile

            }

        )


    # --------------------------------------------------------
    # UNKNOWN ROUTE
    # --------------------------------------------------------

    return response(

        {

            "success":
                False,

            "error":
                "Route not found."

        },

        404

    )
