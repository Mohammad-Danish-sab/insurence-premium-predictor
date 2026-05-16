from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from bson import ObjectId

from app.config import settings
from app.database import get_db


# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


# Decode JWT token
def decode_token(token: str) -> dict:

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")

        role = payload.get("role")

        if not user_id:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"}
            )

        return {
            "id": user_id,
            "role": role
        }

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired or invalid",
            headers={"WWW-Authenticate": "Bearer"}
        )


# Get current authenticated user
async def get_current_user(
    token: str = Depends(oauth2_scheme)
) -> dict:

    # Decode token
    token_data = decode_token(token)

    # Get database
    db = get_db()

    # Find user
    user = await db.users.find_one(
        {
            "_id": ObjectId(token_data["id"])
        }
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Check if blocked/deactivated
    if not user.get("is_active", True):

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact support."
        )

    # Return clean user object
    return {

        "id": str(user["_id"]),

        "email": user["email"],

        "full_name": user["full_name"],

        "role": user["role"],

        "phone": user.get("phone"),

        "avatar_url": user.get("avatar_url")
    }


# Require admin access
async def require_admin(
    current_user: dict = Depends(get_current_user)
) -> dict:

    if current_user["role"] != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user


# Require agent/admin access
async def require_agent(
    current_user: dict = Depends(get_current_user)
) -> dict:

    if current_user["role"] not in ["agent", "admin"]:

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Agent or Admin access required"
        )

    return current_user


# Optional authentication
optional_oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False
)


async def get_optional_user(
    token: str = Depends(optional_oauth2_scheme)
) -> dict | None:

    if not token:
        return None

    try:

        token_data = decode_token(token)

        db = get_db()

        user = await db.users.find_one(
            {
                "_id": ObjectId(token_data["id"])
            }
        )

        if not user:
            return None

        return {

            "id": str(user["_id"]),

            "email": user["email"],

            "full_name": user["full_name"],

            "role": user["role"]
        }

    except Exception:

        return None