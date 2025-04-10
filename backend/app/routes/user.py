from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from passlib.context import CryptContext
from pydantic import BaseModel
from app.models.user import User, UserModel
from app.database import get_user, create_user, update_user, delete_user, user_collection

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

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    try:
        # Check if user exists
        if await user_collection.find_one({"email": user.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user document
        user_dict = {
            "email": user.email,
            "username": user.username,
            "hashed_password": pwd_context.hash(user.password),
            "role": "user",
            "created_at": datetime.utcnow()
        }
        
        # Insert into database
        result = await user_collection.insert_one(user_dict)
        
        # Return user data without password
        return {
            "id": str(result.inserted_id),
            "email": user.email,
            "username": user.username,
            "role": user_dict["role"],
            "created_at": user_dict["created_at"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not register user: {str(e)}"
        )

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
            "email": db_user["email"],
            "username": db_user.get("username", ""),  # Add fallback
            "role": db_user.get("role", "user"),     # Add fallback
            "created_at": db_user.get("created_at", datetime.utcnow())
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )