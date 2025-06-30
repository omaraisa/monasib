# Monasib Project (MVP)

This project helps users find the suitable location for initiating a new restaurant.

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