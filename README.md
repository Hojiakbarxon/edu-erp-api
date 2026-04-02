# 🎓 EduERP — Education Management System API

A robust, role-based REST API backend for managing an educational institution — built with **NestJS**, **TypeORM**, and **PostgreSQL**. Handles everything from user authentication to lesson management, homework submissions, and file/video attachments.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (Node.js) |
| Language | TypeScript |
| ORM | TypeORM |
| Database | PostgreSQL |
| Auth | JWT + Cookie-based tokens |
| Validation | class-validator / class-transformer |
| Password Hashing | bcrypt |
| Email | Nodemailer |
| OTP | otp-generator + node-cache |
| Config | @nestjs/config + dotenv |

---

## 📁 Project Structure

```
src/
├── auth/                   # JWT authentication (login, register, OTP)
├── users/                  # User management (SUPERADMIN, ADMIN, TEACHER, STUDENT)
├── major/                  # Academic majors/departments
├── rooms/                  # Classrooms/lecture rooms
├── groups/                 # Student groups per major
├── lessons/                # Lessons assigned to groups
├── homework/               # Homework assigned per lesson
├── files-of-homework/      # File attachments for homework submissions
├── videos-of-lessons/      # Video attachments for lessons
├── guards/                 # Auth guard (JWT) + Role guard (RBAC)
├── config/                 # Environment config loader
├── enums/                  # UserRoles and other enums
└── utils/                  # Crypto utility (bcrypt wrapper)
```

---

## 🔐 Authentication & Authorization

The API uses a **two-layer guard system**:

1. **AuthGuard** — Validates the JWT from the request cookie and attaches the decoded user to `req.user`
2. **RoleGuard** — Reads `req.user.role` and checks it against the `@Roles()` decorator on each route

**Roles hierarchy:**
```
SUPERADMIN → ADMIN → TEACHER → STUDENT
```

On first startup, a **SuperAdmin** is automatically seeded from environment variables.

---

## 🗄️ Data Models

```
Major ──< Group ──< Lesson ──< Homework ──< FileOfHomework
                       │
                       └──< VideoOfLesson

User (role: SUPERADMIN | ADMIN | TEACHER | STUDENT)
Room
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_URL=postgres://user:password@localhost:5432/eduerp

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

SUPERADMIN_FULL_NAME=Super Admin
SUPERADMIN_AGE=30
SUPERADMIN_PHONE=+998901234567
SUPERADMIN_PASSWORD=superSecurePassword123

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@email.com
MAIL_PASS=your_mail_password
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL running locally or via connection URL

### Installation

```bash
# Clone the repository
git clone https://github.com/Hojiakbarxon/edu-erp-api.git
cd edu-erp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your .env values

# Start in development mode
npm run start:dev
```

The server starts at `http://localhost:3000` and all routes are prefixed with `/api`.

---

## 📡 API Endpoints Overview

| Module | Base Route |
|---|---|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Majors | `/api/major` |
| Rooms | `/api/rooms` |
| Groups | `/api/groups` |
| Lessons | `/api/lessons` |
| Homework | `/api/homework` |
| Homework Files | `/api/files-of-homework` |
| Lesson Videos | `/api/videos-of-lessons` |

---

## 📦 Available Scripts

```bash
npm run start          # Start production
npm run start:dev      # Start with hot-reload (watch mode)
npm run start:debug    # Start in debug mode
npm run build          # Compile TypeScript
npm run lint           # Lint and auto-fix
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run test:cov       # Run tests with coverage report
```

---

## 🔒 Security Notes

- Passwords are hashed using **bcrypt** before storage
- JWT tokens are stored in **httpOnly cookies**
- All incoming requests are validated and stripped of unknown fields via `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`
- OTP codes for email verification are stored in-memory using **node-cache** with TTL

---

## 📄 License

This project is private and unlicensed — for educational/internal use only.
