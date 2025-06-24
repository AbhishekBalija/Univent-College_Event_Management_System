# 🎉 Univent - Real-Time College Event Management System

## 🚀 Project Overview

**Univent** is a dynamic, real-time event management platform tailored for college environments. It handles:

- 🎫 Event registration & tracking  
- 📢 Live announcements  
- 🏆 Leaderboard updates  
- 👥 Role-based access  

Built using the **MERN stack** + **Socket.IO** for real-time communication.

---

## 🏗️ Architecture

Univent follows a **Microservice Architecture** to ensure scalability, maintainability, and separation of concerns.

### 🔄 Microservice Components

- **Authentication Service**: Handles user registration, login, and token management
- **Event Service**: Manages event creation, updates, and participant registration
- **Notification Service**: Handles real-time announcements and updates
- **Leaderboard Service**: Tracks and updates participant scores

## 🗂️ Project Structure

```
eventflow_project/
├── frontend/                 # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service connectors
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Utility functions
│   └── package.json          # Frontend dependencies
│
├── backend/
│   ├── auth-service/         # Authentication microservice
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database schemas
│   │   ├── routes/           # API endpoints
│   │   └── middleware/       # Custom middleware
│   │
│   ├── event-service/        # Event management microservice
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   │
│   ├── notification-service/ # Real-time notification microservice
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── socket/           # Socket.IO handlers
│   │
│   ├── leaderboard-service/  # Leaderboard microservice
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   │
│   └── gateway/              # API Gateway for service orchestration
│       ├── routes/           # Route forwarding
│       └── middleware/       # Gateway middleware
│
└── docker-compose.yml        # Container orchestration
```

### 📦 1. Frontend — `frontend/`

- **Tech Stack**: React.js (CRA)
- Key Pages:
  - Welcome Page
  - Login/Register (admin creates organizer accounts)
  - Event Dashboard
  - Leaderboard
  - Admin Panel
  - Announcements Board

### 🔧 2. Backend — `backend/`

- **Tech Stack**: Node.js + Express.js
- **Libraries**:
  - `Mongoose` for MongoDB interaction
  - `Socket.IO` for real-time updates
- Main APIs:
  - User Auth (JWT-based)
  - Event CRUD
  - Announcements
  - Leaderboard
  - Role-based middleware

### 🗃️ 3. Database — MongoDB Atlas

#### 🧑‍💻 `users` Collection
```js
{
  _id,
  username,
  email,
  password,
  role: 'admin' | 'organizer' | 'participant',
  createdAt
}
```

#### 🎯 `events` Collection
```js
{
  _id,
  name,
  description,
  status,
  createdBy,
  createdAt,
  participants: [userId]
}
```

#### 📢 `announcements` Collection
```js
{
  _id,
  message,
  timestamp,
  createdBy
}
```

#### 🏆 `leaderboards` Collection
```js
{
  _id,
  participantId,
  score,
  eventId
}
```
### 👤 User Roles & Permissions

| Role | Description | Permissions |
| --- | --- | --- |
| Admin | Manages everything | Full CRUD on all resources, creates organizer accounts |
| Organizer | Manages events & participants | Event-specific CRUD, view announcements |
| Participant | Regular user joining events & tracking scores | View-only: events, announcements, scores |

### 🔐 Authentication & Authorization

- JWT-based token system
- Role-based route protection (admin/organizer/participant)
- Middleware checks per endpoint

### 📡 Real-Time Features — Socket.IO

Real-time broadcast for:

- ✅ New event creation
- 📢 Announcements
- 🏁 Leaderboard score updates

### 🚀 Deployment Stack

| Component | Tech/Service |
| --- | --- |
| Frontend | React (CRA),TailwindCSS Vercel |
| Backend | Node.js + Express, Render / Railway / Cyclic |
| Database | MongoDB Atlas |
| Real-time | Socket.IO |