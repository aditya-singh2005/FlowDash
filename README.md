# 🚀 FlowDash

![Repo Size](https://img.shields.io/github/repo-size/aditya-singh2005/FlowDash)
![Last Commit](https://img.shields.io/github/last-commit/aditya-singh2005/FlowDash)
![Made with React](https://img.shields.io/badge/frontend-React-blue)
![TailwindCSS](https://img.shields.io/badge/styled%20with-Tailwind%20CSS-38B2AC.svg)
![Chart.js](https://img.shields.io/badge/visualized%20with-Chart.js-orange.svg)
![Backend](https://img.shields.io/badge/backend-Node.js-green)
![PostgreSQL](https://img.shields.io/badge/db-PostgreSQL-blue.svg)
![Hosted on Render](https://img.shields.io/badge/Hosted%20on-Render-6c47ff)

**Live Demo:** [https://flowdash.onrender.com](https://flowdash.onrender.com)

**YouTube Demo:** [🎥 Watch the demo](https://www.youtube.com/watch?v=1E6jtFieUqg)


---

### ⚠️ Disclaimer About Login Access on Render

🚨 **Note on First-Time Login Access:**  
Due to **Render’s free tier policy**, the backend server may go to sleep after periods of inactivity. When this happens, the initial login attempt might fail or take time to respond.

If the login page doesn’t load immediately or gives a network error:

- Wait a few seconds and **refresh the page**
- It may take **2–3 login attempts** to "wake" the backend server
- After activation, everything should function normally

> This is a limitation of the free hosting plan and **not a bug** in the application itself.

---

## 🌟 About FlowDash

**FlowDash** is a feature-rich dashboard platform built for team management, task tracking, and productivity visualization. With a sleek UI powered by Tailwind CSS and dynamic charting using Chart.js and Nivo, it's built for admins and employees to work collaboratively with clarity and speed.

---

## ✨ Key Features

### 🔐 Role-Based Access
- Secure authentication with distinct access levels for **Admins** and **Employees**
- Smart redirection based on user roles (Admin/Employee)

---

### 🛠️ Admin Panel

- 📊 **Comprehensive Dashboards**  
  Visual summaries using **Chart.js**,**ReCharts**and **Nivo** for workflow, attendance, and department metrics
- 👥 **Employee Management**  
  View and manage employee list with department-wise summaries
- ⏱️ **Attendance Tracking**  
  Monitor and track employee attendance records
- 🗓️ **Leave Request Handling**  
  Approve or reject employee leave requests in real-time
- ✅ **Task Assignment & Monitoring**  
  Assign, edit, and track progress on tasks across teams

---

### 👤 Employee Portal

- 🧑‍💼 **Profile Management**  
  View and update personal and professional information
- 📈 **Workflow Dashboard**  
  Get real-time insights into assigned tasks and deadlines
- 🕒 **Attendance Marking**  
  Easily mark attendance with visual feedback
- 📅 **Leave Management**  
  Apply for leave and check request status
- 🚀 **Personal Growth Hub**  
  Explore learning resources and track development

---

## 🧰 Tech Stack

| Layer       | Tools & Libraries                       |
|-------------|-----------------------------------------|
| **Frontend** | React, Vite, TailwindCSS, Chart.js |
| **Backend**  | Node.js, Express.js                    |
| **Database** | PostgreSQL                             |
| **Auth**     | JWT (JSON Web Tokens)                  |

---

## 🔑 Authentication Flow

- Users sign in using their **email** and **password**
- Backend verifies credentials and issues a **JWT token**
- Token is securely stored in **localStorage** or **cookies**
- **Protected routes** (both frontend & backend) require a valid token to access
- Upon login, users are redirected to their respective dashboards:
  - **Admins ➝ Admin Dashboard**
  - **Employees ➝ Employee Dashboard**



