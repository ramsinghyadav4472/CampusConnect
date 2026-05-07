# 🎓 CampusConnect

**CampusConnect** is a full-stack, university-exclusive marketplace platform designed to help students buy and sell old books, notes, and study materials securely within their own campus community. 

Built with modern web technologies, it features strict university isolation, real-time messaging, advanced filtering, and a production-grade Dockerized deployment pipeline.

![CampusConnect Banner](https://via.placeholder.com/1000x400?text=CampusConnect+-+Your+Campus+Marketplace)

---

## ✨ Key Features

- **🏛️ University Isolation:** A strict walled-garden approach. Students can only browse, view, and interact with listings posted by peers from their specific university.
- **💬 Integrated Chat System:** A built-in messaging platform that groups conversations by user, allowing seamless communication to negotiate prices and set up campus meetups.
- **🔐 Secure Authentication:** Supports both traditional JWT-based credential login and Google OAuth2 Sign-In.
- **📚 Advanced Filtering:** Easily find the exact study materials you need by filtering through Subject, Semester, Book Condition, and Custom Price Ranges.
- **🛍️ Seller Dashboard:** Listers can easily track their active books, toggle availability ("Mark as Sold" / "Mark as Available"), and view their campus reputation.
- **✨ Modern & Dynamic UI:** Fully responsive interface built with Tailwind CSS, featuring smooth micro-animations powered by Framer Motion.
- **🐳 Production Ready:** Fully containerized architecture using Docker, Docker Compose, and an automated GitHub Actions CI/CD pipeline.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (via Vite)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **React Router** (Routing)
- **Axios** (API Client)
- **Lucide React** (Iconography)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **JSON Web Tokens (JWT)** (Authentication)
- **Express Async Handler** (Error Management)

### DevOps & CI/CD
- **Docker** (Multi-stage builds, Nginx for frontend)
- **Docker Compose** (Service orchestration & persistent volumes)
- **GitHub Actions** (Automated build & push pipeline to Docker Hub)

---

## 🚀 Getting Started (Local Development)

Follow these instructions to run the application locally in development mode.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Running locally or a MongoDB Atlas URI)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CampusConnect.git
cd CampusConnect
```

### 2. Install dependencies
Install dependencies for both the frontend and backend.
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup
Create a `.env` file in the `backend/` directory with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Run the Development Servers
You will need two terminal windows to run both servers simultaneously.

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend React App):**
```bash
npm run dev
```
The React application will be available at `http://localhost:5174` (or your Vite default port) and the API will be at `http://localhost:5000`.

---

## 🐳 Docker Production Setup

CampusConnect is configured for robust, scalable deployment using Docker Compose.

### Running with Docker Compose
To spin up the entire application stack (Nginx Frontend, Node API, and MongoDB Database) locally:

```bash
docker compose up --build
```
- **Frontend** is accessible at `http://localhost:3000`
- **Backend API** is accessible at `http://localhost:5000`
- **MongoDB** is running securely with a persistent volume to prevent data loss.

### CI/CD Pipeline
This repository contains a `.github/workflows/main.yml` file. Whenever you push code to the `main` branch, GitHub Actions will automatically:
1. Check out the latest code.
2. Build the optimized Docker images.
3. Push the images directly to Docker Hub.

*(Note: Ensure you add `DOCKER_USERNAME` and `DOCKER_PASSWORD` to your GitHub Repository Secrets for the pipeline to succeed).*

---

## 🏗️ Architecture Design

- **Client-Server Architecture:** Complete decoupling of the React frontend from the Express API backend.
- **RESTful API:** Standardized JSON responses and robust HTTP status code handling via custom Error Middlewares.
- **Denormalized Database References:** Strategic use of MongoDB `ObjectIds` with `.populate()` to efficiently link `Users`, `Books`, and `Messages` while maintaining fast query performance.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/your-username/CampusConnect/issues).

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
