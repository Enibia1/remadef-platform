# ============================================================
# REMADEF PLATFORM API
# Account Registration
# Login
# Profile Management
# Appwrite Cloud Function - Python 3.14
# ============================================================

import os
import json
import re
import secrets
import hashlib
from datetime import datetime, timezone

from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.services.users import Users
from appwrite.query import Query


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

def json_response(
    res,
    data,
    status_code=200
):

    return res.json(

        data,

        status_code

    )


def error_response(
    res,
    message,
    status_code=400
):

    return res.json(

        {
            "success": False,
            "message": message
        },

        status_code

    )


# ============================================================
# TIME
# ============================================================

def now_iso():

    return datetime.now(

        timezone.utc

    ).isoformat()


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

    api_key = os.environ.get(

        "APPWRITE_FUNCTION_API_KEY"

    )

    if not api_key:

        raise RuntimeError(

            "APPWRITE_FUNCTION_API_KEY is missing."

        )

    client.set_key(

        api_key

    )

    return client


# ============================================================
# APPWRITE SERVICES
# ============================================================

def get_tables_db():

    return TablesDB(

        get_client()

    )


def get_users():

    return Users(

        get_client()

    )


# ============================================================
# REQUEST BODY
# ============================================================

def parse_body(req):

    body = getattr(

        req,

        "body",

        None

    )


    if not body:

        return {}


    if isinstance(

        body,

        dict

    ):

        return body


    if isinstance(

        body,

        bytes

    ):

        body = body.decode(

            "utf-8"

        )


    if isinstance(

        body,

        str

    ):

        try:

            return json.loads(

                body

            )

        except json.JSONDecodeError:

            return {}


    return {}


# ============================================================
# VALIDATION
# ============================================================

def clean_string(

    value,

    maximum=10000

):

    if value is None:

        return ""


    value = str(

        value

    ).strip()


    return value[:maximum]


def valid_email(

    email

):

    pattern = (

        r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    )


    return bool(

        re.match(

            pattern,

            email

        )

    )


def valid_password(

    password

):

    if not isinstance(

        password,

        str

    ):

        return False


    return len(

        password

    ) >= 8


# ============================================================
# PASSWORD HASHING
# ============================================================

def hash_password(

    password

):

    salt = secrets.token_hex(

        16

    )


    password_hash = hashlib.pbkdf2_hmac(

        "sha256",

        password.encode(

            "utf-8"

        ),

        salt.encode(

            "utf-8"

        ),

        120000

    ).hex()


    return (

        salt +

        ":" +

        password_hash

    )


def verify_password(

    password,

    stored_hash

):

    try:

        salt,

        password_hash = (

            stored_hash.split(

                ":",

                1

            )

        )


        calculated_hash = (

            hashlib.pbkdf2_hmac(

                "sha256",

                password.encode(

                    "utf-8"

                ),

                salt.encode(

                    "utf-8"

                ),

                120000

            ).hex()

        )


        return secrets.compare_digest(

            calculated_hash,

            password_hash

        )


    except Exception:

        return False


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


        if value is not None and str(

            value

        ).strip():

            completed += 1


    skills = profile.get(

        "skills"

    )


    if isinstance(

        skills,

        list

    ):

        if len(

            skills

        ) > 0:

            completed += 1


    elif skills:

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


# ============================================================
# SKILLS NORMALIZATION
# ============================================================

def normalize_skills(

    skills

):

    if skills is None:

        return []


    if isinstance(

        skills,

        str

    ):

        try:

            decoded = json.loads(

                skills

            )


            if isinstance(

                decoded,

                list

            ):

                skills = decoded

            else:

                skills = [

                    skills

                ]

        except json.JSONDecodeError:

            skills = [

                item.strip()

                for item in skills.split(

                    ","

                )

                if item.strip()

            ]


    if not isinstance(

        skills,

        list

    ):

        return []


    cleaned = []


    for skill in skills:

        skill = clean_string(

            skill,

            100

        )


        if skill and skill not in cleaned:

            cleaned.append(

                skill

            )


    return cleaned[:20]


# ============================================================
# PROFILE DATA
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

    "institution"

]


def sanitize_profile_data(

    data

):

    profile = {}


    for field in PROFILE_FIELDS:

        if field not in data:

            continue


        value = data.get(

            field

        )


        if field == "skills":

            profile[field] = (

                normalize_skills(

                    value

                )

            )

        else:

            profile[field] = clean_string(

                value

            )


    return profile


# ============================================================
# FIND PROFILE
# ============================================================

def get_profile_by_account_id(

    account_id

):

    tables_db = get_tables_db()


    result = tables_db.list_rows(

        database_id=DATABASE_ID,

        table_id=PROFILES_TABLE_ID,

        queries=[

            Query.equal(

                "account_id",

                account_id

            ),

            Query.limit(

                1

            )

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

    profile_data=None

):

    tables_db = get_tables_db()


    profile_data = (

        profile_data or {}

    )


    profile = {

        "account_id":

            account_id,

        "email":

            clean_string(

                profile_data.get(

                    "email",

                    ""

                )

            ),

        "first_name":

            clean_string(

                profile_data.get(

                    "first_name",

                    ""

                )

            ),

        "last_name":

            clean_string(

                profile_data.get(

                    "last_name",

                    ""

                )

            ),

        "display_name":

            clean_string(

                profile_data.get(

                    "display_name",

                    ""

                )

            ),

        "date_of_birth":

            clean_string(

                profile_data.get(

                    "date_of_birth",

                    ""

                )

            ),

        "gender":

            clean_string(

                profile_data.get(

                    "gender",

                    ""

                )

            ),

        "country":

            clean_string(

                profile_data.get(

                    "country",

                    ""

                )

            ),

        "state":

            clean_string(

                profile_data.get(

                    "state",

                    ""

                )

            ),

        "city":

            clean_string(

                profile_data.get(

                    "city",

                    ""

                )

            ),

        "phone":

            clean_string(

                profile_data.get(

                    "phone",

                    ""

                )

            ),

        "headline":

            clean_string(

                profile_data.get(

                    "headline",

                    ""

                ),

                120

            ),

        "about":

            clean_string(

                profile_data.get(

                    "about",

                    ""

                ),

                1000

            ),

        "skills":

            json.dumps(

                normalize_skills(

                    profile_data.get(

                        "skills",

                        []

                    )

                )

            ),

        "education_level":

            clean_string(

                profile_data.get(

                    "education_level",

                    ""

                )

            ),

        "institution":

            clean_string(

                profile_data.get(

                    "institution",

                    ""

                )

            ),

        "profile_completion":

            0,

        "created_at":

            now_iso(),

        "updated_at":

            now_iso()

    }


    profile["profile_completion"] = (

        calculate_profile_completion(

            {

                **profile,

                "skills":

                    json.loads(

                        profile["skills"]

                    )

            }

        )

    )


    return tables_db.create_row(

        database_id=DATABASE_ID,

        table_id=PROFILES_TABLE_ID,

        row_id="unique()",

        data=profile

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


    clean_data = (

        sanitize_profile_data(

            profile_data

        )

    )


    if not existing_profile:

        return create_profile(

            account_id,

            clean_data

        )


    current_profile = dict(

        existing_profile

    )


    for key, value in clean_data.items():

        if key == "skills":

            current_profile[key] = value

        else:

            current_profile[key] = value


    completion = (

        calculate_profile_completion(

            current_profile

        )

    )


    update_data = {}


    for key, value in clean_data.items():

        if key == "skills":

            update_data[key] = json.dumps(

                value

            )

        else:

            update_data[key] = value


    update_data[

        "profile_completion"

    ] = completion


    update_data[

        "updated_at"

    ] = now_iso()


    return tables_db.update_row(

        database_id=DATABASE_ID,

        table_id=PROFILES_TABLE_ID,

        row_id=existing_profile["$id"],

        data=update_data

    )


# ============================================================
# REGISTER ACCOUNT
# ============================================================

def register_account(

    payload

):

    email = clean_string(

        payload.get(

            "email",

            ""

        ),

        320

    ).lower()


    phone = clean_string(

        payload.get(

            "phone",

            ""

        ),

        30

    )


    password = payload.get(

        "password",

        ""

    )


    if not email and not phone:

        return {

            "success": False,

            "message":

                "Email or phone number is required."

        }, 400


    if not valid_password(

        password

    ):

        return {

            "success": False,

            "message":

                "Password must be at least 8 characters."

        }, 400


    if email and not valid_email(

        email

    ):

        return {

            "success": False,

            "message":

                "Please enter a valid email address."

        }, 400


    users = get_users()


    try:

        if email:

            user = users.create(

                user_id="unique()",

                email=email,

                password=password

            )

        else:

            user = users.create(

                user_id="unique()",

                phone=phone,

                password=password

            )


    except Exception as error:

        message = str(

            error

        )


        if (

            "already exists"

            in message.lower()

            or "duplicate"

            in message.lower()

        ):

            return {

                "success": False,

                "message":

                    "An account with these credentials already exists."

            }, 409


        raise error


    account_id = user.get(

        "$id"

    )


    profile = create_profile(

        account_id,

        {

            "email":

                email,

            "phone":

                phone

        }

    )


    return {

        "success": True,

        "message":

            "REMADEF account created successfully.",

        "account": {

            "id":

                account_id,

            "email":

                email,

            "phone":

                phone

        },

        "profile": {

            "id":

                profile.get(

                    "$id"

                ),

            "profile_completion":

                profile.get(

                    "profile_completion",

                    0

                )

        }

    }, 201


# ============================================================
# LOGIN
# ============================================================

def login_account(

    payload

):

    email = clean_string(

        payload.get(

            "email",

            ""

        ),

        320

    ).lower()


    phone = clean_string(

        payload.get(

            "phone",

            ""

        ),

        30

    )


    password = payload.get(

        "password",

        ""

    )


    if not password:

        return {

            "success": False,

            "message":

                "Password is required."

        }, 400


    if not email and not phone:

        return {

            "success": False,

            "message":

                "Email or phone number is required."

        }, 400


    users = get_users()


    user = None


    if email:

        result = users.list(

            queries=[

                Query.equal(

                    "email",

                    email

                ),

                Query.limit(

                    1

                )

            ]

        )


        users_list = result.get(

            "users",

            []

        )


        if users_list:

            user = users_list[0]


    else:

        result = users.list(

            queries=[

                Query.equal(

                    "phone",

                    phone

                ),

                Query.limit(

                    1

                )

            ]

        )


        users_list = result.get(

            "users",

            []

        )


        if users_list:

            user = users_list[0]


    if not user:

        return {

            "success": False,

            "message":

                "Invalid email, phone number or password."

        }, 401


    account_id = user.get(

        "$id"

    )


    profile = get_profile_by_account_id(

        account_id

    )


    return {

        "success": True,

        "message":

            "Login successful.",

        "account": {

            "id":

                account_id,

            "email":

                user.get(

                    "email",

                    ""

                ),

            "phone":

                user.get(

                    "phone",

                    ""

                ),

            "name":

                user.get(

                    "name",

                    ""

                )

        },

        "profile":

            profile

    }, 200


# ============================================================
# GET PROFILE
# ============================================================

def get_profile(

    account_id

):

    profile = get_profile_by_account_id(

        account_id

    )


    if not profile:

        return None


    if isinstance(

        profile.get(

            "skills"

        ),

        str

    ):

        try:

            profile["skills"] = json.loads(

                profile["skills"]

            )

        except json.JSONDecodeError:

            profile["skills"] = normalize_skills(

                profile["skills"]

            )


    return profile


# ============================================================
# ROUTER
# ============================================================

def route_request(

    req,

    res,

    log

):

    method = (

        getattr(

            req,

            "method",

            "GET"

        )

        or "GET"

    ).upper()


    path = (

        getattr(

            req,

            "path",

            "/"

        )

        or "/"

    )


    log(

        f"REMADEF API REQUEST: {method} {path}"

    )


    # --------------------------------------------------------
    # HEALTH
    # --------------------------------------------------------

    if (

        method == "GET"

        and path == "/"

    ):

        return json_response(

            res,

            {

                "success": True,

                "service":

                    "REMADEF Platform API",

                "status":

                    "online"

            }

        )


    if (

        method == "GET"

        and path == "/api/health"

    ):

        return json_response(

            res,

            {

                "success": True,

                "status":

                    "healthy",

                "service":

                    "REMADEF Platform API",

                "database":

                    DATABASE_ID,

                "table":

                    PROFILES_TABLE_ID

            }

        )


    # --------------------------------------------------------
    # BODY
    # --------------------------------------------------------

    payload = parse_body(

        req

    )


    # --------------------------------------------------------
    # REGISTER
    # --------------------------------------------------------

    if (

        method == "POST"

        and path == "/api/register"

    ):

        try:

            data, status = (

                register_account(

                    payload

                )

            )


            return json_response(

                res,

                data,

                status

            )


        except Exception as error:

            log(

                f"REGISTER ERROR: {error}"

            )


            return error_response(

                res,

                "Registration failed. Please try again.",

                500

            )


    # --------------------------------------------------------
    # LOGIN
    # --------------------------------------------------------

    if (

        method == "POST"

        and path == "/api/login"

    ):

        try:

            data, status = (

                login_account(

                    payload

                )

            )


            return json_response(

                res,

                data,

                status

            )


        except Exception as error:

            log(

                f"LOGIN ERROR: {error}"

            )


            return error_response(

                res,

                "Login failed. Please try again.",

                500

            )


    # --------------------------------------------------------
    # PROFILE ID
    # --------------------------------------------------------

    profile_match = re.match(

        r"^/api/profile/([^/]+)$",

        path

    )


    if profile_match:

        account_id = (

            profile_match.group(

                1

            )

        )


        # ----------------------------------------------------
        # GET PROFILE
        # ----------------------------------------------------

        if method == "GET":

            try:

                profile = get_profile(

                    account_id

                )


                if not profile:

                    return error_response(

                        res,

                        "Profile not found.",

                        404

                    )


                return json_response(

                    res,

                    {

                        "success": True,

                        "profile":

                            profile

                    }

                )


            except Exception as error:

                log(

                    f"GET PROFILE ERROR: {error}"

                )


                return error_response(

                    res,

                    "Unable to load profile.",

                    500

                )


        # ----------------------------------------------------
        # UPDATE PROFILE
        # ----------------------------------------------------

        if method in (

            "PUT",

            "PATCH"

        ):

            try:

                profile = update_profile(

                    account_id,

                    payload

                )


                return json_response(

                    res,

                    {

                        "success": True,

                        "message":

                            "Profile updated successfully.",

                        "profile":

                            get_profile(

                                account_id

                            )

                    }

                )


            except Exception as error:

                log(

                    f"UPDATE PROFILE ERROR: {error}"

                )


                return error_response(

                    res,

                    "Unable to update profile.",

                    500

                )


    # --------------------------------------------------------
    # 404
    # --------------------------------------------------------

    return error_response(

        res,

        "Route not found.",

        404

    )


# ============================================================
# APPWRITE FUNCTION ENTRYPOINT
# ============================================================

def main(context):

    req = context.req

    res = context.res

    log = context.log

    error = context.error


    try:

        return route_request(

            req,

            res,

            log

        )


    except Exception as exception:

        error(

            f"UNHANDLED ERROR: {exception}"

        )


        return error_response(

            res,

            "Internal server error.",

            500

        )
