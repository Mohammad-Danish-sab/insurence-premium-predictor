from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BlogCreate(BaseModel):

    title: str

    content: str

    author: str

    image: Optional[str] = ""


class BlogResponse(BaseModel):

    id: str = Field(alias="_id")

    title: str

    content: str

    author: str

    image: Optional[str]

    created_at: datetime