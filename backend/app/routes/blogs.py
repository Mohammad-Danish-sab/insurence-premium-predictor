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

@router.get("/blogs")
async def get_all_blogs():

    db = get_db()

    cursor = db.blogs.find().sort(
        "created_at",
        -1
    )

    blogs = []

    async for blog in cursor:

        blog["_id"] = str(blog["_id"])

        blogs.append(blog)

    return {
        "blogs": blogs
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
    
@router.put("/admin/blogs/{blog_id}")
async def update_blog(

    blog_id: str,

    updated_blog: BlogCreate,

    _: dict = Depends(admin_required)
):

    db = get_db()

    try:

        result = await db.blogs.update_one(
            {
                "_id": ObjectId(blog_id)
            },
            {
                "$set": updated_blog.dict()
            }
        )

        if result.matched_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Blog not found"
            )

        return {
            "message": "Blog updated successfully"
        }

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid blog ID"
        )

@router.delete("/admin/blogs/{blog_id}")
async def delete_blog(

    blog_id: str,

    _: dict = Depends(admin_required)
):

    db = get_db()

    try:

        result = await db.blogs.delete_one(
            {
                "_id": ObjectId(blog_id)
            }
        )

        if result.deleted_count == 0:

            raise HTTPException(
                status_code=404,
                detail="Blog not found"
            )

        return {
            "message": "Blog deleted successfully"
        }

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid blog ID"
        )  
