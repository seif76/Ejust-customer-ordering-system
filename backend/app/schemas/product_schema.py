from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    price: float
    stock: int
    image_url: str | None = None
    category_id: int | None = None

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    stock: int
    image_url: str | None
    category_id: int | None = None
    
    class Config:
        from_attributes = True