from google.oauth2 import service_account
from googleapiclient.discovery import build
import datetime
import os
import json
import traceback

# Path to your service account JSON file - get from an environment variable or use the file directly
SERVICE_ACCOUNT_FILE = os.environ.get('GOOGLE_SERVICE_ACCOUNT_FILE', 'd:/Inovation-WorkFolder/Mentor-Hood/project/service-account-key.json')

# Check if the file exists, if not try Docker-specific path
if not os.path.exists(SERVICE_ACCOUNT_FILE) and not os.environ.get('GOOGLE_SERVICE_ACCOUNT_FILE'):
    # Try a common Docker location
    docker_path = '/app/service-account-key.json'
    if os.path.exists(docker_path):
        SERVICE_ACCOUNT_FILE = docker_path
        print(f"Using service account file: {SERVICE_ACCOUNT_FILE}")
    else:
        print(f"WARNING: Service account file not found at any location")

# The scopes required for Google Calendar
SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
]

def create_google_meet_event(summary, start_time, end_time, attendees, description=None):
    """
    Create a Google Calendar event with Google Meet link.
    
    Args:
        summary (str): Event title
        start_time (datetime): Start time of the meeting
        end_time (datetime): End time of the meeting
        attendees (list): List of email addresses for attendees (will be included in description)
        description (str, optional): Event description
        
    Returns:
        dict: Created event with Google Meet link
    """
    try:
        print(f"Attempting to use service account file: {SERVICE_ACCOUNT_FILE}")
        if not os.path.exists(SERVICE_ACCOUNT_FILE):
            print(f"WARNING: Service account file not found at {SERVICE_ACCOUNT_FILE}")
            return None
        
        # Print service account file content (with sensitive data redacted)
        try:
            with open(SERVICE_ACCOUNT_FILE, 'r') as f:
                sa_content = json.load(f)
                print(f"Service account email: {sa_content.get('client_email')}")
                print(f"Service account project ID: {sa_content.get('project_id')}")
        except Exception as e:
            print(f"Error reading service account file: {str(e)}")
            
        # Authenticate with service account
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
            
        # Create Google Calendar API service
        service = build('calendar', 'v3', credentials=credentials)
        
        # Add attendees to description instead of the event
        enhanced_description = description or ""
        if attendees:
            enhanced_description += "\n\nInvited attendees:"
            for attendee in attendees:
                if attendee:
                    enhanced_description += f"\n- {attendee}"
        
        # Create event with correct conferencing approach - simplified
        event = {
            'summary': summary,
            'description': enhanced_description,
            'start': {
                'dateTime': start_time.isoformat(),
                'timeZone': 'UTC',
            },
            'end': {
                'dateTime': end_time.isoformat(),
                'timeZone': 'UTC',
            },
            'conferenceData': {
                'createRequest': {
                    'requestId': f'mentor-hood-meeting-{datetime.datetime.now().timestamp()}'
                    # Don't specify conferenceSolutionKey at all - let Google choose the default
                }
            }
        }
        
        print(f"Creating calendar event with conference data")
        
        # Simplify the API call - remove supportsAttachments
        try:
            event_result = service.events().insert(
                calendarId='primary',
                body=event,
                conferenceDataVersion=1
            ).execute()
            
            event = event_result
            print(f"Calendar event created successfully with ID: {event.get('id')}")
            
            # Check if conferenceData exists in the response
            if 'conferenceData' not in event:
                print(f"WARNING: No conferenceData in response. API may not be enabled.")
                return None
            
            # Return the Google Meet link from the created event
            meet_link = None
            if 'conferenceData' in event and 'entryPoints' in event['conferenceData']:
                for entry_point in event['conferenceData']['entryPoints']:
                    if entry_point['entryPointType'] == 'video':
                        meet_link = entry_point['uri']
                        print(f"Successfully created Google Meet link: {meet_link}")
                        break
            else:
                print(f"No video entry point found in conference data")
                return None
            
            return {
                'event_id': event['id'],
                'meet_link': meet_link,
                'event': event
            }
            
        except Exception as e:
            print(f"Error creating calendar event: {str(e)}")
            return None
            
    except Exception as e:
        print(f"Error in create_google_meet_event: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return None