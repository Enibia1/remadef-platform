def main(context):
    return context.res.json({
        "success": True,
        "message": "REMADEF Platform API is running",
        "method": context.req.method,
        "path": context.req.path,
        "body": context.req.body
    })
