from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from pydantic_core import core_schema

# Updated PyObjectId class for Pydantic v2
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    # Replacing __modify_schema__ with __get_pydantic_json_schema__ for Pydantic v2
    @classmethod
    def __get_pydantic_json_schema__(cls, _schema_generator, _field_schema):
        return {"type": "string"}
    
    # Add this for proper serialization in Pydantic v2
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ]),
        ])


class AMASessionCreate(BaseModel):
    title: str
    description: str
    mentor: dict
    date: str
    time: str
    duration: str
    registrants: int = 0
    maxRegistrants: int
    questions: List[str] = []
    isWomanTech: bool = False
    sessionName: Optional[str] = None
    sessionType: Optional[str] = None
    isPaid: bool = False
    price: float = 0
    tokenPrice: int = 0
    topics: List[str] = []
    timeSlots: List[dict] = []

    class Config:
        arbitrary_types_allowed = True


class AMASession(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    mentor: dict
    date: str
    time: str
    duration: str
    registrants: int = 0
    maxRegistrants: int
    questions: List[str] = []
    isWomanTech: bool = False
    sessionName: Optional[str] = None
    sessionType: Optional[str] = None
    isPaid: bool = False
    price: float = 0
    tokenPrice: int = 0
    topics: List[str] = []
    timeSlots: List[dict] = []
    created_at: datetime = None
    updated_at: datetime = None

    # Update Config for Pydantic v2
    model_config = {
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: str
        },
        "populate_by_name": True
    }