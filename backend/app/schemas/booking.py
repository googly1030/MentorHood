from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Any
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema: dict, field: Any) -> None:
        field_schema.update(type="string")

class BookingBase(BaseModel):
    session_id: str
    date: str
    time: str
    timezone: str
    email: Optional[EmailStr] = None

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    meeting_link: Optional[str] = None

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True 