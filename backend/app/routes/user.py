from fastapi import APIRouter, HTTPException, status, Body
from datetime import datetime, UTC, timedelta
from typing import List, Optional
from passlib.context import CryptContext
from pydantic import BaseModel
from app.models.user import User, UserModel
from app.database import get_user, create_user, update_user, delete_user, user_collection, user_profile_collection, get_collection
from bson import ObjectId  
import uuid

# Create password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define models
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    username: str
    role: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    role: str
    created_at: datetime
    userId: str

class Experience(BaseModel):
    years: int
    months: int

class MentorProfile(BaseModel):
    user_id: str
    profilePhoto: str
    experience: Experience
    linkedinUrl: str
    primaryExpertise: str
    disciplines: List[str]
    tools: List[str]
    skills: List[str]
    bio: str
    targetMentees: List[str]
    mentoringTopics: List[str]
    relationshipType: str
    aiTools: List[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    # try:
        # Check if user exists
        if await user_collection.find_one({"email": user.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        role = getattr(user, "role", None) or "user"

        
        # Create user document
        user_dict = {
            "userId": str(uuid.uuid4()),
            "email": user.email,
            "username": user.username,
            "hashed_password": pwd_context.hash(user.password),
            "role": role,
            "onBoarded": False,
            "created_at": datetime.now(UTC)
        }

        
        # Insert into database
        result = await user_collection.insert_one(user_dict)

        if not result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="Failed to create user"
            )
        
        profile_dict = {
            "userId": user_dict["userId"],
            "name": user_dict["username"],
            "email": user_dict["email"],
            "role": user_dict["role"],
            "profilePhoto": "",
            "headline": "",
            "experience": [
                {
                "title": "",
                "company": "",
                "description": "",
                "duration": ""
                }
            ],
            "projects": [
                {
                "title": "",
                "description": ""
                }
            ],
            "resources": [
                {
                "title": "",
                "description": "",
                "linkText": ""
                }
            ],
            "stats": {
                "sessionsCompleted": 0,
                "totalHours": 0
            },
            "achievements": [
                {
                "title": "",
                "description": "",
                "date": ""
                }
            ],
            "totalExperience": {
                "years": 0,
                "months": 0
            },
            "linkedinUrl": "",
            "githubUrl": "",
            "primaryExpertise": "",
            "disciplines": [
                ""
            ],
            "tools": [
                ""
            ],
            "skills": [
                ""
            ],
            "bio": "",
            "targetMentees": [
                ""
            ],
            "mentoringTopics": [
                ""
            ],
            "relationshipType": "",
            "aiTools": [
                ""
            ],
            "created_at": datetime.now(UTC),
            "updated_at": datetime.now(UTC)
        }

        collection = get_collection("userprofile")
        
        insert_result = await collection.insert_one(profile_dict)

        if not insert_result.inserted_id:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail="Failed to create mentor profile"
            )
        
        tokens_data = None
        if role == "user":
            tokens_collection = get_collection("tokens")
            
            # Create improved token record with 500 initial tokens
            current_time = datetime.now(UTC)
            expiry_date = current_time + timedelta(days=365)  # Tokens valid for 1 year
            
            token_record = {
                "userId": user_dict["userId"],
                "plan_id": "welcome-bonus",
                "plan_type": "Free",
                "subscription_status": "active",
                "purchased_date": current_time,
                "expiry_date": expiry_date,
                "purchased_tokens": 500,
                "used_tokens": 0,
                "remaining_tokens": 500,
                "usage": {
                    "mentoring_sessions": {
                        "total": 500,
                        "used": 0,
                        "remaining": 500
                    }
                },
                "transactions": [
                    {
                        "type": "credit",
                        "amount": 500,
                        "description": "Welcome bonus for new user",
                        "timestamp": current_time
                    }
                ],
                "created_at": current_time,
                "last_updated": current_time
            }
            
            token_result = await tokens_collection.insert_one(token_record)
            
            if token_result.inserted_id:
                tokens_data = {
                    "balance": 500,
                    "message": "Welcome tokens added to your account",
                    "expiry_date": expiry_date
                }
        
        # Return user data without password
        response_data = {
            "id": str(result.inserted_id),
            "userId": user_dict["userId"],
            "email": user.email,
            "username": user.username,
            "role": user_dict["role"],
            "onBoarded": user_dict["onBoarded"],
            "created_at": user_dict["created_at"]
        }
        
        # Add tokens data to response if available
        if tokens_data:
            response_data["tokens"] = tokens_data
            
        return response_data
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         detail=f"Could not register user: {str(e)}"
    #     )


@router.post("/login", response_model=UserResponse)
async def login(user: UserLogin):
    try:
        # Find user by email
        db_user = await user_collection.find_one({"email": user.email})
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if hashed_password exists
        if "hashed_password" not in db_user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User data is corrupted"
            )
        
        # Verify password
        if not pwd_context.verify(user.password, db_user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Return user data without password
        return {
            "id": str(db_user["_id"]),
            "userId": db_user["userId"],
            "email": db_user["email"],
            "username": db_user.get("username", ""),  
            "role": db_user.get("role", "user"),     
            "created_at": db_user.get("created_at", datetime.now(UTC))
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/mentors/profile", status_code=status.HTTP_201_CREATED)
async def create_mentor_profile(profile: MentorProfile):
    try:
        # Convert string user_id to ObjectId
        user_id = ObjectId(profile.user_id)
        
        # Check if user exists
        user = await user_collection.find_one({"_id": user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Check if mentor profile already exists
        existing_profile = await user_profile_collection.find_one({"user_id": profile.user_id})
        if existing_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mentor profile already exists for this user"
            )

        # Add timestamps
        profile_dict = profile.dict()
        profile_dict["created_at"] = datetime.utcnow()
        profile_dict["updated_at"] = datetime.utcnow()

        # Insert the profile
        result = await user_profile_collection.insert_one(profile_dict)
        
        if result.inserted_id:
            # Update user role to mentor using ObjectId
            await user_collection.update_one(
                {"_id": user_id},
                {"$set": {"role": "mentor"}}
            )
            
            return {
                "message": "Mentor profile created successfully",
                "profile_id": str(result.inserted_id)
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create mentor profile"
            )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not create mentor profile: {str(e)}"
        )

@router.post("/profile")
async def get_user_profile(userId: str):
    try:
        collection = get_collection("userprofile")

        if not userId:
            raise HTTPException(status_code=400, detail="User ID required")

        # Check if user profile exists
        result = await collection.find_one({"userId": userId})
        if not result:
            raise HTTPException(status_code=404, detail="User profile not found")

        # Convert ObjectId to string for JSON serialization
        if "_id" in result:
            result["_id"] = str(result["_id"])

        return {
            "status": "success",
            "profile": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user profile: {str(e)}"
        )

@router.post("/profile/update")
async def update_user_profile(userId: str, profile: dict = Body(...)):
    try:
        collection = get_collection("userprofile")

        if not userId:
            raise HTTPException(status_code=400, detail="User ID required")

        # Check if user profile exists
        existing_user = await collection.find_one({"userId": userId})
        if not existing_user:
            raise HTTPException(status_code=404, detail="User profile not found")

        # Remove _id if present in the profile payload (can't be updated)
        if "_id" in profile:
            del profile["_id"]

        # Add timestamp for update
        profile["updated_at"] = datetime.now(UTC)

        # Update the profile
        result = await collection.update_one(
            {"userId": userId},
            {"$set": profile}
        )

        # Successful even if no changes were made (modified_count could be 0)
        return {
            "status": "success",
            "message": "Profile updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )