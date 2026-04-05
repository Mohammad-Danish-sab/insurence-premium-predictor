from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from bson import ObjectId
from app.models.user import UserSignup, UserLogin, UserUpdateProfile, ChangePassword, UserInDB
from app.database import get_db
from app.config import settings
from fastapi import Depends


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    payload = data.copy()
    expire  = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload.update({"exp": expire})
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def _format_user(user: dict) -> dict:
    user["id"]  = str(user["_id"])
    user.pop("_id",             None)
    user.pop("hashed_password", None)
    return user
async def create_user(user: UserSignup, db=Depends(get_db)):

    # Check duplicate email
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise ValueError("Email already registered")

    # Build DB document
    user_doc = UserInDB(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        phone=user.phone,
        role=user.role
    )

    result = await db.users.insert_one(user_doc.dict())
    user_id = str(result.inserted_id)

    # Generate token
    token = create_access_token({"sub": user_id, "role": user.role})

    return {
        "message":      "User registered successfully ✅",
        "access_token": token,
        "token_type":   "bearer",
        "expires_in":   settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "id":        user_id,
            "full_name": user.full_name,
            "email":     user.email,
            "phone":     user.phone,
            "role":      user.role,
        }
    }



async def login_user(user: UserLogin) -> dict | None:
    db = get_db()

    db_user = await db.users.find_one({"email": user.email})
    if not db_user:
        return None

    if not verify_password(user.password, db_user["hashed_password"]):
        return None

    # Check if account is active
    if not db_user.get("is_active", True):
        raise ValueError("Account is deactivated. Contact support.")

    # Update last login
    await db.users.update_one(
        {"email": user.email},
        {"$set": {"last_login": datetime.utcnow()}}
    )

    user_id = str(db_user["_id"])
    token   = create_access_token({"sub": user_id, "role": db_user["role"]})

    return {
        "message":      "Login successful ✅",
        "access_token": token,
        "token_type":   "bearer",
        "expires_in":   settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "id":        user_id,
            "full_name": db_user["full_name"],
            "email":     db_user["email"],
            "phone":     db_user.get("phone"),
            "role":      db_user["role"],
            "avatar_url": db_user.get("avatar_url"),
        }
    }

async def get_user_by_id(user_id: str) -> dict | None:
    db = get_db()

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None

    return _format_user(user)

async def update_profile(user_id: str, data: UserUpdateProfile) -> dict:
    db = get_db()

    # Only update fields that were actually sent
    update_fields = {
        k: v for k, v in data.dict().items() if v is not None
    }
    update_fields["updated_at"] = datetime.utcnow()

    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    updated_user = await db.users.find_one({"_id": ObjectId(user_id)})
    return _format_user(updated_user)


async def change_password(user_id: str, data: ChangePassword) -> None:
    db = get_db()

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise ValueError("User not found")

    # Verify old password
    if not verify_password(data.old_password, user["hashed_password"]):
        raise ValueError("Old password is incorrect")

    # Hash and save new password
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "hashed_password": hash_password(data.new_password),
            "updated_at":      datetime.utcnow()
        }}
    )

async def get_all_users(skip: int = 0, limit: int = 20) -> list:
    db     = get_db()
    cursor = db.users.find(
        {}, {"hashed_password": 0}
    ).skip(skip).limit(limit)

    users = []
    async for user in cursor:
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        users.append(user)

    return users