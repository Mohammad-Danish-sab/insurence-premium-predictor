from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database import get_db

from app.middleware.admin_middleware import admin_required

from app.schemas.contact_schema import ContactCreate

from app.models.contact_model import contact_structure

router = APIRouter()