"""
PEA Portfolio Analyzer API - Main application entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config import settings
from database import init_database, close_database
from auth.routes import router as auth_router
from portfolio.routes import router as portfolio_router
from market.routes import router as market_router


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup: Initialize database
    logger.info("Starting up application...")
    init_database()
    yield
    # Shutdown: Close database connection
    logger.info("Shutting down application...")
    close_database()


# Create FastAPI app
app = FastAPI(
    title="PEA Portfolio Analyzer API",
    description="Portfolio management system with authentication",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,  # Required for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(portfolio_router)
app.include_router(market_router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "PEA Portfolio Analyzer API",
        "version": "2.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
