import json
import os
import traceback
from datetime import datetime, timezone

from appwrite.client import Client
from appwrite.services.account import Account
from appwrite.services.tables_db import TablesDB

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

APPWRITE_ENDPOINT = (
"https://fra.cloud.appwrite.io/v1"
)

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

def get_dynamic_key(context):

dynamic_key = os.environ.get(
    "APPWRITE_FUNCTION_API_KEY"
)

if dynamic_key:
    return dynamic_key

try:
    dynamic_key = context.req.headers.get(
        "x-appwrite-key"
    )
except Exception:
    dynamic_key = None

if not dynamic_key:
    raise RuntimeError(
        "Appwrite dynamic API key is missing."
    )

return dynamic_key

def get_client(context):

client = Client()

client.set_endpoint(
    APPWRITE_ENDPOINT
)

client.set_project(
    PROJECT_ID
)

client.set_key(
    get_dynamic_key(context)
)

return client

def get_account_service(context):

return Account(
    get_client(context)
)

def get_tables_db(context):

return TablesDB(
    get_client(context)
)

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
    (completed / total) * 100
)

def create_profile(
account_id,
email="",
phone="",
context=None
):

tables_db = get_tables_db(
    context
)

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

def find_profile(
account_id,
context
):

tables_db = get_tables_db(
    context
)

result = tables_db.list_rows(
    database_id=DATABASE_ID,
    table_id=PROFILES_TABLE_ID,
    queries=[
        f'equal("account_id", "{account_id}")'
    ],
    total=False
)

rows = result.get(
    "rows",
    []
)

if not rows:
    return None

return rows[0]

def update_profile(
account_id,
profile_data,
context
):

tables_db = get_tables_db(
    context
)

existing = find_profile(
    account_id,
    context
)

if not existing:

    return create_profile(
        account_id=account_id,
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

            value = json.dumps(
                value
            )

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

def extract_user_id(user):

if hasattr(
    user,
    "model_dump"
):

    user_data = user.model_dump()

elif hasattr(
    user,
    "dict"
):

    user_data = user.dict()

else:

    user_data = vars(
        user
    )

user_id = (
    user_data.get(
        "$id"
    )
    or user_data.get(
        "id"
    )
)

if not user_id:

    raise RuntimeError(
        "Account was created but no user ID was returned."
    )

return user_id

def register_user(
data,
context
):

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

if phone.lower() in [
    "none",
    "null"
]:

    phone = ""

if not email and not phone:

    return error(
        "Email or phone number is required."
    )

if len(password) < 8:

    return error(
        "Password must contain at least 8 characters."
    )

context.log(
    "REGISTRATION: Starting account creation."
)

account_service = get_account_service(
    context
)

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
        "ACCOUNT CREATION FAILED: "
        f"{type(exc).__name__}: "
        f"{str(exc)}"
    )

    message = str(
        exc
    )

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

context.log(
    "REGISTRATION: Account created."
)

try:

    user_id = extract_user_id(
        user
    )

except Exception as exc:

    context.error(
        "USER ID EXTRACTION FAILED: "
        f"{type(exc).__name__}: "
        f"{str(exc)}"
    )

    return error(
        "Account was created, but the user ID could not be retrieved.",
        500
    )

context.log(
    "REGISTRATION: User ID extracted."
)

try:

    context.log(
        "REGISTRATION: Starting profile creation."
    )

    profile = create_profile(
        account_id=user_id,
        email=email,
        phone=phone,
        context=context
    )

    context.log(
        "REGISTRATION: Profile created."
    )

except Exception as exc:

    context.error(
        "PROFILE CREATION FAILED: "
        f"{type(exc).__name__}: "
        f"{str(exc)}"
    )

    return error(
        "Account was created, but the profile could not be created.",
        500
    )

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

def health_check():

return success(
    {
        "service": "REMADEF Platform API",
        "status": "healthy"
    },
    "REMADEF Platform API is running."
)

def route_request(
request,
context
):

method = request.method.upper()

path = request.path

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

if (
    method == "GET"
    and path == "/api/health"
):

    return health_check()

if (
    method == "POST"
    and path == "/api/register"
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
