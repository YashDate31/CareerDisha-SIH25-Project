#!/bin/bash

echo "Setting up CareerDisha Django Backend..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv careerdisha_env

# Activate virtual environment
echo "Activating virtual environment..."
source careerdisha_env/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create database tables
echo "Setting up database..."
python manage.py makemigrations accounts
python manage.py makemigrations resources
python manage.py migrate

# Create superuser
echo
echo "Creating admin user..."
echo "Please enter admin credentials:"
python manage.py createsuperuser

# Load sample data (optional)
echo
read -p "Would you like to load sample data? (y/n): " load_sample
if [[ $load_sample == "y" || $load_sample == "Y" ]]; then
    echo "Loading sample data..."
    python manage.py loaddata sample_data.json
fi

echo
echo "Setup complete!"
echo
echo "To start the server:"
echo "1. Activate virtual environment: source careerdisha_env/bin/activate"
echo "2. Run server: python manage.py runserver"
echo "3. Access admin panel: http://localhost:8000/admin/"
echo "4. API endpoints: http://localhost:8000/api/"
echo