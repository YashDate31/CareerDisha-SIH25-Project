# 02 - Getting Started: Running CareerDisha 🚀

## Prerequisites (What You Need Before Starting)

### **Software Requirements:**
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Python** (version 3.8 or higher) - [Download here](https://python.org/)
- **Git** (for version control) - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended - [Download here](https://code.visualstudio.com/)

### **Knowledge Requirements:**
- **Basic:** Understanding of files, folders, and command line
- **Intermediate:** Basic knowledge of web applications
- **Advanced:** Familiarity with React.js and Django (for development)

## 🔧 **Installation Guide**

### **Step 1: Download the Project**

**Option A: If you have the project folder already**
```bash
# Navigate to your project folder
cd C:\Users\Yash\Downloads\CareerDisha
```

**Option B: If downloading from GitHub**
```bash
# Clone the repository
git clone https://github.com/your-username/CareerDisha.git
cd CareerDisha
```

### **Step 2: Set Up the Frontend (React)**

```bash
# Navigate to the main project directory
cd CareerDisha

# Install dependencies
npm install

# This might take 2-3 minutes depending on your internet speed
```

### **Step 3: Set Up the Backend (Django)**

```bash
# Navigate to backend folder
cd backend/careerdisha_backend

# Create a Python virtual environment (recommended)
python -m venv career_env

# Activate the virtual environment
# On Windows:
career_env\Scripts\activate
# On Mac/Linux:
source career_env/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up the database
python manage.py makemigrations
python manage.py migrate

# Create a superuser (admin account)
python manage.py createsuperuser
# Follow the prompts to create username, email, and password
```

## ▶️ **Running the Application**

### **Quick Start (Both Servers)**

**Open two separate terminal/command prompt windows:**

**Terminal 1 - Backend (Django):**
```bash
cd C:\Users\Yash\Downloads\CareerDisha\backend\careerdisha_backend
python manage.py runserver 127.0.0.1:8000
```

**Terminal 2 - Frontend (React):**
```bash
cd C:\Users\Yash\Downloads\CareerDisha
npm run dev
```

### **Access the Application**

After both servers are running:

- **Main Application:** http://localhost:3000 (or the port shown in terminal)
- **Admin Panel:** http://127.0.0.1:8000/admin/
- **Backend API:** http://127.0.0.1:8000/api/

## 🎯 **First-Time Setup Checklist**

### **✅ Verify Everything is Working:**

1. **Check Frontend:**
   - Open http://localhost:3000
   - You should see the CareerDisha homepage
   - Try navigating to different sections (Resources, Parent Guide, etc.)

2. **Check Backend:**
   - Open http://127.0.0.1:8000/admin/
   - Login with your superuser credentials
   - You should see the Django admin interface

3. **Check API Connection:**
   - In the main app, go to Resources section
   - You should see articles, videos, and PDFs loading
   - If you see empty sections, the API connection needs fixing

## 🔧 **Common Issues & Solutions**

### **Issue 1: "npm command not found"**
**Solution:** Install Node.js from https://nodejs.org/

### **Issue 2: "python command not found"**
**Solution:** 
- On Windows: Use `py` instead of `python`
- Install Python from https://python.org/ and add to PATH

### **Issue 3: "Port already in use"**
**Solution:**
- Frontend: The app will automatically try different ports (3001, 3002, etc.)
- Backend: Change the port in the command: `python manage.py runserver 127.0.0.1:8001`

### **Issue 4: "Module not found" errors**
**Solution:**
- Frontend: Run `npm install` again
- Backend: Run `pip install -r requirements.txt` again

### **Issue 5: Database errors**
**Solution:**
```bash
cd backend/careerdisha_backend
python manage.py makemigrations
python manage.py migrate
```

### **Issue 6: Empty content (no articles/videos showing)**
**Solution:**
- Make sure both frontend and backend are running
- Check that backend is running on http://127.0.0.1:8000
- Add sample content through admin panel

## 📱 **Testing the Application**

### **Basic Functionality Test:**

1. **Homepage:**
   - ✅ Statistics should display (colleges, scholarships, etc.)
   - ✅ Navigation should work smoothly
   - ✅ Mobile responsive (try resizing browser window)

2. **Resources Section:**
   - ✅ Should show videos, PDFs, and articles
   - ✅ Search functionality should work
   - ✅ Filter buttons (All, Videos, Articles, PDFs) should work
   - ✅ Clicking on items should open modals/details

3. **Parent Guide:**
   - ✅ Should show parent-specific content
   - ✅ Tab navigation (Videos, Articles) should work
   - ✅ Content should be different from main Resources

4. **Career Quiz:**
   - ✅ Should load quiz questions
   - ✅ Should allow answering questions
   - ✅ Should show results after completion

5. **Colleges & Scholarships:**
   - ✅ Should display lists of colleges and scholarships
   - ✅ Search functionality should work
   - ✅ Details should be viewable

## 🛠️ **Development Mode Features**

When running in development mode, you get:
- **Hot Reload:** Changes to code automatically refresh the app
- **Error Messages:** Detailed error information in browser console
- **Debug Mode:** Backend shows detailed error pages
- **Live Updates:** No need to restart servers for most changes

## 📊 **Adding Sample Data**

### **Through Admin Panel:**
1. Go to http://127.0.0.1:8000/admin/
2. Login with your superuser account
3. Add sample data:
   - **Videos:** Add YouTube URLs and descriptions
   - **Articles:** Add content with HTML formatting
   - **PDFs:** Upload PDF files with descriptions
   - **Colleges:** Add college information
   - **Scholarships:** Add scholarship details

### **Quick Sample Data Script:**
```bash
cd backend/careerdisha_backend
python manage.py shell -c "
from resources.models import *
# Add sample college
College.objects.create(
    name='Sample Engineering College',
    location='Mumbai, Maharashtra',
    description='Top engineering college with excellent placement record'
)
print('Sample data added!')
"
```

## 🚀 **Production Setup (Basic)**

For deploying the application:

1. **Build Frontend:**
```bash
npm run build
```

2. **Collect Static Files (Django):**
```bash
cd backend/careerdisha_backend
python manage.py collectstatic
```

3. **Environment Variables:**
- Set `DEBUG=False` in Django settings
- Configure production database
- Set up proper domain and CORS settings

## 📞 **Getting Help**

### **If something doesn't work:**
1. **Check Console Logs:** Press F12 in browser, look for red error messages
2. **Check Terminal Output:** Look for error messages in command prompt
3. **Restart Servers:** Close and restart both frontend and backend
4. **Clear Browser Cache:** Press Ctrl+F5 to refresh completely

### **Common Commands Reference:**

```bash
# Start Frontend
npm run dev

# Start Backend
python manage.py runserver

# Install Frontend Dependencies
npm install

# Install Backend Dependencies
pip install -r requirements.txt

# Database Operations
python manage.py makemigrations
python manage.py migrate

# Create Admin User
python manage.py createsuperuser

# Build for Production
npm run build
```

---

**Next:** Learn how to use the application → [03-User-Guide.md](03-User-Guide.md)