from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from app.models.prediction import InsuranceInput, PredictionResponse
from app.services.prediction_service import run_prediction
from app.services.report_service import generate_pdf_report
from app.services.auth_service import get_user_by_id
from app.middleware.auth_middleware import get_current_user
from app.middleware.rate_limiter import limiter
from fastapi import Request
import io

router = APIRouter()

@router.post("/")
@limiter.limit("10/minute")
async def predict_premium(
    request: Request,
    data: InsuranceInput,
    current_user: dict = Depends(get_current_user)
):
    try:
        result = await run_prediction(data, user_id=current_user["id"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/guest")
@limiter.limit("5/minute")
async def predict_guest(
    request: Request,
    data: InsuranceInput
):
    try:
        result = await run_prediction(data, user_id=None)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/what-if")
@limiter.limit("10/minute")
async def what_if_simulator(
     request: Request,
    current: InsuranceInput,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Current scenario
        current_result = await run_prediction(current, user_id=None)

        # Scenario: if not smoker
        non_smoker          = current.model_copy(update={"smoker": False})
        non_smoker_result   = await run_prediction(non_smoker, user_id=None)

        # Scenario: if BMI is normal
        normal_bmi          = current.model_copy(update={"bmi": 24.0})
        normal_bmi_result   = await run_prediction(normal_bmi, user_id=None)

        return {
            "current_scenario": {
                "label":   "Your Current Profile",
                "premium": current_result["predicted_premium"],
                "risk":    current_result["risk_level"]
            },
            "if_non_smoker": {
                "label":   "If You Quit Smoking",
                "premium": non_smoker_result["predicted_premium"],
                "savings": round(
                    current_result["predicted_premium"] - non_smoker_result["predicted_premium"], 2
                ),
                "risk":    non_smoker_result["risk_level"]
            },
            "if_normal_bmi": {
                "label":   "If BMI Were Normal (24)",
                "premium": normal_bmi_result["predicted_premium"],
                "savings": round(
                    current_result["predicted_premium"] - normal_bmi_result["predicted_premium"], 2
                ),
                "risk":    normal_bmi_result["risk_level"]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# ── DOWNLOAD PDF REPORT ──────────────────────
@router.get("/report/{prediction_id}")
async def download_report(
    prediction_id: str,
    current_user: dict = Depends(get_current_user)
):
    from app.database import get_db
    from bson import ObjectId

    db = get_db()

    # Fetch prediction
    prediction = await db.predictions.find_one({
        "_id":     ObjectId(prediction_id),
        "user_id": current_user["id"]
    })
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")

    # Fetch user
    user = await get_user_by_id(current_user["id"])

    # Generate PDF
    pdf_bytes = generate_pdf_report(
        user=user,
        input_data=prediction["input"],
        result=prediction["result"]
    )

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=insurance_report_{prediction_id}.pdf"
        }
    )