# Modular Monolith Backend

A functional backend with clean architecture, authentication, and modular design.

## Structure

```
src/
├── app.ts                    # Express app configuration
├── server.ts                 # Server entry point
├── config/
│   └── db.ts                 # Prisma client
├── core/
│   ├── errors/
│   │   └── AppError.ts       # Custom error class
│   └── middleware/
│       ├── auth.middleware.ts       # JWT authentication
│       ├── authorize.middleware.ts  # Role-based access control
│       ├── error.middleware.ts      # Global error handler
│       ├── rateLimiter.middleware.ts # Request rate limiting
│       └── requestLogger.middleware.ts # Request logging
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.repository.ts
│   ├── users/
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.repository.ts
│   └── products/
│       ├── product.routes.ts
│       ├── product.controller.ts
│       ├── product.service.ts
│       └── product.repository.ts
└── shared/
    └── utils/
        └── jwt.ts            # JWT token generation
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get authenticated user profile

### Users
- `GET /api/v1/users` - List all users (authenticated)
- `GET /api/v1/users/:id` - Get user by ID (authenticated)
- `PATCH /api/v1/users/:id` - Update user (admin only)
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product (authenticated)
- `PATCH /api/v1/products/:id` - Update product (authenticated)
- `DELETE /api/v1/products/:id` - Delete product (authenticated)

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Run database migration: `npm run prisma:migrate`
4. Start server: `npm run dev`

## Features
- JWT Authentication with bcrypt password hashing
- Role-based authorization (USER, ADMIN)
- Zod validation for request bodies
- Modular architecture with clean separation of concerns
- Request logging and rate limiting
- Proper error handling