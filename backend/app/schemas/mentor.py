from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class Experience(BaseModel):
    title: str
    company: str
    duration: str
    description: str

class Project(BaseModel):
    title: str
    description: str

class Resource(BaseModel):
    title: str
    description: str
    linkText: str

class Service(BaseModel):
    id: int
    title: str
    duration: str
    type: str
    frequency: str
    sessions: int
    price: float
    rating: Optional[float] = None

class GroupSession(BaseModel):
    id: int
    title: str
    date: str
    time: str
    participants: int
    maxParticipants: int
    price: float

class Achievement(BaseModel):
    id: int
    title: str
    description: str
    date: str

class ReviewUser(BaseModel):
    name: str
    image: str
    role: str

class Review(BaseModel):
    id: int
    user: ReviewUser
    rating: float
    comment: str
    date: str

class Testimonial(BaseModel):
    name: str
    image: str
    comment: str

class MentorProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    userId: str
    name: str
    headline: str
    membership: str
    experience: List[Experience]
    projects: List[Project]
    resources: List[Resource]
    services: List[Service]
    groupSessions: List[GroupSession]
    achievements: List[Achievement]
    reviews: List[Review]
    testimonials: List[Testimonial]
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updatedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat()) 