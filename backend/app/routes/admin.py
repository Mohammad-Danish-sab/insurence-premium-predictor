from fastapi import APIRouter, Depends, HTTPException, Query
from app.middleware.auth_middleware import get_current_user, require_admin
from app.database import get_db
from bson import ObjectId

router = APIRouter()

@router.get("/users")
async def get_all_users(
    page:  int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    _: dict = Depends(require_admin)
):
    db   = get_db()
    skip = (page - 1) * limit

    cursor = db.users.find(
        {}, {"hashed_password": 0}   # exclude password
    ).skip(skip).limit(limit)

    users = []
    async for user in cursor:
        user["_id"] = str(user["_id"])
        users.append(user)

    total = await db.users.count_documents({})
    return {"users": users, "total": total, "page": page}

@router.get("/predictions")
async def get_all_predictions(
    page:  int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    _: dict = Depends(require_admin)
):
    db   = get_db()
    skip = (page - 1) * limit

    cursor = db.predictions.find().sort(
        "created_at", -1
    ).skip(skip).limit(limit)

    predictions = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        predictions.append(doc)

    total = await db.predictions.count_documents({})
    return {"predictions": predictions, "total": total, "page": page}