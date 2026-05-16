from fastapi import APIRouter, Depends, HTTPException, Query
from app.middleware.auth_middleware import require_admin
from app.database import get_db
from bson import ObjectId

router = APIRouter()

@router.get("/dashboard")
async def admin_dashboard(
    _: dict = Depends(require_admin)
):

    db = get_db()

    total_users = await db.users.count_documents({})

    total_predictions = await db.predictions.count_documents({})

    total_blogs = await db.blogs.count_documents({})

    total_contacts = await db.contacts.count_documents({})

    recent_users_cursor = db.users.find(
        {},
        {
            "hashed_password": 0
        }
    ).sort("_id", -1).limit(5)

    recent_users = []

    async for user in recent_users_cursor:
        user["_id"] = str(user["_id"])
        recent_users.append(user)

    recent_predictions_cursor = db.predictions.find().sort(
        "_id",
        -1
    ).limit(5)

    recent_predictions = []

    async for prediction in recent_predictions_cursor:
        prediction["_id"] = str(prediction["_id"])
        recent_predictions.append(prediction)

    return {

        "analytics": {

            "total_users": total_users,

            "total_predictions": total_predictions,

            "total_blogs": total_blogs,

            "total_contacts": total_contacts
        },

        "recent_users": recent_users,

        "recent_predictions": recent_predictions
    }

@router.get("/users")
async def get_all_users(
    page:  int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    _: dict = Depends(require_admin)
):
    db   = get_db()
    skip = (page - 1) * limit

    cursor = db.users.find(
        {}, {"hashed_password": 0}   
    ).skip(skip).limit(limit)

    users = []
    async for user in cursor:
        user["_id"] = str(user["_id"])
        users.append(user)

    total = await db.users.count_documents({})
    return {"users": users, "total": total, "page": page, "limit": limit}

@router.get("/predictions")
async def get_all_predictions(

    page: int = Query(default=1, ge=1),

    limit: int = Query(default=20, ge=1, le=100),

    smoker: str = None,

    region: str = None,

    min_premium: float = None,

    max_premium: float = None,

    _: dict = Depends(require_admin)
):

    db = get_db()

    skip = (page - 1) * limit

    filters = {}

    if smoker:
        filters["smoker"] = smoker

    if region:
        filters["region"] = region

    if min_premium is not None or max_premium is not None:

        filters["result.predicted_premium"] = {}

        if min_premium is not None:
            filters["result.predicted_premium"]["$gte"] = min_premium

        if max_premium is not None:
            filters["result.predicted_premium"]["$lte"] = max_premium

    cursor = db.predictions.find(filters).sort(
        "created_at",
        -1
    ).skip(skip).limit(limit)

    predictions = []

    async for prediction in cursor:

        prediction["_id"] = str(prediction["_id"])

        predictions.append(prediction)

    total = await db.predictions.count_documents(filters)

    return {

        "predictions": predictions,

        "total": total,

        "page": page,

        "limit": limit,

        "filters": filters
    }

@router.delete("/predictions/{prediction_id}")
async def delete_prediction(

    prediction_id: str,

    _: dict = Depends(require_admin)
):

    db = get_db()

    try:

        result = await db.predictions.delete_one(
            {
                "_id": ObjectId(prediction_id)
            }
        )

        if result.deleted_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Prediction not found"
            )

        return {
            "message": "Prediction deleted successfully"
        }

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid prediction ID"
        )
    

@router.get("/stats")
async def admin_stats(_: dict = Depends(require_admin)):
    db = get_db()

    total_users       = await db.users.count_documents({})
    total_predictions = await db.predictions.count_documents({})

    pipeline = [
        {"$group": {
            "_id":         None,
            "avg_premium": {"$avg": "$result.predicted_premium"},
            "avg_risk":    {"$avg": "$result.risk_score"},
        }}
    ]
    agg = await db.predictions.aggregate(pipeline).to_list(1)
    agg = agg[0] if agg else {}

    return {
        "total_users":       total_users,
        "total_predictions": total_predictions,
        "avg_premium":       round(agg.get("avg_premium", 0), 2),
        "avg_risk_score":    round(agg.get("avg_risk", 0), 2),
    }

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    _: dict = Depends(require_admin)
):

    db = get_db()

    try:

        result = await db.users.delete_one({
            "_id": ObjectId(user_id)
        })

        if result.deleted_count == 0:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        await db.predictions.delete_many({
            "user_id": user_id
        })

        return {
            "message": "User and predictions deleted"
        }

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )
    
@router.put("/users/block/{user_id}")
async def block_user(
    user_id: str,
    _: dict = Depends(require_admin)
):

    db = get_db()

    try:

        result = await db.users.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "is_blocked": True
                }
            }
        )

        if result.matched_count == 0:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return {
            "message": "User blocked successfully"
        }

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )
    
@router.put("/users/unblock/{user_id}")
async def unblock_user(
    user_id: str,
    _: dict = Depends(require_admin)
):

    db = get_db()

    try:

        result = await db.users.update_one(
            {
                "_id": ObjectId(user_id)
            },
            {
                "$set": {
                    "is_blocked": False
                }
            }
        )

        if result.matched_count == 0:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return {
            "message": "User unblocked successfully"
        }

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )