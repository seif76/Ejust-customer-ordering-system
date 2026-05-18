from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.dependencies.admin_dep import get_current_admin
from app.models.product_model import Product
from app.schemas.product_schema import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

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

@router.get("/", response_model=List[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

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