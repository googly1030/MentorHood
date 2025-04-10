from fastapi import APIRouter, HTTPException, status
from app.models.user import User, UserModel
from app.schemas.user import UserCreate, UserUpdate
from app.database import get_user, create_user, update_user, delete_user, user_collection
from passlib.hash import bcrypt

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user: UserModel):
    try:
        # Check if user exists
        existing_user = await user_collection.find_one({"email": user.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        user_dict = user.dict()
        result = await user_collection.insert_one(user_dict)
        
        # Confirm user was created
        if result.inserted_id:
            return {"message": "User created successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/", response_model=User)
async def create_new_user(user: UserCreate):
    db_user = await create_user(user)
    if not db_user:
        raise HTTPException(status_code=400, detail="User could not be created")
    return db_user

@router.get("/{user_id}", response_model=User)
async def read_user(user_id: str):
    db_user = await get_user(user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=User)
async def update_existing_user(user_id: str, user: UserUpdate):
    db_user = await update_user(user_id, user)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}", response_model=dict)
async def delete_existing_user(user_id: str):
    result = await delete_user(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}