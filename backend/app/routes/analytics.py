from fastapi import APIRouter, Depends
from app.middleware.auth_middleware import require_admin
from app.database import get_db

router = APIRouter()

@router.get("/admin/analytics")
async def get_analytics(
    current_user: dict = Depends(require_admin)
):
    db = get_db()

    total_users = await db.users.count_documents({})

    total_predictions = await db.predictions.count_documents({})

    total_blogs = await db.blogs.count_documents({})

    total_contacts = await db.contacts.count_documents({})

    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "total_blogs": total_blogs,
        "total_contacts": total_contacts
    }