# IntellMeet – AI Meeting Intelligence & Collaboration Platform

IntellMeet is a modern, modular, production-style web application designed to transform meetings into structured and actionable knowledge assets.

---

## 🚀 Key Features

1. **Real-Time Video Conferencing & Messaging:**
   - WebRTC Audio & Video streaming mesh
   - Screen sharing capabilities
   - Live socket-based participant chat
   - Real-time speech transcript log stream

2. **Automated AI Intelligence Engine:**
   - Automatic transcript processing
   - AI Summary generation
   - Decision & Key Discussion points extraction
   - Action item & Task auto-generation with priority and assignees

3. **Ask Your Meeting AI (Unique Feature):**
   - Natural language query interface over meeting context
   - Retrieval over stored transcripts, summaries, decisions, and action items
   - Deterministic guardrails (`"I couldn't find that information in this meeting."`)

4. **SaaS Dashboard & Action Board:**
   - Upcoming and recent meeting workspace cards
   - Task management board with status updates (`Pending`, `In Progress`, `Completed`)
   - Complete responsive sidebar navigation

---

## 📂 Project Architecture & Folder Structure

```
intellmeet/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/       # Auth, Meeting, AI & Task Controllers
│   │   ├── middleware/        # JWT Authentication middleware
│   │   ├── models/            # Mongoose Schemas (User, Meeting, Workspace, Task)
│   │   ├── realtime/          # Socket.io & WebRTC signaling handler
│   │   ├── routes/            # REST API endpoints
│   │   └── server.js          # Express & HTTP server entry point
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/        # Navbar, Sidebar reusable UI
    │   ├── pages/             # Landing, Login, Register, Dashboard, Room, Workspace, Tasks, Profile
    │   ├── services/          # Modular Axios API Services
    │   ├── App.jsx            # Main Router setup
    │   └── index.css          # Tailwind CSS styling
    ├── tailwind.config.js
    └── package.json
```

---

## 🛠️ Installation & Setup Guide

### 1. Backend Setup

```bash
cd backend
npm install
node src/server.js
```
The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The Vite frontend server runs on `http://localhost:5173`.

---

## 👥 Team Responsibilities & Modular Separation

| Team Member | Module | Responsibilities |
|---|---|---|
| **Member 1** | Frontend UI/UX | Dashboard, Landing, Auth, Room UI, Workspace & Action Boards. |
| **Member 2** | Backend & Database | Express APIs, MongoDB Schemas, JWT Middleware & Security. |
| **Member 3** | Real-Time Engine | Socket.io Signaling, WebRTC audio/video mesh & Live Chat. |
| **Member 4** | AI Intelligence | Structured JSON summary pipeline & Ask-Your-Meeting engine. |
