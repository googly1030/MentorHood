import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user as user_routes
from app.routes import questionnaire as questionnaire_routes
from app.routes import session as session_routes
from app.routes import ama_session as ama_session_routes
from app.utils.email import email_sender
from app.routes import mentor as mentor_routes
from app.routes import registration as registration_routes
from app.routes import booking as booking_routes
from app.routes import dashboard
from app.routes import upload

# Add this near the start of your application
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
    "https://ec2-13-201-134-80.ap-south-1.compute.amazonaws.com",
    "https://mentorhood.guvi.world",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_routes.router)
app.include_router(questionnaire_routes.router)
app.include_router(session_routes.router)
app.include_router(mentor_routes.router)
app.include_router(ama_session_routes.router)
app.include_router(registration_routes.router)
app.include_router(booking_routes.router)
app.include_router(dashboard.router)
app.include_router(upload.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI MongoDB app!"}

@app.get("/test-email")
async def test_email():
    try:
        success = email_sender.send_email(
            to_email="pradeep.g@guvi.in",
            subject="Test Email from MentorHood",
            body="<h1>Test Email</h1><p>This is a test email from your MentorHood application.</p>"
        )
        if success:
            return {"message": "Email sent successfully"}
        else:
            return {"message": "Failed to send email"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

# Add this to check if environment variables are set (remove before production)
@app.on_event("startup")
async def startup_event():
    logger.info("Checking S3 configuration...")
    s3_vars = {
        "AWS_ACCESS_KEY": os.environ.get("AWS_ACCESS_KEY"),
        "AWS_SECRET_KEY": os.environ.get("AWS_SECRET_KEY"),
        "S3_REGION": os.environ.get("S3_REGION"),
        "S3_BUCKET": os.environ.get("S3_BUCKET")
    }
    
    for key, value in s3_vars.items():
        if value:
            logger.info(f"{key} is set")
        else:
            logger.warning(f"{key} is NOT set!")