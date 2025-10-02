# Online Education Platform API

A RESTful API for an online education platform built with Node.js, Express, Prisma, and PostgreSQL. This platform enables instructors to create and manage courses while students can browse and enroll in available courses.

## Features

### Authentication & Authorization
- User registration with email verification via OTP
- JWT-based authentication
- Role-based access control (Instructor/Student)
- Secure password hashing with bcrypt
- Account activation through email OTP

### Course Management
- Create, read, update courses (CRUD operations)
- Role-based course management (instructors only)
- Course enrollment system
- Instructor-specific course listings
- Public course browsing

### API Documentation
- Interactive Swagger/OpenAPI documentation
- Comprehensive endpoint descriptions
- Request/response examples

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Database**: PostgreSQL
- **ORM**: Prisma v6.16.3
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **OTP Generation**: otplib
- **Email Service**: nodemailer
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)

## Project Structure

```
.
├── controllers/          # Request handlers
│   ├── users.controller.js
│   └── courses.controller.js
├── middleware/           # Custom middleware
│   ├── verifyToken.js   # JWT authentication
│   ├── rolePolice.js    # Role-based authorization
│   └── selfPolice.js    # Resource ownership verification
├── routes/              # API routes
│   ├── index.js         # Main router
│   ├── users.routes.js  # User/auth routes
│   └── courses.routes.js # Course routes
├── validations/         # Input validation schemas
│   ├── users.validation.js
│   └── courses.validation.js
├── prisma/              # Database schema and migrations
│   └── schema.prisma
├── mail/                # Email service
│   └── index.js
├── main.js              # Application entry point
└── .env                 # Environment variables
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
   PORT=3000
   TOKEN_SECRET_KEY=your_jwt_secret_key
   TOTP_SECRET_KEY=your_totp_secret_key

   # Email configuration (nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Documentation

Once the server is running, access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/verify-otp` | Activate account with OTP | No |
| POST | `/login` | User login | No |

### Courses (`/api/courses`)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all courses | No | - |
| GET | `/:id` | Get course by ID | No | - |
| GET | `/my-courses` | Get instructor's courses | Yes | Instructor |
| POST | `/` | Create a new course | Yes | Instructor |
| PATCH | `/:id` | Update a course | Yes | Instructor (owner) |

## Database Schema

### Users
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum (instructor, student)
- `status`: Enum (ACTIVE, INACTIVE)
- `created_at`: DateTime

### Courses
- `id`: UUID (Primary Key)
- `title`: String
- `description`: String
- `price`: Decimal(10,2)
- `instructor_id`: UUID (Foreign Key)
- `created_at`: DateTime

### Enrollments
- `id`: UUID (Primary Key)
- `student_id`: UUID (Foreign Key)
- `course_id`: UUID (Foreign Key)
- `created_at`: DateTime

## Scripts

```bash
# Start development server with auto-reload
npm run dev

# Run tests
npm test
```

## Middleware

### `verifyToken`
Validates JWT tokens and attaches user information to the request object.

### `checkRole([roles])`
Restricts access to specific user roles.

### `selfPolice([roles])`
Ensures users can only modify their own resources.

## Validation

All input data is validated using Joi schemas before processing:
- User registration: name, email, password, role
- User login: email, password
- Course creation: title, description, price
- Course update: title, description, price (all optional)

## Security Features

- Password hashing using bcrypt (10 salt rounds)
- JWT-based authentication
- OTP verification for account activation (30-minute expiry)
- Role-based access control
- Input validation and sanitization
- Environment variable protection

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "Error description",
  "error_message": "Detailed error (development mode)"
}
```

## Development

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

### Prisma Studio
View and edit your database with Prisma Studio:
```bash
npx prisma studio
```

## License

ISC

## Author

[Your Name]

---

**Note**: This is a development project. Ensure proper security measures, error handling, and testing before deploying to production.
