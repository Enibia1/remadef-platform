# ============================================================
# REMADEF PLATFORM - PROFILE API
# src/profile.py
# ============================================================

import os
import json
import re
from datetime import datetime, timezone

from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.tables_db import TablesDB
from appwrite.exception import AppwriteException


# ============================================================
# ENVIRONMENT VARIABLES
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

    client.set_endpoint(
        os.environ.get(
            "APPWRITE_FUNCTION_ENDPOINT",
            "https://fra.cloud.appwrite.io/v1"
        )
    )

    client.set_project(PROJECT_ID)

    # Appwrite automatically creates/provides a dynamic API key
    # for the function execution when the required scopes are enabled.
    dynamic_key = os.environ.get(
        "APPWRITE_FUNCTION_API_KEY"
    )

    if dynamic_key:
        client.set_key(dynamic_key)

    return client


# ============================================================
# SERVICES
# ============================================================

def get_users_service():

    client = get_client()

    return Users(client)


def get_tables_service():

    client = get_client()

    return TablesDB(client)


# ============================================================
# BASIC VALIDATION
# ============================================================

def clean_text(value, max_length=500):

    if value is None:
        return ""

    value = str(value).strip()

    return value[:max_length]


def clean_name(value):

    value = clean_text(value, 100)

    # Remove dangerous HTML characters
    value = re.sub(r"[<>]", "", value)

    return value


def validate_profile_data(data):

    if not isinstance(data, dict):

        return False, "Invalid profile data"

    allowed_fields = {

        "first_name",
        "last_name",
        "username",
        "bio",
        "country",
        "city",
        "phone",
        "avatar_url",
        "cover_url",
        "date_of_birth",
        "gender",
        "education",
        "occupation",
        "skills",
        "website",
        "linkedin",
        "twitter",
        "instagram"

    }

    cleaned = {}

    for key, value in data.items():

        if key not in allowed_fields:

            continue

        if key in ["first_name", "last_name", "username"]:

            cleaned[key] = clean_name(value)

        elif key == "bio":

            cleaned[key] = clean_text(value, 1000)

        elif key == "skills":

            if isinstance(value, list):

                cleaned[key] = [
                    clean_text(skill, 100)
                    for skill in value[:30]
                ]

            else:

                cleaned[key] = clean_text(value, 500)

        else:

            cleaned[key] = clean_text(value, 500)

    return True, cleaned


# ============================================================
# GET USER
# ============================================================

def get_user(user_id):

    try:

        users = get_users_service()

        return users.get(
            user_id=user_id
        )

    except AppwriteException as error:

        print(
            f"GET USER ERROR: {error}"
        )

        return None


# ============================================================
# GET PROFILE
# ============================================================

def get_profile(user_id):

    if not user_id:

        return {

            "success": False,
            "error": "User ID is required"

        }

    if not DATABASE_ID:

        return {

            "success": False,
            "error": "APPWRITE_DATABASE_ID is not configured"

        }

    if not PROFILES_TABLE_ID:

        return {

            "success": False,
            "error": "APPWRITE_PROFILES_TABLE_ID is not configured"

        }

    try:

        tables = get_tables_service()

        # New Appwrite TablesDB API
        result = tables.list_rows(

            database_id=DATABASE_ID,

            table_id=PROFILES_TABLE_ID,

            queries=[

                f'equal("$id", "{user_id}")'

            ]

        )

        rows = result.get(

            "rows",

            []

        )

        if rows:

            return {

                "success": True,

                "profile": rows[0]

            }

        return {

            "success": True,

            "profile": None

        }

    except AppwriteException as error:

        print(

            f"GET PROFILE ERROR: {error}"

        )

        return {

            "success": False,

            "error": str(error)

        }


# ============================================================
# SAVE PROFILE
# ============================================================

def save_profile(user_id, profile_data):

    if not user_id:

        return {

            "success": False,

            "error": "User ID is required"

        }

    if not DATABASE_ID:

        return {

            "success": False,

            "error": "APPWRITE_DATABASE_ID is not configured"

        }

    if not PROFILES_TABLE_ID:

        return {

            "success": False,

            "error": "APPWRITE_PROFILES_TABLE_ID is not configured"

        }

    valid, cleaned_data = validate_profile_data(

        profile_data

    )

    if not valid:

        return {

            "success": False,

            "error": cleaned_data

        }

    try:

        tables = get_tables_service()

        # Check if profile already exists
        existing = tables.list_rows(

            database_id=DATABASE_ID,

            table_id=PROFILES_TABLE_ID,

            queries=[

                f'equal("$id", "{user_id}")'

            ]

        )

        rows = existing.get(

            "rows",

            []

        )

        now = datetime.now(

            timezone.utc

        ).isoformat()

        # ========================================================
        # UPDATE EXISTING PROFILE
        # ========================================================

        if rows:

            row_id = rows[0]["$id"]

            cleaned_data["updated_at"] = now

            result = tables.update_row(

                database_id=DATABASE_ID,

                table_id=PROFILES_TABLE_ID,

                row_id=row_id,

                data=cleaned_data

            )

            return {

                "success": True,

                "message": "Profile updated successfully",

                "profile": result

            }

        # ========================================================
        # CREATE NEW PROFILE
        # ========================================================

        cleaned_data["user_id"] = user_id

        cleaned_data["created_at"] = now

        cleaned_data["updated_at"] = now

        result = tables.create_row(

            database_id=DATABASE_ID,

            table_id=PROFILES_TABLE_ID,

            row_id=user_id,

            data=cleaned_data

        )

        return {

            "success": True,

            "message": "Profile created successfully",

            "profile": result

        }

    except AppwriteException as error:

        print(

            f"SAVE PROFILE ERROR: {error}"

        )

        return {

            "success": False,

            "error": str(error)

        }


# ============================================================
# DELETE PROFILE
# ============================================================

def delete_profile(user_id):

    if not user_id:

        return {

            "success": False,

            "error": "User ID is required"

        }

    try:

        tables = get_tables_service()

        tables.delete_row(

            database_id=DATABASE_ID,

            table_id=PROFILES_TABLE_ID,

            row_id=user_id

        )

        return {

            "success": True,

            "message": "Profile deleted successfully"

        }

    except AppwriteException as error:

        print(

            f"DELETE PROFILE ERROR: {error}"

        )

        return {

            "success": False,

            "error": str(error)

        }


# ============================================================
# ROUTER
# ============================================================

def handle_profile_request(

    method,

    user_id=None,

    body=None

):

    method = method.upper()

    # ----------------------------------------------------------
    # GET /api/profile
    # ----------------------------------------------------------

    if method == "GET":

        return get_profile(

            user_id

        )

    # ----------------------------------------------------------
    # POST /api/profile
    # ----------------------------------------------------------

    if method == "POST":

        return save_profile(

            user_id,

            body or {}

        )

    # ----------------------------------------------------------
    # PUT /api/profile
    # ----------------------------------------------------------

    if method == "PUT":

        return save_profile(

            user_id,

            body or {}

        )

    # ----------------------------------------------------------
    # DELETE /api/profile
    # ----------------------------------------------------------

    if method == "DELETE":

        return delete_profile(

            user_id

        )

    return {

        "success": False,

        "error": "Method not allowed"

    }
