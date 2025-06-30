@echo off

echo Activating virtual environment...
call .\venv\Scripts\activate

echo Starting FastAPI server...
echo You can access the API at http://localhost:8000

python -m uvicorn main:app --reload --port 8888

pause
