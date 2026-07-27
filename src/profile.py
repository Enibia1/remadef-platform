# ============================================================
# REMADEF PLATFORM API
# APPWRITE CLOUD FUNCTION
# ============================================================

import json

from .auth import require_user

from .users import (

    register_user,

    get_current_user

)

from .profile import (

    get_profile,

    save_profile,

    delete_profile

)


# ============================================================
# CORS
# ============================================================

CORS_HEADERS = {

    "Access-Control-Allow-Origin":

        "https://enibia1.github.io",

    "Access-Control-Allow-Methods":

        "GET, POST, PUT, DELETE, OPTIONS",

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
# READ REQUEST BODY
# ============================================================

def get_body(request):

    body = request.body or {}


    if isinstance(

        body,

        str

    ):

        try:

            body = json.loads(

                body

            )

        except json.JSONDecodeError:

            return None


    if not isinstance(

        body,

        dict

    ):

        return None


    return body


# ============================================================
# LOG ERRORS
# ============================================================

def log_error(

    context,

    result

):

    if result.get(

        "log"

    ):

        context.log(

            result["log"]

        )


# ============================================================
# MAIN
# ============================================================

def main(context):

    request = context.req


    method = (

        request.method

        or

        "GET"

    ).upper()


    path = (

        request.path

        or

        "/"

    )


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
    # API ROOT
    # ========================================================

    if (

        method == "GET"

        and

        path == "/"

    ):

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

    if (

        method == "GET"

        and

        path == "/api/health"

    ):

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
    # REGISTER
    # ========================================================

    if (

        method == "POST"

        and

        path == "/api/register"

    ):

        body = get_body(

            request

        )


        if body is None:

            return response(

                context,

                {

                    "success": False,

                    "error":
                        "Invalid request body"

                },

                400

            )


        result = register_user(

            email=body.get(

                "email"

            ),

            password=body.get(

                "password"

            )

        )


        log_error(

            context,

            result

        )


        return response(

            context,

            {

                key: value

                for key, value in result.items()

                if key not in [

                    "status",

                    "log"

                ]

            },

            result.get(

                "status",

                200

            )

        )


    # ========================================================
    # CURRENT USER
    # ========================================================

    if (

        method == "GET"

        and

        path == "/api/user"

    ):

        user_id = require_user(

            request

        )


        result = get_current_user(

            user_id

        )


        log_error(

            context,

            result

        )


        return response(

            context,

            {

                key: value

                for key, value in result.items()

                if key not in [

                    "status",

                    "log"

                ]

            },

            result.get(

                "status",

                200

            )

        )


    # ========================================================
    # GET PROFILE
    # ========================================================

    if (

        method == "GET"

        and

        path == "/api/profile"

    ):

        user_id = require_user(

            request

        )


        result = get_profile(

            user_id

        )


        log_error(

            context,

            result

        )


        return response(

            context,

            {

                key: value

                for key, value in result.items()

                if key not in [

                    "status",

                    "log"

                ]

            },

            result.get(

                "status",

                200

            )

        )


    # ========================================================
    # CREATE / UPDATE PROFILE
    # ========================================================

    if (

        method in [

            "POST",

            "PUT"

        ]

        and

        path == "/api/profile"

    ):

        user_id = require_user(

            request

        )


        body = get_body(

            request

        )


        if body is None:

            return response(

                context,

                {

                    "success": False,

                    "error":
                        "Invalid request body"

                },

                400

            )


        result = save_profile(

            user_id,

            body

        )


        log_error(

            context,

            result

        )


        return response(

            context,

            {

                key: value

                for key, value in result.items()

                if key not in [

                    "status",

                    "log"

                ]

            },

            result.get(

                "status",

                200

            )

        )


    # ========================================================
    # DELETE PROFILE
    # ========================================================

    if (

        method == "DELETE"

        and

        path == "/api/profile"

    ):

        user_id = require_user(

            request

        )


        result = delete_profile(

            user_id

        )


        log_error(

            context,

            result

        )


        return response(

            context,

            {

                key: value

                for key, value in result.items()

                if key not in [

                    "status",

                    "log"

                ]

            },

            result.get(

                "status",

                200

            )

        )


    # ========================================================
    # UNKNOWN ROUTE
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
