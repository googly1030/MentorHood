import os
from dotenv import load_dotenv

load_dotenv(".env")

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
ENVIRONMENT = os.getenv("ENVIRONMENT")

from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    MONGODB_URI: str = MONGODB_URI
    DATABASE_NAME: str = DATABASE_NAME
    ENVIRONMENT: str = ENVIRONMENT

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True
        extra = "allow"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
DATABASE_URL = settings.MONGODB_URI