from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BlogCreate(BaseModel):
    title: str
    description: str
    content: str
    image: Optional[str] = None


def blog_structure(blog: BlogCreate):
    return {
        "title": blog.title,
        "description": blog.description,
        "content": blog.content,
        "image": blog.image,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }