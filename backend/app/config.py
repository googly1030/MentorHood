import os
from pydantic_settings import BaseSettings

class Config:
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "mydatabase")
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")

class Settings(BaseSettings):
    DATABASE_URL: str = "mongodb://localhost:27017/mentorhood"
    DATABASE_NAME: str = "mentorhood"

settings = Settings()
DATABASE_URL = settings.DATABASE_URL

config = Config()