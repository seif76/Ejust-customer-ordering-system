from app.auth.jwt import hash_password, verify_password, create_access_token, decode_token

def test_hash_and_verify_password():
    plain = "mysecret123"
    hashed = hash_password(plain)
    assert verify_password(plain, hashed) is True
    assert verify_password("wrong", hashed) is False

def test_create_access_token():
    data = {"sub": "user@test.com", "user_id": 1}
    token = create_access_token(data)
    assert token is not None
    decoded = decode_token(token)
    assert decoded["sub"] == "user@test.com"
    assert decoded["user_id"] == 1