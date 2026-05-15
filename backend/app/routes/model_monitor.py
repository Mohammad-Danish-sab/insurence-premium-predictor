from fastapi import APIRouter, Depends

from app.database import get_db

from app.middleware.admin_middleware import admin_required

router = APIRouter()

@router.get("/admin/model-monitor")
async def model_monitor(
    _: dict = Depends(admin_required)
):

    db = get_db()

    total_predictions = await db.predictions.count_documents({})

    monitor_data = await db.model_monitor.find_one()

    if not monitor_data:

        monitor_data = {

            "model_name": "Insurance Premium Predictor",

            "model_version": "v1.0.0",

            "accuracy": 92.4,

            "status": "active",

            "last_retrained": "2026-05-10"
        }

        await db.model_monitor.insert_one(
            monitor_data
        )

    monitor_data["_id"] = str(
        monitor_data["_id"]
    )

    monitor_data["total_predictions"] = total_predictions

    return monitor_data