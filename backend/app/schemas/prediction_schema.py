from pydantic import BaseModel


class PredictionSchema(BaseModel):
    age: int
    bmi: float
    smoker: str
    region: str
    predicted_amount: float