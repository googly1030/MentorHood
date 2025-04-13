from fastapi import APIRouter, HTTPException, status
from datetime import datetime, UTC
from typing import List, Optional
from passlib.context import CryptContext
from pydantic import BaseModel
from app.models.user import User, UserModel
from app.database import get_user, create_user, update_user, delete_user, user_collection, user_profile_collection
from bson import ObjectId  # Add this import at the top
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
        
        # Create user document
        user_dict = {
            "userId": str(uuid.uuid4()),
            "email": user.email,
            "username": user.username,
            "hashed_password": pwd_context.hash(user.password),
            "role": "user",
            "created_at": datetime.now(UTC)
        }
        
        # Insert into database
        result = await user_collection.insert_one(user_dict)
        
        # Return user data without password
        return {
            "id": str(result.inserted_id),
            "userId": user_dict["userId"],
            "email": user.email,
            "username": user.username,
            "role": user_dict["role"],
            "created_at": user_dict["created_at"]
        }
    # except Exception as e:
    #     raise HTTPException(
    #         status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #         detail=f"Could not register user: {str(e)}"
    #     )

# Update the login function to properly handle password fields
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
