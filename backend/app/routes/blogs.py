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

@router.get("/blogs/{blog_id}")
async def get_single_blog(blog_id: str):

    db = get_db()

    try:

        blog = await db.blogs.find_one(
            {
                "_id": ObjectId(blog_id)
            }
        )

        if not blog:

            raise HTTPException(
                status_code=404,
                detail="Blog not found"
            )

        blog["_id"] = str(blog["_id"])

        return blog

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid blog ID"
        )
    
