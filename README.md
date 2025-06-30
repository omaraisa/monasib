# Monasib (مناسب) - Restaurant Location Intelligence

<div align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success" alt="Status">
  <img src="https://img.shields.io/badge/Frontend-React%2017-blue" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-FastAPI-green" alt="Backend">
  <img src="https://img.shields.io/badge/GIS-GeoPandas-orange" alt="GIS">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED" alt="Docker">
</div>

## 🌟 Overview

**Monasib** (Arabic: مناسب, meaning "suitable") is a production-ready, intelligent GIS-based platform that helps entrepreneurs and investors find the optimal location for opening new restaurants. Using advanced spatial analysis and customizable criteria, Monasib evaluates potential locations based on 10 key parameters that influence restaurant success.

### ✨ New Features & Improvements

- 🔧 **Production Ready** - Full Docker support, health checks, monitoring
- 📊 **Enhanced Logging** - Comprehensive logging system with rotation
- ⚙️ **Configuration Management** - Environment-based configuration with .env support
- 🚀 **Performance Optimized** - Better error handling and response times
- 🔒 **Security Enhanced** - CORS configuration, rate limiting ready
- 📈 **Monitoring Ready** - Health checks, metrics endpoint, Prometheus support
- 🧪 **Comprehensive Testing** - Updated test suite covering all endpoints
- 🐳 **Docker Support** - Full containerization with docker-compose

## Running the project

1.  **Install Python:** Make sure you have Python 3.7+ installed.
2.  **Navigate to the backend directory:**
    ```bash
    cd Monasib/backend
    ```
3.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    ```
4.  **Activate the virtual environment:**
    -   On Windows:
        ```bash
        .\venv\Scripts\activate
        ```
    -   On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
5.  **Install the required packages:**
    ```bash
    pip install -r requirements.txt
    ```
6.  **Start the application:**
    ```bash
    uvicorn main:app --reload
    ```
7.  The backend API will be available at `http://localhost:8888`.

## Project Structure

-   `backend/`
    -   `main.py`: The main FastAPI application file.
    -   `requirements.txt`: The required Python packages.
    -   `gis_data.gpkg`: The GeoPackage database file (will be created on first run).