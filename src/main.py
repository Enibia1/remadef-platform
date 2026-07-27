# ============================================================
# REMADEF PLATFORM API
# PROFILE MANAGEMENT API
# ============================================================

import os
import json
import re
from datetime import datetime, timezone

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
    "APPWRITE_PROFILES_TABLE_ID",
    "profiles"
)

PROJECT_ID = os.environ.get(
    "APPWRITE_PROJECT_ID",
    "6a634fdc00148a907132"
)

APPWRITE_ENDPOINT = os.environ.get(
    "APPWRITE_FUNCTION_ENDPOINT",
    "https://fra.cloud.appwrite.io/v1"
)


# ============================================================
# HTTP RESPONSE HELPERS
# ============================================================

def response(
    body,
    status_code=200
):

    return {

        "statusCode":
            status_code,

        "headers": {

            "Content-Type":
                "application/json",

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Methods":
                "GET, POST, PUT, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type, X-Appwrite-Project"

        },

        "body":
            json.dumps(
                body,
                ensure_ascii=False
            )

    }


def success(
    data=None,
    message="Success",
    status_code=200
):

    result = {

        "success":
            True,

        "message":
            message

    }

    if data is not None:

        result["data"] = data

    return response(
        result,
        status_code
    )


def error(
    message,
    status_code=400,
    details=None
):

    result = {

        "success":
            False,

        "message":
            message

    }

    if details is not None:

        result["details"] = details

    return response(
        result,
        status_code
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

    dynamic_key = os.environ.get(
        "APPWRITE_FUNCTION_API_KEY"
    )

    if not dynamic_key:

        raise RuntimeError(
            "APPWRITE_FUNCTION_API_KEY is missing."
        )

    client.set_key(
        dynamic_key
    )

    return client


# ============================================================
# TABLES DATABASE
# ============================================================

def get_tables_db():

    return TablesDB(
        get_client()
    )


# ============================================================
# UTILITIES
# ============================================================

def now_iso():

    return datetime.now(
        timezone.utc
    ).isoformat()


def clean_string(
    value,
    default=""
):

    if value is None:

        return default

    return str(
        value
    ).strip()


def parse_json_body(
    req
):

    body = req.get(
        "body"
    )

    if not body:

        return {}

    if isinstance(
        body,
        dict
    ):

        return body

    try:

        return json.loads(
            body
        )

    except Exception:

        raise ValueError(
            "Request body must contain valid JSON."
        )


def get_query_parameter(
    req,
    name
):

    query = req.get(
        "query",
        {}
    )

    if not query:

        return None

    return query.get(
        name
    )


def normalize_skills(
    skills
):

    if skills is None:

        return []

    if isinstance(
        skills,
        list
    ):

        result = []

        for skill in skills:

            value = clean_string(
                skill
            )

            if value and value not in result:

                result.append(
                    value
                )

        return result[:20]

    if isinstance(
        skills,
        str
    ):

        value = skills.strip()

        if not value:

            return []

        try:

            parsed = json.loads(
                value
            )

            if isinstance(
                parsed,
                list
            ):

                return normalize_skills(
                    parsed
                )

        except Exception:

            pass

        return [

            item.strip()

            for item in value.split(",")

            if item.strip()

        ][:20]

    return []


def serialize_skills(
    skills
):

    return json.dumps(
        normalize_skills(
            skills
        ),
        ensure_ascii=False
    )


def deserialize_skills(
    value
):

    return normalize_skills(
        value
    )


# ============================================================
# PROFILE COMPLETION
# ============================================================

PROFILE_COMPLETION_FIELDS = [

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


def calculate_profile_completion(
    profile
):

    completed = 0

    for field in PROFILE_COMPLETION_FIELDS:

        value = profile.get(
            field
        )

        if (

            value is not None

            and str(
                value
            ).strip()

        ):

            completed += 1

    skills = normalize_skills(
        profile.get(
            "skills"
        )
    )

    if skills:

        completed += 1

    total = (

        len(
            PROFILE_COMPLETION_FIELDS
        )

        + 1

    )

    return round(

        (

            completed /

            total

        ) * 100

    )


# ============================================================
# PROFILE DATA NORMALIZATION
# ============================================================

def normalize_profile(
    profile
):

    if not profile:

        return {}

    result = dict(
        profile
    )

    result["skills"] = normalize_skills(
        profile.get(
            "skills"
        )
    )

    result["profile_completion"] = (

        profile.get(
            "profile_completion"
        )

        if profile.get(
            "profile_completion"
        ) is not None

        else calculate_profile_completion(
            result
        )

    )

    return result


# ============================================================
# FIND PROFILE BY ACCOUNT ID
# ============================================================

def get_profile_by_account_id(
    account_id
):

    account_id = clean_string(
        account_id
    )

    if not account_id:

        return None

    tables_db = get_tables_db()

    result = tables_db.list_rows(

        database_id=
            DATABASE_ID,

        table_id=
            TABLE_ID,

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

    return normalize_profile(
        rows[0]
    )


# ============================================================
# CREATE PROFILE
# ============================================================

def create_profile(
    account_id,
    email="",
    phone=""
):

    account_id = clean_string(
        account_id
    )

    if not account_id:

        raise ValueError(
            "account_id is required."
        )

    existing_profile = (

        get_profile_by_account_id(
            account_id
        )

    )

    if existing_profile:

        return existing_profile

    now = now_iso()

    profile_data = {

        "account_id":
            account_id,

        "email":
            clean_string(
                email
            ),

        "first_name":
            "",

        "last_name":
            "",

        "display_name":
            "",

        "date_of_birth":
            "",

        "gender":
            "",

        "country":
            "",

        "state":
            "",

        "city":
            "",

        "phone":
            clean_string(
                phone
            ),

        "headline":
            "",

        "about":
            "",

        "skills":
            "[]",

        "education_level":
            "",

        "institution":
            "",

        "profile_completion":
            0,

        "created_at":
            now,

        "updated_at":
            now

    }

    tables_db = get_tables_db()

    created = tables_db.create_row(

        database_id=
            DATABASE_ID,

        table_id=
            TABLE_ID,

        row_id=
            "unique()",

        data=
            profile_data

    )

    return normalize_profile(
        created
    )


# ============================================================
# UPDATE PROFILE
# ============================================================

def update_profile(
    account_id,
    profile_data
):

    account_id = clean_string(
        account_id
    )

    if not account_id:

        raise ValueError(
            "account_id is required."
        )

    if not isinstance(
        profile_data,
        dict
    ):

        raise ValueError(
            "Profile data must be an object."
        )

    existing_profile = (

        get_profile_by_account_id(
            account_id
        )

    )

    if not existing_profile:

        create_profile(
            account_id
        )

        existing_profile = (

            get_profile_by_account_id(
                account_id
            )

        )

    allowed_fields = [

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

        "institution"

    ]

    update_data = {}

    for field in allowed_fields:

        if field not in profile_data:

            continue

        value = profile_data[field]

        if field == "skills":

            value = serialize_skills(
                value
            )

        else:

            value = clean_string(
                value
            )

        update_data[field] = value

    merged_profile = dict(
        existing_profile
    )

    for field in update_data:

        value = update_data[field]

        if field == "skills":

            merged_profile[field] = (

                deserialize_skills(
                    value
                )

            )

        else:

            merged_profile[field] = value

    update_data[
        "profile_completion"
    ] = calculate_profile_completion(
        merged_profile
    )

    update_data[
        "updated_at"
    ] = now_iso()

    tables_db = get_tables_db()

    updated = tables_db.update_row(

        database_id=
            DATABASE_ID,

        table_id=
            TABLE_ID,

        row_id=
            existing_profile["$id"],

        data=
            update_data

    )

    return normalize_profile(
        updated
    )


# ============================================================
# REQUEST HANDLERS
# ============================================================

def handle_health():

    return success(

        {

            "service":
                "REMADEF Platform API",

            "status":
                "healthy",

            "database":
                DATABASE_ID,

            "table":
                TABLE_ID

        },

        "REMADEF Platform API is healthy."

    )


def handle_get_profile(
    req
):

    account_id = get_query_parameter(

        req,

        "account_id"

    )

    if not account_id:

        return error(

            "account_id is required.",

            400

        )

    profile = (

        get_profile_by_account_id(
            account_id
        )

    )

    if not profile:

        return error(

            "Profile not found.",

            404

        )

    return success(

        profile,

        "Profile retrieved successfully."

    )


def handle_create_profile(
    req
):

    body = parse_json_body(
        req
    )

    account_id = clean_string(
        body.get(
            "account_id"
        )
    )

    if not account_id:

        return error(

            "account_id is required.",

            400

        )

    profile = create_profile(

        account_id=

            account_id,

        email=

            body.get(
                "email",
                ""
            ),

        phone=

            body.get(
                "phone",
                ""
            )

    )

    return success(

        profile,

        "Profile created successfully.",

        201

    )


def handle_update_profile(
    req
):

    body = parse_json_body(
        req
    )

    account_id = clean_string(

        body.get(
            "account_id"
        )

    )

    if not account_id:

        return error(

            "account_id is required.",

            400

        )

    profile_data = body.get(
        "profile"
    )

    if profile_data is None:

        profile_data = {

            key:
                value

            for key, value in body.items()

            if key != "account_id"

        }

    profile = update_profile(

        account_id=

            account_id,

        profile_data=

            profile_data

    )

    return success(

        profile,

        "Profile updated successfully."

    )


# ============================================================
# MAIN FUNCTION
# ============================================================

def main(
    context
):

    req = context.req

    method = (

        req.method

        or "GET"

    ).upper()

    path = (

        req.path

        or "/"

    ).rstrip("/")

    try:

        # ----------------------------------------------------
        # CORS PREFLIGHT
        # ----------------------------------------------------

        if method == "OPTIONS":

            return response(
                {},
                204
            )

        # ----------------------------------------------------
        # ROOT
        # ----------------------------------------------------

        if (

            method == "GET"

            and path in [

                "",

                "/"

            ]

        ):

            return success(

                {

                    "name":
                        "REMADEF Platform API",

                    "version":
                        "1.0.0",

                    "status":
                        "online",

                    "endpoints": [

                        "GET /",

                        "GET /api/health",

                        "GET /api/profile?account_id=...",

                        "POST /api/profile",

                        "PUT /api/profile",

                        "POST /api/profile/create"

                    ]

                },

                "REMADEF Platform API is online."

            )

        # ----------------------------------------------------
        # HEALTH
        # ----------------------------------------------------

        if (

            method == "GET"

            and path == "/api/health"

        ):

            return handle_health()

        # ----------------------------------------------------
        # GET PROFILE
        # ----------------------------------------------------

        if (

            method == "GET"

            and path == "/api/profile"

        ):

            return handle_get_profile(
                req
            )

        # ----------------------------------------------------
        # CREATE PROFILE
        # ----------------------------------------------------

        if (

            method == "POST"

            and path == "/api/profile/create"

        ):

            return handle_create_profile(
                req
            )

        # ----------------------------------------------------
        # CREATE OR UPDATE PROFILE
        # ----------------------------------------------------

        if (

            method == "POST"

            and path == "/api/profile"

        ):

            return handle_update_profile(
                req
            )

        # ----------------------------------------------------
        # UPDATE PROFILE
        # ----------------------------------------------------

        if (

            method == "PUT"

            and path == "/api/profile"

        ):

            return handle_update_profile(
                req
            )

        # ----------------------------------------------------
        # NOT FOUND
        # ----------------------------------------------------

        return error(

            "Endpoint not found.",

            404

        )

    except ValueError as exc:

        return error(

            str(
                exc
            ),

            400

        )

    except Exception as exc:

        print(
            "REMADEF API ERROR:",
            repr(
                exc
            )
        )

        return error(

            "Internal server error.",

            500,

            str(
                exc
            )

        )
