# ============================================================
# REMADEF AUTHENTICATION SERVICE
# Appwrite Cloud Function
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

APPWRITE_API_KEY = os.environ.get(
    "APPWRITE_API_KEY"
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

        APPWRITE_API_KEY

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
# GET USER ID FROM REQUEST
# ============================================================

def get_user_id(request):

    headers = request.headers or {}


    # Appwrite function user header

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

        return user_id


    return None


# ============================================================
# REQUIRE AUTHENTICATION
# ============================================================

def require_authentication(request):

    user_id = get_user_id(

        request

    )


    if not user_id:

        return {

            "authenticated": False,

            "user_id": None,

            "error":
                "Authentication required"

        }


    return {

        "authenticated": True,

        "user_id": user_id,

        "error": None

    }


# ============================================================
# GET AUTHENTICATED USER
# ============================================================

def get_authenticated_user(request):

    auth = require_authentication(

        request

    )


    if not auth["authenticated"]:

        return None


    user_id = auth["user_id"]


    try:

        users = get_users()


        return users.get(

            user_id

        )


    except Exception:

        return None
