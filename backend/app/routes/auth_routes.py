from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse
from app.auth.jwt import hash_password, verify_password, create_access_token
from app.db.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])


import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for: {user.email}")
    
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user:
        logger.warning(f"User not found: {user.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user.password, db_user.password):
        logger.warning(f"Invalid password for: {user.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create token with user ID and email
    token = create_access_token({
        "sub": db_user.email,
        "user_id": db_user.id
    })
    
    logger.info(f"Login successful for: {db_user.email}")
    
    # Return token AND user data
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }