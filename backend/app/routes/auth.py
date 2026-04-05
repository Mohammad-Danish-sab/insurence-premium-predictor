from fastapi import APIRouter, HTTPException, Depends
from app.models.user import UserSignup, UserLogin
from app.services.auth_service import create_user, login_user



from app.models.user import (
    UserSignup,
    UserLogin,
    UserUpdateProfile,
    ChangePassword
)

from app.services.auth_service import (
    create_user,
    login_user,
    get_user_by_id,
    update_profile,
    change_password
)

from app.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.post("/signup")
async def signup(user: UserSignup):
    try:
        result = await create_user(user)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user: UserLogin):
    result = await login_user(user)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return result

@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    user = await get_user_by_id(current_user["id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me")
async def update_my_profile(
    data: UserUpdateProfile,
    current_user: dict = Depends(get_current_user)
):
    updated = await update_profile(current_user["sub"], data)
    return {"message": "Profile updated ", "user": updated}

@router.put("/change-password")
async def change_my_password(
    data: ChangePassword,
    current_user: dict = Depends(get_current_user)
):
    try:
        await change_password(current_user["sub"], data)
        return {"message": "Password changed successfully "}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))