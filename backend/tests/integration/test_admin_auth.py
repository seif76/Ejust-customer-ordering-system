from app.models.admin_model import Admin
from app.auth.jwt import hash_password

def test_admin_login(client, db):
    admin = Admin(name="Admin", email="admin@admin.com", password=hash_password("admin"))
    db.add(admin)
    db.commit()

    res = client.post("/admin/auth/login", json={
        "email": "admin@admin.com",
        "password": "admin"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["admin"]["email"] == "admin@admin.com"

def test_admin_login_invalid(client, db):
    res = client.post("/admin/auth/login", json={
        "email": "admin@admin.com",
        "password": "wrong"
    })
    assert res.status_code == 401