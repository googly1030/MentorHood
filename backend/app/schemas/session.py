from pydantic import BaseModel, Field
from typing import List, Optional, Any
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

class TimeRange(BaseModel):
    start: Optional[str] = None
    end: Optional[str] = None

class TimeSlot(BaseModel):
    day: Optional[str] = None
    available: Optional[bool] = None
    timeRanges: Optional[List[TimeRange]] = None

class SessionBase(BaseModel):
    sessionName: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[str] = None
    sessionType: Optional[str] = None
    numberOfSessions: Optional[str] = None
    occurrence: Optional[str] = None
    topics: Optional[List[str]] = None
    allowMenteeTopics: Optional[bool] = None
    showOnProfile: Optional[bool] = None
    isPaid: Optional[bool] = None
    price: Optional[str] = None
    mentorId: Optional[str] = None
    sessionId: Optional[str] = None

class SessionCreate(SessionBase):
    timeSlots: Optional[List[TimeSlot]] = None
    userId: str

class Session(SessionBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    timeSlots: Optional[List[TimeSlot]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True 