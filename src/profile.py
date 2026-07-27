# ============================================================
# REMADEF PROFILE SERVICE
# ============================================================

import os
import re
from datetime import datetime, timezone

from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.query import Query
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

PROFILE_COLLECTION_ID = os.environ.get(
    "APPWRITE_PROFILE_COLLECTION_ID"
)

FUNCTION_API_KEY = os.environ.get(
    "APPWRITE_FUNCTION_API_KEY"
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
        PROJECT_ID
    )

    if not FUNCTION_API_KEY:

        raise RuntimeError(
            "APPWRITE_FUNCTION_API_KEY is missing."
        )

    client.set_key(
        FUNCTION_API_KEY
    )

    return client


# ============================================================
# DATABASE CLIENT
# ============================================================

def get_database():

    return Databases(
        get_client()
    )


# ============================================================
# VALIDATE USER ID
# ============================================================

def validate_user_id(user_id):

    if not user_id:

        raise ValueError(
            "User ID is required."
        )

    user_id = str(
        user_id
    ).strip()

    if len(user_id) > 36:

        raise ValueError(
            "Invalid user ID."
        )

    return user_id


# ============================================================
# CLEAN TEXT
# ============================================================

def clean_text(value, max_length=5000):

    if value is None:

        return ""

    value = str(
        value
    ).strip()

    return value[:max_length]


# ============================================================
# CLEAN SKILLS
# ============================================================

def clean_skills(skills):

    if not isinstance(
        skills,
        list
    ):

        return []


    cleaned = []


    for skill in skills:

        skill = clean_text(
            skill,
            80
        )


        if not skill:

            continue


        if skill.lower() in [

            existing.lower()

            for existing in cleaned

        ]:

            continue


        cleaned.append(
            skill
        )


        if len(cleaned) >= 20:

            break


    return cleaned


# ============================================================
# PROFILE DATA
# ============================================================

PROFILE_FIELDS = [

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
# NORMALIZE PROFILE
# ============================================================

def normalize_profile(data):

    if not isinstance(
        data,
        dict
    ):

        data = {}


    profile = {}


    for field in PROFILE_FIELDS:

        value = data.get(
            field
        )


        if field == "skills":

            profile[field] = clean_skills(
                value
            )

        else:

            profile[field] = clean_text(
                value
            )


    return profile


# ============================================================
# FIND PROFILE
# ============================================================

def find_profile(user_id):

    user_id = validate_user_id(
        user_id
    )


    if not DATABASE_ID:

        raise RuntimeError(
            "APPWRITE_DATABASE_ID is missing."
        )


    if not PROFILE_COLLECTION_ID:

        raise RuntimeError(
            "APPWRITE_PROFILE_COLLECTION_ID is missing."
        )


    databases = get_database()


    try:

        result = databases.list_documents(

            database_id=DATABASE_ID,

            collection_id=PROFILE_COLLECTION_ID,

            queries=[

                Query.equal(
                    "user_id",
                    user_id
                ),

                Query.limit(
                    1
                )

            ]

        )


        documents = result.get(
            "documents",
            []
        )


        if not documents:

            return None


        return documents[0]


    except AppwriteException as error:

        raise RuntimeError(
            f"PROFILE LOOKUP ERROR: {error}"
        )


# ============================================================
# GET PROFILE
# ============================================================

def get_profile(user_id):

    profile = find_profile(
        user_id
    )


    if not profile:

        return None


    return profile


# ============================================================
# SAVE PROFILE
# ============================================================

def save_profile(

    user_id,

    profile_data

):

    user_id = validate_user_id(
        user_id
    )


    if not DATABASE_ID:

        raise RuntimeError(
            "APPWRITE_DATABASE_ID is missing."
        )


    if not PROFILE_COLLECTION_ID:

        raise RuntimeError(
            "APPWRITE_PROFILE_COLLECTION_ID is missing."
        )


    profile = normalize_profile(
        profile_data
    )


    profile["user_id"] = user_id


    now = datetime.now(
        timezone.utc
    ).isoformat()


    existing = find_profile(
        user_id
    )


    databases = get_database()


    try:

        if existing:

            document_id = existing["$id"]


            result = databases.update_document(

                database_id=DATABASE_ID,

                collection_id=PROFILE_COLLECTION_ID,

                document_id=document_id,

                data={

                    **profile,

                    "updated_at": now

                }

            )


        else:

            result = databases.create_document(

                database_id=DATABASE_ID,

                collection_id=PROFILE_COLLECTION_ID,

                document_id="unique()",

                data={

                    **profile,

                    "user_id": user_id,

                    "created_at": now,

                    "updated_at": now

                }

            )


        return result


    except AppwriteException as error:

        raise RuntimeError(
            f"SAVE PROFILE ERROR: {error}"
        )


# ============================================================
# PROFILE COMPLETION
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

        value = profile.get(
            field
        )


        if value:

            completed += 1


    if profile.get(
        "skills"
    ):

        completed += 1


    total = len(
        fields
    ) + 1


    percentage = round(

        (

            completed /

            total

        ) * 100

    )


    return min(
        percentage,
        100
    )
