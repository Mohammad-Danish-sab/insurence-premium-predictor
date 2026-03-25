from fastapi import APIRouter, Depends, HTTPException
from app.models.prediction import InsuranceInput, PredictionResponse
from app.services.prediction_service import run_prediction
from app.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def predict_premium(
    data: InsuranceInput,
    current_user: dict = Depends(get_current_user)
):
    try:
        result = await run_prediction(data, current_user["id"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/guest")  # No auth needed for demo
async def predict_guest(data: InsuranceInput):
    result = await run_prediction(data, user_id=None)
    return result

@router.get("/what-if")
async def what_if_simulator(
    base_bmi: float, target_bmi: float,
    smoker: bool, age: int,
    current_user: dict = Depends(get_current_user)
):
    # Compare premium under different scenarios
    ...