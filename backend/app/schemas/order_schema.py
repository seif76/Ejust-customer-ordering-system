from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int]
    product_name: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    total_amount: float
    created_at: datetime
    items: List[OrderItemResponse] = []
    class Config:
        from_attributes = True