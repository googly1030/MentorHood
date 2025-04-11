from fastapi import APIRouter, HTTPException, status, Query, Body
from datetime import datetime, UTC
from typing import List, Any, Dict
from app.schemas.mentor import MentorProfile
from app.database import get_collection
import uuid

router = APIRouter(
    prefix="/api/mentors",
    tags=["mentors"]
)

@router.get("/all")
async def get_all_mentors():
    collection = get_collection("mentorProfile")
    
    mentors = await collection.find({}).to_list(length=None)
    
    # Convert ObjectId to string and remove _id field for each mentor
    mentors_list = []
    for mentor in mentors:
        mentor_dict = dict(mentor)
        mentor_dict.pop('_id', None)
        mentors_list.append(mentor_dict)

    return {
        "status": "success",
        "mentors": mentors_list
    }

@router.post("/creatementorprofile")
async def create_mentor_profile(profile: dict = Body(...)):
    collection = get_collection("mentorProfile")
    
    # Check if the userId is provided
    if not profile.get("userId"):
        raise HTTPException(status_code=400, detail="User ID is required")
    
    # Check if profile already exists for this user
    existing_profile = await collection.find_one({"userId": profile["userId"]})
    if existing_profile:
        raise HTTPException(status_code=409, detail="Profile already exists for this user")
    
    # Add timestamps if not provided
    current_time = datetime.now(UTC).isoformat()
    if "createdAt" not in profile:
        profile["createdAt"] = current_time
    if "updatedAt" not in profile:
        profile["updatedAt"] = current_time
    
    # Insert the profile into the collection
    insert_result = await collection.insert_one(profile)
    if not insert_result.inserted_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to create mentor profile"
        )
    
    # Get the created profile (excluding _id)
    created_profile = await collection.find_one({"userId": profile["userId"]})
    if created_profile:
        created_profile_dict = dict(created_profile)
        created_profile_dict.pop('_id', None)
    else:
        created_profile_dict = {}
    
    return {
        "status": "success",
        "message": "Mentor profile created successfully",
        "mentor": created_profile_dict
    }

@router.get("/{mentor_id}")
async def get_mentor_profile(mentor_id: str):
    collection = get_collection("mentorProfile")
    
    if not mentor_id:
        raise HTTPException(status_code=400, detail="Mentor ID required")
    
    mentor = await collection.find_one({"userId": mentor_id})
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")
    
    # Convert ObjectId to string and remove _id field
    mentor_dict = dict(mentor)
    mentor_dict.pop('_id', None)
    
    return {
        "status": "success",
        "mentor": mentor_dict
    }

@router.post("/{mentor_id}/update")
async def update_mentor_profile(mentor_id: str, profile: dict = Body(...)):
    collection = get_collection("mentorProfile")

    if not mentor_id:
        raise HTTPException(status_code=400, detail="Mentor ID required")

    # Check if mentor exists
    existing_mentor = await collection.find_one({"userId": mentor_id})
    if not existing_mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    # Update the profile
    result = await collection.update_one(
        {"userId": mentor_id},
        {"$set": profile}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update profile"
        )

    return {
        "status": "success",
        "message": "Profile updated successfully"
    }

@router.get("/all")
async def get_all_mentors():
    collection = get_collection("mentorProfile")
    
    mentors = await collection.find({}).to_list(length=None)
    
    # Convert ObjectId to string and remove _id field for each mentor
    mentors_list = []
    for mentor in mentors:
        mentor_dict = dict(mentor)
        mentor_dict.pop('_id', None)
        mentors_list.append(mentor_dict)

    return {
        "status": "success",
        "mentors": mentors_list
    }

@router.get("/{mentor_id}/sessions")
async def get_mentor_sessions(
    mentor_id: str,
    type: str = Query(None, description="Type of session: one-on-one or group-session")
):
    sessions_collection = get_collection("sessions")
    
    if not mentor_id:
        raise HTTPException(status_code=400, detail="Mentor ID required")
    
    # Build query based on session type
    query = {"userId": mentor_id}
    if type:
        if type not in ["one-on-one", "group-session"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid session type. Must be either 'one-on-one' or 'group-session'"
            )
        query["sessionType"] = type
    
    sessions = await sessions_collection.find(query).to_list(length=None)
    
    # Convert ObjectId to string and remove _id field for each session
    sessions_list = []
    for session in sessions:
        session_dict = dict(session)
        session_dict.pop('_id', None)
        sessions_list.append(session_dict)

    return {
        "status": "success",
        "sessions": sessions_list
    } 