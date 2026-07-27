# ============================================================
# REMADEF USERS MODULE
# ============================================================

import re

from appwrite.id import ID

from .auth import get_users


# ============================================================
# EMAIL VALIDATION
# ============================================================

def is_valid_email(email):

    return re.match(

        r"^[^@\s]+@[^@\s]+\.[^@\s]+$",

        email

    )


# ============================================================
# REGISTER USER
# ============================================================

def register_user(

    email,

    password

):

    email = str(

        email or ""

    ).strip().lower()


    password = str(

        password or ""

    )


    # --------------------------------------------------------
    # VALIDATE EMAIL
    # --------------------------------------------------------

    if not email:

        return {

            "success": False,

            "error":
                "Email is required",

            "status": 400

        }


    if not is_valid_email(

        email

    ):

        return {

            "success": False,

            "error":
                "Invalid email address",

            "status": 400

        }


    # --------------------------------------------------------
    # VALIDATE PASSWORD
    # --------------------------------------------------------

    if len(password) < 8:

        return {

            "success": False,

            "error":
                "Password must be at least 8 characters",

            "status": 400

        }


    try:

        users = get_users()


        user = users.create(

            user_id=ID.unique(),

            email=email,

            password=password

        )


        return {

            "success": True,

            "message":
                "REMADEF account created successfully",

            "account": {

                "id":
                    user.id,

                "email":
                    user.email

            },

            "next": {

                "action":
                    "complete_profile",

                "path":
                    "/profile-completion.html"

            },

            "status": 201

        }


    except Exception as error:

        error_message = str(

            error

        )


        if (

            "already exists"

            in

            error_message.lower()

        ) or (

            "user_already_exists"

            in

            error_message.lower()

        ):

            return {

                "success": False,

                "error":
                    "An account with this email already exists",

                "status": 409

            }


        return {

            "success": False,

            "error":
                "Unable to create account",

            "status": 500,

            "log":
                error_message

        }


# ============================================================
# GET CURRENT USER
# ============================================================

def get_current_user(user_id):

    if not user_id:

        return {

            "success": False,

            "error":
                "Authentication required",

            "status": 401

        }


    try:

        users = get_users()


        user = users.get(

            user_id

        )


        return {

            "success": True,

            "user": {

                "id":
                    user.id,

                "email":
                    user.email,

                "phone":
                    getattr(

                        user,

                        "phone",

                        None

                    ),

                "name":
                    getattr(

                        user,

                        "name",

                        None

                    ),

                "status":
                    user.status

            },

            "status": 200

        }


    except Exception as error:

        return {

            "success": False,

            "error":
                "User not found",

            "status": 404,

            "log":
                str(error)

        }
