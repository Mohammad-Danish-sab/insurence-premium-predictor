from app.models.prediction import InsuranceInput, PredictionResponse, PredictionInDB
from app.database import get_db
from datetime import datetime


# CORE PREMIUM CALCULATION (Rule-Based)

def calculate_premium(data: InsuranceInput) -> tuple[float, list]:
    base  = 5000.0
    factors = []

    # Age factor
    if data.age < 25:
        base *= 1.1
        factors.append({"factor": "Age (18–24)",  "impact": "+10%",  "direction": "increases"})
    elif data.age < 35:
        base *= 1.2
        factors.append({"factor": "Age (25–34)",  "impact": "+20%",  "direction": "increases"})
    elif data.age < 45:
        base *= 1.5
        factors.append({"factor": "Age (35–44)",  "impact": "+50%",  "direction": "increases"})
    elif data.age < 55:
        base *= 1.8
        factors.append({"factor": "Age (45–54)",  "impact": "+80%",  "direction": "increases"})
    else:
        base *= 2.2
        factors.append({"factor": "Age (55+)",    "impact": "+120%", "direction": "increases"})

    #  BMI factor 
    if data.bmi < 18.5:
        base *= 1.1
        factors.append({"factor": "BMI Underweight", "impact": "+10%", "direction": "increases"})
    elif data.bmi < 25:
        base *= 1.0
        factors.append({"factor": "BMI Normal",      "impact": "+0%",  "direction": "neutral"})
    elif data.bmi < 30:
        base *= 1.2
        factors.append({"factor": "BMI Overweight",  "impact": "+20%", "direction": "increases"})
    else:
        base *= 1.5
        factors.append({"factor": "BMI Obese",       "impact": "+50%", "direction": "increases"})

    # Smoker factor
    if data.smoker:
        base *= 2.0
        factors.append({"factor": "Smoker", "impact": "+100%", "direction": "increases"})
    else:
        factors.append({"factor": "Non-Smoker", "impact": "+0%", "direction": "neutral"})

    # Children factor
    child_addition = data.children * 500
    base += child_addition
    if data.children > 0:
        factors.append({
            "factor": f"{data.children} Child(ren)",
            "impact": f"+₹{child_addition}",
            "direction": "increases"
        })

    # Region factor 
    region_map = {
        "northeast": 1.1,
        "northwest": 1.0,
        "southeast": 1.2,
        "southwest": 1.0
    }
    region_mult = region_map[data.region]
    base *= region_mult
    if region_mult > 1.0:
        factors.append({
            "factor": f"Region ({data.region})",
            "impact": f"+{int((region_mult - 1) * 100)}%",
            "direction": "increases"
        })

    # Insurance type multiplier
    type_map = {
        "health": 1.0,
        "life":   0.8,
        "auto":   0.6,
        "home":   0.5
    }
    base *= type_map[data.insurance_type]

    return round(base, 2), factors[:3]  # return top 3 factors


# RISK SCORE

def calculate_risk_score(data: InsuranceInput) -> tuple[int, str]:
    score = 0

    if data.smoker:       score += 35
    if data.bmi >= 30:    score += 20
    if data.bmi >= 35:    score += 10
    if data.age >= 55:    score += 20
    if data.age >= 45:    score += 10
    if data.children >= 3: score += 5

    score = min(score, 100)

    if score <= 20:   level = "Low"
    elif score <= 45: level = "Medium"
    elif score <= 70: level = "High"
    else:             level = "Very High"

    return score, level


# PLAN COMPARISON

def get_plan_comparison(base_premium: float) -> dict:
    return {
        "basic": {
            "plan_name":       "Basic",
            "premium":         round(base_premium * 0.8, 2),
            "coverage_amount": 500000,
            "deductible":      10000,
            "features": [
                "Hospitalization cover",
                "Emergency care",
                "Basic OPD"
            ]
        },
        "standard": {
            "plan_name":       "Standard",
            "premium":         round(base_premium, 2),
            "coverage_amount": 1000000,
            "deductible":      5000,
            "features": [
                "All Basic features",
                "Specialist consultations",
                "Dental & Vision",
                "Maternity cover"
            ]
        },
        "premium": {
            "plan_name":       "Premium",
            "premium":         round(base_premium * 1.4, 2),
            "coverage_amount": 2000000,
            "deductible":      0,
            "features": [
                "All Standard features",
                "Zero deductible",
                "International coverage",
                "Mental health support",
                "Annual health checkup"
            ]
        }
    }


# RECOMMENDATION

def get_recommendation(data: InsuranceInput, risk_score: int) -> str:
    tips = []

    if data.smoker:
        tips.append("Quitting smoking can reduce your premium by up to 50%.")
    if data.bmi >= 30:
        tips.append("Reducing BMI below 30 can lower your premium significantly.")
    if data.age < 30:
        tips.append("Lock in a long-term policy now while rates are low.")
    if risk_score >= 70:
        tips.append("Consider a Premium plan for better coverage given your risk profile.")
    if not tips:
        tips.append("Your profile is healthy! A Standard plan offers great value for you.")

    return " ".join(tips)


# MAIN SERVICE FUNCTION

async def run_prediction(data: InsuranceInput, user_id: str = None) -> dict:

    # Calculate premium + factors
    premium, top_factors = calculate_premium(data)

    # Risk score
    risk_score, risk_level = calculate_risk_score(data)

    # Confidence range ±10%
    confidence_range = {
        "min": round(premium * 0.90, 2),
        "max": round(premium * 1.10, 2)
    }

    # Plan comparison
    plan_comparison = get_plan_comparison(premium)

    # Recommendation
    recommendation = get_recommendation(data, risk_score)

    result = {
        "predicted_premium": premium,
        "risk_score":        risk_score,
        "risk_level":        risk_level,
        "confidence_range":  confidence_range,
        "top_factors":       top_factors,
        "recommendation":    recommendation,
        "plan_comparison":   plan_comparison,
        "timestamp":         datetime.utcnow().isoformat()
    }

    # Save to MongoDB if user is logged in
    if user_id:
        db = get_db()
        prediction_doc = PredictionInDB(
            user_id=user_id,
            input=data.dict(),
            result=result
        )
        await db.predictions.insert_one(prediction_doc.dict())

    return result

