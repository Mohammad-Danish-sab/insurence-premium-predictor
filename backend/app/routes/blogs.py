from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId

from app.database import get_db

from app.middleware.admin_middleware import admin_required

from app.schemas.blog_schema import BlogCreate

from app.models.blog_model import blog_structure

router = APIRouter()

@router.post("/admin/blogs")
async def create_blog(

    blog: BlogCreate,

    _: dict = Depends(admin_required)
):

    db = get_db()

    new_blog = blog_structure(blog)

    result = await db.blogs.insert_one(new_blog)

    return {

        "message": "Blog created successfully",

        "blog_id": str(result.inserted_id)
    }