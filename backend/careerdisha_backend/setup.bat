@echo off
echo Setting up CareerDisha Django Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in PATH. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv careerdisha_env

REM Activate virtual environment
echo Activating virtual environment...
call careerdisha_env\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create database tables
echo Setting up database...
python manage.py makemigrations accounts
python manage.py makemigrations resources
python manage.py migrate

REM Create superuser
echo.
echo Creating admin user...
echo Please enter admin credentials:
python manage.py createsuperuser

REM Load sample data (optional)
echo.
set /p load_sample="Would you like to load sample data? (y/n): "
if /i "%load_sample%"=="y" (
    echo Loading sample data...
    python manage.py loaddata sample_data.json
)

echo.
echo Setup complete!
echo.
echo To start the server:
echo 1. Activate virtual environment: careerdisha_env\Scripts\activate
echo 2. Run server: python manage.py runserver
echo 3. Access admin panel: http://localhost:8000/admin/
echo 4. API endpoints: http://localhost:8000/api/
echo.
pause