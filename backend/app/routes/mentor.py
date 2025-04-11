from fastapi import APIRouter, HTTPException, status
from datetime import datetime, UTC
from typing import List
from app.schemas.mentor import MentorProfile
from app.database import get_collection
import uuid

router = APIRouter(
    prefix="/api/mentors",
    tags=["mentors"]
)

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