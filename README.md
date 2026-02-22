# Fixl – HR System  
## Employee Leave & Attendance Management System (Mini HR Tool)

---

##  Project Overview

Fixl HR System is a full-stack web application designed to manage employee leave and attendance efficiently.

The system allows:

- Employees to register and log in securely.
- Apply for leave (Casual, Sick, Paid).
- Mark daily attendance.
- Track leave balance and attendance history.
- Admin to manage employees, monitor attendance, and approve or reject leave requests.

The application follows proper authentication, role-based access control, and clean business logic to ensure secure and structured HR management.

---

## 🔗 Repository & Live Links

## GitHub Repository
https://github.com/Sanjeetkumar61/Fixl---HR-System  

## Live Application URL
https://github.com/Sanjeetkumar61/Fixl---HR-System  

## Backend API URL
https://fixl-hr-system.vercel.app/  

---

## 🛠 Tech Stack & Justification

## Frontend
- **React (Vite)** – Fast development and component-based architecture.
- **Tailwind CSS** – Clean, responsive, and modern UI design.
- **React Router** – Handles routing and protected routes.
- **Axios** – API communication between frontend and backend.
- **Lucide React** – Modern icon system.

## Backend
- **Node.js + Express.js** – RESTful API development.
- **MongoDB (Mongoose)** – Flexible NoSQL database.
- **JWT (JSON Web Token)** – Secure authentication.
- **Bcrypt** – Password hashing for user security.

This stack ensures scalability, performance, and maintainability.

---

##  Installation Steps (Run Locally)

## 1️⃣ Clone Repository

git clone https://github.com/Sanjeetkumar61/Fixl---HR-System  
cd Fixl---HR-System  

## 2️⃣ Backend Setup

cd backend  
npm install  

Create a `.env` file inside the backend folder (see below).  

Run backend:

npm run dev  

Backend runs at:  
http://localhost:5000  

## 3️⃣ Frontend Setup

cd frontend  
npm install  

Create a `.env` file inside frontend folder.  

Run frontend:

npm run dev  

Frontend runs at:  
http://localhost:5173  

---

##  Environment Variables

## Backend (.env)

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

SEED_ADMIN=true  
ADMIN_NAME=System Admin  
ADMIN_EMAIL=admin@hrsystem.com  
ADMIN_PASSWORD=admin123  
ADMIN_DEPARTMENT=Administration  
ADMIN_LEAVE_BALANCE=20  

## Frontend (.env)

VITE_API_URL=http://localhost:5000/api  

For production:

VITE_API_URL=https://fixl-hr-system.vercel.app/api  

---

##  API Endpoints

## Authentication Routes
- POST /api/auth/register – Register user  
- POST /api/auth/login – Login user  
- GET /api/auth/me – Get logged-in user  

## User Routes
- GET /api/users – Get all users (Admin only)  
- GET /api/users/:id – Get user by ID  
- PUT /api/users/:id – Update user  

## Attendance Routes
- POST /api/attendance – Mark attendance  
- GET /api/attendance – Get personal attendance  
- GET /api/attendance/all – Get all attendance (Admin)  

## Leave Routes
- POST /api/leaves – Apply leave  
- GET /api/leaves – Get personal leaves  
- PUT /api/leaves/:id/status – Approve/Reject leave (Admin)  
- DELETE /api/leaves/:id – Cancel leave  

---

##  Database Models

## User Model
- name  
- email  
- password (hashed)  
- role (employee/admin)  
- department  
- leaveBalance  

## Attendance Model
- user (reference to User)  
- date  
- status (present/absent/late)  

Rule: Only one attendance record per user per day.

## Leave Model
- user (reference to User)  
- leaveType (casual/sick/paid)  
- startDate  
- endDate  
- totalDays  
- status (pending/approved/rejected)  

Business Logic:
- Each employee starts with fixed leave balance.
- Leave balance reduces only when leave is approved.

---

##  Admin Credentials (Seeded)

If `SEED_ADMIN=true`, the following admin account is automatically created:

Email: admin@hrsystem.com  
Password: admin123  

(Admin password should be changed in production.)

---

##  Authentication & Security

- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control (Employee / Admin)
- Protected API routes
- Proper HTTP status codes (401, 403, 404)

---

##  AI Tools Declaration

The following AI tools were used during development:

- **ChatGPT** – Used for research, architectural guidance, debugging assistance, and documentation structuring.
- **Stitch** – Used for UI inspiration and layout assistance.
- **Claude** – Used for backend-related guidance and optimization suggestions.
- **GitHub Copilot** – Assisted in writing repetitive code and speeding up development.

Core business logic, authentication flow, database schema design, and role-based access control were manually implemented and customized.

---

##  Known Limitations

- No email notifications implemented.
- No pagination support.
- No unit testing included.
- No Docker setup.
- Basic reporting features only.

---

## ⏱ Time Spent

Approximate Development Time: **15-20 Hours**
