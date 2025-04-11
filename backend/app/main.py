from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user as user_routes
from app.routes import questionnaire as questionnaire_routes
from app.routes import session as session_routes
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