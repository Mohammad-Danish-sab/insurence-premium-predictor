from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from bson import ObjectId

from app.models.user import (
    UserSignup,
    UserLogin,
    UserUpdateProfile,
    ChangePassword,
    UserInDB
)

from app.database import get_db
from app.config import settings


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================
# PASSWORD FUNCTIONS
# =========================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# =========================
# JWT TOKEN
# =========================

def create_access_token(data: dict):
    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload.update({
        "exp": expire
    })

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return token


# =========================
# FORMAT USER
# =========================

def format_user(user):
    return {
        "id": str(user["_id"]),
        "full_name": user.get("full_name"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "role": user.get("role", "user"),
        "avatar_url": user.get("avatar_url"),
        "created_at": user.get("created_at")
    }


# =========================
# CREATE USER
# =========================

async def create_user(user: UserSignup):
    db = get_db()

    existing_user = await db.users.find_one({
        "email": user.email
    })

    if existing_user:
        raise ValueError("Email already registered")

    user_data = {
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "hashed_password": hash_password(user.password),
        "role": getattr(user, "role", "user"),
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = await db.users.insert_one(user_data)

    inserted_user = await db.users.find_one({
        "_id": result.inserted_id
    })

    token = create_access_token({
        "sub": str(result.inserted_id),
        "role": inserted_user["role"]
    })

    return {
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": format_user(inserted_user)
    }


# =========================
# LOGIN USER
# =========================

async def login_user(user: UserLogin):
    db = get_db()

    db_user = await db.users.find_one({
        "email": user.email
    })

    # USER NOT FOUND
    if not db_user:
        return None

    # PASSWORD FIELD MISSING
    if "hashed_password" not in db_user:
        raise ValueError(
            "Password not found for this account"
        )

    # VERIFY PASSWORD
    valid_password = verify_password(
        user.password,
        db_user["hashed_password"]
    )

    if not valid_password:
        return None

    # CHECK ACTIVE
    if not db_user.get("is_active", True):
        raise ValueError(
            "Account is deactivated"
        )

    # UPDATE LAST LOGIN
    await db.users.update_one(
        {"_id": db_user["_id"]},
        {
            "$set": {
                "last_login": datetime.utcnow()
            }
        }
    )

    token = create_access_token({
        "sub": str(db_user["_id"]),
        "role": db_user.get("role", "user")
    })

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": format_user(db_user)
    }


# =========================
# GET USER
# =========================

async def get_user_by_id(user_id: str):
    db = get_db()

    user = await db.users.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        return None

    return format_user(user)


# =========================
# UPDATE PROFILE
# =========================

async def update_profile(
    user_id: str,
    data: UserUpdateProfile
):
    db = get_db()

    update_fields = {
        k: v
        for k, v in data.dict().items()
        if v is not None
    }

    if update_fields:
        update_fields["updated_at"] = datetime.utcnow()

        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_fields}
        )

    updated_user = await db.users.find_one({
        "_id": ObjectId(user_id)
    })

    return format_user(updated_user)


# =========================
# CHANGE PASSWORD
# =========================

async def change_password(
    user_id: str,
    data: ChangePassword
):
    db = get_db()

    user = await db.users.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        raise ValueError("User not found")

    valid_password = verify_password(
        data.old_password,
        user["hashed_password"]
    )

    if not valid_password:
        raise ValueError(
            "Old password is incorrect"
        )

    new_hashed_password = hash_password(
        data.new_password
    )

    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "hashed_password": new_hashed_password,
                "updated_at": datetime.utcnow()
            }
        }
    )


# =========================
# GET ALL USERS
# =========================

async def get_all_users(
    skip: int = 0,
    limit: int = 20
):
    db = get_db()

    cursor = db.users.find(
        {},
        {
            "hashed_password": 0
        }
    ).skip(skip).limit(limit)

    users = []

    async for user in cursor:
        users.append(format_user(user))

    return users