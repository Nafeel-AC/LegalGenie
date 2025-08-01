from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import os
from utils.auth import (
    get_current_user, 
    create_user_session, 
    register_user, 
    refresh_user_session, 
    logout_user
)

router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str

@router.post("/register")
async def register(user_data: UserRegister):
    """Register a new user"""
    try:
        result = await register_user(
            email=user_data.email,
            password=user_data.password,
            name=user_data.name
        )
        
        return {
            "message": "User registered successfully",
            "user": result["user"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(user_data: UserLogin):
    """Login user"""
    try:
        result = await create_user_session(
            email=user_data.email,
            password=user_data.password
        )
        
        return {
            "message": "Login successful",
            "user": result["user"],
            "session": result["session"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Login failed")

@router.post("/logout")
async def logout():
    """Logout user"""
    try:
        return await logout_user()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Logout failed")

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    try:
        return {
            "id": current_user["id"],
            "email": current_user["email"],
            "name": current_user["name"],
            "profile": current_user.get("profile")
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token"""
    try:
        result = await refresh_user_session(request.refresh_token)
        
        return {
            "access_token": result["access_token"],
            "refresh_token": result["refresh_token"],
            "expires_at": result["expires_at"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token refresh failed")

@router.post("/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify if the current token is valid"""
    return {
        "valid": True,
        "user": {
            "id": current_user["id"],
            "email": current_user["email"],
            "name": current_user["name"]
        }
    } 