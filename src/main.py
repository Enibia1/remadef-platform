# ============================================================
# REMADEF PLATFORM API
# Appwrite Cloud Function - Python
# ============================================================

import os
import json
import traceback

from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.tables_db import TablesDB
from appwrite.exception import AppwriteException


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ID = os.environ.get(
    "APPWRITE_PROJECT_ID",
    "6a634fdc00148a907132"
)

DATABASE_ID = os.environ.get(
    "APPWRITE_DATABASE_ID"
)

PROFILES_TABLE_ID = os.environ.get(
    "APPWRITE_PROFILES_TABLE_ID"
)


# ============================================================
# APPWRITE CLIENT
# ============================================================

def get_client():

    client = Client()

    # Appwrite Function environment automatically provides this
    client.set_endpoint(
        os.environ.get(
            "APPWRITE_FUNCTION_ENDPOINT",
            "https://fra.cloud.appwrite.io/v1"
        )
    )

    client.set_project(PROJECT_ID)

    # Dynamic API key automatically generated for the function
    client.set_key(
        os.environ.get(
            "APPWRITE_FUNCTION_API_KEY"
        )
    )

    return client


# ============================================================
# APPWRITE SERVICES
# ============================================================

def get_users_service():

    client = get_client()

    return Users(client)


def get_tables_service():

    client = get_client()

    return TablesDB(client)


# ============================================================
# JSON RESPONSE
# ============================================================

def response(body, status_code=200):

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, X-Appwrite-User-ID",
            "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS"
        },
        "body": json.dumps(body)
    }


# ============================================================
# REQUEST BODY
# ============================================================

def get_request_body(req):

    body = req.get("body")

    if not body:
        return {}

    if isinstance(body, dict):
        return body

    try:
        return json.loads(body)

    except Exception:

        return {}


# ============================================================
# USER ID
# ============================================================

def get_user_id(req, body):

    # First, check the authenticated Appwrite user header
    user_id = (
        req.get("headers", {})
        .get("x-appwrite-user-id")
    )

    if user_id:
        return user_id

    # Fallback for frontend requests
    user_id = body.get("user_id")

    return user_id


# ============================================================
# HEALTH CHECK
# ============================================================

def health():

    return response({

        "success": True,

        "service": "REMADEF Platform API",

        "status": "healthy",

        "database_configured": bool(DATABASE_ID),

        "profiles_table_configured": bool(
            PROFILES_TABLE_ID
        )

    })


# ============================================================
# GET PROFILE
# ============================================================

def get_profile(req):

    body = get_request_body(req)

    user_id = get_user_id(req, body)

    if not user_id:

        return response({

            "success": False,

            "error": "User ID is required"

        }, 400)

    if not DATABASE_ID:

        return response({

            "success": False,

            "error": "Database is not configured"

        }, 500)

    if not PROFILES_TABLE_ID:

        return response({

            "success": False,

            "error": "Profiles table is not configured"

        }, 500)

    try:

        tables = get_tables_service()

        profile = tables.get_row(

            database_id=DATABASE_ID,

            table_id=PROFILES_TABLE_ID,

            row_id=user_id

        )

        return response({

            "success": True,

            "profile": profile

        }, 200)

    except AppwriteException as error:

        # Profile does not exist
        if error.code == 404:

            return response({

                "success": True,

                "profile": None

            }, 200)

        print(
            "GET PROFILE ERROR:",
            str(error)
        )

        return response({

            "success": False,

            "error": str(error)

        }, 500)


# ============================================================
# SAVE PROFILE
# ============================================================

def save_profile(req):

    body = get_request_body(req)

    user_id = get_user_id(req, body)

    if not user_id:

        return response({

            "success": False,

            "error": "User ID is required"

        }, 400)

    if not DATABASE_ID:

        return response({

            "success": False,

            "error": "Database is not configured"

        }, 500)

    if not PROFILES_TABLE_ID:

        return response({

            "success": False,

            "error": "Profiles table is not configured"

        }, 500)

    # Remove system fields
    profile_data = {

        "user_id": user_id,

        "first_name": body.get(
            "first_name",
            ""
        ),

        "last_name": body.get(
            "last_name",
            ""
        ),

        "username": body.get(
            "username",
            ""
        ),

        "bio": body.get(
            "bio",
            ""
        ),

        "country": body.get(
            "country",
            ""
        ),

        "phone": body.get(
            "phone",
            ""
        ),

        "profile_image": body.get(
            "profile_image",
            ""
        )

    }

    try:

        tables = get_tables_service()

        # Check whether profile already exists
        try:

            existing = tables.get_row(

                database_id=DATABASE_ID,

                table_id=PROFILES_TABLE_ID,

                row_id=user_id

            )

            # Update existing profile
            profile = tables.update_row(

                database_id=DATABASE_ID,

                table_id=PROFILES_TABLE_ID,

                row_id=user_id,

                data=profile_data

            )

            return response({

                "success": True,

                "message": "Profile updated successfully",

                "profile": profile

            }, 200)

        except AppwriteException as error:

            # Profile does not exist
            if error.code != 404:

                raise error

        # Create new profile
        profile = tables.create_row(

            database_id=DATABASE_ID,

            table_id=PROFILES_TABLE_ID,

            row_id=user_id,

            data=profile_data

        )

        return response({

            "success": True,

            "message": "Profile created successfully",

            "profile": profile

        }, 201)

    except Exception as error:

        print(
            "SAVE PROFILE ERROR:",
            str(error)
        )

        traceback.print_exc()

        return response({

            "success": False,

            "error": str(error)

        }, 500)


# ============================================================
# REGISTER USER
# ============================================================

def register_user(req):

    body = get_request_body(req)

    email = body.get("email")

    password = body.get("password")

    name = body.get(
        "name",
        ""
    )

    if not email:

        return response({

            "success": False,

            "error": "Email is required"

        }, 400)

    if not password:

        return response({

            "success": False,

            "error": "Password is required"

        }, 400)

    if len(password) < 8:

        return response({

            "success": False,

            "error": "Password must be at least 8 characters"

        }, 400)

    try:

        users = get_users_service()

        user = users.create(

            user_id="unique()",

            email=email,

            password=password,

            name=name

        )

        return response({

            "success": True,

            "message": "Account created successfully",

            "user": {

                "$id": user["$id"],

                "email": user.get(
                    "email"
                ),

                "name": user.get(
                    "name"
                )

            }

        }, 201)

    except AppwriteException as error:

        print(
            "REGISTER ERROR:",
            str(error)
        )

        return response({

            "success": False,

            "error": str(error)

        }, error.code or 500)


# ============================================================
# MAIN FUNCTION
# ============================================================

def main(req, res):

    try:

        method = req.get(
            "method",
            "GET"
        ).upper()

        path = req.get(
            "path",
            "/"
        )

        # ----------------------------------------------------
        # CORS PREFLIGHT
        # ----------------------------------------------------

        if method == "OPTIONS":

            return response({

                "success": True

            }, 200)

        # ----------------------------------------------------
        # HOME
        # ----------------------------------------------------

        if path == "/":

            return response({

                "success": True,

                "service": "REMADEF Platform API",

                "version": "1.0.0",

                "status": "online"

            }, 200)

        # ----------------------------------------------------
        # HEALTH
        # ----------------------------------------------------

        if path == "/api/health":

            return health()

        # ----------------------------------------------------
        # REGISTER
        # ----------------------------------------------------

        if path == "/api/register":

            if method != "POST":

                return response({

                    "success": False,

                    "error": "Method not allowed"

                }, 405)

            return register_user(req)

        # ----------------------------------------------------
        # PROFILE GET
        # ----------------------------------------------------

        if path == "/api/profile":

            if method == "GET":

                return get_profile(req)

            if method in [
                "POST",
                "PUT"
            ]:

                return save_profile(req)

            return response({

                "success": False,

                "error": "Method not allowed"

            }, 405)

        # ----------------------------------------------------
        # 404
        # ----------------------------------------------------

        return response({

            "success": False,

            "error": "Endpoint not found",

            "path": path

        }, 404)

    except Exception as error:

        print(
            "FATAL FUNCTION ERROR:",
            str(error)
        )

        traceback.print_exc()

        return response({

            "success": False,

            "error": "Internal server error",

            "details": str(error)

        }, 500)
