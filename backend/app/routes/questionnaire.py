from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from bson import ObjectId

from ..database import get_collection
from ..schemas.questionnaire import QuestionnaireCreate, Questionnaire as QuestionnaireSchema

router = APIRouter(
    prefix="/api/questionnaires",
    tags=["questionnaires"]
)

@router.get("/", response_model=List[QuestionnaireSchema])
async def list_questionnaires(
    skip: int = 0,
    limit: int = 10,
    category_id: str = None,
    sort_by: str = "timestamp"  # Default sort by timestamp (newest first)
):
    collection = get_collection("questionnaires")
    query = {}
    if category_id and category_id != "all":
        query["category_id"] = category_id
    
    # Determine sort order based on sort_by parameter
    sort_order = -1  # Default to descending (newest first)
    if sort_by == "upvotes":
        sort_criteria = [("upvotes", -1), ("timestamp", -1)]  # Sort by upvotes first, then timestamp
    else:  # Default to timestamp
        sort_criteria = [("timestamp", -1)]
    
    cursor = collection.find(query).sort(sort_criteria).skip(skip).limit(limit)
    questionnaires = await cursor.to_list(length=limit)
    # Convert ObjectId to string before returning
    for q in questionnaires:
        q["_id"] = str(q["_id"])
    return questionnaires

@router.post("/", response_model=QuestionnaireSchema)
async def create_questionnaire(questionnaire: QuestionnaireCreate):
    collection = get_collection("questionnaires")
    
    questionnaire_dict = questionnaire.dict()
    questionnaire_dict.update({
        "authors": [{
            "id": "current-user",  # This should be replaced with actual user ID
            "name": "Current User",  # This should be replaced with actual user name
            "initials": "CU"  # This should be replaced with actual user initials
        }],
        "upvotes": 0,
        "answers": 0,
        "timestamp": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    result = await collection.insert_one(questionnaire_dict)
    created_questionnaire = await collection.find_one({"_id": result.inserted_id})
    # Convert ObjectId to string before returning
    created_questionnaire["_id"] = str(created_questionnaire["_id"])
    return created_questionnaire

@router.get("/{questionnaire_id}", response_model=QuestionnaireSchema)
async def get_questionnaire(questionnaire_id: str):
    collection = get_collection("questionnaires")
    
    if not ObjectId.is_valid(questionnaire_id):
        raise HTTPException(status_code=400, detail="Invalid questionnaire ID")
    
    questionnaire = await collection.find_one({"_id": ObjectId(questionnaire_id)})
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    # Convert ObjectId to string before returning
    questionnaire["_id"] = str(questionnaire["_id"])
    return questionnaire

@router.post("/{questionnaire_id}/upvote", response_model=QuestionnaireSchema)
async def upvote_questionnaire(questionnaire_id: str):
    collection = get_collection("questionnaires")
    
    if not ObjectId.is_valid(questionnaire_id):
        raise HTTPException(status_code=400, detail="Invalid questionnaire ID")
    
    # Find the questionnaire
    questionnaire = await collection.find_one({"_id": ObjectId(questionnaire_id)})
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    # Increment the upvotes count
    result = await collection.update_one(
        {"_id": ObjectId(questionnaire_id)},
        {"$inc": {"upvotes": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update questionnaire")
    
    # Get the updated questionnaire
    updated_questionnaire = await collection.find_one({"_id": ObjectId(questionnaire_id)})
    updated_questionnaire["_id"] = str(updated_questionnaire["_id"])
    return updated_questionnaire

@router.post("/{questionnaire_id}/answer", response_model=QuestionnaireSchema)
async def add_answer_to_questionnaire(questionnaire_id: str):
    collection = get_collection("questionnaires")
    
    if not ObjectId.is_valid(questionnaire_id):
        raise HTTPException(status_code=400, detail="Invalid questionnaire ID")
    
    # Find the questionnaire
    questionnaire = await collection.find_one({"_id": ObjectId(questionnaire_id)})
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    # Increment the answers count
    result = await collection.update_one(
        {"_id": ObjectId(questionnaire_id)},
        {"$inc": {"answers": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update questionnaire")
    
    # Get the updated questionnaire
    updated_questionnaire = await collection.find_one({"_id": ObjectId(questionnaire_id)})
    updated_questionnaire["_id"] = str(updated_questionnaire["_id"])
    return updated_questionnaire