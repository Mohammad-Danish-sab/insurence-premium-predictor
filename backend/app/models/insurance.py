from pydantic import BaseModel
from typing import List
from enum import Enum


class InsuranceType(str, Enum):
    health = "health"
    life   = "life"
    auto   = "auto"
    home   = "home"


class CoverageDetail(BaseModel):
    name:        str
    description: str
    covered:     bool


class InsurancePlan(BaseModel):
    plan_name:       str           # Basic / Standard / Premium
    premium:         float
    coverage_amount: float
    deductible:      float
    features:        List[str]


class PlanComparisonResponse(BaseModel):
    basic:    InsurancePlan
    standard: InsurancePlan
    premium:  InsurancePlan