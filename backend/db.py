"""
Database connection and session management
"""

from dotenv import load_dotenv
load_dotenv()

from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine
from sqlalchemy.orm import sessionmaker
import os


# Get DATABASE_URL from environment and convert to async
DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
# Remove sslmode from URL - we'll pass it as connect_args instead
if "?sslmode=require" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("?sslmode=require", "")
elif "&sslmode=require" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("&sslmode=require", "")

# Create async engine with connection pooling
# For Neon PostgreSQL with asyncpg, we can use the sslmode in the URL
# and don't need to pass explicit SSL context in connect_args
engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    future=True,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Check connection before using (fixes Neon sleep issue)
    pool_recycle=300,    # Recycle connections every 5 minutes
)


async def get_session():
    """
    Dependency injection for FastAPI routes.
    Provides async database session.
    """
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
