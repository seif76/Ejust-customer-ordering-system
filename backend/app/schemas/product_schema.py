from pydantic import BaseModel, ConfigDict

class ProductCreate(BaseModel):
    name: str
    price: float
    stock: int
    image_url: str | None = None
    category_id: int | None = None

class ProductResponse(ProductBase if hasattr(locals(), 'ProductBase') else BaseModel):
    # Modern Pydantic v2 ORM configuration
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: float
    stock: int
    image_url: str | None
    category_id: int | None = None

class ProductCatalogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    # Changed to lowercase 'list' to leverage native Python 3.10+ type hints smoothly
    products: list[ProductResponse]
    total: int
    page: int
    limit: int

# 🌟 Keeps the validation engine perfectly aware of nested types across routes
ProductCatalogResponse.model_rebuild()