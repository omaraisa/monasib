@echo off
echo 🚀 Starting Monasib Development Server...
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call .\venv\Scripts\activate

REM Install/upgrade dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Copy environment file if it doesn't exist
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env
        echo ✅ Created .env file from template
    )
)

REM Create logs directory
if not exist "logs\" mkdir logs

echo.
echo 🌐 Starting FastAPI server...
echo 📍 API will be available at: http://127.0.0.1:8888
echo 📚 API Documentation: http://127.0.0.1:8888/docs
echo 🖥️ Frontend Application: http://127.0.0.1:8888/app
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
python server.py

pause

pause
