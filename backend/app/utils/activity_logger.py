from datetime import datetime
from app.database import get_db

async def create_activity_log(
    action: str,
    user_email: str,
    role: str = "user"
):
    db = get_db()

    log = {
        "action": action,
        "user_email": user_email,
        "role": role,
        "created_at": datetime.utcnow()
    }

    await db.activity_logs.insert_one(log)