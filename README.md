# 🧭 Culinary Compass

**AI-Powered Travel & Food Discovery Platform**

A production-ready full-stack Progressive Web App that helps users discover authentic regional food, find nearby hotels, explore tourist attractions, and generate AI-powered travel itineraries.

![Tech Stack](https://img.shields.io/badge/React-TypeScript-blue) ![Backend](https://img.shields.io/badge/FastAPI-Python-green) ![Database](https://img.shields.io/badge/MySQL-Database-orange)

---

## ✨ Features

### 🍽️ Food Discovery
- Browse 500+ authentic regional dishes
- Filter by cuisine, region, category, dietary preference
- Detailed food pages with reviews and nearby places

### 🏨 Nearby Hotels
- GPS-based hotel discovery
- Real-time API integration (OpenTripMap/Geoapify)
- Price ranges and ratings

### 🗺️ Tourist Attractions
- Discover nearby tourist spots
- Interactive dark-themed Leaflet maps
- Animated markers with category filters

### 🤖 AI Travel Assistant
- ChatGPT-style AI interface
- Personalized trip itineraries
- Budget-aware recommendations
- Quick prompt suggestions

### 🔐 Authentication
- JWT access + refresh tokens
- bcrypt password hashing
- Google OAuth ready
- Forgot/reset password flow
- Role-based access (User/Admin)

### 📱 Mobile-First PWA
- Installable as mobile app
- Floating glassmorphic bottom nav
- Smooth Framer Motion animations
- Dark theme with premium aesthetics

### 👑 Admin Dashboard
- Platform analytics
- User management (ban/unban/role)
- Review moderation
- Report management

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion, GSAP, React Router v6, Zustand, TanStack Query, Leaflet, Lucide Icons |
| **Backend** | Python FastAPI, SQLAlchemy ORM, Pydantic, JWT, bcrypt |
| **Database** | MySQL 8.0 (SQLite fallback) |
| **APIs** | OpenTripMap, Geoapify, OpenAI, Cloudinary |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL 8.0 (or use SQLite fallback)

### 1. Clone & Setup

```bash
cd vibe2
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run backend
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env .env.local
# Edit if needed

# Run frontend
npm run dev
```

### 4. Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Default Admin Account
- **Email**: admin@culinarycompass.com
- **Password**: admin123

---

## 🐳 Docker Setup

```bash
# Start all services (MySQL + Backend + Frontend)
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## 📁 Project Structure

```
vibe2/
├── frontend/                  # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── layout/        # AppLayout, BottomNav
│   │   │   ├── cards/         # FoodCard, PlaceCard
│   │   │   └── ai/            # AIChatWidget
│   │   ├── pages/             # All 20+ pages
│   │   ├── store/             # Zustand state management
│   │   ├── lib/               # API client, utilities, animations
│   │   └── index.css          # Design system + Tailwind
│   └── public/                # PWA manifest, assets
├── backend/                   # FastAPI + Python
│   ├── app/
│   │   ├── routes/            # API route handlers
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic validation
│   │   ├── services/          # Business logic
│   │   ├── auth/              # JWT, bcrypt, dependencies
│   │   ├── config.py          # Settings
│   │   ├── database.py        # DB connection
│   │   └── main.py            # FastAPI app
│   └── requirements.txt
├── database/                  # SQL schema + seed data
│   ├── schema.sql
│   └── seed.sql
├── docker-compose.yml
└── README.md
```

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/forgot-password` | Request reset |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/me` | Get current user |

### Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/foods/` | List/search foods |
| GET | `/foods/featured` | Featured foods |
| GET | `/foods/{id}` | Food details |
| GET | `/restaurants/nearby` | Nearby restaurants |
| GET | `/hotels/nearby` | Nearby hotels |
| GET | `/attractions/nearby` | Nearby attractions |
| POST | `/reviews/` | Create review |
| POST | `/ai/chat` | AI assistant |
| POST | `/itineraries/` | Save itinerary |
| GET/POST/DELETE | `/favorites/` | Manage favorites |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Platform stats |
| GET | `/admin/users` | User management |
| PUT | `/admin/users/{id}/role` | Change role |
| GET | `/admin/reports` | View reports |

---

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=mysql+pymysql://root:password@localhost/culinary_compass
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...
OPENTRIPMAP_API_KEY=...
GEOAPIFY_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

---

## 📄 License

MIT License — Built for TECHNOTHON VIBE-ATHON 2026

---

**Built with ❤️ by Culinary Compass Team**
