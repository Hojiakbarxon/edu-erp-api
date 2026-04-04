# 🎓 EduERP — Advanced Education Management System API

A scalable and modular **Education Management System (ERP)** backend built with **NestJS**, **TypeORM**, and **PostgreSQL**.

This API handles **authentication, role-based access control, academic structure, lesson management, homework, and file/video uploads** — designed with real-world architecture practices.

---

## 🚀 Key Features

* 🔐 **Authentication with OTP verification**
* 🍪 **JWT + Refresh Token (cookie-based)**
* 🛡️ **Role-Based Access Control (RBAC)**
* 👥 User roles: `SUPERADMIN`, `ADMIN`, `TEACHER`, `STUDENT`
* 🏫 Academic system: Majors → Groups → Lessons → Homework
* 📁 File upload system (homework submissions)
* 🎥 Video upload system (lesson materials)
* 🧠 Smart validation & error handling
* ⚙️ Auto **SuperAdmin seeding** on app startup
* 🧹 Automatic file cleanup on delete/update

---

## 🧠 Tech Stack

| Layer       | Technology                      |
| ----------- | ------------------------------- |
| Framework   | NestJS                          |
| Language    | TypeScript                      |
| Database    | PostgreSQL                      |
| ORM         | TypeORM                         |
| Auth        | JWT (Access + Refresh)          |
| Security    | bcrypt (via custom Crypto util) |
| Validation  | class-validator                 |
| File Upload | Multer                          |
| Email       | Nodemailer                      |
| Cache       | In-memory (OTP handling)        |

---

## 📁 Project Structure

```
src/
├── auth/                  # Authentication (OTP, login, password reset)
├── users/                 # User management (roles, profiles)
├── major/                 # Academic majors
├── rooms/                 # Classrooms
├── groups/                # Student groups
├── lessons/               # Lessons
├── homework/              # Homework system
├── files-of-homework/     # Homework file uploads
├── videos-of-lessons/     # Lesson video uploads
├── guards/                # AuthGuard + RoleGuard
├── decorators/            # Custom decorators (Roles, CurrentUser)
├── utils/                 # Helpers (Crypto, Token, Mail, Cache)
├── config/                # Environment config
└── enums/                 # Enums (roles, days, etc.)
```

---

## 🔐 Authentication Flow (IMPORTANT)

This project uses a **2-step login system with OTP**:

### Step 1: Login

* User submits email + password
* If correct → OTP is sent to email

### Step 2: Confirm OTP

* User sends OTP
* Server returns:

  * `access_token`
  * `refresh_token` (stored in cookies)

---

## 🔄 Token System

* **Access Token** → Used in headers (`Authorization: Bearer ...`)
* **Refresh Token** → Stored in **httpOnly cookies**
* Endpoint `/auth/token` → generates new access token

---

## 🛡️ Authorization System

### Guards Used:

* `AuthGuard` → verifies JWT
* `RoleGuard` → checks roles via `@Roles()`

### Example:

```ts
@UseGuards(AuthGuard, RoleGuard)
@Roles(UserRoles.ADMIN)
```

### Special Role:

* `'SELF'` → allows user to access own data only

---

## 🗄️ Database Design

```
Major
  └── Group
        ├── Users
        ├── Lessons
              ├── Homework
              │     └── Files
              └── Videos
```

---

## 📦 File & Video Upload

* Files stored in `/uploads`
* Served via:

```
http://localhost:PORT/uploads/...
```

### Features:

* Old files are **automatically deleted** on update
* Files are **cleaned up** when parent entity is deleted

---

## ⚙️ Environment Variables

Create `.env` file:

```env
PORT=3000
DB_URL=postgres://user:password@localhost:5432/eduerp

ACCESS_TOKEN_KEY=secret
ACCESS_TOKEN_TIME=15m

REFRESH_TOKEN_KEY=secret
REFRESH_TOKEN_TIME=7d

MAIL_HOST=smtp.gmail.com
MAIL_PORT=
MAIL_USER=your_email
MAIL_PASS=your_password

SUPER_ADMIN_FULL_NAME=
SUPER_ADMIN_AGE=
SUPER_ADMIN_PHONE_NUMBER=
SUPER_ADMIN_PASSWORD=
```

---

## 👑 Super Admin Auto-Creation

On app startup:

* If no `SUPERADMIN` exists → it will be created automatically
* Uses `.env` credentials
* Password is hashed using `Crypto` utility

---

## 📡 API Endpoints

| Module   | Route                    |
| -------- | ------------------------ |
| Auth     | `/api/auth`              |
| Users    | `/api/users`             |
| Majors   | `/api/major`             |
| Rooms    | `/api/rooms`             |
| Groups   | `/api/groups`            |
| Lessons  | `/api/lessons`           |
| Homework | `/api/homework`          |
| Files    | `/api/files-of-homework` |
| Videos   | `/api/videos-of-lessons` |

---


## 🛠️ Installation

```bash

# Clone the repository
=======
git clone https://github.com/Hojiakbarxon/edu-erp-api.git
cd edu-erp-api

npm install

npm run start:dev
```


The server starts at `http://localhost:port` and all routes are prefixed with `/api`.

=======

---


## 🔒 Security Notes

* Passwords hashed before storing
* Tokens validated in guards
* ValidationPipe protects API from invalid data
* Sensitive tokens stored in cookies (httpOnly)

---

## 📄 License



Private project — for educational and portfolio use.

---

## 👨‍💻 Author

**Hojiakbarxon Olimxo'jayev**

* Backend Developer

---

