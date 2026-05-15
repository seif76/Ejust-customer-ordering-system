from app.db.database import SessionLocal
from app.models.admin_model import Admin
from app.auth.jwt import hash_password

async def create_default_admin():
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.email == "admin@admin.com").first()
        if not admin:
            new_admin = Admin(
                name="Admin",
                email="admin@admin.com",
                password=hash_password("admin")
            )
            db.add(new_admin)
            db.commit()
    finally:
        db.close()