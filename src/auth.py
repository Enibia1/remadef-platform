# ============================================================
# REMADEF AUTHENTICATION MODULE
# ============================================================

import os

from appwrite.client import Client
from appwrite.services.users import Users


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
# USERS SERVICE
# ============================================================

def get_users():

    return Users(

        get_client()

    )


# ============================================================
# GET AUTHENTICATED USER ID
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
# REQUIRE AUTHENTICATION
# ============================================================

def require_user(request):

    user_id = get_user_id(

        request

    )

    if not user_id:

        return None


    return user_id
