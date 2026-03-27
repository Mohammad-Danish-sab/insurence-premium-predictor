from fastapi import APIRouter, HTTPException
from app.models.user import UserSignup, UserLogin
from app.services.auth_service import create_user, login_user

router = APIRouter()

@router.post("/signup")
async def signup(user: UserSignup):
    return await create_user(user)

@router.post("/login")
async def login(user: UserLogin):
    token = await login_user(user)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user