from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, EmailStr

from ..database import get_collection
from ..schemas.questionnaire import QuestionnaireCreate, Questionnaire as QuestionnaireSchema, AnswerCreate, Answer as AnswerSchema
from ..utils.email import email_sender

router = APIRouter(
    prefix="/api/questionnaires",
    tags=["questionnaires"]
)

# Define a schema for the registration request
class RegistrationRequest(BaseModel):
    email: EmailStr

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

@router.post("/{questionnaire_id}/answer", response_model=AnswerSchema)
async def add_answer_to_questionnaire(questionnaire_id: str, answer: AnswerCreate):
    questionnaire_collection = get_collection("questionnaires")
    answers_collection = get_collection("answers")
    
    if not ObjectId.is_valid(questionnaire_id):
        raise HTTPException(status_code=400, detail="Invalid questionnaire ID")
    
    # Find the questionnaire
    questionnaire = await questionnaire_collection.find_one({"_id": ObjectId(questionnaire_id)})
    if questionnaire is None:
        raise HTTPException(status_code=404, detail="Questionnaire not found")
    
    # Create the answer document
    answer_dict = answer.dict()
    answer_dict.update({
        "upvotes": 0,
        "timestamp": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # Insert the answer into the answers collection
    result = await answers_collection.insert_one(answer_dict)
    
    # Increment the answers count in the questionnaire
    await questionnaire_collection.update_one(
        {"_id": ObjectId(questionnaire_id)},
        {"$inc": {"answers": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    # Get the created answer
    created_answer = await answers_collection.find_one({"_id": result.inserted_id})
    created_answer["_id"] = str(created_answer["_id"])
    return created_answer

@router.get("/{questionnaire_id}/answers", response_model=List[AnswerSchema])
async def get_questionnaire_answers(
    questionnaire_id: str,
    skip: int = 0,
    limit: int = 10,
    sort_by: str = "timestamp"  # Default sort by timestamp (newest first)
):
    answers_collection = get_collection("answers")
    
    if not ObjectId.is_valid(questionnaire_id):
        raise HTTPException(status_code=400, detail="Invalid questionnaire ID")
    
    # Determine sort order based on sort_by parameter
    if sort_by == "upvotes":
        sort_criteria = [("upvotes", -1), ("timestamp", -1)]  # Sort by upvotes first, then timestamp
    else:  # Default to timestamp
        sort_criteria = [("timestamp", -1)]
    
    cursor = answers_collection.find({"question_id": questionnaire_id}).sort(sort_criteria).skip(skip).limit(limit)
    answers = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string before returning
    for a in answers:
        a["_id"] = str(a["_id"])
    
    return answers

@router.post("/register", response_model=dict)
async def register_user(registration: RegistrationRequest):
    """
    Register a user and send a confirmation email.
    """
    try:
        # Send confirmation email
        subject = "Registration Confirmation - MentorHood"
        body = f"""
        <html>
            <body>
                <h2>Thank you for registering with MentorHood!</h2>
                <p>We're excited to have you join our community of mentors and mentees.</p>
                <p>You can now access all our features and start connecting with others.</p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The MentorHood Team</p>
            </body>
        </html>
        """
        
        success = email_sender.send_email(
            to_email=registration.email,
            subject=subject,
            body=body
        )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to send confirmation email")
        
        return {"message": "Registration successful. Confirmation email sent."}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")