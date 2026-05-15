from datetime import datetime


def activity_log_structure(
    user_email,
    action,
    role
):

    return {

        "user_email": user_email,

        "action": action,

        "role": role,

        "created_at": datetime.utcnow()
    }