# Task Manager - Full Stack Task Management Application

TaskMaster is a modern, responsive, and secure task management web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to organize their daily tasks with features like categorization, prioritization, date management, and powerful search/filter capabilities. The application features a robust authentication system using JWTs and secure cookies.


## 🚀 Tech Stack

*   **MERN Stack:** MongoDB, Express.js, React, Node.js
*   **Styling:** Tailwind CSS
*   **Authentication:** JWT (JSON Web Tokens) & Cookies

---

## ✨ Features

### 🔐 Authentication & Security
*   **User Registration & Login:** Secure signup and signin flows.
*   **JWT Architecture:** Uses short-lived Access Tokens (stored in memory/storage) and long-lived Refresh Tokens (stored in HttpOnly Cookies) for maximum security against XSS.
*   **Auto-Refresh:** Seamless token refreshing via Axios interceptors.
*   **Session Management:** Supports persistent sessions (Stay logged in) vs session-only login based on browser lifecycle.

### 📝 Task Management
*   **Create Tasks:** Add tasks with title, description, priority, and due dates.
*   **Smart Date Validation:** Prevents selecting past dates for new tasks.
*   **Read/List:** View all tasks in a responsive grid layout.
*   **Update:** Edit task details or toggle completion status instantly.
*   **Delete:** Remove tasks with confirmation.

### 🔍 Search, Sort & Filter
*   **Advanced Filtering:** Filter by Status (Pending/Completed) and Priority (Low/Medium/High).
*   **Smart Sorting:** 
    *   **Priority Sort:** Custom weighted sorting (High -> Medium -> Low).
    *   **Date Sort:** Sort by Due Date or Creation Date.
*   **Real-time Search:** Search tasks by title or description with debouncing for performance.

### 🎨 UI/UX
*   **Modern Design:** Clean, consistent interface using Tailwind CSS.
*   **Responsive:** optimized for Desktop, Tablet, and Mobile.
*   **Interactive:** Modal-based forms, hover effects, and loading states.

---

## 🛠️ Project Setup

### Prerequisites
*   [Node.js] (v16+ recommended)
*   [MongoDB Atlas] account (or local MongoDB instance)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    *   Create a `.env` file in the `backend/` directory.
    *   Add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key_here
    NODE_ENV=development
    ```

4.  Start the server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    *   Create a `.env` file in the `frontend/` directory.
    *   Add the backend URL:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| `express` | Web framework for Node.js |
| `mongoose` | MongoDB object modeling |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT generation and verification |
| `cookie-parser` | Parse HTTP request cookies |
| `cors` | Enable Cross-Origin Resource Sharing |
| `dotenv` | Load environment variables |
| `nodemon` | Dev tool to restart server on changes |

### Frontend
| Package | Purpose |
|---------|---------|
| `react` | UI Library |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP Client for API requests |
| `tailwindcss` | Utility-first CSS framework |
| `react-icons` | Icon library |
| `date-fns` | Date manipulation |
| `clsx`, `tailwind-merge` | Conditional class merging |
