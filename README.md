# PlainNow - Web App & Backend

Fully rebuilt with React Web (Vite + TailwindCSS) and Node.js (Fastify + Prisma + PostgreSQL).

## Project Structure
- `web/`: Web Application (React Web + Vite + TailwindCSS)
- `backend/`: API Server (Node.js + Fastify + Prisma + PostgreSQL)

## Setup Instructions

### 1. Prerequisites
- Docker Desktop (Running)
- Node.js (v18+) 

### 2. Backend Setup
    The backend handles authentication and document analysis.

```powershell
cd backend
# 1. Install dependencies
npm install

# 2. Start Database (PostgreSQL)
docker compose up -d

# 3. Initialize Database Schema
npx prisma db push

# 4. Start Server
npm run dev
```
Server runs at: `http://localhost:3000`

### 3. WEB Setup
    The frontend is a React Web app.

```powershell
cd web
# 1. Install dependencies (Wait for initial install to finish first!)
npm install

# 2. Start Web App
npm run dev 
```

## Features
- **Modern UI**: Linear Gradients, Glassmorphism (BlurView).
- **Secure Auth**: JWT Authentication, Password Hashing.
- **AI Analysis**: Google Gemini integration for document risk analysis.
- **Database**: PostgreSQL for robust data storage.
