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
from appwrite.services.users import Users
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

    client.set_project(
        PROJECT_ID
    )

    dynamic_key = context.req.headers.get(
        "x-appwrite-key"
    )

    if not dynamic_key:

        raise RuntimeError(
            "Dynamic Appwrite API key is missing."
        )

    client.set_key(
        dynamic_key
    )

    return client


# ============================================================
# APPWRITE SERVICES
# ============================================================

def get_users_service(context):

    return Users(
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

    skills = profile.get(
        "skills"
    )

    if skills:

        if isinstance(skills, list):

            if len(skills) > 0:

                completed += 1

        elif str(skills).strip():

            completed += 1

    total = len(fields) + 1

    return round(
        (
            completed / total
        ) * 100
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

    update_data[
        "profile_completion"
    ] = calculate_completion(
        merged
    )

    update_data[
        "updated_at"
    ] = datetime.now(
        timezone.utc
    ).isoformat()

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

    users_service = get_users_service(
        context
    )

    user = None

    # --------------------------------------------------------
    # CREATE EMAIL USER
    # --------------------------------------------------------

    try:

        if email:

            user = users_service.create(

                user_id="unique()",

                email=email,

                password=password

            )

        else:

            user = users_service.create(

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

        if (

            "already exists"

            in message.lower()

            or "user_already_exists"

            in message.lower()

        ):

            return error(

                "An account with these credentials already exists.",

                409

            )

        return error(

            "Could not create account.",

            400

        )

    # --------------------------------------------------------
    # VERIFY USER CREATION
    # --------------------------------------------------------

    if not user:

        context.error(

            "Account creation returned no user."

        )

        return error(

            "Account creation failed.",

            500

        )

    user_id = user.get(

        "$id"

    )

    if not user_id:

        context.error(

            "Account was created but no user ID was returned."

        )

        return error(

            "Account creation failed.",

            500

        )

    # --------------------------------------------------------
    # CREATE PROFILE
    # --------------------------------------------------------

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

        # IMPORTANT:
        # The Auth user was already created successfully.
        # We do not pretend the entire registration failed.

        return response(

            201,

            {

                "success": True,

                "message": (

                    "Account created successfully, "

                    "but profile setup is pending."

                ),

                "account": {

                    "id": user_id,

                    "email": email,

                    "phone": phone

                },

                "profile": None

            }

        )

    # --------------------------------------------------------
    # SUCCESS
    # --------------------------------------------------------

    return response(

        201,

        {

            "success": True,

            "message": (

                "Account created successfully."

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
# LOGIN
# ============================================================

def login_user(data):

    return error(

        (

            "Login is handled by the frontend using "

            "Appwrite Account.createEmailPasswordSession "

            "or Account.createPhoneSession."

        ),

        501

    )


# ============================================================
# GET PROFILE
# ============================================================

def get_profile(data, context):

    account_id = str(

        data.get(

            "account_id",

            ""

        )

    ).strip()

    if not account_id:

        return error(

            "Account ID is required."

        )

    profile = find_profile(

        account_id,

        context

    )

    if not profile:

        return error(

            "Profile not found.",

            404

        )

    skills = profile.get(

        "skills",

        ""

    )

    if isinstance(

        skills,

        str

    ) and skills:

        try:

            profile["skills"] = json.loads(

                skills

            )

        except json.JSONDecodeError:

            profile["skills"] = [

                skills

            ]

    return success(

        profile,

        "Profile loaded."

    )


# ============================================================
# SAVE PROFILE
# ============================================================

def save_profile(data, context):

    account_id = str(

        data.get(

            "account_id",

            ""

        )

    ).strip()

    if not account_id:

        return error(

            "Account ID is required."

        )

    profile_data = data.get(

        "profile",

        data

    )

    if not isinstance(

        profile_data,

        dict

    ):

        return error(

            "Invalid profile data."

        )

    profile = update_profile(

        account_id,

        profile_data,

        context

    )

    return success(

        profile,

        "Profile saved successfully."

    )


# ============================================================
# ROUTER
# ============================================================

def route_request(request, context):

    method = str(

        request.method or "GET"

    ).upper()

    path = request.path or "/"

    if method == "OPTIONS":

        return response(

            204,

            {}

        )

    if method == "GET" and path == "/":

        return success(

            {

                "service":

                    "REMADEF Platform API",

                "status":

                    "online"

            },

            "REMADEF Platform API is online."

        )

    if method == "GET" and path == "/api/health":

        return success(

            {

                "status":

                    "healthy"

            },

            "API is healthy."

        )

    data = parse_json_body(

        request

    )

    if (

        method == "POST"

        and path == "/api/register"

    ):

        return register_user(

            data,

            context

        )

    if (

        method == "POST"

        and path == "/api/login"

    ):

        return login_user(

            data

        )

    if (

        method == "GET"

        and path == "/api/profile"

    ):

        return get_profile(

            data,

            context

        )

    if (

        method in (

            "POST",

            "PUT",

            "PATCH"

        )

        and path == "/api/profile"

    ):

        return save_profile(

            data,

            context

        )

    return error(

        "Route not found.",

        404

    )


# ============================================================
# APPWRITE FUNCTION ENTRYPOINT
# ============================================================

def main(context):

    try:

        request = context.req

        return route_request(

            request,

            context

        )

    except Exception as exc:

        context.error(

            "UNHANDLED ERROR: "

            f"{type(exc).__name__}: "

            f"{str(exc)}"

        )

        traceback.print_exc()

        return error(

            "Internal server error.",

            500

        )
