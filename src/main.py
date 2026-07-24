def main(context):
    request = context.req

    method = request.method
    path = request.path or "/"

    if method == "OPTIONS":
        return context.res.empty()

    if method == "GET" and path == "/":
        return context.res.json({
            "success": True,
            "service": "REMADEF Platform API",
            "status": "online",
            "version": "1.0.0"
        })

    if method == "GET" and path == "/api/health":
        return context.res.json({
            "success": True,
            "service": "REMADEF Platform API",
            "status": "healthy"
        })

    return context.res.json({
        "success": False,
        "error": "Endpoint not found",
        "path": path,
        "method": method
    }, 404)
