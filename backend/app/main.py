import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database.core import init_db
from .auth.router import router as auth_router
from .items.router import router as items_router
from .users.router import router as users_router

if settings.ENVIRONMENT == "dev":
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
    token_url=f"{settings.AUTH_STR}/token",  # Customize token URL
)

# --- Middleware ---
# Set up CORS (Cross-Origin Resource Sharing)
# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# --- Routers ---
# Resource routers (one or more)
app.include_router(items_router, prefix=f"{settings.API_V1_STR}/items", tags=["Items"])
app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])

# Authorization router
app.include_router(
    auth_router, prefix=settings.AUTH_STR, tags=["Authorization & Profile"]
)


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
        "redoc_url": f"{settings.API_V1_STR}/redoc",
    }


# --- Health Check Endpoint ---
@app.head("/health", tags=["Health Check"])
async def head_root():
    """
    Root endpoint providing health check via HEAD request.
    This endpoint can be used to check if the API is up and running.
    """
    return {
        "status": "OK",
        "version": settings.PROJECT_VERSION
    }


if __name__ == "__main__":
    
    # Run the app with Uvicorn if this file is executed directly
    uvicorn.run(app, host=settings.HOST, port=settings.PORT, log_level=LOG_LEVEL)
