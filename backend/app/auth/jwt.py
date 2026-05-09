# import os
# from dotenv import load_dotenv
# from datetime import datetime, timedelta
# from jose import jwt
# from passlib.context import CryptContext

# load_dotenv()

# SECRET_KEY = os.getenv("SECRET_KEY")
# ALGORITHM = os.getenv("ALGORITHM")
# ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str):
#     return pwd_context.hash(password)

# def verify_password(plain: str, hashed: str):
#     return pwd_context.verify(plain, hashed)

# def create_access_token(data: dict):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

#     to_encode.update({"exp": expire})

#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



# app/auth/jwt.py
from datetime import datetime, timedelta
from typing import Optional
import bcrypt  # Direct bcrypt usage
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

# Remove passlib, use bcrypt directly
def hash_password(password: str) -> str:
    """Hash password using bcrypt directly"""
    # Convert password to bytes, hash it, return as string
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False
    
load_dotenv()


# JWT Configuration - Move these to environment variables later
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Create refresh token (longer lived)"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None