from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    user  = "user"
    agent = "agent"
    admin = "admin"


# REQUEST SCHEMAS (incoming data)

class UserSignup(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=50)
    email:     EmailStr
    password:  str = Field(..., min_length=6, max_length=100)
    phone:     Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
    role:      UserRole = UserRole.user  # default role

    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "Rahul Sharma",
                "email": "rahul@example.com",
                "password": "securepass123",
                "phone": "+919876543210",
                "role": "user"
            }
        }


class UserLogin(BaseModel):
    email:    EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "rahul@example.com",
                "password": "securepass123"
            }
        }


class UserUpdateProfile(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=50)
    phone:     Optional[str] = Field(None, pattern=r"^\+?[0-9]{10,15}$")
    username:   Optional[str] = None 
    avatar_url: Optional[str] = None


class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)


# RESPONSE SCHEMAS (outgoing data)

class UserResponse(BaseModel):
    id:         str
    full_name:  str
    email:      str
    phone:      Optional[str]
    role:       UserRole
    avatar_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token:  str
    token_type:    str = "bearer"
    expires_in:    int  # seconds
    user:          UserResponse


# DATABASE SCHEMA (stored in MongoDB)

class UserInDB(BaseModel):
    full_name:      str
    email:          str
    hashed_password: str
    phone:          Optional[str] = None
    role:           UserRole = UserRole.user
    username:         Optional[str]  = None 
    avatar_url:     Optional[str] = None
    is_active:      bool = True
    is_verified:    bool = False
    created_at:     datetime = Field(default_factory=datetime.utcnow)
    updated_at:     datetime = Field(default_factory=datetime.utcnow)
    last_login:     Optional[datetime] = None
    prediction_count: int = 0  # track how many predictions user made