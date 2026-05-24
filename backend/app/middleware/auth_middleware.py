from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError, ExpiredSignatureError
from bson import ObjectId
from bson.errors import InvalidId

from app.config import settings
from app.database import get_db


# =========================
# OAuth2 Scheme
# =========================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


# =========================
# Decode JWT Token
# =========================

def decode_token(token: str):

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")
        role = payload.get("role", "user")

        if not user_id:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={
                    "WWW-Authenticate": "Bearer"
                }
            )

        return {
            "id": user_id,
            "role": role
        }

    except ExpiredSignatureError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )


# =========================
# Get Current User
# =========================

async def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    token_data = decode_token(token)

    db = get_db()

    try:

        user = await db.users.find_one({
            "_id": ObjectId(token_data["id"])
        })

    except InvalidId:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID"
        )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check active account
    if not user.get("is_active", True):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account deactivated"
        )

    return {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "full_name": user.get("full_name"),
        "role": user.get("role", "user"),
        "phone": user.get("phone"),
        "avatar_url": user.get("avatar_url"),
    }


# =========================
# Admin Access
# =========================

async def require_admin(
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user


# =========================
# Agent Access
# =========================

async def require_agent(
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] not in ["agent", "admin"]:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent/Admin access required"
        )

    return current_user


# =========================
# Optional Auth
# =========================

optional_oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False
)


async def get_optional_user(
    token: str = Depends(optional_oauth2_scheme)
):

    if not token:
        return None

    try:

        token_data = decode_token(token)

        db = get_db()

        user = await db.users.find_one({
            "_id": ObjectId(token_data["id"])
        })

        if not user:
            return None

        return {
            "id": str(user["_id"]),
            "email": user.get("email"),
            "full_name": user.get("full_name"),
            "role": user.get("role", "user"),
        }

    except Exception:
        return None