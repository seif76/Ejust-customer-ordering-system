import json
from app.models.admin_model import Admin
from app.auth.jwt import hash_password, create_access_token
from app.db.database import get_db

# Helper to get admin token
def get_admin_token(client):
    admin = Admin(name="admin", email="admin@prod.com", password=hash_password("admin"))
    db = client.app.dependency_overrides[get_db]()
    db.add(admin)
    db.commit()
    token = create_access_token({"sub": "admin@prod.com", "admin_id": admin.id})
    return f"Bearer {token}"

def test_create_product(client):
    token = get_admin_token(client)
    headers = {"Authorization": token}
    res = client.post("/products/", json={
        "name": "Notebook",
        "price": 12.5,
        "stock": 100,
        "image_url": "https://example.com/img.jpg"
    }, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Notebook"
    assert data["price"] == 12.5

def test_list_products(client):
    res = client.get("/products/")
    assert res.status_code == 200
    # Response may be paginated; check structure
    assert "products" in res.json() or isinstance(res.json(), list)

def test_product_details(client):
    token = get_admin_token(client)
    headers = {"Authorization": token}
    # Create a product first
    create_res = client.post("/products/", json={
        "name": "Pen", "price": 1.0, "stock": 50
    }, headers=headers)
    product_id = create_res.json()["id"]

    # Get details
    res = client.get(f"/products/{product_id}")
    assert res.status_code == 200
    assert res.json()["name"] == "Pen"