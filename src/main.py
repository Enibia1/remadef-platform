
import json
from typing import Any

def json_response(
body: dict[str, Any],
status_code: int = 200
) -> dict[str, Any]:
"""
Create a standard Appwrite HTTP response.
"""

return {
    "statusCode": status_code,
    "headers": {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    "body": json.dumps(body),
}

def main(context):
"""
REMADEF Platform API entrypoint.
"""

request = context.req

# Browser CORS preflight request
if request.method == "OPTIONS":
    return json_response({}, 204)

path = request.path or "/"
method = request.method

# API root
if path == "/" and method == "GET":
    return json_response({
        "success": True,
        "service": "REMADEF Platform API",
        "status": "online",
        "version": "1.0.0"
    })

# Health check
if path == "/api/health" and method == "GET":
    return json_response({
        "success": True,
        "service": "REMADEF Platform API",
        "status": "healthy"
    })

# Future API routes
return json_response({
    "success": False,
    "error": "Endpoint not found",
    "path": path,
    "method": method
}, 404)
