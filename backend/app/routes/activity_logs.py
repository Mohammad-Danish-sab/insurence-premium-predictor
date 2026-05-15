from fastapi import APIRouter, Depends

from app.database import get_db

from app.middleware.admin_middleware import admin_required

router = APIRouter()


@router.get("/admin/activity-logs")
async def get_activity_logs(
    _: dict = Depends(admin_required)
):

    db = get_db()

    cursor = db.activity_logs.find().sort(
        "created_at",
        -1
    )

    logs = []

    async for log in cursor:

        log["_id"] = str(log["_id"])

        logs.append(log)

    return {
        "activity_logs": logs
    }