from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.schemas.user_schema import UserCreate, UserLogin
from app.utils.password_hash import (
    hash_password,
    verify_password
)
from app.utils.jwt_handler import create_access_token

router = APIRouter()

@router.post("/login")
async def login(user: UserLogin):

    db = get_db()

    existing_user = await db.users.find_one(
        {"email": user.email}
    )

    if not existing_user:

        raise HTTPException(
            status_code=400,
            detail="Invalid email"
        )

    # CHECK BLOCKED USER
    if existing_user.get("is_blocked"):

        raise HTTPException(
            status_code=403,
            detail="Your account has been blocked"
        )

    valid_password = verify_password(
        user.password,
        existing_user["password"]
    )

    if not valid_password:

        raise HTTPException(
            status_code=400,
            detail="Invalid password"
        )

    token = create_access_token(
        {
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    )

    return {

        "access_token": token,

        "role": existing_user["role"]
    }