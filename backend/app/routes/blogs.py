from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

from app.database import get_db
from app.middleware.admin_middleware import admin_required

from app.models.blog_model import BlogCreate, blog_structure

from app.utils.activity_logger import create_activity_log


router = APIRouter(
    prefix="/api/blogs",
    tags=["Blogs"]
)

@router.post("/admin")
async def create_blog(
    blog: BlogCreate,
    admin: dict = Depends(admin_required)
):

    db = get_db()

    new_blog = blog_structure(blog)

    result = await db.blogs.insert_one(new_blog)

    await create_activity_log(
        action="Created Blog",
        admin_email=admin["email"]
    )

    return {
        "message": "Blog created successfully",
        "blog_id": str(result.inserted_id)
    }

@router.get("/")
async def get_all_blogs():

    db = get_db()

    blogs = []

    cursor = db.blogs.find().sort(
        "created_at",
        -1
    )

    async for blog in cursor:

        blog["_id"] = str(blog["_id"])

        blogs.append(blog)

    return {
        "blogs": blogs
    }


@router.get("/{blog_id}")
async def get_single_blog(blog_id: str):

    db = get_db()

    try:

        object_id = ObjectId(blog_id)

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid blog ID"
        )

    blog = await db.blogs.find_one(
        {
            "_id": object_id
        }
    )

    if not blog:

        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    blog["_id"] = str(blog["_id"])

    return blog


@router.put("/admin/{blog_id}")
async def update_blog(
    blog_id: str,
    updated_blog: BlogCreate,
    admin: dict = Depends(admin_required)
):

    db = get_db()

    try:

        object_id = ObjectId(blog_id)

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid blog ID"
        )

    update_data = updated_blog.dict(
        exclude_none=True
    )

    update_data["updated_at"] = datetime.utcnow()

    result = await db.blogs.update_one(
        {
            "_id": object_id
        },
        {
            "$set": update_data
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    await create_activity_log(
        action="Updated Blog",
        admin_email=admin["email"]
    )

    return {
        "message": "Blog updated successfully"
    }


@router.delete("/admin/{blog_id}")
async def delete_blog(
    blog_id: str,
    admin: dict = Depends(admin_required)
):

    db = get_db()

    try:

        object_id = ObjectId(blog_id)

    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail="Invalid blog ID"
        )

    result = await db.blogs.delete_one(
        {
            "_id": object_id
        }
    )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Blog not found"
        )

    await create_activity_log(
        action="Deleted Blog",
        admin_email=admin["email"]
    )

    return {
        "message": "Blog deleted successfully"
    }