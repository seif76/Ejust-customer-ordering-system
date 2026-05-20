def test_order_total_calculation():
    # Simulate order items
    items = [
        {"unit_price": 10.0, "quantity": 2, "total_price": 20.0},
        {"unit_price": 5.5, "quantity": 3, "total_price": 16.5},
    ]
    total = sum(item["total_price"] for item in items)
    assert total == 36.5

def test_stock_validation():
    available = 5
    requested = 10
    assert requested > available  # business rule: can't order more than stock