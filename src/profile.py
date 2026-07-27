# ============================================================
# REMADEF PROFILE SERVICE
# Appwrite Cloud Function
# ============================================================

import json
import os
from appwrite.client import Client
from appwrite.services.tables_db import TablesDB


# ============================================================
# CONFIGURATION
# ============================================================

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
    "Access-Control-Allow-Origin": "https://enibia1.github.io",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Appwrite-User-Id",
    "Access-Control-Max-Age": "86400"
}


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
        os.environ.get(
            "APPWRITE_FUNCTION_PROJECT_ID"
        )
    )

    client.set_key(
        os.environ.get(
            "APPWRITE_API_KEY"
        )
    )

    return client


# ============================================================
# DATABASE
# ============================================================

def get_database():

    return TablesDB(
        get_client()
    )


# ============================================================
# RESPONSE
# ============================================================

def send_response(
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
# BODY
# ============================================================

def get_body(request):

    body = request.body

    if not body:

        return {}

    if isinstance(body, dict):

        return body

    if isinstance(body, str):

        try:

            return json.loads(body)

        except json.JSONDecodeError:

            return None

    return None


# ============================================================
# USER ID
# ============================================================

def get_user_id(request):

    headers = request.headers or {}

    return (

        headers.get(
            "x-appwrite-user-id"
        )

        or

        headers.get(
            "X-Appwrite-User-Id"
        )

    )


# ============================================================
# ALLOWED PROFILE FIELDS
# ============================================================

ALLOWED_FIELDS = {

    "first_name",
    "last_name",
    "display_name",

    "date_of_birth",
    "gender",

    "country",
    "state",
    "city",

    "phone",

    "headline",
    "about",
    "skills",

    "education_level",
    "institution"

}


# ============================================================
# CLEAN PROFILE DATA
# ============================================================

def clean_profile_data(body):

    profile = {}

    for key in ALLOWED_FIELDS:

        if key not in body:

            continue

        value = body[key]

        if key == "skills":

            if not isinstance(value, list):

                continue

            profile[key] = [

                str(skill).strip()

                for skill in value

                if str(skill).strip()

            ][:20]

            continue

        if value is None:

            continue

        if isinstance(value, str):

            value = value.strip()

        profile[key] = value

    return profile


# ============================================================
# GET PROFILE
# ============================================================

def get_profile(context):

    request = context.req

    user_id = get_user_id(request)

    if not user_id:

        return send_response(

            context,

            {
                "success": False,
                "error": "Authentication required"
            },

            401

        )


    try:

        database = get_database()

        profile = database.get_row(

            database_id=DATABASE_ID,

            table_id=TABLE_ID,

            row_id=user_id

        )


        return send_response(

            context,

            {

                "success": True,

                "profile": profile

            }

        )


    except Exception as error:

        context.log(

            "PROFILE GET ERROR: "

            + str(error)

        )


        return send_response(

            context,

            {

                "success": False,

                "error": "Profile not found"

            },

            404

        )


# ============================================================
# SAVE PROFILE
# ============================================================

def save_profile(context):

    request = context.req

    user_id = get_user_id(request)

    if not user_id:

        return send_response(

            context,

            {

                "success": False,

                "error": "Authentication required"

            },

            401

        )


    body = get_body(request)

    if body is None:

        return send_response(

            context,

            {

                "success": False,

                "error": "Invalid request body"

            },

            400

        )


    profile_data = clean_profile_data(body)


    if not profile_data:

        return send_response(

            context,

            {

                "success": False,

                "error": "No profile data provided"

            },

            400

        )


    try:

        database = get_database()


        # ====================================================
        # TRY TO UPDATE EXISTING PROFILE
        # ====================================================

        try:

            existing = database.get_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id

            )


            profile = database.update_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id,

                data=profile_data

            )


            return send_response(

                context,

                {

                    "success": True,

                    "message": "Profile updated successfully",

                    "profile": profile

                }

            )


        except Exception:

            # =================================================
            # CREATE NEW PROFILE
            # =================================================

            profile_data["user_id"] = user_id


            profile = database.create_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id,

                data=profile_data

            )


            return send_response(

                context,

                {

                    "success": True,

                    "message": "Profile created successfully",

                    "profile": profile

                },

                201

            )


    except Exception as error:

        context.log(

            "PROFILE SAVE ERROR: "

            + str(error)

        )


        return send_response(

            context,

            {

                "success": False,

                "error": "Unable to save profile"

            },

            500

        )
