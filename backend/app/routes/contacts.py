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

@router.get("/admin/contacts")
async def get_all_contacts(
    _: dict = Depends(admin_required)
):

    db = get_db()

    cursor = db.contacts.find().sort(
        "created_at",
        -1
    )

    contacts = []

    async for contact in cursor:

        contact["_id"] = str(contact["_id"])

        contacts.append(contact)

    return {
        "contacts": contacts
    }

@router.put("/admin/contacts/{contact_id}")
async def mark_contact_resolved(

    contact_id: str,

    _: dict = Depends(admin_required)
):

    db = get_db()

    try:

        result = await db.contacts.update_one(
            {
                "_id": ObjectId(contact_id)
            },
            {
                "$set": {
                    "status": "resolved"
                }
            }
        )

        if result.matched_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Contact not found"
            )

        return {
            "message": "Contact marked resolved"
        }

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid contact ID"
        )