from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class InsuranceInput(BaseModel):
    age: int = Field(..., ge=18, le=100)
    sex: str = Field(..., pattern="^(male|female)$")
    bmi: float = Field(..., ge=10.0, le=60.0)
    children: int = Field(..., ge=0, le=10)
    smoker: bool
    region: str = Field(..., pattern="^(northeast|northwest|southeast|southwest)$")
    insurance_type: str = Field(default="health")  # health, auto, life

class PredictionResponse(BaseModel):
    predicted_premium: float
    risk_score: int                    # 0-100
    confidence_range: dict             # {"min": X, "max": Y}
    top_factors: list                  # SHAP-based factors
    recommendation: str
    timestamp: datetime = datetime.now()