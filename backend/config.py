"""
Configuration management for Monasib backend
"""
import os
from typing import List
from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # API Settings
    api_host: str = "127.0.0.1"
    api_port: int = 8888
    api_reload: bool = True
    api_workers: int = 1
    
    # Database Settings
    database_path: str = "gis_data.gpkg"
    database_backup_enabled: bool = True
    
    # GIS Analysis Settings
    default_location_lat: float = 40.7128
    default_location_lng: float = -74.0060
    max_analysis_locations: int = 200
    min_analysis_locations: int = 50
    
    # Sample Data Generation
    sample_restaurants_count: int = 20
    sample_locations_count: int = 50
    sample_layer_features_min: int = 15
    sample_layer_features_max: int = 30
    
    # Security Settings
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:8888",
        "http://localhost:8888"
    ]
    cors_allow_credentials: bool = True
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 60
    
    # Development Settings
    debug: bool = True
    environment: str = "development"
    
    # External Services
    openai_api_key: str = ""
    google_maps_api_key: str = ""
    mapbox_api_key: str = ""
    
    # File Upload Settings
    max_file_size: int = 10485760  # 10MB
    allowed_extensions: List[str] = [".geojson", ".kml", ".gpx", ".csv"]
    
    # Cache Settings
    cache_ttl: int = 300  # 5 minutes
    cache_enabled: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings()
