from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dependencies.admin_dep import get_current_admin
from app.models.order_model import Order, OrderStatus
from app.models.product_model import Product
from app.models.user_model import User

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin = Depends(get_current_admin)
):
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING).count()
    total_products = db.query(Product).count()
    total_users = db.query(User).count()

    # Simple total revenue from confirmed orders
    confirmed_orders = db.query(Order).filter(Order.status == OrderStatus.CONFIRMED).all()
    total_revenue = sum(order.total_amount for order in confirmed_orders)

    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_products": total_products,
        "total_users": total_users,
        "total_revenue": total_revenue,
    }