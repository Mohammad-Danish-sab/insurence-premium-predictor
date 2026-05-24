from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Request model
class BlogCreate(BaseModel):
    title: str
    content: str
    author: str
    image: Optional[str] = ""


# Response model
class BlogResponse(BaseModel):
    id: Optional[str] = Field(alias="_id")
    title: str
    content: str
    author: str
    image: Optional[str] = ""
    created_at: datetime

    class Config:
        populate_by_name = True