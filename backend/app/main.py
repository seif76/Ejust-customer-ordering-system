# from fastapi import FastAPI
# from app.db.database import Base, engine
# from app.routes import auth_routes
# from fastapi.middleware.cors import CORSMiddleware


# app = FastAPI()

# # Create tables
# Base.metadata.create_all(bind=engine)


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",  # Next.js dev server
#         "http://127.0.0.1:3000",
#         # Add your production domain later
#     ],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
#     allow_headers=["*"],
#     expose_headers=["*"],
#     max_age=3600,  # Cache preflight for 1 hour
# )


# app.include_router(auth_routes.router)


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.routes.auth_routes import router as user_auth_router  # keep user auth
from app.routes.admin_auth import router as admin_auth_router
from app.routes.product_routes import router as product_router
from app.core.startup import create_default_admin

app = FastAPI()
 
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://127.0.0.1:3000",
                   ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_auth_router)          # /auth/signup, /auth/login
app.include_router(admin_auth_router)         # /admin/auth/login
app.include_router(product_router)            # /products/

@app.on_event("startup")
async def startup():
    await create_default_admin()

@app.get("/")
def root():
    return {"message": "API running"}