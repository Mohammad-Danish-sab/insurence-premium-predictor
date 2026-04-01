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

@router.get("/{prediction_id}")
async def get_prediction(
    prediction_id: str,
    current_user:  dict = Depends(get_current_user)
):
    db = get_db()

    doc = await db.predictions.find_one({
        "_id":     ObjectId(prediction_id),
        "user_id": current_user["id"]
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Prediction not found")

    doc["_id"] = str(doc["_id"])
    return doc

@router.delete("/{prediction_id}")
async def delete_prediction(
    prediction_id: str,
    current_user:  dict = Depends(get_current_user)
):
    db     = get_db()
    result = await db.predictions.delete_one({
        "_id":     ObjectId(prediction_id),
        "user_id": current_user["id"]
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prediction not found")

    return {"message": "Prediction deleted "}


@router.get("/stats/summary")
async def get_stats(current_user: dict = Depends(get_current_user)):
    db = get_db()

    pipeline = [
        {"$match": {"user_id": current_user["id"]}},
        {"$group": {
            "_id":         None,
            "total":       {"$sum": 1},
            "avg_premium": {"$avg": "$result.predicted_premium"},
            "max_premium": {"$max": "$result.predicted_premium"},
            "min_premium": {"$min": "$result.predicted_premium"},
            "avg_risk":    {"$avg": "$result.risk_score"}
        }}
    ]

    result = await db.predictions.aggregate(pipeline).to_list(1)

    if not result:
        return {
            "total": 0, "avg_premium": 0,
            "max_premium": 0, "min_premium": 0, "avg_risk": 0
        }

    stats = result[0]
    stats.pop("_id", None)
    return {k: round(v, 2) if isinstance(v, float) else v for k, v in stats.items()}