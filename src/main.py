# ============================================================
# REMADEF PLATFORM API
# ============================================================

import json
import traceback

from profile import (

    get_profile,

    save_profile,

    calculate_completion

)


# ============================================================
# RESPONSE HELPERS
# ============================================================

def json_response(

    body,

    status_code=200

):

    return {

        "statusCode": status_code,

        "headers": {

            "Content-Type":
                "application/json",

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Headers":
                "Content-Type, X-Appwrite-User-Id",

            "Access-Control-Allow-Methods":
                "GET, PUT, POST, OPTIONS"

        },

        "body": json.dumps(

            body,

            ensure_ascii=False

        )

    }


# ============================================================
# GET REQUEST BODY
# ============================================================

def get_body(req):

    body = req.body


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
# GET USER ID
# ============================================================

def get_user_id(req):

    headers = req.headers or {}


    user_id = (

        headers.get(
            "x-appwrite-user-id"
        )

        or

        headers.get(
            "X-Appwrite-User-Id"
        )

    )


    if user_id:

        return str(
            user_id
        ).strip()


    return None


# ============================================================
# MAIN FUNCTION
# ============================================================

def main(req, res):

    try:

        method = (

            req.method or

            "GET"

        ).upper()


        path = (

            req.path or

            "/"

        )


        # ====================================================
        # CORS PREFLIGHT
        # ====================================================

        if method == "OPTIONS":

            return json_response(

                {

                    "success":
                        True

                }

            )


        # ====================================================
        # ROOT
        # ====================================================

        if path == "/":

            return json_response(

                {

                    "success":
                        True,

                    "service":
                        "REMADEF Platform API",

                    "status":
                        "online"

                }

            )


        # ====================================================
        # HEALTH
        # ====================================================

        if (

            path == "/api/health"

            and

            method == "GET"

        ):

            return json_response(

                {

                    "success":
                        True,

                    "status":
                        "healthy"

                }

            )


        # ====================================================
        # USER ID
        # ====================================================

        user_id = get_user_id(
            req
        )


        if not user_id:

            return json_response(

                {

                    "success":
                        False,

                    "error":
                        "User authentication is required."

                },

                401

            )


        # ====================================================
        # GET PROFILE
        # ====================================================

        if (

            path == "/api/profile"

            and

            method == "GET"

        ):


            profile = get_profile(
                user_id
            )


            if not profile:

                return json_response(

                    {

                        "success":
                            True,

                        "profile":
                            None,

                        "message":
                            "Profile not found."

                    },

                    200

                )


            return json_response(

                {

                    "success":
                        True,

                    "profile":
                        profile,

                    "completion":
                        calculate_completion(
                            profile
                        )

                }

            )


        # ====================================================
        # SAVE PROFILE
        # ====================================================

        if (

            path == "/api/profile"

            and

            method in [

                "PUT",

                "POST"

            ]

        ):


            body = get_body(
                req
            )


            if not body:

                return json_response(

                    {

                        "success":
                            False,

                        "error":
                            "Profile data is required."

                    },

                    400

                )


            profile = save_profile(

                user_id,

                body

            )


            return json_response(

                {

                    "success":
                        True,

                    "message":
                        "Profile saved successfully.",

                    "profile":
                        profile,

                    "completion":
                        calculate_completion(
                            profile
                        )

                },

                200

            )


        # ====================================================
        # NOT FOUND
        # ====================================================

        return json_response(

            {

                "success":
                    False,

                "error":
                    "Endpoint not found."

            },

            404

        )


    except Exception as error:


        print(

            "REMADEF API ERROR:",

            str(error)

        )


        traceback.print_exc()


        return json_response(

            {

                "success":
                    False,

                "error":
                    str(error)

            },

            500

        )
