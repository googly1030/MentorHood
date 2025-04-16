from fastapi import APIRouter, HTTPException, status
from datetime import datetime, UTC
from typing import List
from app.schemas.session import Session, SessionCreate
from app.database import get_collection
import uuid

router = APIRouter(
    prefix="/sessions",
    tags=["sessions"]
)

@router.post("/create")
async def create_session(session: SessionCreate):
    collection = get_collection("sessions")
    
    session_dict = session.model_dump()
    session_dict.update({
        "sessionId": str(uuid.uuid4()),
        "created_at": datetime.now(UTC),
        "updated_at": datetime.now(UTC)
    })
    
    result = await collection.insert_one(session_dict)
    return {
        "status": "success",
        "sessionId": session_dict["sessionId"]
    }

@router.post("/update/{session_id}")
async def update_session(session_id: str, session: SessionCreate):
    collection = get_collection("sessions")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    exist_session = await collection.find_one({"sessionId": session_id})
    if exist_session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_dict = session.model_dump()
    session_dict.update({
        "updated_at": datetime.now(UTC),
        "sessionId": session_id
    })
    
    result = await collection.update_one(
        {"sessionId": session_id},
        {"$set": session_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="No data updated")
    
    return {
        "status": "success",
    }

@router.post("/delete/{session_id}")
async def delete_session(session_id: str):
    collection = get_collection("sessions")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    result = await collection.delete_one({"sessionId": session_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "status": "success",
    }

@router.get("/{session_id}")
async def get_session(session_id: str):
    collection = get_collection("sessions")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    session = await collection.find_one({"sessionId": session_id})
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Convert ObjectId to string and remove _id field
    session_dict = dict(session)
    session_dict.pop('_id', None)
    
    return {
        "status": "success",
        "session": session_dict
    }

@router.get("/mentor/{mentor_id}")
async def get_mentor_sessions(mentor_id: str):
    collection = get_collection("sessions")
    
    sessions = await collection.find({"userId": mentor_id}).to_list(length=None)
    
    # Convert ObjectId to string and remove _id field for each session
    sessions_list = []
    for session in sessions:
        session_dict = dict(session)
        session_dict.pop('_id', None)
        sessions_list.append(session_dict)

    return {
        "status": "success",
        "userId": mentor_id,
        "sessions": sessions_list
    }

@router.get("/one-on-one/all")
async def get_all_one_on_one_sessions():
    sessions_collection = get_collection("sessions")
    mentor_collection = get_collection("userprofile")
    
    try:
        # Get all one-on-one sessions
        sessions = await sessions_collection.find({"sessionType": "one-on-one"}).to_list(length=None)
        
        if not sessions:
            return {
                "status": "success",
                "sessions": [],
                "mentors": []
            }
        
        # Get unique mentor IDs from sessions
        mentor_ids = list(set(session["userId"] for session in sessions))
        
        # Get mentor profiles
        mentors = await mentor_collection.find({"userId": {"$in": mentor_ids}}).to_list(length=None)
        
        # Convert ObjectId to string and remove _id field for each session and mentor
        sessions_list = []
        for session in sessions:
            session_dict = dict(session)
            session_dict.pop('_id', None)
            sessions_list.append(session_dict)
        
        mentors_list = []
        for mentor in mentors:
            mentor_dict = dict(mentor)
            mentor_dict.pop('_id', None)
            mentors_list.append(mentor_dict)
        
        return {
            "status": "success",
            "sessions": sessions_list,
            "mentors": mentors_list
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch sessions and mentors: {str(e)}"
        )

@router.get("/group-session/all")
async def get_all_group_discussion_sessions():
    sessions_collection = get_collection("sessions")
    mentor_collection = get_collection("userprofile")
    
    try:
        # Get all group discussion sessions
        sessions = await sessions_collection.find({"sessionType": "group-session"}).to_list(length=None)
        
        if not sessions:
            return {
                "status": "success",
                "sessions": [],
                "mentors": []
            }
        
        # Get unique mentor IDs from sessions
        mentor_ids = list(set(session["userId"] for session in sessions))
        
        # Get mentor profiles
        mentors = await mentor_collection.find({"userId": {"$in": mentor_ids}}).to_list(length=None)
        
        # Convert ObjectId to string and remove _id field for each session and mentor
        sessions_list = []
        for session in sessions:
            session_dict = dict(session)
            session_dict.pop('_id', None)
            sessions_list.append(session_dict)
        
        mentors_list = []
        for mentor in mentors:
            mentor_dict = dict(mentor)
            mentor_dict.pop('_id', None)
            mentors_list.append(mentor_dict)
        
        return {
            "status": "success",
            "sessions": sessions_list,
            "mentors": mentors_list
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch group discussion sessions and mentors: {str(e)}"
        )
