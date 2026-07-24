import json
import re


def main(context):
    request = context.req

    method = request.method
    path = request.path or "/"

    # ========================================================
    # API STATUS
    # ========================================================

    if method == "GET" and path == "/":
        return context.res.json({
            "success": True,
            "service": "REMADEF Platform API",
            "status": "online",
            "version": "1.0.0"
        })


    # ========================================================
    # API HEALTH
    # ========================================================

    if method == "GET" and path == "/api/health":
        return context.res.json({
            "success": True,
            "service": "REMADEF Platform API",
            "status": "healthy"
        })


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


            # Validate email

            if not email:

                return context.res.json(
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

                return context.res.json(
                    {
                        "success": False,
                        "error": "Invalid email address"
                    },
                    400
                )


            # Validate password

            if len(password) < 8:

                return context.res.json(
                    {
                        "success": False,
                        "error":
                        "Password must be at least 8 characters"
                    },
                    400
                )


            # Temporary response

            return context.res.json({

                "success": True,

                "message":
                "Registration data received successfully",

                "email": email

            })


        except Exception as error:

            return context.res.json({

                "success": False,

                "error":
                "Unable to process registration"

            }, 500)


    # ========================================================
    # UNKNOWN ENDPOINT
    # ========================================================

    return context.res.json({

        "success": False,

        "error": "Endpoint not found",

        "path": path,

        "method": method

    }, 404)
