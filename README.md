# Univent - College Event Management System

## Overview
Univent is a real-time event management platform designed specifically for college environments. It enables seamless organization and participation in college events, featuring live updates and interactive leaderboards.

## Key Features
- 🎫 Event Management & Registration
- 📢 Real-time Announcements
- 🏆 Live Leaderboard Updates
- 👥 Role-based Access Control
- 📱 Real-time Notifications
- 📊 Event Analytics

## Technology Stack
- **Frontend**: React.js with TailwindCSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT-based

## Architecture
Univent follows a microservice architecture with four core services:

- **Authentication Service**: User management and authentication
- **Event Service**: Event creation and management
- **Notification Service**: Real-time announcements
- **Leaderboard Service**: Participant scoring and rankings

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/univent.git
cd univent
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
cd auth-service && npm install
cd ../event-service && npm install
cd ../notification-service && npm install
cd ../leaderboard-service && npm install
```

3. Environment Setup
```bash
# Create .env files in each service directory
# Example for auth-service:
MONGODB_URI=mongodb://localhost:27017/univent
JWT_SECRET=your_jwt_secret
PORT=8001
```

4. Start the services
```bash
# Start all services using Docker
docker-compose up

# Or start services individually
cd auth-service && npm run dev
cd event-service && npm run dev
cd notification-service && npm run dev
cd leaderboard-service && npm run dev
cd frontend && npm start
```

## User Roles

| Role | Access Level |
|------|-------------|
| Admin | Full system access, user management |
| Organizer | Event creation and management |
| Participant | Event registration and participation |

## API Services

### Authentication Service (Port: 8001)
- User registration and login
- JWT token management
- Role-based access control

### Event Service (Port: 8002)
- Event CRUD operations
- Registration management
- Participant tracking

### Notification Service (Port: 8003)
- Real-time announcements
- Event updates
- System notifications

### Leaderboard Service (Port: 8004)
- Score tracking
- Ranking calculations
- Achievement management

## Real-time Features
The platform uses Socket.IO for real-time updates including:
- Live announcements
- Event status changes
- Leaderboard updates
- Registration notifications

## Project Structure
```
univent/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── context/        # React context
│
├── backend/
│   ├── auth-service/       # Authentication
│   ├── event-service/      # Event management
│   ├── notification-service/ # Real-time notifications
│   ├── leaderboard-service/ # Scoring system
│   └── gateway/           # API Gateway
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.