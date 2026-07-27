# ============================================================
# REMADEF USER SERVICE
# Appwrite Cloud Function
# ============================================================

from auth import get_users


# ============================================================
# GET USER
# ============================================================

def get_user(user_id):

    if not user_id:

        return None


    try:

        users = get_users()


        return users.get(

            user_id

        )


    except Exception:

        return None


# ============================================================
# GET USER DATA
# ============================================================

def get_user_data(user_id):

    user = get_user(

        user_id

    )


    if not user:

        return None


    return {

        "id":
            user.id,

        "email":
            user.email,

        "phone":
            user.phone,

        "name":
            user.name,

        "status":
            user.status,

        "registration":
            user.registration,

        "emailVerification":
            user.email_verification,

        "phoneVerification":
            user.phone_verification

    }
