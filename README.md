# Mental Health Prediction

A full-stack mental wellness tracking project built with React, Vite, Django REST Framework, and a scikit-learn model. Users can register, log in with JWT authentication, describe how they feel, receive an AI-based mental health category prediction, save daily check-ins, review mood history, and explore mood-based YouTube recommendations.

## Features

- User registration and login with JWT access and refresh tokens
- Protected routes for authenticated pages
- Text-based mental health prediction using a trained ML model and vectorizer
- Automatic saving of prediction results to mood history
- Quick daily mood check-ins without writing text
- Dashboard with recent entries, mood trend chart, and mood distribution chart
- Profile update page for username and email
- Mood-based YouTube video recommendations
- Basic deployment configuration for Django and Vercel frontend hosting

## Tech Stack

**Frontend**

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS 4
- Recharts
- Lucide React

**Backend**

- Django 6
- Django REST Framework
- Simple JWT
- django-cors-headers
- WhiteNoise
- dj-database-url
- python-decouple

**Machine Learning**

- scikit-learn
- joblib
- nltk

## Project Structure

```text
Mental Health prediction/
|-- backend-drf/              Django REST API
|   |-- accounts/             Registration and profile APIs
|   |-- api/                  API route mapping
|   |-- models/               model.pkl and vectorizer.pkl
|   |-- mysite/               Django settings and root URLs
|   |-- prediction/           Prediction, save-entry, history APIs
|   `-- yt_videos/            YouTube recommendation API
|-- frontend/                 React + Vite client
|   `-- src/
|-- prediction model.ipynb    Notebook related to model work
`-- README.md
```

## Core Workflow

1. A user registers and logs in.
2. The frontend stores JWT tokens in `localStorage`.
3. Authenticated requests go to the Django API.
4. The backend preprocesses input text, vectorizes it, and runs the trained model.
5. The prediction result and confidence are saved in `PredictionRecord`.
6. The dashboard reads saved history and builds trend and distribution data.
7. The home page can request mood-based YouTube recommendations.


## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Mental Health prediction"
```

### 2. Backend setup

```bash
cd backend-drf
python -m venv .venv
```

Activate the environment.

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```


Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in `backend-drf/`:

```env
SECRET_KEY=replace-me
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=127.0.0.1,localhost,testserver
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
YOUTUBE_API_KEY=
```

Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000/
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_BACKEND_BASE_API=http://127.0.0.1:8000/api/v1/
```

Start the frontend:

```bash
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173/
```

## Environment Variables

### Backend

- `SECRET_KEY`: Django secret key
- `DEBUG`: `True` or `False`
- `DATABASE_URL`: SQLite or production database URL
- `ALLOWED_HOSTS`: Comma-separated hostnames
- `CORS_ALLOWED_ORIGINS`: Comma-separated frontend origins
- `CSRF_TRUSTED_ORIGINS`: Comma-separated trusted origins
- `YOUTUBE_API_KEY`: Needed for live video recommendations
- `RENDER_EXTERNAL_HOSTNAME`: Optional deploy-time host setting for Render

### Frontend

- `VITE_BACKEND_BASE_API`: Must point to the backend API base, including `/api/v1/`

## Model Assets

The backend expects these files inside `backend-drf/models/`:

- `model.pkl`
- `vectorizer.pkl`

If these files are missing or invalid, the prediction endpoint will respond with a `503` error.

## Deployment Notes

### Backend

- `build.sh` installs requirements, collects static files, and runs migrations
- `Procfile` runs Gunicorn
- Settings already include WhiteNoise support for static files

### Frontend

- `vercel.json` rewrites all routes to `index.html`
- When deploying, set `VITE_BACKEND_BASE_API` to your live backend API URL

## Current Notes

- The project includes `prediction model.ipynb` for notebook-based model work.
- Mood predictions are supportive indicators only and should not be treated as a clinical diagnosis.


## Disclaimer

This project is for educational and supportive use only. It is not a replacement for professional medical advice, diagnosis, or treatment. If a user is in crisis or at risk of self-harm, they should contact local emergency services or a licensed mental health professional immediately.
