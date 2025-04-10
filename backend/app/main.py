from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user as user_routes

app = FastAPI()

# Configure CORS - update the origins list
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "*"  # During development only - remove in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include user routes
app.include_router(user_routes.router, prefix="/api")  # Add prefix

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI MongoDB app!"}