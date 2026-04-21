# 🛡️ PrepWise — Disaster Preparedness Education System

> An AI-powered full-stack platform that educates, alerts and guides Indian citizens during natural disasters — built on NDMA standards.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Sequelize-4479A1?style=for-the-badge&logo=mysql)](https://mysql.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-FF6B35?style=for-the-badge)](https://groq.com/)

---

## 👥 Team

- **Mallakaluva Hemanth Reddy**
- **Varsha B**
- **Mounika M**

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🚨 Real-time Alerts | 19 active India disaster alerts with auto-refresh every 5 minutes |
| 📚 40 Courses | Full lesson content with Do's, Don'ts and Key Takeaways |
| 🏠 27 Shelters | Across 15 Indian states with GPS coordinates and Near Me feature |
| 🧠 Scenario Quiz | Real emergency situations with instant expert feedback |
| ⚡ Emergency Guide | 6 disasters with 3-phase step-by-step guidance |
| 🎒 Emergency Kit | 36 items across 6 categories based on NDMA standard |
| 👨‍👩‍👧 Family Safety Plan | Add members, meeting points and emergency contacts |
| 🏃 Drill Scheduler | 20 NDRF drills with ability to schedule new ones |
| 🏆 Certificates | PDF download with unique ID and QR verification |
| 🤖 AI Chatbot | Powered by Groq Llama 3.3 70B for disaster Q&A |
| 🆘 SOS Button | One-tap 112 national emergency call from every page |
| 🛡️ Admin Panel | Post alerts, manage users and monitor system |

---

## 🔧 Tech Stack

### Frontend
React 18 + Vite
React Router v6
Axios + Fetch API
jsPDF — Certificate generation

### Backend
Node.js + Express.js
MySQL + Sequelize ORM
MongoDB + Mongoose
JWT Authentication
bcryptjs — Password hashing

### AI and Integrations
Groq AI — Llama 3.3 70B
Browser Geolocation API
Google Maps Directions
QR Server API
---

## 🗄️ Database

| Table | Records | Purpose |
|-------|---------|---------|
| courses | 40 | Disaster preparedness courses |
| alerts | 19 | Active India disaster alerts |
| shelters | 27 | Emergency shelters across India |
| drills | 20 | NDRF emergency drills |
| users | 16 | Registered users |
| enrollments | — | Course enrollment tracking |
| progress | — | Lesson completion tracking |
| certificates | — | Issued certificates with unique codes |
| family_members | — | Family safety plan data |
| emergency_contacts | — | Personal emergency contacts |
| meeting_points | — | Family evacuation meeting points |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- MongoDB
- npm

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Environment Variables (server/.env)
```env
PORT=5001
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=prepwise_db
MONGO_URI=mongodb://localhost:27017/prepwise
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|---------|
| Admin | hemanth@test.com | Test@123 |
| Student | priya@test.com | Test@123 |
| Student | arjun@test.com | Test@123 |

---

## 📱 Pages and Routes

| Route | Page | Description |
|-------|------|-------------|
| /dashboard | Dashboard | Central hub with live stats and alerts |
| /alerts | Disaster Alerts | 19 live alerts with severity filters |
| /courses | Courses | Browse 40 preparedness courses |
| /courses/:id | Course Player | HackerRank-style lesson player |
| /shelters | Shelter Locator | 27 shelters with Near Me GPS |
| /quiz | Scenario Quiz | Real emergency situation quiz |
| /emergency-action | Emergency Guide | Step-by-step disaster guidance |
| /kit | Emergency Kit | NDMA standard 36-item checklist |
| /family-plan | Family Safety Plan | Members, contacts, meeting points |
| /drills | Drill Scheduler | NDRF drill tracking and scheduling |
| /certificates | Certificates | PDF certificates with QR codes |
| /profile | Profile | User stats, skills and badges |
| /admin | Admin Dashboard | Alerts, users and system status |

---

## 🔢 Algorithms Used

| Algorithm | Where Used |
|-----------|-----------|
| Haversine Formula | GPS distance calculation for Near Me shelter feature |
| JWT HS256 | Secure token-based authentication |
| bcrypt Blowfish | Password hashing with 10 salt rounds |
| RBAC Whitelist | Role-based access control (admin/student) |
| TimSort | Sorting shelters by distance from user |
| Interval Polling | Auto-refresh alerts every 5 minutes |
| LLM Inference | Groq AI responses for chatbot |

---

## 📊 System Architecture

┌─────────────────────────────────┐
│   Browser — React 18 + Vite     │
│   React Router + Axios          │
└────────────────┬────────────────┘
│ REST API (HTTP)
┌────────────────▼────────────────┐
│   Express.js — Node.js Server   │
│   JWT Auth + RBAC Middleware    │
└──────────┬──────────────┬───────┘
│              │
┌──────────▼───┐  ┌───────▼──────┐
│   MySQL DB   │  │  MongoDB     │
│  (Sequelize) │  │  (Mongoose)  │
│  Structured  │  │ Chat History │
│     Data     │  │              │
└──────────────┘  └──────────────┘
│
┌──────────▼───────────────────────┐
│   Groq AI API — Llama 3.3 70B    │
│   AI Chatbot + Quiz Generation   │
└──────────────────────────────────┘

---

## 🇮🇳 Built for India

- **NDMA** — National Disaster Management Authority standards
- **IMD** — India Meteorological Department alert format
- **NDRF** — National Disaster Response Force drill data
- **Emergency Numbers** — 112, 108, 101, 100, 1078, 1800-180-1717
- **States Covered** — Karnataka, Tamil Nadu, Maharashtra, Odisha, Gujarat, Kerala, Delhi, Assam, West Bengal, Andhra Pradesh, Uttarakhand, Jharkhand, Rajasthan, Uttar Pradesh, Manipur

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/1E3A5F/ffffff?text=PrepWise+Dashboard)

### Alerts
![Alerts](https://via.placeholder.com/800x400/DC2626/ffffff?text=Disaster+Alerts)

### Courses
![Courses](https://via.placeholder.com/800x400/2563EB/ffffff?text=40+Courses)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch `git checkout -b feature/amazing-feature`
3. Commit your changes `git commit -m 'Add amazing feature'`
4. Push to the branch `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — Built for JNTU Hyderabad Project Review 2026

---

<div align="center">

**PrepWise — Saving lives through education and preparedness** 🛡️

Made with ❤️ in India 🇮🇳

</div>
