from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.admin_model import Admin
from app.schemas.admin_schema import AdminLogin
from app.auth.jwt import verify_password, create_access_token
from app.db.database import get_db

router = APIRouter(prefix="/admin/auth", tags=["Admin Auth"])

@router.post("/login")
def admin_login(form: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == form.email).first()
    if not admin or not verify_password(form.password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    token = create_access_token({"sub": admin.email, "admin_id": admin.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email
        }
    }