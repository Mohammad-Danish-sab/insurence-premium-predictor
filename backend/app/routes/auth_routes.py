from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.schemas.user_schema import UserCreate, UserLogin
from app.utils.password_hash import (
    hash_password,
    verify_password
)
from app.utils.jwt_handler import create_access_token

router = APIRouter()