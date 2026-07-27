# ============================================================
# REMADEF PLATFORM API
# Appwrite Cloud Function
# Python 3.12
# ============================================================

import json
import os
import traceback
from datetime import datetime, timezone

from appwrite.client import Client
from appwrite.services.account import Account
from appwrite.services.tables_db import TablesDB


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ID = os.environ.get(
    "APPWRITE_PROJECT_ID",
    "6a634fdc00148a907132"
)

DATABASE_ID = os.environ.get(
    "APPWRITE_DATABASE_ID",
    "6a66577c000d17565b18"
)

PROFILES_TABLE_ID = os.environ.get(
    "APPWRITE_PROFILES_TABLE_ID",
    "profiles"
)


# ============================================================
# RESPONSE HELPERS
# ============================================================

def response(status_code=200, body=None):

    if body is None:
        body = {}

    return {
        "statusCode": status_code,

        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": (
                "Content-Type, X-Appwrite-Project"
            ),
            "Access-Control-Allow-Methods": (
                "GET, POST, PUT, PATCH, OPTIONS"
            )
        },

        "body": json.dumps(
            body,
            ensure_ascii=False
        )
    }


def success(data=None, message="Success"):

    return response(
        200,
        {
            "success": True,
            "message": message,
            "data": data
        }
    )


def error(message, status_code=400):

    return response(
        status_code,
        {
            "success": False,
            "message": message
        }
    )


# ============================================================
# APPWRITE CLIENT
# ============================================================

def get_client(context):

    client = Client()

    client.set_endpoint(
        os.environ.get(
            "APPWRITE_FUNCTION_ENDPOINT",
            "https://fra.cloud.appwrite.io/v1"
        )
    )

    client.set_project(PROJECT_ID)

    # Appwrite provides the dynamic key to the function
    dynamic_key = context.req.headers.get(
        "x-appwrite-key"
    )

    if not dynamic_key:
        raise RuntimeError(
            "Dynamic Appwrite API key is missing."
        )

    client.set_key(dynamic_key)

    return client


# ============================================================
# APPWRITE SERVICES
# ============================================================

def get_account_service(context):

    return Account(
        get_client(context)
    )


def get_tables_db(context):

    return TablesDB(
        get_client(context)
    )


# ============================================================
# REQUEST BODY PARSER
# ============================================================

def parse_json_body(request):

    body = request.body

    if not body:
        return {}

    if isinstance(body, dict):
        return body

    if isinstance(body, str):

        try:
            return json.loads(body)

        except json.JSONDecodeError:
            return {}

    return {}


# ============================================================
# PROFILE FIELDS
# ============================================================

PROFILE_FIELDS = [

    "email",
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
    "institution",
    "profile_completion"

]


# ============================================================
# FIND PROFILE
# ============================================================

def find_profile(account_id, context):

    tables_db = get_tables_db(context)

    result = tables_db.list_rows(
        database_id=DATABASE_ID,
        table_id=PROFILES_TABLE_ID,
        queries=[
            f'equal("account_id", "{account_id}")'
        ]
    )

    rows = result.get(
        "rows",
        []
    )

    if not rows:
        return None

    return rows[0]


# ============================================================
# CALCULATE PROFILE COMPLETION
# ============================================================

def calculate_completion(profile):

    fields = [

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
        "education_level",
        "institution"

    ]

    completed = 0

    for field in fields:

        value = profile.get(field)

        if (
            value is not None
            and str(value).strip()
        ):
            completed += 1

    skills = profile.get("skills")

    if skills:

        if isinstance(skills, list):

            if len(skills) > 0:
                completed += 1

        elif str(skills).strip():

            completed += 1

    total = len(fields) + 1

    return round(
        (completed / total) * 100
    )


# ============================================================
# CREATE PROFILE
# ============================================================

def create_profile(
    account_id,
    email="",
    phone="",
    context=None
):

    tables_db = get_tables_db(context)

    now = datetime.now(
        timezone.utc
    ).isoformat()

    profile_data = {

        "account_id": account_id,

        "email": email or "",

        "first_name": "",

        "last_name": "",

        "display_name": "",

        "date_of_birth": "",

        "gender": "",

        "country": "",

        "state": "",

        "city": "",

        "phone": phone or "",

        "headline": "",

        "about": "",

        "skills": "",

        "education_level": "",

        "institution": "",

        "profile_completion": 0,

        "created_at": now,

        "updated_at": now

    }

    return tables_db.create_row(

        database_id=DATABASE_ID,

        table_id=PROFILES_TABLE_ID,

        row_id="unique()",

        data=profile_data

    )


# ============================================================
# UPDATE PROFILE
# ============================================================

def update_profile(
    account_id,
    profile_data,
    context
):

    tables_db = get_tables_db(context)

    existing = find_profile(
        account_id,
        context
    )

    if not existing:

        return create_profile(

            account_id,

            context=context

        )

    row_id = existing["$id"]

    update_data = {}

    for field in PROFILE_FIELDS:

        if field not in profile_data:
            continue

        value = profile_data[field]

        if field == "skills":

            if isinstance(value, list):

                value = json.dumps(value)

            elif value is None:

                value = ""

        update_data[field] = value

    merged = {
        **existing,
        **update_data
    }

    update_data["profile_completion"] = (
        calculate_completion(merged)
    )

    update_data["updated_at"] = (
        datetime.now(
            timezone.utc
        ).isoformat()
    )

    return tables_db.update_row(

        database_id=DATABASE_ID,

        table_id=PROFILES_TABLE_ID,

        row_id=row_id,

        data=update_data

    )


# ============================================================
# REGISTER USER
# ============================================================

def register_user(data, context):

    email = str(
        data.get(
            "email",
            ""
        )
    ).strip().lower()

    password = str(
        data.get(
            "password",
            ""
        )
    )

    phone = str(
        data.get(
            "phone",
            ""
        )
    ).strip()

    if not email and not phone:

        return error(
            "Email or phone number is required."
        )

    if len(password) < 8:

        return error(
            "Password must contain at least 8 characters."
        )

    account_service = get_account_service(
        context
    )


    # ========================================================
    # CREATE ACCOUNT
    # ========================================================

    try:

        if email:

            user = account_service.create(

                user_id="unique()",

                email=email,

                password=password

            )

        else:

            user = account_service.create_phone_user(

                user_id="unique()",

                phone=phone,

                password=password

            )


    except Exception as exc:

        context.error(

            "Account creation failed: "

            f"{type(exc).__name__}: "

            f"{str(exc)}"

        )

        message = str(exc)

        if "already exists" in message.lower():

            return error(

                "An account with these credentials already exists.",

                409

            )

        return error(

            "Could not create account.",

            400

        )


    # ========================================================
    # EXTRACT USER ID
    # ========================================================

    try:

        if hasattr(user, "model_dump"):

            user_data = user.model_dump()

        elif hasattr(user, "dict"):

            user_data = user.dict()

        else:

            user_data = vars(user)

        user_id = (

            user_data.get("$id")

            or user_data.get("id")

        )

        if not user_id:

            raise RuntimeError(

                "Account was created but no user ID was returned."

            )


    except Exception as exc:

        context.error(

            "User ID extraction failed: "

            f"{type(exc).__name__}: "

            f"{str(exc)}"

        )

        return error(

            "Account was created, but the user ID could not be retrieved.",

            500

        )


    # ========================================================
    # CREATE PROFILE
    # ========================================================

    try:

        profile = create_profile(

            account_id=user_id,

            email=email,

            phone=phone,

            context=context

        )


    except Exception as exc:

        context.error(

            "Profile creation failed: "

            f"{type(exc).__name__}: "

            f"{str(exc)}"

        )

        return error(

            "Account was created, but the profile could not be created.",

            500

        )


    # ========================================================
    # SUCCESS
    # ========================================================

    return response(

        201,

        {

            "success": True,

            "message": (

                "Account and profile created successfully."

            ),

            "account": {

                "id": user_id,

                "email": email,

                "phone": phone

            },

            "profile": profile

        }

    )


# ============================================================
# HEALTH CHECK
# ============================================================

def health_check():

    return success(

        {

            "service": (

                "REMADEF Platform API"

            ),

            "status": "healthy"

        },

        "REMADEF Platform API is running."

    )


# ============================================================
# ROUTER
# ============================================================

def route_request(
    request,
    context
):

    method = request.method.upper()

    path = request.path


    # ========================================================
    # CORS PREFLIGHT
    # ========================================================

    if method == "OPTIONS":

        return response(

            200,

            {

                "success": True,

                "message": (

                    "CORS preflight successful."

                )

            }

        )


    # ========================================================
    # HEALTH
    # ========================================================

    if (

        method == "GET"

        and

        path == "/api/health"

    ):

        return health_check()


    # ========================================================
    # REGISTER
    # ========================================================

    if (

        method == "POST"

        and

        path == "/api/register"

    ):

        data = parse_json_body(

            request

        )

        return register_user(

            data,

            context

        )


    return error(

        "Route not found.",

        404

    )


# ============================================================
# MAIN ENTRYPOINT
# ============================================================

def main(context):

    try:

        return route_request(

            context.req,

            context

        )


    except Exception as exc:

        context.error(

            "UNHANDLED ERROR: "

            f"{type(exc).__name__}: "

            f"{str(exc)}"

        )

        context.error(

            traceback.format_exc()

        )

        return error(

            "Internal server error.",

            500

        )
