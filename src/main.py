import json
import re


def main(context):

    request = context.req

    method = request.method
    path = request.path or "/"


    # ========================================================
    # CORS HEADERS
    # ========================================================

    CORS_HEADERS = {

        "Access-Control-Allow-Origin":
        "https://enibia1.github.io",

        "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS",

        "Access-Control-Allow-Headers":
        "Content-Type",

        "Access-Control-Max-Age":
        "86400"

    }


    # ========================================================
    # CORS PREFLIGHT
    # ========================================================

    if method == "OPTIONS":

        return context.res.json(

            {
                "success": True
            },

            200,

            CORS_HEADERS

        )


    # ========================================================
    # API STATUS
    # ========================================================

    if method == "GET" and path == "/":

        return context.res.json(

            {

                "success": True,

                "service":
                "REMADEF Platform API",

                "status":
                "online",

                "version":
                "1.0.0"

            },

            200,

            CORS_HEADERS

        )


    # ========================================================
    # API HEALTH
    # ========================================================

    if method == "GET" and path == "/api/health":

        return context.res.json(

            {

                "success": True,

                "service":
                "REMADEF Platform API",

                "status":
                "healthy"

            },

            200,

            CORS_HEADERS

        )


    # ========================================================
    # ACCOUNT REGISTRATION
    # ========================================================

    if method == "POST" and path == "/api/register":

        try:

            # =================================================
            # READ REQUEST BODY
            # =================================================

            body = request.body or {}


            if isinstance(body, str):

                body = json.loads(body)


            # =================================================
            # EXTRACT DATA
            # =================================================

            email = str(

                body.get(
                    "email",
                    ""
                )

            ).strip().lower()


            phone = str(

                body.get(
                    "phone",
                    ""
                )

            ).strip()


            password = str(

                body.get(
                    "password",
                    ""
                )

            )


            registration_method = str(

                body.get(
                    "method",
                    "email"
                )

            )


            # =================================================
            # EMAIL REGISTRATION
            # =================================================

            if registration_method == "email":

                if not email:

                    return context.res.json(

                        {

                            "success": False,

                            "error":
                            "Email is required"

                        },

                        400,

                        CORS_HEADERS

                    )


                if not re.match(

                    r"^[^@\s]+@[^@\s]+\.[^@\s]+$",

                    email

                ):

                    return context.res.json(

                        {

                            "success": False,

                            "error":
                            "Invalid email address"

                        },

                        400,

                        CORS_HEADERS

                    )


            # =================================================
            # PHONE REGISTRATION
            # =================================================

            elif registration_method == "phone":

                if not phone:

                    return context.res.json(

                        {

                            "success": False,

                            "error":
                            "Phone number is required"

                        },

                        400,

                        CORS_HEADERS

                    )


                if not re.match(

                    r"^[0-9]{10,15}$",

                    phone

                ):

                    return context.res.json(

                        {

                            "success": False,

                            "error":
                            "Invalid phone number"

                        },

                        400,

                        CORS_HEADERS

                    )


            else:

                return context.res.json(

                    {

                        "success": False,

                        "error":
                        "Invalid registration method"

                    },

                    400,

                    CORS_HEADERS

                )


            # =================================================
            # PASSWORD VALIDATION
            # =================================================

            if len(password) < 8:

                return context.res.json(

                    {

                        "success": False,

                        "error":
                        "Password must be at least 8 characters"

                    },

                    400,

                    CORS_HEADERS

                )


            if not re.search(

                r"[a-z]",

                password

            ):

                return context.res.json(

                    {

                        "success": False,

                        "error":
                        "Password must contain a lowercase letter"

                    },

                    400,

                    CORS_HEADERS

                )


            if not re.search(

                r"[A-Z]",

                password

            ):

                return context.res.json(

                    {

                        "success": False,

                        "error":
                        "Password must contain an uppercase letter"

                    },

                    400,

                    CORS_HEADERS

                )


            if not re.search(

                r"[0-9]",

                password

            ):

                return context.res.json(

                    {

                        "success": False,

                        "error":
                        "Password must contain a number"

                    },

                    400,

                    CORS_HEADERS

                )


            # =================================================
            # TEMPORARY SUCCESS RESPONSE
            # =================================================

            return context.res.json(

                {

                    "success": True,

                    "message":
                    "Registration data received successfully",

                    "method":
                    registration_method,

                    "email":
                    email if registration_method == "email"
                    else None,

                    "phone":
                    phone if registration_method == "phone"
                    else None

                },

                200,

                CORS_HEADERS

            )


        except Exception as error:

            context.error(

                f"Registration error: {str(error)}"

            )


            return context.res.json(

                {

                    "success": False,

                    "error":
                    "Unable to process registration"

                },

                500,

                CORS_HEADERS

            )


    # ========================================================
    # UNKNOWN ENDPOINT
    # ========================================================

    return context.res.json(

        {

            "success": False,

            "error":
            "Endpoint not found",

            "path":
            path,

            "method":
            method

        },

        404,

        CORS_HEADERS

    )
