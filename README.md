# PlainNow - Android App & Backend

Fully rebuilt with React Native (Expo) and Node.js (Fastify + PostgreSQL).

## Project Structure
- `mobile/`: Android Application (React Native + NativeWind)
- `backend/`: API Server (Fastify + Prisma + PostgreSQL)

## Setup Instructions

### 1. Prerequisites
- Docker Desktop (Running)
- Node.js (v18+)
- Android Emulator (via Android Studio)

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

### 3. Mobile Setup
The frontend is a React Native app.

```powershell
cd mobile
# 1. Install dependencies (Wait for initial install to finish first!)
npm install

# 2. Install UI libraries (Run this script)
./setup_deps.ps1

# 3. Start Android App
npx expo start --android
```

## Features
- **Modern UI**: Linear Gradients, Glassmorphism (BlurView).
- **Secure Auth**: JWT Authentication, Password Hashing.
- **AI Analysis**: Google Gemini integration for document risk analysis.
- **Database**: PostgreSQL for robust data storage.
