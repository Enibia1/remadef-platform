import json
import re
import os
from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.id import ID


# ============================================================
# CORS HEADERS
# ============================================================

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://enibia1.github.io",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
}


def response(context, data, status=200):

    return context.res.json(
        data,
        status,
        CORS_HEADERS
    )


def main(context):

    request = context.req

    method = request.method

    path = request.path or "/"


    # ========================================================
    # CORS PREFLIGHT
    # ========================================================

    if method == "OPTIONS":

        return response(
            context,
            {
                "success": True
            },
            204
        )


    # ========================================================
    # API STATUS
    # ========================================================

    if method == "GET" and path == "/":

        return response(
            context,
            {
                "success": True,
                "service": "REMADEF Platform API",
                "status": "online",
                "version": "1.0.0"
            }
        )


    # ========================================================
    # API HEALTH
    # ========================================================

    if method == "GET" and path == "/api/health":

        return response(
            context,
            {
                "success": True,
                "service": "REMADEF Platform API",
                "status": "healthy"
            }
        )


    # ========================================================
    # ACCOUNT REGISTRATION
    # ========================================================

    if method == "POST" and path == "/api/register":

        try:

            body = request.body or {}


            if isinstance(body, str):

                body = json.loads(body)


            email = str(
                body.get("email", "")
            ).strip().lower()


            password = str(
                body.get("password", "")
            )


            # ------------------------------------------------
            # EMAIL VALIDATION
            # ------------------------------------------------

            if not email:

                return response(
                    context,
                    {
                        "success": False,
                        "error": "Email is required"
                    },
                    400
                )


            if not re.match(
                r"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                email
            ):

                return response(
                    context,
                    {
                        "success": False,
                        "error": "Invalid email address"
                    },
                    400
                )


            # ------------------------------------------------
            # PASSWORD VALIDATION
            # ------------------------------------------------

            if len(password) < 8:

                return response(
                    context,
                    {
                        "success": False,
                        "error":
                        "Password must be at least 8 characters"
                    },
                    400
                )


            # ------------------------------------------------
            # APPWRITE AUTH USER CREATION
            # ------------------------------------------------

            try:
                client = Client()
                client.set_endpoint(os.environ.get("APPWRITE_FUNCTION_ENDPOINT", "https://fra.cloud.appwrite.io/v1"))
                client.set_project(os.environ.get("APPWRITE_FUNCTION_PROJECT_ID"))
                client.set_key(os.environ.get("APPWRITE_API_KEY"))

                users = Users(client)

                user = users.create(
                    user_id=ID.unique(),
                    email=email,
                    password=password
                )

                # FIXED: Using dot notation (user.$id and user.email) instead of subscript brackets
                return response(
                    context,
                    {
                        "success": True,
                        "message": "Account created successfully in Appwrite Auth",
                        "userId": user.$id,
                        "email": user.email
                    },
                    200
                )

            except Exception as appwrite_error:
                return response(
                    context,
                    {
                        "success": False,
                        "error": f"Registration failed: {str(appwrite_error)}"
                    },
                    400
                )


        except Exception:

            return response(
                context,
                {
                    "success": False,
                    "error":
                    "Unable to process registration"
                },
                500
            )


    # ========================================================
    # UNKNOWN ENDPOINT
    # ========================================================

    # FIXED: Added the missing closing parenthesis for the response() function call
    return response(
        context,
        {
            "success": False,
            "error": "Endpoint not found",
            "path": path,
            "method": method
        },
        404
    )
