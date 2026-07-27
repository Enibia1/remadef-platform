# ============================================================
# REMADEF PROFILE MODULE
# ============================================================

import os

from appwrite.client import Client
from appwrite.services.tables_db import TablesDB


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ID = os.environ.get(

    "APPWRITE_FUNCTION_PROJECT_ID"

)


APPWRITE_ENDPOINT = os.environ.get(

    "APPWRITE_FUNCTION_ENDPOINT",

    "https://fra.cloud.appwrite.io/v1"

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
# APPWRITE CLIENT
# ============================================================

def get_client():

    client = Client()

    client.set_endpoint(

        APPWRITE_ENDPOINT

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
# DATABASE SERVICE
# ============================================================

def get_database():

    return TablesDB(

        get_client()

    )


# ============================================================
# ALLOWED PROFILE FIELDS
# ============================================================

ALLOWED_FIELDS = [

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

]


# ============================================================
# FILTER PROFILE DATA
# ============================================================

def clean_profile_data(data):

    if not isinstance(

        data,

        dict

    ):

        return {}


    cleaned = {}


    for field in ALLOWED_FIELDS:

        if field in data:

            cleaned[field] = data[field]


    return cleaned


# ============================================================
# GET PROFILE
# ============================================================

def get_profile(user_id):

    if not user_id:

        return {

            "success": False,

            "error":
                "Authentication required",

            "status": 401

        }


    try:

        database = get_database()


        profile = database.get_row(

            database_id=DATABASE_ID,

            table_id=TABLE_ID,

            row_id=user_id

        )


        return {

            "success": True,

            "profile":
                profile,

            "status": 200

        }


    except Exception as error:

        return {

            "success": False,

            "error":
                "Profile not found",

            "status": 404,

            "log":
                str(error)

        }


# ============================================================
# CREATE OR UPDATE PROFILE
# ============================================================

def save_profile(

    user_id,

    data

):

    if not user_id:

        return {

            "success": False,

            "error":
                "Authentication required",

            "status": 401

        }


    profile_data = clean_profile_data(

        data

    )


    if not profile_data:

        return {

            "success": False,

            "error":
                "No profile data provided",

            "status": 400

        }


    try:

        database = get_database()


        # ----------------------------------------------------
        # TRY TO FIND EXISTING PROFILE
        # ----------------------------------------------------

        try:

            existing = database.get_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id

            )


            # ------------------------------------------------
            # UPDATE
            # ------------------------------------------------

            profile = database.update_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id,

                data=profile_data

            )


            return {

                "success": True,

                "message":
                    "Profile updated successfully",

                "profile":
                    profile,

                "status": 200

            }


        except Exception:

            # ------------------------------------------------
            # CREATE
            # ------------------------------------------------

            profile_data["user_id"] = user_id


            profile = database.create_row(

                database_id=DATABASE_ID,

                table_id=TABLE_ID,

                row_id=user_id,

                data=profile_data

            )


            return {

                "success": True,

                "message":
                    "Profile created successfully",

                "profile":
                    profile,

                "status": 201

            }


    except Exception as error:

        return {

            "success": False,

            "error":
                "Unable to save profile",

            "status": 500,

            "log":
                str(error)

        }


# ============================================================
# DELETE PROFILE
# ============================================================

def delete_profile(user_id):

    if not user_id:

        return {

            "success": False,

            "error":
                "Authentication required",

            "status": 401

        }


    try:

        database = get_database()


        database.delete_row(

            database_id=DATABASE_ID,

            table_id=TABLE_ID,

            row_id=user_id

        )


        return {

            "success": True,

            "message":
                "Profile deleted successfully",

            "status": 200

        }


    except Exception as error:

        return {

            "success": False,

            "error":
                "Unable to delete profile",

            "status": 500,

            "log":
                str(error)

        }
