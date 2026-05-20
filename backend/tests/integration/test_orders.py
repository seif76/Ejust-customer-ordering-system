from app.models.user_model import User
from app.models.product_model import Product
from app.auth.jwt import hash_password, create_access_token
from app.db.database import get_db

def get_user_token(client):
    user = User(name="customer", email="cust@test.com", password=hash_password("pass"))
    db = client.app.dependency_overrides[get_db]()
    db.add(user)
    db.commit()
    token = create_access_token({"sub": "cust@test.com", "user_id": user.id})
    return f"Bearer {token}"

def get_admin_token(client):
    from app.models.admin_model import Admin
    admin = Admin(name="admin", email="orderadmin@test.com", password=hash_password("admin"))
    db = client.app.dependency_overrides[get_db]()
    db.add(admin)
    db.commit()
    token = create_access_token({"sub": "orderadmin@test.com", "admin_id": admin.id})
    return f"Bearer {token}"

def test_create_order_and_get_history(client):
    # Create a product
    admin_headers = {"Authorization": get_admin_token(client)}
    product_res = client.post("/products/", json={
        "name": "Test Product", "price": 10.0, "stock": 20
    }, headers=admin_headers)
    product_id = product_res.json()["id"]

    # Create order as customer
    user_headers = {"Authorization": get_user_token(client)}
    order_res = client.post("/orders/", json={
        "items": [{"product_id": product_id, "quantity": 2}]
    }, headers=user_headers)
    assert order_res.status_code == 200
    order = order_res.json()
    assert order["total_amount"] == 20.0
    assert order["status"] == "pending"

    # Get my orders
    history_res = client.get("/orders/", headers=user_headers)
    assert history_res.status_code == 200
    orders = history_res.json()
    assert len(orders) == 1
    assert orders[0]["id"] == order["id"]

def test_order_invalid_product(client):
    user_headers = {"Authorization": get_user_token(client)}
    res = client.post("/orders/", json={
        "items": [{"product_id": 9999, "quantity": 1}]
    }, headers=user_headers)
    assert res.status_code == 404

def test_admin_view_all_orders(client):
    admin_headers = {"Authorization": get_admin_token(client)}
    res = client.get("/orders/admin", headers=admin_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_admin_update_order_status(client):
    admin_headers = {"Authorization": get_admin_token(client)}
    # Create an order first
    product_res = client.post("/products/", json={
        "name": "Temp", "price": 5.0, "stock": 10
    }, headers=admin_headers)
    product_id = product_res.json()["id"]

    user_headers = {"Authorization": get_user_token(client)}
    order_res = client.post("/orders/", json={
        "items": [{"product_id": product_id, "quantity": 1}]
    }, headers=user_headers)
    order_id = order_res.json()["id"]

    # Change status to confirmed
    update_res = client.put(f"/orders/admin/{order_id}/status?status=confirmed", headers=admin_headers)
    assert update_res.status_code == 200
    assert "confirmed" in update_res.json()["message"]

    # Verify change
    list_res = client.get("/orders/admin", headers=admin_headers)
    assert list_res.json()[0]["status"] == "confirmed"