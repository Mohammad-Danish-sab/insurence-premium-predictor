from app.models.activity_model import activity_log_structure

from app.database import get_db


async def create_activity_log(

    user_email,

    action,

    role
):

    db = get_db()

    activity = activity_log_structure(
        user_email,
        action,
        role
    )

    await db.activity_logs.insert_one(
        activity
    )