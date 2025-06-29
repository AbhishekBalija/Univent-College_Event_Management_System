# Settings Service

This microservice handles user and system settings for the EventFlow platform.

## Features

- User settings management (notifications, theme, language, privacy)
- System settings management (admin only)
- JWT authentication integration

## API Endpoints

### User Settings

- `GET /api/settings/user` - Get current user's settings
- `PUT /api/settings/user` - Update current user's settings

### System Settings (Admin only)

- `GET /api/settings/system` - Get system settings
- `PUT /api/settings/system` - Update system settings

## Environment Variables

- `PORT` - Port to run the service on (default: 8005)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT verification (must match auth service)

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the service:
   ```
   npm start
   ```

3. For development with auto-reload:
   ```
   npm run dev
   ```