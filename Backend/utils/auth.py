import os
from typing import Optional, Dict, Any
from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from utils.database import get_supabase

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated user from Supabase JWT token"""
    try:
        supabase = get_supabase()
        
        # Verify the JWT token with Supabase
        user = supabase.auth.get_user(credentials.credentials)
        
        if not user.user:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        
        # Get user profile from database
        from utils.database import get_user_profile
        profile = await get_user_profile(user.user.id)
        
        return {
            "id": user.user.id,
            "email": user.user.email,
            "name": profile.get("name") if profile else user.user.email,
            "profile": profile
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

async def get_current_user_id(user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """Extract user ID from authenticated user"""
    return user["id"]

def verify_user_owns_document(user_id: str, document_user_id: str):
    """Verify that the authenticated user owns the document"""
    if user_id != document_user_id:
        raise HTTPException(status_code=403, detail="Access denied - you don't own this document")

async def create_user_session(email: str, password: str) -> Dict[str, Any]:
    """Create a user session with Supabase Auth"""
    try:
        supabase = get_supabase()
        
        # Sign in user
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Get user profile
        from utils.database import get_user_profile
        profile = await get_user_profile(auth_response.user.id)
        
        return {
            "user": {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "name": profile.get("name") if profile else auth_response.user.email
            },
            "session": {
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token,
                "expires_at": auth_response.session.expires_at
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Login failed")

async def register_user(email: str, password: str, name: str) -> Dict[str, Any]:
    """Register a new user with Supabase Auth"""
    try:
        supabase = get_supabase()
        
        # Sign up user
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "name": name
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Registration failed")
        
        # Create user profile
        from utils.database import create_user_profile
        await create_user_profile(auth_response.user.id, email, name)
        
        return {
            "user": {
                "id": auth_response.user.id,
                "email": email,
                "name": name
            },
            "message": "User registered successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")

async def refresh_user_session(refresh_token: str) -> Dict[str, Any]:
    """Refresh user session with Supabase Auth"""
    try:
        supabase = get_supabase()
        
        # Refresh session
        session = supabase.auth.refresh_session(refresh_token)
        
        if not session.session:
            raise HTTPException(status_code=401, detail="Token refresh failed")
        
        return {
            "access_token": session.session.access_token,
            "refresh_token": session.session.refresh_token,
            "expires_at": session.session.expires_at
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token refresh failed")

async def logout_user():
    """Logout user from Supabase Auth"""
    try:
        supabase = get_supabase()
        supabase.auth.sign_out()
        return {"message": "Logout successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Logout failed")

def get_user_from_request(request: Request) -> Optional[Dict[str, Any]]:
    """Extract user information from request headers (for optional auth)"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header.split(" ")[1]
        supabase = get_supabase()
        user = supabase.auth.get_user(token)
        
        if user.user:
            return {
                "id": user.user.id,
                "email": user.user.email
            }
        
        return None
        
    except:
        return None 