from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database import get_db

from app.middleware.admin_middleware import admin_required

from app.schemas.contact_schema import ContactCreate

from app.models.contact_model import contact_structure

router = APIRouter()

@router.post("/contact")
async def create_contact_message(
    contact: ContactCreate
):

    db = get_db()

    new_contact = contact_structure(contact)

    result = await db.contacts.insert_one(
        new_contact
    )

    return {

        "message": "Message sent successfully",

        "contact_id": str(result.inserted_id)
    }