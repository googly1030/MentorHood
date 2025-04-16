import uuid
from datetime import datetime, timedelta

class MeetingService:
    def __init__(self):
        # No authentication needed for Jitsi Meet
        pass
    
    def create_meet_event(self, title, description, start_time, duration_minutes, attendee_email=None):
        """
        Create a Jitsi Meet link for a session.
        
        Args:
            title (str): Event title (used for room naming)
            description (str): Event description (unused in this implementation)
            start_time (datetime): Start time of the event
            duration_minutes (int): Duration of the event in minutes
            attendee_email (str, optional): Email of the attendee (unused in this implementation)
            
        Returns:
            dict: Event details including the Jitsi Meet link
        """
        # Calculate end time
        end_time = start_time + timedelta(minutes=int(duration_minutes))
        
        # Generate a room name (can be more readable than random codes)
        room_id = f"mentorhood-{uuid.uuid4().hex[:8]}"
        
        # Create Jitsi Meet link
        meet_link = f"https://meet.jit.si/{room_id}"
        
        # Create a unique ID for this "event"
        event_id = f"jitsi-meet-{uuid.uuid4()}"
        
        return {
            'event_id': event_id,
            'meet_link': meet_link,
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat()
        }