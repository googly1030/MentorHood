from fastapi import APIRouter, HTTPException, Body, Query, status
from app.database import get_collection
from bson import ObjectId
from typing import Optional
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/tokens",
    tags=["tokens"],
)

@router.post("/initialize")
async def initialize_user_tokens(user_id: str):
    """Initialize tokens for a new user"""
    tokens_collection = get_collection("tokens")
    
    # Check if user already has a token record
    existing_record = await tokens_collection.find_one({"userId": user_id})
    if existing_record:
        return {
            "status": "success",
            "message": "User already has tokens initialized",
            "tokens": existing_record["remaining_tokens"]
        }
    
    current_time = datetime.utcnow()
    expiry_date = current_time + timedelta(days=365)  
    
    new_token_record = {
        "userId": user_id,
        "plan_id": "welcome-bonus",
        "plan_type": "Free",
        "subscription_status": "active",
        "purchased_date": current_time,
        "expiry_date": expiry_date,
        "purchased_tokens": 500,
        "used_tokens": 0,
        "remaining_tokens": 500,
        "usage": {
            "mentoring_sessions": {
                "total": 500,
                "used": 0,
                "remaining": 500
            }
        },
        "transactions": [
            {
                "type": "credit",
                "amount": 500,
                "description": "Welcome bonus for new user",
                "timestamp": current_time
            }
        ],
        "created_at": current_time,
        "last_updated": current_time
    }
    
    result = await tokens_collection.insert_one(new_token_record)
    
    if result.inserted_id:
        return {
            "status": "success",
            "message": "Tokens initialized successfully",
            "tokens": 500,
            "expiry_date": expiry_date
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initialize tokens"
        )

@router.get("/balance")
async def get_token_balance(user_id: str):
    """Get the token balance for a user"""
    tokens_collection = get_collection("tokens")
    
    user_tokens = await tokens_collection.find_one({"userId": user_id})
    if not user_tokens:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No token record found for this user"
        )
    
    # Check if tokens have expired
    if datetime.utcnow() > user_tokens.get("expiry_date", datetime.max):
        return {
            "status": "expired",
            "message": "Your tokens have expired",
            "balance": 0,
            "expiry_date": user_tokens.get("expiry_date"),
            "transactions": user_tokens.get("transactions", [])
        }
    
    return {
        "status": "success",
        "balance": user_tokens.get("remaining_tokens", 0),
        "purchased": user_tokens.get("purchased_tokens", 0),
        "used": user_tokens.get("used_tokens", 0),
        "expiry_date": user_tokens.get("expiry_date"),
        "usage": user_tokens.get("usage", {}),
        "transactions": user_tokens.get("transactions", [])
    }

@router.post("/spend")
async def spend_tokens(user_id: str, amount: int = Body(...), description: str = Body(...), 
                      usage_type: str = Body("mentoring_sessions")):
    """Spend tokens for a service"""
    tokens_collection = get_collection("tokens")
    
    user_tokens = await tokens_collection.find_one({"userId": user_id})
    if not user_tokens:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No token record found for this user"
        )
    
    # Check if tokens have expired
    if datetime.utcnow() > user_tokens.get("expiry_date", datetime.max):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your tokens have expired"
        )
    
    # Check if user has enough tokens
    remaining_tokens = user_tokens.get("remaining_tokens", 0)
    if remaining_tokens < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient token balance. You have {remaining_tokens} tokens but need {amount}."
        )
    
    # Update balance and usage statistics
    new_balance = remaining_tokens - amount
    new_used = user_tokens.get("used_tokens", 0) + amount
    current_time = datetime.utcnow()
    
    new_transaction = {
        "type": "debit",
        "amount": amount,
        "description": description,
        "usage_type": usage_type,
        "timestamp": current_time
    }
    
    # Update usage tracking
    usage = user_tokens.get("usage", {})
    usage_category = usage.get(usage_type, {"total": 0, "used": 0, "remaining": 0})
    
    usage_category["used"] = usage_category.get("used", 0) + amount
    usage_category["remaining"] = usage_category.get("total", 0) - usage_category["used"]
    
    usage[usage_type] = usage_category
    
    # Prepare the update
    update_data = {
        "remaining_tokens": new_balance,
        "used_tokens": new_used,
        "usage": usage,
        "last_updated": current_time
    }
    
    result = await tokens_collection.update_one(
        {"userId": user_id},
        {
            "$set": update_data,
            "$push": {
                "transactions": new_transaction
            }
        }
    )
    
    if result.modified_count == 1:
        return {
            "status": "success",
            "message": "Tokens spent successfully",
            "balance": new_balance,
            "usage": usage
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update token balance"
        )

@router.post("/add")
async def add_tokens(
    user_id: str, 
    amount: int = Body(...), 
    description: str = Body(...),
    plan_id: str = Body("standard"),
    plan_type: str = Body("Standard"),
    extend_expiry: bool = Body(True),
    usage_type: str = Body("mentoring_sessions")
):
    """Add tokens to a user account"""
    tokens_collection = get_collection("tokens")
    current_time = datetime.utcnow()
    
    user_tokens = await tokens_collection.find_one({"userId": user_id})
    if not user_tokens:
        # If no token record exists, create a new one
        expiry_date = current_time + timedelta(days=365)  # Default to 1 year
        
        new_token_record = {
            "userId": user_id,
            "plan_id": plan_id,
            "plan_type": plan_type,
            "subscription_status": "active",
            "purchased_date": current_time,
            "expiry_date": expiry_date,
            "purchased_tokens": amount,
            "used_tokens": 0,
            "remaining_tokens": amount,
            "usage": {
                usage_type: {
                    "total": amount,
                    "used": 0,
                    "remaining": amount
                }
            },
            "transactions": [
                {
                    "type": "credit",
                    "amount": amount,
                    "description": description,
                    "usage_type": usage_type,
                    "timestamp": current_time
                }
            ],
            "created_at": current_time,
            "last_updated": current_time
        }
        
        result = await tokens_collection.insert_one(new_token_record)
        
        if result.inserted_id:
            return {
                "status": "success",
                "message": "Token account created and tokens added successfully",
                "balance": amount,
                "expiry_date": expiry_date
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create token account"
            )
    
    # Update existing token record
    new_balance = user_tokens.get("remaining_tokens", 0) + amount
    purchased_tokens = user_tokens.get("purchased_tokens", 0) + amount
    
    # Handle expiry extension if needed
    expiry_date = user_tokens.get("expiry_date")
    if extend_expiry or datetime.utcnow() > expiry_date:
        expiry_date = current_time + timedelta(days=365)  # Extend by 1 year
    
    new_transaction = {
        "type": "credit",
        "amount": amount,
        "description": description,
        "plan_id": plan_id,
        "usage_type": usage_type,
        "timestamp": current_time
    }
    
    # Update usage tracking
    usage = user_tokens.get("usage", {})
    usage_category = usage.get(usage_type, {"total": 0, "used": 0, "remaining": 0})
    
    usage_category["total"] = usage_category.get("total", 0) + amount
    usage_category["remaining"] = usage_category["total"] - usage_category.get("used", 0)
    
    usage[usage_type] = usage_category
    
    update_data = {
        "remaining_tokens": new_balance,
        "purchased_tokens": purchased_tokens,
        "expiry_date": expiry_date,
        "subscription_status": "active",
        "plan_id": plan_id,
        "plan_type": plan_type,
        "usage": usage,
        "last_updated": current_time
    }
    
    result = await tokens_collection.update_one(
        {"userId": user_id},
        {
            "$set": update_data,
            "$push": {
                "transactions": new_transaction
            }
        }
    )
    
    if result.modified_count == 1:
        return {
            "status": "success",
            "message": "Tokens added successfully",
            "balance": new_balance,
            "expiry_date": expiry_date,
            "usage": usage
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update token balance"
        )