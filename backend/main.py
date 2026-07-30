# ==============================================================================
# REMADEF PLATFORM - MAIN APPWRITE FUNCTION ENTRY POINT (main.py)
# ==============================================================================
# Author: Onyekachi Kizito Chetachi / Remora Limited
# Description: HTTP server routing, request context parsing, and dispatcher.
# ==============================================================================

import json
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.users import Users

# Import modular financial engine routes
from financial_engine import (
    handle_get_wallet_balance,
    handle_fiat_deposit,
    handle_gift_card_redemption,
    handle_escrow_release,
    handle_get_user_transactions,
    handle_admin_mint_gift_cards,
    handle_admin_list_gift_cards,
    handle_baas_payment_webhook,
    handle_user_kyc_submission
)


# ------------------------------------------------------------------------------
# 1. HELPER RESPONSE & PARSING UTILITIES
# ------------------------------------------------------------------------------

def success(data, message="Request successful", status_code=200):
    return {
        "success": True,
        "message": message,
        "data": data,
        "code": status_code
    }


def error(message="An error occurred", status_code=400):
    return {
        "success": False,
        "message": message,
        "data": None,
        "code": status_code
    }


def parse_json_body(req):
    try:
        if hasattr(req, "body_json") and req.body_json:
            return req.body_json
        if hasattr(req, "body") and req.body:
            if isinstance(req.body, str):
                return json.loads(req.body)
            return req.body
        return {}
    except Exception:
        return {}


def convert_to_dict(appwrite_document_or_list):
    """Safely convert Appwrite SDK models or dictionaries into standard Python dicts."""
    if hasattr(appwrite_document_or_list, "to_dict"):
        return appwrite_document_or_list.to_dict()
    if isinstance(appwrite_document_or_list, dict):
        return {k: convert_to_dict(v) for k, v in appwrite_document_or_list.items()}
    if isinstance(appwrite_document_or_list, list):
        return [convert_to_dict(item) for item in appwrite_document_or_list]
    return appwrite_document_or_list


# ------------------------------------------------------------------------------
# 2. APPWRITE CLIENT & SERVICES INITIALIZER
# ------------------------------------------------------------------------------

def get_tables_db(context):
    client = Client()
    client.set_endpoint(os_env(context, "APPWRITE_FUNCTION_ENDPOINT", "https://cloud.appwrite.io/v1"))
    client.set_project(os_env(context, "APPWRITE_FUNCTION_PROJECT_ID", ""))
    client.set_key(os_env(context, "APPWRITE_API_KEY", ""))
    return Databases(client)


def get_current_user(context):
    """Extract authenticated user session context from Appwrite request headers."""
    try:
        client = Client()
        client.set_endpoint(os_env(context, "APPWRITE_FUNCTION_ENDPOINT", "https://cloud.appwrite.io/v1"))
        client.set_project(os_env(context, "APPWRITE_FUNCTION_PROJECT_ID", ""))
        
        # Forward user JWT or session token if present
        jwt_token = context.req.headers.get("x-appwrite-jwt") or context.req.headers.get("authorization", "").replace("Bearer ", "")
        if jwt_token:
            client.set_jwt(jwt_token)
        
        users_service = Users(client)
        user_account = users_service.get("current")
        return convert_to_dict(user_account)
    except Exception as auth_err:
        raise Exception(f"Authentication failed: {str(auth_err)}")


def os_env(context, key, default):
    if hasattr(context, "req") and hasattr(context.req, "env") and key in context.req.env:
        return context.req.env[key]
    import os
    return os.environ.get(key, default)


# ------------------------------------------------------------------------------
# 3. CENTRALIZED ROUTE DISPATCHER
# ------------------------------------------------------------------------------

def route_request(method, path, body_data, context):
    # Wallet Balance
    if method == "GET" and path == "/api/wallet/balance":
        return handle_get_wallet_balance(context, get_current_user, get_tables_db, convert_to_dict, success, error)

    # Fiat Deposit Initialization
    if method == "POST" and path == "/api/wallet/fund/fiat":
        return handle_fiat_deposit(body_data, context, get_current_user, success, error)

    # Gift Card Redemption
    if method == "POST" and path == "/api/wallet/giftcard/redeem":
        return handle_gift_card_redemption(body_data, context, get_current_user, get_tables_db, convert_to_dict, success, error)

    # Escrow Release Milestone
    if method == "POST" and path == "/api/escrow/release":
        return handle_escrow_release(body_data, context, get_current_user, get_tables_db, convert_to_dict, success, error)

    # Transaction Audit History Log
    if method == "GET" and path == "/api/wallet/transactions":
        return handle_get_user_transactions(context, get_current_user, get_tables_db, convert_to_dict, success, error)

    # Admin: Mint Gift Cards
    if method == "POST" and path == "/api/admin/giftcards/mint":
        return handle_admin_mint_gift_cards(body_data, context, get_current_user, get_tables_db, convert_to_dict, success, error)

    # Admin: List Gift Cards
    if method == "GET" and path == "/api/admin/giftcards/list":
        return handle_admin_list_gift_cards(context, get_current_user, get_tables_db, convert_to_dict, success, error)

    # Automated Payment Webhook Receiver
    if method == "POST" and path == "/api/wallet/webhook":
        return handle_baas_payment_webhook(context, parse_json_body, get_tables_db, convert_to_dict, success, error)

    # User KYC Tier Upgrade Submission
    if method == "POST" and path == "/api/user/kyc/submit":
        return handle_user_kyc_submission(body_data, context, get_current_user, get_tables_db, convert_to_dict, success, error)

    return error("Endpoint not found.", 404)


# ------------------------------------------------------------------------------
# 4. MAIN APPWRITE ENTRYPOINT HANDLER
# ------------------------------------------------------------------------------

def main(context):
    try:
        method = context.req.method.upper()
        path = context.req.path
        body_data = parse_json_body(context.req)

        # Dispatch request through router
        response_payload = route_request(method, path, body_data, context)
        
        status_code = response_payload.get("code", 200)
        return context.res.json(response_payload, status_code)

    except Exception as exc:
        context.error(f"CRITICAL SERVER EXCEPTION: {str(exc)}")
        return context.res.json(error(f"Internal server error: {str(exc)}", 500), 500)
