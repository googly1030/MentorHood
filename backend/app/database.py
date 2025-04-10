from motor.motor_asyncio import AsyncIOMotorClient
from app.config import DATABASE_URL
from fastapi import HTTPException
from bson import ObjectId

try:
    client = AsyncIOMotorClient(DATABASE_URL)
    db = client.mentorhood
    user_collection = db.users
    user_profile_collection = db.userprofile
    mentor_profile_collection = db.mentorprofile  # Add this line
except Exception as e:
    print(f"Failed to connect to MongoDB: {str(e)}")
    raise

async def get_user(user_id: str):
    return db.users.find_one({"_id": user_id})

async def create_user(user_data: dict):
    try:
        result = await user_collection.insert_one(user_data)
        if result.inserted_id:
            created_user = await user_collection.find_one({"_id": result.inserted_id})
            return created_user
        raise HTTPException(status_code=400, detail="Failed to create user")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def update_user(user_id: str, user_data: dict):
    db.users.update_one({"_id": user_id}, {"$set": user_data.dict(exclude_unset=True)})
    return await get_user(user_id)

async def delete_user(user_id: str):
    result = db.users.delete_one({"_id": user_id})
    return result.deleted_count > 0

def get_collection(collection_name):
    return db[collection_name]

def close_connection():
    client.close()