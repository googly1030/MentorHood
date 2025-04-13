from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, EmailStr

from ..database import get_collection
from ..schemas.questionnaire import QuestionnaireCreate, Questionnaire as QuestionnaireSchema, AnswerCreate, Answer as AnswerSchema
from ..utils.email import email_sender

router = APIRouter(
    prefix="/questionnaires",
    tags=["questionnaires"]
)

# Define a schema for the registration request
class RegistrationRequest(BaseModel):
    email: EmailStr
    session_id: str

@router.get("/", response_model=List[QuestionnaireSchema])
async def list_questionnaires(
    skip: int = 0,
    limit: int = 10,
    category_id: str = None,
    session_id: str = None,
    sort_by: str = "timestamp"  # Default sort by timestamp (newest first)
):
    collection = get_collection("questionnaires")
    query = {}
    if category_id and category_id != "all":
        query["category_id"] = category_id
    
    # Add session_id filter if provided
    if session_id:
        if not ObjectId.is_valid(session_id):
            raise HTTPException(status_code=400, detail="Invalid session ID")
        query["session_id"] = session_id
    
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
    
    questionnaire_dict = questionnaire.dict(exclude={"author"})
    
    # Use provided author details or default values
    author = questionnaire.author.dict() if questionnaire.author else {
        "id": "current-user",
        "name": "Current User",
        "initials": "CU"
    }
    
    questionnaire_dict.update({
        "authors": [author],
        "upvotes": 0,
        "answers": 0,
        "timestamp": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # If session_id is provided, validate it
    if questionnaire_dict.get("session_id"):
        if not ObjectId.is_valid(questionnaire_dict["session_id"]):
            raise HTTPException(status_code=400, detail="Invalid session ID")
        
        # Check if the session exists
        ama_sessions_collection = get_collection("ama_sessions")
        session = await ama_sessions_collection.find_one({"_id": ObjectId(questionnaire_dict["session_id"])})
        if session is None:
            raise HTTPException(status_code=404, detail="Session not found")
    
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
    Register a user for an AMA session and send a confirmation email.
    """
    try:
        # Check if the session exists
        if not ObjectId.is_valid(registration.session_id):
            raise HTTPException(status_code=400, detail="Invalid session ID")
        
        ama_sessions_collection = get_collection("ama_sessions")
        session = await ama_sessions_collection.find_one({"_id": ObjectId(registration.session_id)})
        if session is None:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Check if the user is already registered
        registrations_collection = get_collection("registrations")
        existing_registration = await registrations_collection.find_one({
            "email": registration.email,
            "session_id": registration.session_id
        })
        
        if existing_registration:
            raise HTTPException(status_code=400, detail="You are already registered for this session")
        
        # Check if the session is full
        if session["registrants"] >= session["maxRegistrants"]:
            raise HTTPException(status_code=400, detail="Session is full")
        
        # Create the registration document
        registration_dict = {
            "email": registration.email,
            "session_id": registration.session_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert the registration
        await registrations_collection.insert_one(registration_dict)
        
        # Increment the registrants count in the session
        await ama_sessions_collection.update_one(
            {"_id": ObjectId(registration.session_id)},
            {"$inc": {"registrants": 1}, "$set": {"updated_at": datetime.utcnow()}}
        )
        
        # Send confirmation email
        subject = f"Registration Confirmation - {session['title']}"
        body = f"""
        <html>
            <head>
                <style>
                    body {{
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                    }}
                    .email-container {{
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .email-header {{
                        background-color: #000000;
                        padding: 20px;
                        text-align: center;
                    }}
                    .logo {{
                        font-size: 24px;
                        font-weight: bold;
                        color: #ffffff;
                        text-decoration: none;
                    }}
                    .email-body {{
                        background-color: #ffffff;
                        padding: 30px;
                        border: 1px solid #e0e0e0;
                        border-top: none;
                    }}
                    h2 {{
                        color: #000000;
                        font-size: 22px;
                        margin-top: 0;
                        margin-bottom: 20px;
                    }}
                    p {{
                        margin-bottom: 16px;
                        font-size: 16px;
                    }}
                    .session-details {{
                        background-color: #f5f5f5;
                        border: 1px solid #e0e0e0;
                        padding: 15px;
                        border-radius: 4px;
                        margin: 20px 0;
                    }}
                    .email-footer {{
                        background-color: #f5f5f5;
                        padding: 20px;
                        text-align: center;
                        font-size: 14px;
                        color: #666666;
                    }}
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <span class="logo">MentorHood</span>
                    </div>
                    
                    <div class="email-body">
                        <h2>You're registered for {session['title']}!</h2>
                        
                        <p>Thank you for registering for our upcoming AMA session. We're excited to have you join us!</p>
                        
                        <div class="session-details">
                            <p><strong>Session:</strong> {session['title']}</p>
                            <p><strong>Date:</strong> {session['date']}</p>
                            <p><strong>Time:</strong> {session['time']}</p>
                            <p><strong>Duration:</strong> {session['duration']}</p>
                            <p><strong>Host:</strong> {session['mentor']['name']}, {session['mentor']['role']}</p>
                        </div>
                        
                        <p>We'll send you a reminder before the session starts. In the meantime, feel free to prepare your questions!</p>
                        
                        <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@mentorhood.com">support@mentorhood.com</a>.</p>
                        
                        <p>Best regards,<br>The MentorHood Team</p>
                    </div>
                    
                    <div class="email-footer">
                        <p>© 2025 MentorHood. All rights reserved.</p>
                        <p>123 Mentorship Avenue, Knowledge City, CA 94103</p>
                    </div>
                </div>
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

@router.get("/check-registration/{session_id}/{email}", response_model=dict)
async def check_registration(session_id: str, email: str):
    """
    Check if a user is already registered for a session.
    """
    registrations_collection = get_collection("registrations")
    
    if not ObjectId.is_valid(session_id):
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    registration = await registrations_collection.find_one({
        "email": email,
        "session_id": session_id
    })
    
    return {"is_registered": registration is not None}

@router.post("/{question_id}/answers/{answer_id}/upvote", response_model=AnswerSchema)
async def upvote_answer(question_id: str, answer_id: str):
    """Upvote an answer for a specific question"""
    # Validate question_id
    if not ObjectId.is_valid(question_id):
        raise HTTPException(status_code=400, detail="Invalid question ID")
        
    # Validate answer_id
    if not ObjectId.is_valid(answer_id):
        raise HTTPException(status_code=400, detail="Invalid answer ID")
    
    # Get answers collection
    answers_collection = get_collection("answers")
    
    # Check if answer exists and belongs to the question
    answer = await answers_collection.find_one({
        "_id": ObjectId(answer_id),
        "question_id": question_id
    })
    
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found for this question")
    
    # Increment upvotes
    result = await answers_collection.update_one(
        {"_id": ObjectId(answer_id)},
        {"$inc": {"upvotes": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to upvote answer")
    
    # Get updated answer
    updated_answer = await answers_collection.find_one({"_id": ObjectId(answer_id)})
    
    # Convert ObjectId to string for JSON serialization
    updated_answer["_id"] = str(updated_answer["_id"])
    
    return updated_answer