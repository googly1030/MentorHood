from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    id: str | None = None
    username: str
    email: EmailStr
    role: str
    disabled: bool = False

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str

class UserModel(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str