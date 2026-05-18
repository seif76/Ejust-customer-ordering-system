from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.dependencies.admin_dep import get_current_admin
from app.models.category_model import Category
from app.schemas.category_schema import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate, 
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    
    existing = db.query(Category).filter(Category.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category name already exists")
        
    new_category = Category(**category.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


@router.get("/", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

 
@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int, 
    category_data: CategoryCreate, 
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    db_category.name = category_data.name
    db_category.description = category_data.description
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}")
def delete_category(
    category_id: int, 
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}