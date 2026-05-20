from app.models.user_model import User
from app.auth.jwt import hash_password

def test_signup(client, db):
    res = client.post("/auth/signup", json={
        "name": "Test User",
        "email": "test@test.com",
        "password": "secret123"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "test@test.com"
    assert "id" in data

    # Duplicate signup
    res2 = client.post("/auth/signup", json={
        "name": "Test User",
        "email": "test@test.com",
        "password": "secret123"
    })
    assert res2.status_code == 400

def test_login(client, db):
    # Create a user directly
    user = User(name="login", email="login@test.com", password=hash_password("pass"))
    db.add(user)
    db.commit()

    res = client.post("/auth/login", json={
        "email": "login@test.com",
        "password": "pass"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "login@test.com"

def test_login_invalid(client, db):
    res = client.post("/auth/login", json={
        "email": "nobody@test.com",
        "password": "wrong"
    })
    assert res.status_code == 401