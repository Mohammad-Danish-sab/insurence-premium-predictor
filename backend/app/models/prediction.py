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

    class Config:
        json_schema_extra = {
            "example": {
                "age": 35,
                "sex": "male",
                "bmi": 28.5,
                "children": 2,
                "smoker": False,
                "region": "northeast",
                "insurance_type": "health"
            }
        }

    class FactorDetail(BaseModel):
        factor:    str
        impact:    str   # e.g. "+₹2000"
        direction: str   # "increases" or "decreases"

class PredictionResponse(BaseModel):
    predicted_premium: float
    risk_score: int  
    risk_level: str                  # 0-100
    confidence_range: dict             # {"min": X, "max": Y}
    top_factors: list                  # SHAP-based factors
    recommendation: str
    plan_comparison: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PredictionInDB(BaseModel):
    user_id:    str
    input:      dict
    result:     dict
    created_at: datetime = Field(default_factory=datetime.utcnow)   