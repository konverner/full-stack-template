from fastapi import FastAPI
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.auth.router import router as auth_router
from app.items.router import router as items_router

if settings.ENVIRONMENT == "local":
    LOG_LEVEL = "debug"  # Set log level to debug for local development
else:
    LOG_LEVEL = "info"

# Create FastAPI app instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",  # Customize OpenAPI path
    docs_url=f"{settings.API_V1_STR}/docs",  # Customize Swagger UI path
    redoc_url=f"{settings.API_V1_STR}/redoc",  # Customize ReDoc path
)

# --- Middleware ---
# Set up CORS (Cross-Origin Resource Sharing)
origins = [
    "*"
    # Add other allowed origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# --- Routers ---
# Include modular routers
api_router_v1 = APIRouter() # Create a router for versioning
api_router_v1.include_router(auth_router)
api_router_v1.include_router(items_router)

app.include_router(api_router_v1, prefix=settings.API_V1_STR)


# --- Root Endpoint ---
@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint providing basic API information.
    """
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} API",
        "version": settings.PROJECT_VERSION,
        "docs_url": f"{settings.API_V1_STR}/docs",
        "redoc_url": f"{settings.API_V1_STR}/redoc"
        }
    
    
if __name__ == "__main__":
    import uvicorn
    from app.database.core import init_db
    # Initialize the database connection
    init_db()
    # Run the app with Uvicorn if this file is executed directly
    uvicorn.run(app, host=settings.HOST, port=settings.PORT, log_level=LOG_LEVEL)
