from motor.motor_asyncio import AsyncIOMotorClient
from app.config import DATABASE_URL

MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.mentorhood
user_collection = db.users

async def get_user(user_id: str):
    return db.users.find_one({"_id": user_id})

async def create_user(user_data: dict):
    result = db.users.insert_one(user_data.dict())
    return await get_user(result.inserted_id)

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