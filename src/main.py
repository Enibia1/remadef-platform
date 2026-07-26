# ============================================================
# REMADEF PLATFORM API
# Appwrite Cloud Function - Python
# ============================================================

import json
import re
import os

from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.tables_db import TablesDB
from appwrite.id import ID


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ID = os.environ.get(
    "APPWRITE_FUNCTION_PROJECT_ID"
)

DATABASE_ID = os.environ.get(
    "APPWRITE_DATABASE_ID",
    "6a66577c000d17565b18"
)

TABLE_ID = os.environ.get(
    "APPWRITE_PROFILE_TABLE_ID",
    "profiles"
)


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

def get_client():

    client = Client()

    client.set_endpoint(

        os.environ.get(

            "APPWRITE_FUNCTION_ENDPOINT",

            "https://fra.cloud.appwrite.io/v1"

        )

    )

    client.set_project(

        PROJECT_ID

    )

    client.set_key(

        os.environ.get(

            "APPWRITE_API_KEY"

        )

    )

    return client


# ============================================================
# APPWRITE USERS SERVICE
# ============================================================

def get_appwrite_users():

    return Users(

        get_client()

    )


# ============================================================
# APPWRITE DATABASE SERVICE
# ============================================================

def get_database():

    return TablesDB(

        get_client()

    )


# ============================================================
# READ JSON BODY
# ============================================================

def get_body(request):

    body = request.body or {}

    if isinstance(body, str):

        try:

            body = json.loads(body)

        except json.JSONDecodeError:

            return None

    if not isinstance(body, dict):

        return None

    return body


# ============================================================
# GET AUTHENTICATED USER ID
# ============================================================

def get_user_id(request):

    headers = request.headers or {}

    return (

        headers.get("x-appwrite-user-id")

        or

        headers.get("X-Appwrite-User-Id")

    )


# ============================================================
# ACCOUNT REGISTRATION
# ============================================================

def register_account(context):

    request = context.req

    body = get_body(request)

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


    # --------------------------------------------------------
    # VALIDATE EMAIL
    # --------------------------------------------------------

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


    # --------------------------------------------------------
    # VALIDATE PASSWORD
    # --------------------------------------------------------

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

        users = get_appwrite_users()


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
                        "complete_profile",

                    "path":
                        "/profile.html"

                }

            },

            201

        )


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


# ============================================================
# GET PROFILE
# ============================================================

def get_profile(context):

    request = context.req

    user_id = get_user_id(request)


    if not user_id:

        return response(

            context,

            {

                "success": False,

                "error":
                    "Authentication required"

            },

            401

        )


    try:

        database = get_database()


        row = database.get_row(

            database_id=DATABASE_ID,

            table_id=TABLE_ID,

            row_id=user_id

        )


        return response(

            context,

            {

                "success": True,

                "profile":
                    row

            }

        )


    except Exception as error:

        context.log(

            "GET PROFILE ERROR: "

            + str(error)

        )


        return response(

            context,

            {

                "success": False,

                "error":
                    "Profile not found"

            },

            404

        )


# ============================================================
# CREATE OR UPDATE PROFILE
# ============================================================

def save_profile(context):

    request = context.req

    user_id = get_user_id(request)


    if not user_id:

        return response(

            context,

            {

                "success": False,

                "error":
                    "Authentication required"

            },

            401

        )


    body = get_body(request)


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


    # --------------------------------------------------------
    # PROFILE FIELDS
    # --------------------------------------------------------

    allowed_fields = [

        "firstName",

        "lastName",

        "phone",

        "country",

        "city",

        "dateOfBirth",

        "gender",

        "bio",

        "profileType"

    ]


    profile_data = {}


    for field in allowed_fields:

        if field in body:

            profile_data[field] = body[field]


    if not profile_data:

        return response(

            context,

            {

                "success": False,

                "error":
                    "No profile data provided"

            },

            400

        )


    try:

        database = get_database()


        # ----------------------------------------------------
        # CHECK IF PROFILE ALREADY EXISTS
        # ----------------------------------------------------

        try:

            existing = database.get_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id

            )


            # ------------------------------------------------
            # UPDATE EXISTING PROFILE
            # ------------------------------------------------

            row = database.update_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id,

                data=profile_data

            )


            return response(

                context,

                {

                    "success": True,

                    "message":
                        "Profile updated successfully",

                    "profile":
                        row

                }

            )


        except Exception:

            # ------------------------------------------------
            # CREATE NEW PROFILE
            # ------------------------------------------------

            profile_data["userId"] = user_id


            row = database.create_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id,

                data=profile_data

            )


            return response(

                context,

                {

                    "success": True,

                    "message":
                        "Profile created successfully",

                    "profile":
                        row

                },

                201

            )


    except Exception as error:

        context.log(

            "SAVE PROFILE ERROR: "

            + str(error)

        )


        return response(

            context,

            {

                "success": False,

                "error":
                    "Unable to save profile"

            },

            500

        )


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
                    "1.1.0"

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

    if method == "POST" and path == "/api/register":

        return register_account(context)


    # ========================================================
    # GET PROFILE
    # ========================================================

    if method == "GET" and path == "/api/profile":

        return get_profile(context)


    # ========================================================
    # CREATE / UPDATE PROFILE
    # ========================================================

    if method in ["POST", "PUT"] and path == "/api/profile":

        return save_profile(context)


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
