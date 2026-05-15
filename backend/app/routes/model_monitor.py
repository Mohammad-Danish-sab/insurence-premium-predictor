from fastapi import APIRouter, Depends

from app.database import get_db

from app.middleware.admin_middleware import admin_required

router = APIRouter()