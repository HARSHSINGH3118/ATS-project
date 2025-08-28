# Mini ATS (Applicant Tracking System)

A lightweight yet powerful **Applicant Tracking System (ATS)** built with **MERN (MongoDB, Express, React, Node.js)** stack.  
Recruiters can **add candidates, upload resumes, move them across stages with Kanban drag-and-drop, and view analytics**.  

---

##  Features

- **Authentication (JWT based)** – Secure login & register  
-  **Candidate Management** – Add, edit, delete candidates  
-  **Resume Upload** – Store resumes on **Cloudinary**  
- **Kanban Board** – Drag-and-drop candidates between stages  
-  **Color-coded Stages** – Easy tracking (Applied, Interview, Offer, Rejected)  
-  **Analytics Dashboard** – Distribution by stage, role, experience, resumes uploaded  
-  **Responsive UI + Dark Mode** – Mobile friendly with theme toggle  

---

##  Tech Stack

### 🔹 Backend
- Node.js + Express
- MongoDB + Mongoose
- Cloudinary (resume storage)
- Multer (file uploads)
- JWT Authentication

### 🔹 Frontend
- React (Vite)
- TailwindCSS (UI styling + dark mode)
- @hello-pangea/dnd (drag-and-drop)
- Recharts (analytics charts)
- React Router DOM (routing)

---

##  Project Structure

### Backend
backend/
```
│── config/
│ ├── db.js # MongoDB connection
│ ├── cloudinary.js # Cloudinary config
│ └── multer.js # Multer + Cloudinary storage
│
│── middleware/
│ └── authMiddleware.js # JWT authentication
│
│── models/
│ ├── Candidate.js # Candidate schema
│ └── User.js # Recruiter schema
│
│── routes/
│ ├── authRoutes.js # Register, Login
│ └── candidateRoutes.js # CRUD + Analytics + Resume Upload
│
│── server.js # Express entry point
└── package.json
```

### Frontend

```
frontend/
│── src/
│ ├── api/
│ │ ├── authService.js
│ │ └── candidateService.js
│ │
│ ├── components/
│ │ ├── Navbar.jsx
│ │ ├── Sidebar.jsx
│ │ ├── CandidateCard.jsx
│ │ ├── CandidateForm.jsx
│ │ └── AnalyticsWidget.jsx
│ │
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Dashboard.jsx # Kanban board
│ │ └── Analytics.jsx
│ │
│ ├── context/
│ │ └── AuthContext.jsx
│ │
│ ├── utils/
│ │ └── api.js # axios base instance
│ │
│ ├── App.jsx
│ └── main.jsx
│
└── package.json
```


---

##  Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/mini-ats.git
cd mini-ats
### 2️⃣ Backend Setup
```
cd backend
npm install
```
Create a .env file inside backend/:
```
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run backend:
```
npm start
```
### 3️⃣ Frontend Setup
```
cd ../frontend
npm install
```
Run frontend:
```
npm run dev
```
## Usage

Register as a recruiter and log in.

Add candidates with resume upload.

Drag-and-drop candidates across stages: Applied → Interview → Offer → Rejected.

View analytics with charts (role distribution, stage distribution, average experience, resumes uploaded).
```

| Method | Endpoint  | Body                      | Description               |
| ------ | --------- | ------------------------- | ------------------------- |
| POST   | /register | { name, email, password } | Register a recruiter      |
| POST   | /login    | { email, password }       | Login, returns token+user |

| Method | Endpoint           | Body / Params       | Description                                            |
| ------ | ------------------ | ------------------- | ------------------------------------------------------ |
| POST   | /                  | { name, role, ... } | Add new candidate                                      |
| GET    | /                  | ?role, ?status      | Fetch candidates (filterable)                          |
| PUT    | /\:id              | { status, ... }     | Update candidate details/stage                         |
| DELETE | /\:id              | Candidate ID        | Delete candidate + resume                              |
| POST   | /\:id/uploadResume | form-data {resume}  | Upload resume to Cloudinary                            |
| GET    | /analytics/data    | —                   | Stage count, role count, experience avg, resumes count |

## Demo Video
Demo link : https://drive.google.com/file/d/1OgacKI3--_-LpClIRte9mexv26oQdWVD/view?usp=drivesdk 
