from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from bson import ObjectId
from app.models.user import UserSignup, UserLogin, UserUpdateProfile, ChangePassword, UserInDB
from app.database import get_db
from app.config import settings


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

async def create_user(user: UserSignup) -> dict:
    db = get_db()

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
