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

class Mentor(BaseModel):
    name: str
    role: str
    image: str

class AMASessionBase(BaseModel):
    title: str
    mentor: Mentor
    date: str
    time: str
    duration: str
    registrants: int
    maxRegistrants: int
    questions: List[str]
    isWomanTech: bool = False
    tag: Optional[str] = None
    description: Optional[str] = None

class AMASessionCreate(AMASessionBase):
    pass

class AMASession(AMASessionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True 