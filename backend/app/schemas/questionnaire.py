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

class AuthorBase(BaseModel):
    id: str
    name: str
    initials: str
    image: Optional[str] = None

class QuestionnaireBase(BaseModel):
    title: str
    content: str
    category_id: str

class QuestionnaireCreate(QuestionnaireBase):
    pass

class Questionnaire(QuestionnaireBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    authors: List[AuthorBase]
    upvotes: int
    answers: int
    timestamp: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True

class AnswerCreate(BaseModel):
    content: str
    author: AuthorBase
    question_id: str

class Answer(AnswerCreate):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    upvotes: int = 0
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        arbitrary_types_allowed = True 