import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, RedisDsn, Field

class Settings(BaseSettings):
    API_V1_STR: str = Field("/api/v1", description="API Version string")
    PROJECT_NAME: str = Field("Devbrew Fraud Detection API", description="Project Name")
    
    # Load required values from .env file, API will fail to start if these are missing
    # Database connection strings (optional — API degrades gracefully without them)
    REDIS_URL: Optional[RedisDsn] = Field(None, description="Redis connection string")
    DATABASE_URL: Optional[PostgresDsn] = Field(None, description="PostgreSQL connection string")
    # Model paths
    MODEL_PATH: str = Field(..., description="Path to the fraud model file")
    SCREENER_PATH: str = Field(..., description="Path to the sanctions screener pickle")
    EXPLAINER_PATH: str = Field(..., description="Path to the SHAP explainer pickle")

    # Feature registry path
    FEATURE_REGISTRY_PATH: str = Field(..., description="Path to the feature registry JSON")
    
    model_config = {
        # Load values from .env file
        "env_file": (".env", "apps/api/.env"),
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore"
    }

settings = Settings()