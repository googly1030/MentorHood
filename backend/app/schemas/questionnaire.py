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

class Author(BaseModel):
    id: str
    name: str
    initials: str

class QuestionnaireBase(BaseModel):
    title: str
    content: str
    category_id: Optional[str] = None
    session_id: Optional[str] = None

class QuestionnaireCreate(QuestionnaireBase):
    author: Optional[Author] = None

class Questionnaire(QuestionnaireBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    authors: List[Author]
    upvotes: int = 0
    answers: int = 0
    timestamp: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class AnswerBase(BaseModel):
    content: str
    author: Author
    question_id: str

class AnswerCreate(AnswerBase):
    pass

class Answer(AnswerBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    upvotes: int = 0
    timestamp: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True 