from fastapi import APIRouter, Depends, HTTPException, Query  
from sqlalchemy.orm import Session
from typing import List, Optional  
from app.db.database import get_db
from app.dependencies.admin_dep import get_current_admin
from app.models.product_model import Product
from app.schemas.product_schema import ProductCreate, ProductResponse, ProductCatalogResponse

router = APIRouter(prefix="/products", tags=["Products"])

# ➕ CREATE PRODUCT
@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# 📋 LIST ALL PRODUCTS (With Search, Filtering & Pagination)
@router.get("/", response_model=ProductCatalogResponse) 
def list_products(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Search products by name"),
    category_id: Optional[int] = Query(None, description="Filter products by category ID"),
    page: int = Query(1, ge=1, description="Page number to fetch"),
    limit: int = Query(9, ge=1, le=100, description="Number of items per page")
):
    query = db.query(Product)
    
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
        
    if category_id:
        query = query.filter(Product.category_id == category_id)
        
    total_items = query.count()
    
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()
    
    return {
        "products": products,
        "total": total_items,
        "page": page,
        "limit": limit
    }

# 🔍 GET SINGLE PRODUCT DETAILS (Added for the user-facing details view)
@router.get("/{product_id}", response_model=ProductResponse)
def get_single_product(
    product_id: int, 
    db: Session = Depends(get_db)
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Requested product details not found")
    return db_product

# ✏️ UPDATE PRODUCT (For Admin Edit Modal Window)
@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_update: ProductCreate, 
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin) 
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Target product profile not found")
        
    update_data = product_update.dict()
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

# ❌ DELETE PRODUCT (For Admin Table Row Deletion)
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin) 
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product profile already missing or dropped")
        
    db.delete(db_product)
    db.commit()
    
    return {"detail": f"Successfully removed item reference ID #{product_id}"}