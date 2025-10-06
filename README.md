✉️ Final Submission Email (to Sakshi)

Subject:
✅ Submission — SDE Intern Assignment: Alerting & Notification Platform | Priyanshu Rai

Body:

Dear Sakshi,

Please find below my completed submission for the SDE Intern assignment — *Alerting & Notification Platform*.

🔹 Tech Stack:
- **Backend:** Node.js (TypeScript, Express) with modular OOP design
- **Frontend:** React + Vite (Admin & User Dashboards)
- **Database:** In-memory store (mocked for assignment)
- **Deployment:** 
  - Backend → Render: https://alerting-platform-backend.onrender.com
  - Frontend → Render: https://alerting-platform-kxsm.onrender.com
  - GitHub:
    - Backend: https://github.com/priyanshurai007/Alerting-Platform-Backend
    - Frontend: https://github.com/priyanshurai007/Alerting-Platform

✅ **Key Deliverables Implemented**
- Admin can create, update, list, and filter alerts (severity / audience / status)
- Visibility management across Organization, Team, and User levels
- End users can view alerts, mark read/unread, and snooze for the day
- Recurring 2-hour reminder simulation (trigger API)
- Analytics dashboard with real-time metrics: total alerts, active/expired, severity breakdown, read/snooze counts
- Pre-seeded data for users (`Alex`, `Bella`, `Chen`) and teams (`Engineering`, `Marketing`)
- Extensible OOP-based architecture (Strategy pattern for channels, State pattern for alert status)

🧩 README for setup and usage instructions is included in both repositories.

This project demonstrates clean modular design, adherence to SRP/OCP principles, and code readiness for extending notification channels (Email/SMS) in future iterations.

Thank you for the opportunity and for considering my submission.  
I truly enjoyed building this project!

Best regards,  
**Priyanshu Rai**  
M.Tech (Software Engineering), IIIT-Allahabad  
📧 priyanshurai0007@gmail.com | 📱 +91-XXXXXXXXXX  
GitHub: [github.com/priyanshurai007](https://github.com/priyanshurai007) | LinkedIn: [linkedin.com/in/priyanshurai007](https://linkedin.com/in/priyanshurai007)

🧾 README.md (for your Backend repo)
# 🧠 Alerting & Notification Platform — Backend

A modular, object-oriented notification system that allows admins to configure and deliver alerts to users or teams with configurable visibility, recurring reminders, and analytics.

---

## 🚀 Tech Stack
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** In-Memory Store (for PRD demonstration)
- **Design Patterns:** Strategy, State, and Observer principles
- **Deployment:** Render — [Live API](https://alerting-platform-backend.onrender.com)

---

## 🧩 Key Features
### 👩‍💼 Admin Features
- Create, update, archive, and list alerts
- Filter by severity, status (active/expired), and audience
- Configure visibility:
  - Entire Organization
  - Specific Teams
  - Specific Users
- Manage reminder frequency (2h default)

### 👤 User Features
- Fetch alerts visible to the user
- Mark alerts as read/unread
- Snooze alerts for the day
- Automatically re-notified every 2h until snoozed/expired

### 📊 Analytics
- Total alerts created
- Alerts delivered vs. read
- Snoozed counts per alert
- Breakdown by severity (Info / Warning / Critical)
- Active vs. expired alert count

---

## 🧱 Project Structure


src/
├── models/ # Alert, User, Team, State models
├── routes/
│ ├── admin.ts # Admin CRUD APIs
│ ├── user.ts # User alert APIs
│ ├── analytics.ts # Aggregated metrics
│ └── reminders.ts # Reminder trigger (cron simulation)
├── services/
│ ├── AlertService.ts
│ ├── NotificationService.ts
│ ├── VisibilityService.ts
│ └── UserStateService.ts
└── store.ts # In-memory DB seed


---

## ⚙️ Setup Instructions
### 1️⃣ Install dependencies
```bash
npm install

2️⃣ Run locally
npm run dev
# or
npm run build && npm start

3️⃣ Seed sample data
POST /seed

🧪 API Reference
👩‍💼 Admin APIs
Method	Endpoint	Description
POST	/admin/alerts	Create new alert
PUT	/admin/alerts/:id	Update alert
GET	/admin/alerts	List & filter alerts
👤 User APIs
Method	Endpoint	Description
GET	/user/:userId/alerts	Fetch visible alerts
POST	/user/:userId/alerts/:alertId/read	Mark alert as read
POST	/user/:userId/alerts/:alertId/unread	Mark alert as unread
POST	/user/:userId/alerts/:alertId/snooze	Snooze for the day
📊 Analytics API
Method	Endpoint	Description
GET	/analytics/metrics	Get aggregated system metrics
🔁 Reminder API (for demo)
Method	Endpoint	Description
POST	/reminders/trigger	Simulate 2h recurring reminders
🧠 Design Highlights

SRP & OCP Compliant: Each service handles one concern.

Extensible: Future-ready for Email/SMS channels.

State Management: Tracks user read/snooze states cleanly.

Test-friendly: Stateless APIs, no hard-coded dependencies.

👥 Seed Data
Type	Sample
Teams	Engineering (t-eng), Marketing (t-mkt)
Users	Alex (u-alex), Bella (u-bella), Chen (u-chen)
🌐 Live Deployment

Backend API: https://alerting-platform-backend.onrender.com

Frontend Dashboard: https://alerting-platform-kxsm.onrender.com

🧑‍💻 Author

Priyanshu Rai
M.Tech (Software Engineering), IIIT-Allahabad
📧 priyanshurai0007@gmail.com

LinkedIn
 | GitHub


---

## ✅ README.md (Frontend — shorter version)

```markdown
# 🧩 Alerting Platform — Frontend (React + Vite)

### 🚀 Live Demo
👉 https://alerting-platform-kxsm.onrender.com  
(API connected to: https://alerting-platform-backend.onrender.com)

---

## 💡 Overview
A two-panel dashboard for:
- **Admin Users:** Create, manage, and analyze alerts.
- **End Users:** View, read/unread, and snooze alerts.

---

## 🧱 Structure


src/
├── pages/
│ ├── AdminDashboard.jsx
│ ├── UserDashboard.jsx
│ └── AnalyticsDashboard.jsx
├── components/
│ ├── AlertForm.jsx
│ ├── AlertListAdmin.jsx
│ ├── AlertCardUser.jsx
│ └── FiltersBar.jsx
└── api.js


---

## ⚙️ Setup
```bash
npm install
npm run dev

🌐 Features

Real-time CRUD interaction with backend APIs

Visibility-based alerts (org/team/user)

Snooze, read/unread, and analytics metrics

Clean Tailwind-style UI with consistent card design

🧠 Deployment

Deployed via Render

Build command: npm run build

Publish directory: dist


---

## 🏁 Final Check Before Sending
1. Make sure both Render links are live and public.
2. Both GitHub repos have README files with the above content.
3. Attach only your email — no zip file needed (Render + GitHub are enough).

---

Would you like me to generate a **polished one-page PDF summary (project + architecture + endpoints)**
