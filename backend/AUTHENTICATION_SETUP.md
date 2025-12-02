# Authentication System Setup

## Overview
This document describes the authentication system that has been implemented for the backend.

## Environment Variables Required

Add these to your `.env` file:

```
MONGO_URL=your_mongodb_connection_string
PORT=8000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

## API Endpoints

### Public Routes

1. **POST /api/auth/signup** - User registration
   - Body: `{ email, username, password }`
   - Returns: User data and JWT token

2. **POST /api/auth/login** - User login
   - Body: `{ username, password }`
   - Returns: User data and JWT token

3. **POST /api/auth/admin/login** - Admin login
   - Body: `{ username, password }`
   - Returns: Admin user data and JWT token (only if user has admin role)

### Protected Routes

4. **GET /api/auth/me** - Get current user profile
   - Headers: `Authorization: Bearer <token>`
   - Returns: Current user data

## File Structure

```
backend/
├── models/
│   └── User.js              (NEW - User model with password)
├── controllers/
│   └── authController.js    (NEW - Auth logic)
├── routes/
│   └── authRoutes.js        (NEW - Auth routes)
├── middleware/
│   ├── authMiddleware.js    (NEW - JWT verification)
│   └── validationMiddleware.js (NEW - Input validation)
└── index.js                 (MODIFIED - Added auth routes)
```

## Dependencies

Make sure to install:
```bash
npm install bcrypt jsonwebtoken
```

