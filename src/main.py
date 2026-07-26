import json
import re
import os

from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.id import ID


# ============================================================
# CORS HEADERS
# ============================================================

CORS_HEADERS = {

    "Access-Control-Allow-Origin":
        "https://enibia1.github.io",

    "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS",

    "Access-Control-Allow-Headers":
        "Content-Type",

    "Access-Control-Max-Age":
        "86400"

}


# ============================================================
# STANDARD RESPONSE
# ============================================================

def response(context, data, status=200):

    return context.res.json(

        data,

        status,

        CORS_HEADERS

    )


# ============================================================
# APPWRITE CLIENT
# ============================================================

def get_appwrite_users():

    client = Client()

    client.set_endpoint(

        os.environ.get(

            "APPWRITE_FUNCTION_ENDPOINT",

            "https://fra.cloud.appwrite.io/v1"

        )

    )

    client.set_project(

        os.environ.get(

            "APPWRITE_FUNCTION_PROJECT_ID"

        )

    )

    client.set_key(

        os.environ.get(

            "APPWRITE_API_KEY"

        )

    )

    return Users(client)


# ============================================================
# MAIN FUNCTION
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
                    "1.0.0"

            }

        )


    # ========================================================
    # API HEALTH
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
    # ACCOUNT REGISTRATION
    # ========================================================

    if method == "POST" and path == "/api/register":

        try:


            # ------------------------------------------------
            # READ REQUEST BODY
            # ------------------------------------------------

            body = request.body or {}


            if isinstance(body, str):

                body = json.loads(body)


            if not isinstance(body, dict):

                return response(

                    context,

                    {

                        "success": False,

                        "error":
                            "Invalid request body"

                    },

                    400

                )


            # ------------------------------------------------
            # EXTRACT REGISTRATION DATA
            # ------------------------------------------------

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


            # ------------------------------------------------
            # EMAIL VALIDATION
            # ------------------------------------------------

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


            # ------------------------------------------------
            # PASSWORD VALIDATION
            # ------------------------------------------------

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


            # =================================================
            # CREATE REAL APPWRITE AUTH USER
            # =================================================

            users = get_appwrite_users()


            user = users.create(

                user_id=ID.unique(),

                email=email,

                password=password

            )


            # =================================================
            # RETURN ACCOUNT INFORMATION
            # =================================================

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
                            "complete_profile",

                        "path":
                            "/profile.html"

                    }

                },

                201

            )


        # =====================================================
        # DUPLICATE EMAIL / APPWRITE ERROR
        # =====================================================

        except Exception as error:


            error_message = str(error)


            if (

                "already exists"
                in error_message.lower()

                or

                "user_already_exists"
                in error_message.lower()

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
