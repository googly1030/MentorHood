from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from bson import ObjectId
import logging

from ..database import get_collection

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)

@router.get("/mentee/{user_email}")
async def get_mentee_dashboard(user_email: str):
    """
    Get mentee dashboard data including:
    - User information
    - Upcoming bookings (sessions)
    - Past sessions
    - Learning progress
    """
    try:
        # Get user information
        users_collection = get_collection("users")
        user = await users_collection.find_one({"email": user_email})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get bookings for this user
        bookings_collection = get_collection("bookings")
        current_date = datetime.utcnow()
        current_date_str = current_date.strftime("%Y-%m-%d")
        
        logger.info(f"Fetching bookings for user: {user_email}, current date: {current_date_str}")
        
        # Find upcoming bookings (date in the future)
        # Note: In your sample data, date is stored as ISODate, we need to handle it properly
        upcoming_cursor = bookings_collection.find({
            "email": user_email,
        })
        
        all_bookings = await upcoming_cursor.to_list(length=None)
        logger.info(f"Total bookings found: {len(all_bookings)}")
        
        # Filter bookings by date manually since MongoDB query might not handle date format correctly
        upcoming_bookings = []
        past_bookings = []
        
        for booking in all_bookings:
            # Handle the date which could be in different formats
            booking_date = booking.get("date")
            
            if isinstance(booking_date, str):
                try:
                    # Try parsing as ISO format
                    booking_date = datetime.fromisoformat(booking_date.replace('Z', '+00:00'))
                    booking_date_str = booking_date.strftime("%Y-%m-%d")
                except ValueError:
                    # If not ISO format, use as is
                    booking_date_str = booking_date
            else:
                # If it's already a datetime object
                booking_date_str = booking_date.strftime("%Y-%m-%d") if hasattr(booking_date, "strftime") else str(booking_date)
            
            logger.info(f"Booking date: {booking_date_str}, Current date: {current_date_str}")
            
            # Compare dates as strings in YYYY-MM-DD format
            if booking_date_str >= current_date_str:
                upcoming_bookings.append(booking)
            else:
                past_bookings.append(booking)
        
        # Sort bookings by date
        upcoming_bookings.sort(key=lambda x: str(x.get("date")))
        past_bookings.sort(key=lambda x: str(x.get("date")), reverse=True)
        
        # Limit to 5 bookings each
        upcoming_bookings = upcoming_bookings[:5]
        past_bookings = past_bookings[:5]
        
        logger.info(f"Upcoming bookings: {len(upcoming_bookings)}, Past bookings: {len(past_bookings)}")
        
        # Enrich booking data with session information
        enriched_upcoming = await enrich_bookings(upcoming_bookings)
        enriched_past = await enrich_bookings(past_bookings)
        
        # Calculate learning stats
        total_sessions = len(past_bookings)
        total_hours = calculate_total_hours(past_bookings)
        
        # Prepare learning progress data
        # In a real application, you might have actual skills and certificates data
        skills_improved = ["System Design", "Leadership", "Frontend Development"]
        certificates = 0
        
        # Convert ObjectId to string
        if "_id" in user:
            user["_id"] = str(user["_id"])
        
        return {
            "user": {
                "name": user.get("username", user.get("name", "User")),
                "email": user_email,
                # Include other user details as needed
            },
            "upcomingSessions": enriched_upcoming,
            "completedSessions": enriched_past,
            "learningProgress": {
                "sessionsCompleted": total_sessions,
                "totalHours": total_hours,
                "skillsImproved": skills_improved,
                "certificates": certificates
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching dashboard data: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard data: {str(e)}")

async def enrich_bookings(bookings):
    """Helper function to enrich booking data with session and mentor details"""
    enriched_bookings = []
    
    for booking in bookings:
        # Convert ObjectId to string
        if "_id" in booking:
            booking["_id"] = str(booking["_id"])
        
        try:
            # Get session data based on session_id
            session_id = booking.get("session_id")
            if not session_id:
                logger.warning(f"Booking {booking.get('_id')} has no session_id")
                continue
                
            sessions_collection = get_collection("sessions")
            
            # Try to find by string ID first (your sample data uses string IDs)
            session = await sessions_collection.find_one({"sessionId": session_id})
            
            # If not found, try by ObjectId
            if not session and ObjectId.is_valid(session_id):
                session = await sessions_collection.find_one({"_id": ObjectId(session_id)})
            
            if session:
                # Format date and time properly
                date_str = booking.get("date")
                if isinstance(date_str, str) and "T" in date_str:
                    # Extract just the date part from ISO format
                    date_str = date_str.split("T")[0]
                
                # Get mentor information from user collection if session has mentorId
                mentor_name = session.get("mentorName", "Mentor")
                mentor_role = "Mentor"
                mentor_company = ""
                
                mentor_id = session.get("userId") or session.get("mentorId")
                if mentor_id:
                    users_collection = get_collection("users")
                    mentor = await users_collection.find_one({"userId": mentor_id})
                    if mentor:
                        mentor_name = mentor.get("username", mentor_name)
                
                enriched_booking = {
                    "id": booking.get("_id", str(ObjectId())),
                    "title": session.get("sessionName", "Mentorship Session"),
                    "mentor": mentor_name,
                    "mentorRole": mentor_role + (f" at {mentor_company}" if mentor_company else ""),
                    "date": date_str or booking.get("date", ""),
                    "time": booking.get("time", ""),
                    "timezone": booking.get("timezone", "UTC"),
                    "duration": f"{session.get('duration', 45)} min",
                    "status": "confirmed",
                    "meeting_link": booking.get("meeting_link", ""),
                    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"  # Default image
                }
                enriched_bookings.append(enriched_booking)
            else:
                # If session not found, create a basic booking record
                logger.warning(f"Session {session_id} not found for booking {booking.get('_id')}")
                
                date_str = booking.get("date", "")
                if isinstance(date_str, str) and "T" in date_str:
                    date_str = date_str.split("T")[0]
                    
                enriched_booking = {
                    "id": booking.get("_id", str(ObjectId())),
                    "title": "Mentorship Session",
                    "mentor": "Mentor",
                    "mentorRole": "Mentor",
                    "date": date_str,
                    "time": booking.get("time", ""),
                    "timezone": booking.get("timezone", "UTC"),
                    "duration": "45 min",
                    "status": "confirmed",
                    "meeting_link": booking.get("meeting_link", ""),
                    "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                }
                enriched_bookings.append(enriched_booking)
                
        except Exception as e:
            logger.error(f"Error enriching booking {booking.get('_id', 'unknown')}: {str(e)}", exc_info=True)
            continue
    
    return enriched_bookings

def calculate_total_hours(bookings):
    """Calculate total hours from bookings"""
    total_hours = 0
    
    for booking in bookings:
        # Try to get duration from associated session
        # For now, assume each session is 1 hour
        total_hours += 1
        
    return total_hours