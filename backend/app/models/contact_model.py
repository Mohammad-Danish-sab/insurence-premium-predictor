from datetime import datetime


def contact_structure(data):

    return {

        "name": data.name,

        "email": data.email,

        "subject": data.subject,

        "message": data.message,

        "status": "pending",

        "created_at": datetime.utcnow()
    }