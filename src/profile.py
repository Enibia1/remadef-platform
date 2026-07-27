# ============================================================
# REMADEF PROFILE MANAGEMENT
# ============================================================

import os
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
            "APPWRITE_PROJECT_ID",
            "6a634fdc00148a907132"
        )
    )

    # Appwrite provides a temporary dynamic API key
    # during function execution.
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
# TABLES DATABASE SERVICE
# ============================================================

def get_tables_db():

    client = get_client()

    return TablesDB(
        client
    )


# ============================================================
# FIND PROFILE BY ACCOUNT ID
# ============================================================

def get_profile_by_account_id(
    account_id
):

    tables_db = get_tables_db()

    result = tables_db.list_rows(
        database_id=DATABASE_ID,
        table_id=TABLE_ID,
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
# CREATE PROFILE
# ============================================================

def create_profile(
    account_id,
    email="",
    phone=""
):

    tables_db = get_tables_db()

    now = datetime.now(
        timezone.utc
    ).isoformat()

    profile_data = {

        "account_id":
            account_id,

        "email":
            email or "",

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
            phone or "",

        "headline":
            "",

        "about":
            "",

        "skills":
            "",

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

    return tables_db.create_row(
        database_id=DATABASE_ID,
        table_id=TABLE_ID,
        row_id="unique()",
        data=profile_data
    )


# ============================================================
# UPDATE PROFILE
# ============================================================

def update_profile(
    account_id,
    profile_data
):

    tables_db = get_tables_db()

    existing_profile = (

        get_profile_by_account_id(

            account_id

        )

    )

    if not existing_profile:

        return create_profile(

            account_id

        )

    row_id = existing_profile["$id"]

    now = datetime.now(
        timezone.utc
    ).isoformat()

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

        "institution",

        "profile_completion"

    ]

    update_data = {}

    for field in allowed_fields:

        if field in profile_data:

            value = profile_data[field]

            # Appwrite text column for skills
            # receives a JSON string.
            if field == "skills":

                if isinstance(
                    value,
                    list
                ):

                    import json

                    value = json.dumps(
                        value
                    )

                elif value is None:

                    value = ""

            update_data[field] = value

    update_data[
        "updated_at"
    ] = now

    return tables_db.update_row(

        database_id=DATABASE_ID,

        table_id=TABLE_ID,

        row_id=row_id,

        data=update_data

    )


# ============================================================
# PROFILE COMPLETION
# ============================================================

def calculate_profile_completion(
    profile
):

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

        value = profile.get(
            field
        )

        if (

            value is not None

            and

            str(value).strip()

        ):

            completed += 1

    skills = profile.get(
        "skills"
    )

    if skills:

        completed += 1

    total = len(
        fields
    ) + 1

    return round(

        (

            completed /

            total

        ) * 100

    )
