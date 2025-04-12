from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from bson import ObjectId
import uuid

from ..database import get_collection
from ..schemas.registration import RegistrationCreate, Registration
from ..utils.email import email_sender

router = APIRouter(
    prefix="/registrations",
    tags=["registrations"]
)

@router.post("/", response_model=Registration)
async def create_registration(registration: RegistrationCreate):
    """
    Create a new registration for an AMA session.
    """
    registrations_collection = get_collection("registrations")
    ama_sessions_collection = get_collection("ama_sessions")
    
    # Check if the session exists
    if not ObjectId.is_valid(registration.session_id):
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    session = await ama_sessions_collection.find_one({"_id": ObjectId(registration.session_id)})
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Check if the user is already registered
    existing_registration = await registrations_collection.find_one({
        "email": registration.email,
        "session_id": registration.session_id
    })
    
    if existing_registration:
        raise HTTPException(status_code=400, detail="You are already registered for this session")
    
    # Check if the session is full
    if session["registrants"] >= session["maxRegistrants"]:
        raise HTTPException(status_code=400, detail="Session is full")
    
    # Generate a unique meeting link
    meeting_id = str(uuid.uuid4())
    meeting_link = f"https://meet.mentorhood.com/{meeting_id}"
    
    # Create the registration document with session details and meeting link
    registration_dict = registration.dict()
    registration_dict.update({
        "meeting_link": meeting_link,
        "meeting_id": meeting_id,
        "session_title": session.get("title", ""),
        "session_date": session.get("date", ""),
        "session_time": session.get("time", ""),
        "session_duration": session.get("duration", ""),
        "mentor_name": session.get("mentor", {}).get("name", ""),
        "mentor_role": session.get("mentor", {}).get("role", ""),
        "mentor_company": session.get("mentor", {}).get("company", ""),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # Insert the registration
    result = await registrations_collection.insert_one(registration_dict)
    
    # Increment the registrants count in the session
    await ama_sessions_collection.update_one(
        {"_id": ObjectId(registration.session_id)},
        {"$inc": {"registrants": 1}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    # Get the created registration
    created_registration = await registrations_collection.find_one({"_id": result.inserted_id})
    created_registration["_id"] = str(created_registration["_id"])
    
    # Send confirmation email
    try:
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
                    .meeting-link {{
                        background-color: #f0f8ff;
                        border: 1px solid #cce6ff;
                        padding: 15px;
                        border-radius: 4px;
                        margin: 20px 0;
                        word-break: break-all;
                    }}
                    .meeting-link a {{
                        color: #0066cc;
                        text-decoration: none;
                        font-weight: bold;
                    }}
                    .meeting-link a:hover {{
                        text-decoration: underline;
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
                        
                        <div class="meeting-link">
                            <p style="margin-top: 0;"><strong>Your Meeting Link:</strong></p>
                            <a href="{meeting_link}">{meeting_link}</a>
                            <p style="margin-bottom: 0; font-size: 14px;">This link will be active 5 minutes before your scheduled session.</p>
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
            # Log the error but don't fail the registration
            print(f"Failed to send confirmation email to {registration.email}")
    
    except Exception as e:
        # Log the error but don't fail the registration
        print(f"Error sending confirmation email: {str(e)}")
    
    return created_registration

@router.get("/check/{session_id}/{email}", response_model=dict)
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

@router.get("/session/{session_id}", response_model=List[Registration])
async def get_session_registrations(session_id: str):
    """
    Get all registrations for a specific session.
    """
    registrations_collection = get_collection("registrations")
    
    if not ObjectId.is_valid(session_id):
        raise HTTPException(status_code=400, detail="Invalid session ID")
    
    cursor = registrations_collection.find({"session_id": session_id})
    registrations = await cursor.to_list(length=None)
    
    # Convert ObjectId to string before returning
    for r in registrations:
        r["_id"] = str(r["_id"])
    
    return registrations 