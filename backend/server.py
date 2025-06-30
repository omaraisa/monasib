#!/usr/bin/env python3
"""
Production server startup script for Monasib
"""
import os
import sys
import multiprocessing
from config import settings
from logger import setup_logging

def get_worker_count():
    """Calculate optimal number of workers"""
    return (multiprocessing.cpu_count() * 2) + 1

def main():
    """Start the production server"""
    # Setup logging
    setup_logging()
    
    # Import after logging is configured
    import uvicorn
    
    # Configuration for production
    config = {
        "app": "main:app",
        "host": settings.api_host,
        "port": settings.api_port,
        "workers": get_worker_count() if settings.environment == "production" else 1,
        "log_level": settings.log_level.lower(),
        "access_log": True,
        "use_colors": False,
        "reload": settings.environment == "development",
    }
    
    print(f"🚀 Starting Monasib API Server")
    print(f"📍 Environment: {settings.environment}")
    print(f"🌐 Host: {settings.api_host}:{settings.api_port}")
    print(f"👥 Workers: {config['workers']}")
    print(f"📊 Log Level: {settings.log_level}")
    print(f"🔄 Reload: {config['reload']}")
    print("-" * 50)
    
    try:
        uvicorn.run(**config)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
