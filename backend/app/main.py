from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user as user_routes

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_routes.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI MongoDB app!"}