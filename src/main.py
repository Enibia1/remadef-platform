# ============================================================
# REMADEF PLATFORM API
# Central API Router
# Appwrite Cloud Function
# ============================================================

import json
import re

from appwrite.id import ID

from auth import get_users
from profile import get_profile, save_profile


# ============================================================
# CORS
# ============================================================

CORS_HEADERS = {

    "Access-Control-Allow-Origin":
        "https://enibia1.github.io",

    "Access-Control-Allow-Methods":
        "GET, POST, PUT, OPTIONS",

    "Access-Control-Allow-Headers":
        "Content-Type, X-Appwrite-User-Id",

    "Access-Control-Max-Age":
        "86400"

}


# ============================================================
# RESPONSE
# ============================================================

def response(
    context,
    data,
    status=200
):

    return context.res.json(

        data,

        status,

        CORS_HEADERS

    )


# ============================================================
# READ REQUEST BODY
# ============================================================

def get_body(request):

    body = request.body or {}

    if isinstance(body, dict):

        return body


    if isinstance(body, str):

        try:

            return json.loads(body)

        except json.JSONDecodeError:

            return None


    return None


# ============================================================
# REGISTER ACCOUNT
# ============================================================

def register_account(context):

    body = get_body(

        context.req

    )


    if body is None:

        return response(

            context,

            {

                "success": False,

                "error":
                    "Invalid request body"

            },

            400

        )


    email = str(

        body.get(

            "email",

            ""

        )

    ).strip().lower()


    password = str(

        body.get(

            "password",

            ""

        )

    )


    # ========================================================
    # VALIDATE EMAIL
    # ========================================================

    if not email:

        return response(

            context,

            {

                "success": False,

                "error":
                    "Email is required"

            },

            400

        )


    if not re.match(

        r"^[^@\s]+@[^@\s]+\.[^@\s]+$",

        email

    ):

        return response(

            context,

            {

                "success": False,

                "error":
                    "Invalid email address"

            },

            400

        )


    # ========================================================
    # VALIDATE PASSWORD
    # ========================================================

    if len(password) < 8:

        return response(

            context,

            {

                "success": False,

                "error":
                    "Password must be at least 8 characters"

            },

            400

        )


    try:

        users = get_users()


        user = users.create(

            user_id=ID.unique(),

            email=email,

            password=password

        )


        return response(

            context,

            {

                "success": True,

                "message":
                    "REMADEF account created successfully",

                "account": {

                    "id":
                        user.id,

                    "email":
                        user.email

                },

                "next": {

                    "action":
                        "login",

                    "path":
                        "login.html"

                }

            },

            201

        )


    except Exception as error:

        error_message = str(

            error

        )


        if (

            "already exists"

            in

            error_message.lower()

            or

            "user_already_exists"

            in

            error_message.lower()

        ):

            return response(

                context,

                {

                    "success": False,

                    "error":
                        "An account with this email already exists"

                },

                409

            )


        context.log(

            "REGISTRATION ERROR: "

            + error_message

        )


        return response(

            context,

            {

                "success": False,

                "error":
                    "Unable to create account"

            },

            500

        )


# ============================================================
# MAIN ROUTER
# ============================================================

def main(context):

    request = context.req

    method = request.method

    path = request.path or "/"


    # ========================================================
    # CORS PREFLIGHT
    # ========================================================

    if method == "OPTIONS":

        return response(

            context,

            {

                "success": True

            },

            204

        )


    # ========================================================
    # API STATUS
    # ========================================================

    if method == "GET" and path == "/":

        return response(

            context,

            {

                "success": True,

                "service":
                    "REMADEF Platform API",

                "status":
                    "online",

                "version":
                    "2.0.0"

            }

        )


    # ========================================================
    # HEALTH CHECK
    # ========================================================

    if method == "GET" and path == "/api/health":

        return response(

            context,

            {

                "success": True,

                "service":
                    "REMADEF Platform API",

                "status":
                    "healthy"

            }

        )


    # ========================================================
    # REGISTER
    # ========================================================

    if (

        method == "POST"

        and

        path == "/api/register"

    ):

        return register_account(

            context

        )


    # ========================================================
    # GET PROFILE
    # ========================================================

    if (

        method == "GET"

        and

        path == "/api/profile"

    ):

        return get_profile(

            context

        )


    # ========================================================
    # CREATE PROFILE
    # ========================================================

    if (

        method == "POST"

        and

        path == "/api/profile"

    ):

        return save_profile(

            context

        )


    # ========================================================
    # UPDATE PROFILE
    # ========================================================

    if (

        method == "PUT"

        and

        path == "/api/profile"

    ):

        return save_profile(

            context

        )


    # ========================================================
    # UNKNOWN ENDPOINT
    # ========================================================

    return response(

        context,

        {

            "success": False,

            "error":
                "Endpoint not found",

            "path":
                path,

            "method":
                method

        },

        404

    )
