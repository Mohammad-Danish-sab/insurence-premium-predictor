from fastapi import APIRouter, Depends, HTTPException, Query
from app.middleware.auth_middleware import get_current_user, require_admin
from app.database import get_db
from bson import ObjectId

router = APIRouter()