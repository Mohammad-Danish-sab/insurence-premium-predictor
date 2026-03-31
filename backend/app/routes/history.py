from fastapi import APIRouter, Depends, HTTPException, Query
from app.middleware.auth_middleware import get_current_user
from app.database import get_db
from bson import ObjectId

router = APIRouter()

@router.get("/")
async def get_history(
    page:  int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
    current_user: dict = Depends(get_current_user)
):
    db     = get_db()
    skip   = (page - 1) * limit

    cursor = db.predictions.find(
        {"user_id": current_user["id"]}
    ).sort("created_at", -1).skip(skip).limit(limit)

    predictions = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        predictions.append(doc)

    total = await db.predictions.count_documents({"user_id": current_user["id"]})

    return {
        "predictions": predictions,
        "total":       total,
        "page":        page,
        "pages":       (total + limit - 1) // limit
    }

