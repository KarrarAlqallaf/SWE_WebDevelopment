# 🏋️‍♂️ JadwalGYM – MERN Workout Program Platform

A full-stack MERN application that allows users to browse, create, edit, and manage workout programs. Includes full user features and a complete admin dashboard.

> **Collaboration Note:**
This project was built collaboratively through Discord pair-programming, screen-sharing, debugging, and planning together. Commit logs do not reflect actual teamwork.

---

## 📑 Table of Contents
1. Project Overview
2. Tech Stack
3. Features
4. Project Structure
5. Running the Project
6. Deployment Guide (Render)
7. Collaboration Note

---

## 1. Project Overview
JadwalGYM is a fitness web application built using the MERN stack. Users can browse workout programs, customize schedules, save programs, manage profiles, and rate programs. Admins can manage users, roles, and programs through a full admin dashboard.

---

## 2. Tech Stack

### Frontend
- React 18 + Vite  
- CSS Variables Design System  
- Light/Dark Theme  
- Fully Responsive Components  
- Authentication  
- User Profile Page  
- Admin Dashboard Interface  

### Backend
- Node.js + Express  
- MongoDB + Mongoose  
- JWT Authentication  
- REST API  
- Middleware (auth, roles, CORS, validation)

---

## 3. Features

### User Features
- Register / Login  
- Token-based authentication  
- Update username, email, password  
- Upload profile picture  
- Browse workout programs  
- Filter by category  
- Rate programs  
- Save favorite programs (vault)  
- Create custom schedules (Jadwal)

### Admin Features
- Admin login  
- Manage users (ban/unban, update role)  
- View all programs  
- Create programs  
- Edit programs  
- Delete programs  
- View dashboard statistics  

---

## 4. Project Structure 
```bash
root/
│
├── .cursor
├── .vscode
│
├── backend
│ ├── controllers
│ ├── middleware
│ ├── models
│ ├── node_modules
│ ├── routes
│ ├── .env
│ ├── index.js
│ ├── package.json
│ ├── package-lock.json
│ ├── seed.js
│ ├── seed2.js
│
├── frontend
│ ├── node_modules
│ ├── src
│ ├── .gitignore
│ ├── index.html
│ ├── package.json
│ ├── package-lock.json
│ ├── vite.config.js
│
├── README.md
├── package-lock.json (root)
├── programs_data.json
├── programs_data_updated.json
```

## 5. Running the Project

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 6. Deployment Guide (Render)

Render sometimes looks for the wrong package.json path:
Wrong:
  /opt/render/project/src/package.json

Correct:
  /opt/render/project/src/backend/package.json
  /opt/render/project/src/frontend/package.json

### Backend Service (Render)
- Root Directory: backend
- Build Command: npm install
- Start Command: npm start
- Environment Variables:
    MONGO_URL=your_connection
    JWT_SECRET=your_secret
    ALLOWED_ORIGINS=https://your-frontend.com
    PORT=5000

### Frontend Service (Render)
- Root Directory: frontend
- Build Command: npm install && npm run build
- Publish Directory: dist
- Environment Variables:
    VITE_API_BASE_URL=https://your-backend.com

### If Deployment Still Fails
- Ensure render.yaml is at project root.
- Recreate backend & frontend services manually if needed.
- Verify all environment variables are set.
- Clear Build Cache → Redeploy.

## 10. Collaboration Note

The project was fully developed collaboratively through:

- Daily Discord calls
- Pair-programming sessions
- Screen-sharing and live coding
- Shared debugging and troubleshooting
- Joint decision-making on UI/UX and backend logic

Commit logs do not reflect the actual teamwork, because most commits
were pushed from one device even though development was done together.
