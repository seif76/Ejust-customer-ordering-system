from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    price = Column(Float)
    stock = Column(Integer, default=0)
    image_url = Column(String(500), nullable=True)