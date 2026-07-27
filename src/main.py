# ============================================================
# REMADEF PLATFORM API
# Central API Router
# Appwrite Cloud Function
# ============================================================

import os

from profile import (
    get_profile,
    save_profile
)


# ============================================================
# CORS
# ============================================================

CORS_HEADERS = {

    "Access-Control-Allow-Origin":
        "https://enibia1.github.io",

    "Access-Control-Allow-Methods":
        "GET, POST, PUT, OPTIONS",

    "Access-Control-Allow-Headers":
        "Content-Type, X-Appwrite-User-Id",

    "Access-Control-Max-Age":
        "86400"

}


# ============================================================
# RESPONSE
# ============================================================

def response(
    context,
    data,
    status=200
):

    return context.res.json(

        data,

        status,

        CORS_HEADERS

    )


# ============================================================
# MAIN ROUTER
# ============================================================

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

                "service":
                    "REMADEF Platform API",

                "status":
                    "online",

                "version":
                    "2.0.0"

            }

        )


    # ========================================================
    # HEALTH CHECK
    # ========================================================

    if method == "GET" and path == "/api/health":

        return response(

            context,

            {

                "success": True,

                "service":
                    "REMADEF Platform API",

                "status":
                    "healthy"

            }

        )


    # ========================================================
    # GET PROFILE
    # ========================================================

    if (

        method == "GET"

        and

        path == "/api/profile"

    ):

        return get_profile(

            context

        )


    # ========================================================
    # CREATE PROFILE
    # ========================================================

    if (

        method == "POST"

        and

        path == "/api/profile"

    ):

        return save_profile(

            context

        )


    # ========================================================
    # UPDATE PROFILE
    # ========================================================

    if (

        method == "PUT"

        and

        path == "/api/profile"

    ):

        return save_profile(

            context

        )


    # ========================================================
    # UNKNOWN ENDPOINT
    # ========================================================

    return response(

        context,

        {

            "success": False,

            "error":
                "Endpoint not found",

            "path":
                path,

            "method":
                method

        },

        404

    )
