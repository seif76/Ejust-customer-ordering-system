# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.db.database import get_db
# from app.dependencies.auth_dep import get_current_user
# from app.models.order_model import Order, OrderItem, OrderStatus
# from app.models.product_model import Product
# from app.schemas.order_schema import OrderCreate, OrderResponse

# router = APIRouter(prefix="/orders", tags=["Orders"])

# @router.post("/", response_model=OrderResponse)
# def create_order(
#     payload: OrderCreate,
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     if not payload.items:
#         raise HTTPException(status_code=400, detail="Cart is empty")

#     order_items = []
#     total_amount = 0.0
#     for item in payload.items:
#         product = db.query(Product).filter(Product.id == item.product_id).first()
#         if not product:
#             raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
#         if product.stock < item.quantity:
#             raise HTTPException(status_code=400, detail=f"Not enough stock for '{product.name}'")
#         if item.quantity < 1:
#             raise HTTPException(status_code=400, detail="Quantity must be >= 1")

#         unit_price = product.price
#         total_price = unit_price * item.quantity
#         total_amount += total_price

#         product.stock -= item.quantity
#         db.add(product)

#         order_items.append(OrderItem(
#             product_id=product.id,
#             quantity=item.quantity,
#             unit_price=unit_price,
#             total_price=total_price
#         ))

#     order = Order(
#         user_id=current_user.id,
#         status=OrderStatus.PENDING,
#         total_amount=total_amount
#     )
#     order.items = order_items
#     db.add(order)
#     db.commit()
#     db.refresh(order)
#     return order

# @router.get("/", response_model=list[OrderResponse])
# def get_my_orders(
#     db: Session = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
#     return orders


from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dependencies.auth_dep import get_current_user
from app.dependencies.admin_dep import get_current_admin
from app.models.order_model import Order, OrderItem, OrderStatus
from app.models.product_model import Product
from app.schemas.order_schema import OrderCreate, OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

# -------------------------------------------------------------------
# CUSTOMER ENDPOINTS
# -------------------------------------------------------------------

@router.post("/", response_model=OrderResponse)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order_items = []
    total_amount = 0.0
    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for '{product.name}'")
        if item.quantity < 1:
            raise HTTPException(status_code=400, detail="Quantity must be >= 1")

        unit_price = product.price
        total_price = unit_price * item.quantity
        total_amount += total_price

        product.stock -= item.quantity
        db.add(product)

        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=item.quantity,
                unit_price=unit_price,
                total_price=total_price,
            )
        )

    order = Order(
        user_id=current_user.id,
        status=OrderStatus.PENDING,
        total_amount=total_amount,
    )
    order.items = order_items
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/", response_model=list[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


# -------------------------------------------------------------------
# ADMIN ENDPOINTS
# -------------------------------------------------------------------

@router.get("/admin", response_model=list[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """Return all orders for the admin panel, newest first."""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return orders


@router.put("/admin/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str = Query(..., description="New status: pending, confirmed, cancelled"),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """Update an order's status (admin only)."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    valid_statuses = [s.value for s in OrderStatus]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed: {', '.join(valid_statuses)}",
        )

    order.status = status
    db.commit()
    return {"message": f"Order #{order_id} status changed to {status}"}