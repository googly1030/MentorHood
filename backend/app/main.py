from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user as user_routes
from app.routes import questionnaire as questionnaire_routes
from app.routes import session as session_routes
from app.utils.email import email_sender
from app.routes import mentor as mentor_routes

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use specific origins instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_routes.router, prefix="/api")
app.include_router(questionnaire_routes.router)
app.include_router(session_routes.router)
app.include_router(mentor_routes.router)

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