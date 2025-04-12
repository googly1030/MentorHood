from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from app.schemas.ama_session import AMASession, AMASessionCreate, PyObjectId
from app.database import get_collection
from bson import ObjectId

router = APIRouter()

@router.get("/ama-sessions", response_model=List[AMASession])
async def get_ama_sessions(is_woman_tech: bool = None):
    collection = get_collection("ama_sessions")
    query = {}
    if is_woman_tech is not None:
        query["isWomanTech"] = is_woman_tech
    
    sessions = await collection.find(query).to_list(length=None)
    return sessions

@router.get("/ama-sessions/{session_id}", response_model=AMASession)
async def get_ama_session_by_id(session_id: str):
    collection = get_collection("ama_sessions")
    try:
        session = await collection.find_one({"_id": ObjectId(session_id)})
        if session is None:
            raise HTTPException(status_code=404, detail="Session not found")
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid session ID: {str(e)}")

@router.post("/ama-sessions", response_model=AMASession, status_code=status.HTTP_201_CREATED)
async def create_ama_session(session: AMASessionCreate):
    collection = get_collection("ama_sessions")
    session_dict = session.model_dump()
    
    # Generate a new ObjectId for the session
    session_id = ObjectId()
    session_dict["_id"] = session_id
    
    # Add timestamps
    session_dict["created_at"] = datetime.utcnow()
    session_dict["updated_at"] = datetime.utcnow()
    
    # Insert the session with the generated ID
    await collection.insert_one(session_dict)
    
    # Retrieve the created session
    created_session = await collection.find_one({"_id": session_id})
    return created_session

@router.put("/ama-sessions/{session_id}", response_model=AMASession)
async def update_ama_session(session_id: str, session: AMASessionCreate):
    collection = get_collection("ama_sessions")
    session_dict = session.model_dump()
    session_dict["updated_at"] = datetime.utcnow()
    
    result = await collection.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": session_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    
    updated_session = await collection.find_one({"_id": ObjectId(session_id)})
    return updated_session

@router.delete("/ama-sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ama_session(session_id: str):
    collection = get_collection("ama_sessions")
    result = await collection.delete_one({"_id": ObjectId(session_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found") 