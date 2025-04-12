from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel
import uuid
import secrets
import re

from ..database import get_collection
from ..schemas.booking import BookingCreate, Booking as BookingSchema
from ..utils.email import email_sender

router = APIRouter(
    prefix="/api/bookings",
    tags=["bookings"]
)

class BookingRequest(BaseModel):
    session_id: str
    date: str
    time: str
    timezone: str
    email: Optional[str] = None
    session_data: dict

@router.post("/create", response_model=BookingSchema)
async def create_booking(booking_request: BookingRequest):
    """
    Create a new booking and send a confirmation email.
    """
    try:
        # Generate a unique meeting link
        meeting_id = str(uuid.uuid4())
        meeting_link = f"https://meet.mentorhood.com/{meeting_id}"
        
        # Create the booking document
        booking_dict = {
            "session_id": booking_request.session_id,
            "date": booking_request.date,
            "time": booking_request.time,
            "timezone": booking_request.timezone,
            "email": booking_request.email,
            "meeting_link": meeting_link,
            "meeting_id": meeting_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert the booking
        bookings_collection = get_collection("bookings")
        result = await bookings_collection.insert_one(booking_dict)
        
        # Get the created booking
        created_booking = await bookings_collection.find_one({"_id": result.inserted_id})
        created_booking["_id"] = str(created_booking["_id"])
        
        # Send confirmation email if email is provided
        if booking_request.email:
            await send_booking_confirmation_email(
                booking_request.email, 
                booking_request.session_data, 
                booking_request,
                meeting_link
            )
        
        return booking_dict
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Booking creation failed: {str(e)}")

@router.get("/", response_model=List[BookingSchema])
async def list_bookings(session_id: str = None):
    """
    List all bookings, optionally filtered by session_id.
    """
    bookings_collection = get_collection("bookings")
    query = {}
    
    if session_id:
        if not ObjectId.is_valid(session_id):
            raise HTTPException(status_code=400, detail="Invalid session ID")
        query["session_id"] = session_id
    
    cursor = bookings_collection.find(query)
    bookings = await cursor.to_list(length=100)
    
    # Convert ObjectId to string before returning
    for b in bookings:
        b["_id"] = str(b["_id"])
    
    return bookings

@router.get("/{booking_id}", response_model=BookingSchema)
async def get_booking(booking_id: str):
    """
    Get a booking by ID.
    """
    bookings_collection = get_collection("bookings")
    
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(status_code=400, detail="Invalid booking ID")
    
    booking = await bookings_collection.find_one({"_id": ObjectId(booking_id)})
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking["_id"] = str(booking["_id"])
    return booking

@router.get("/check/{session_id}/{email}")
async def check_booking_status(session_id: str, email: str):
    """
    Check if a user has already booked a specific session.
    Returns a list of all dates the user has booked for this session.
    """
    try:
        bookings_collection = get_collection("bookings")
        
        # Find all bookings with matching session_id and email
        cursor = bookings_collection.find({
            "session_id": session_id,
            "email": email
        })
        
        bookings = await cursor.to_list(length=100)
        
        # Convert ObjectId to string for each booking
        for booking in bookings:
            booking["_id"] = str(booking["_id"])
        
        return {
            "has_bookings": len(bookings) > 0,
            "bookings": bookings
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error checking booking status: {str(e)}"
        )

async def send_booking_confirmation_email(email: str, session_data: dict, booking_request: BookingRequest, meeting_link: str):
    """
    Send a confirmation email for a booking.
    """
    subject = f"Booking Confirmation - {session_data.get('title', 'AMA Session')}"
    
    # Format date and time - handle ISO format dates with time component
    try:
        # Check if the date is in ISO format with time component
        if 'T' in booking_request.date:
            # Extract just the date part (YYYY-MM-DD)
            date_match = re.match(r'(\d{4}-\d{2}-\d{2})', booking_request.date)
            if date_match:
                date_str = date_match.group(1)
                formatted_date = datetime.strptime(date_str, "%Y-%m-%d").strftime("%B %d, %Y")
            else:
                formatted_date = booking_request.date
        else:
            # Assume it's already in YYYY-MM-DD format
            formatted_date = datetime.strptime(booking_request.date, "%Y-%m-%d").strftime("%B %d, %Y")
    except Exception as e:
        # Fallback to the original date string if parsing fails
        formatted_date = booking_request.date
    
    formatted_time = booking_request.time
    
    # Get additional session details
    session_title = session_data.get('title', 'AMA Session')
    session_description = session_data.get('description', '')
    session_duration = session_data.get('duration', '60 minutes')
    mentor_name = session_data.get('mentor', {}).get('name', 'Mentor')
    mentor_role = session_data.get('mentor', {}).get('role', '')
    mentor_company = session_data.get('mentor', {}).get('company', '')
    session_tag = session_data.get('tag', '')
    
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
                .button {{
                    display: inline-block;
                    background-color: #000000;
                    color: #ffffff;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: bold;
                    margin-top: 20px;
                }}
                .tag {{
                    display: inline-block;
                    background-color: #e0e0e0;
                    color: #333333;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    margin-right: 8px;
                }}
                .mentor-info {{
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                }}
                .mentor-avatar {{
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 15px;
                    object-fit: cover;
                }}
                .mentor-details {{
                    flex: 1;
                }}
                .mentor-name {{
                    font-weight: bold;
                    margin-bottom: 2px;
                }}
                .mentor-role {{
                    color: #666666;
                    font-size: 14px;
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
                    <h2>Your Booking is Confirmed!</h2>
                    
                    <p>Thank you for booking a session with MentorHood. We're excited to have you join us!</p>
                    
                    <div class="session-details">
                        <h3 style="margin-top: 0;">{session_title}</h3>
                        
                        {session_tag and f'<span class="tag">{session_tag}</span>'}
                        
                        <div class="mentor-info">
                            <img src="{session_data.get('mentor', {}).get('image', 'https://via.placeholder.com/50')}" alt="{mentor_name}" class="mentor-avatar">
                            <div class="mentor-details">
                                <div class="mentor-name">{mentor_name}</div>
                                <div class="mentor-role">{mentor_role} at {mentor_company}</div>
                            </div>
                        </div>
                        
                        <p style="margin-top: 15px;"><strong>Date:</strong> {formatted_date}</p>
                        <p><strong>Time:</strong> {formatted_time} ({booking_request.timezone})</p>
                        <p><strong>Duration:</strong> {session_duration}</p>
                        
                        {session_description and f'<p style="margin-top: 15px;"><strong>Description:</strong><br>{session_description}</p>'}
                    </div>
                    
                    <div class="meeting-link">
                        <p style="margin-top: 0;"><strong>Your Meeting Link:</strong></p>
                        <a href="{meeting_link}">{meeting_link}</a>
                        <p style="margin-bottom: 0; font-size: 14px;">This link will be active 5 minutes before your scheduled session.</p>
                    </div>
                    
                    <p>We'll send you a reminder before the session starts. In the meantime, feel free to prepare your questions!</p>
                    
                    <a href="http://localhost:3000/sessions/{booking_request.session_id}" class="button">View Session Details</a>
                    
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
        to_email=email,
        subject=subject,
        body=body
    )
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send confirmation email")
    
    return {"message": "Confirmation email sent successfully"}