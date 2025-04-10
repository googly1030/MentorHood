from fastapi import APIRouter, HTTPException, status
from datetime import datetime, UTC
from typing import List
from app.schemas.session import Session, SessionCreate
from app.database import get_collection
from bson import ObjectId

router = APIRouter(
    prefix="/api/sessions",
    tags=["sessions"]
)

@router.post("/create", response_model=Session)
async def create_session(session: SessionCreate):
    collection = get_collection("sessions")
    
    session_dict = session.model_dump()
    session_dict.update({
        "created_at": datetime.now(UTC),
        "updated_at": datetime.now(UTC)
    })
    
    result = await collection.insert_one(session_dict)
    return {
        "status": "success",
    }

@router.get("/{session_id}", response_model=Session)
async def get_session(session_id: str):
    collection = get_collection("sessions")
    
    if not ObjectId.is_valid(session_id):
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    session = await collection.find_one({"_id": ObjectId(session_id)})
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session["_id"] = str(session["_id"])
    return {
        "status": "success",
        "session": session
    }

@router.get("/mentor/{mentor_id}", response_model=List[Session])
async def get_mentor_sessions(mentor_id: str):
    collection = get_collection("sessions")
    
    sessions = await collection.find({"mentorId": mentor_id}).to_list(length=None)
    for session in sessions:
        session["_id"] = str(session["_id"])
    return {
        "status": "success",
        "mentorId": mentor_id,
        "sessions": sessions
    }
