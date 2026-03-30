from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse

# ── Initialize limiter ───────────────────────
limiter = Limiter(key_func=get_remote_address)


# ── Custom error handler ─────────────────────
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "error":   "Rate limit exceeded",
            "message": "Too many requests. Please wait and try again.",
            "detail":  str(exc.detail)
        }
    )
