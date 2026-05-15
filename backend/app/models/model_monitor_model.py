from datetime import datetime


def model_monitor_structure():

    return {

        "model_name": "Insurance Premium Predictor",

        "model_version": "v1.0.0",

        "accuracy": 92.4,

        "status": "active",

        "last_retrained": datetime.utcnow()
    }