from fastapi import FastAPI
from app.db.database import Base, engine
from app.routes import auth_routes
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
        # Add your production domain later
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight for 1 hour
)


app.include_router(auth_routes.router)