# 🧠 Alerting & Notification Platform (MVP)

A lightweight, modular **Alerting & Notification Platform** built using **TypeScript + Express**, implementing the given PRD with clean OOP principles, extensible design, and clear separation of concerns.

---

## 🚀 Tech Stack
- **Language:** TypeScript  
- **Framework:** Express.js  
- **Database:** In-memory store (for MVP demonstration)  
- **Design Patterns:** Strategy, State, and Observer principles  
- **Deployment:** Render (Cloud Hosted)

---

## 🧩 Features (MVP)

### 👩‍💼 Admin
- Create, Update, List, and Archive alerts  
- Configure visibility:
  - Entire **Organization**
  - Specific **Teams**
  - Specific **Users**
- Define:
  - **Severity:** `Info | Warning | Critical`
  - **Delivery Type:** `InApp` (extensible to Email/SMS)
  - **Reminder Frequency:** Default every **2 hours**
  - **Start** / **Expiry** timestamps
  - Enable / disable **recurring reminders**

### 👤 End User
- Fetch alerts based on assigned visibility  
- Mark alerts **Read / Unread**  
- **Snooze** alerts for the day (auto-resets next day)  
- Receive reminders every **2 hours** until:
  - The alert is snoozed (for the day), or  
  - The alert expires  

### ⏰ Reminder Logic
- Each alert triggers reminders **every 2 hours** until snoozed or expired  
- API to simulate scheduler:


POST /reminders/trigger

- Each user’s alert reminders are tracked via `lastNotifiedAt` timestamp

### 📊 Analytics Dashboard
- Aggregated system metrics:
- Total alerts created  
- Alerts delivered vs. read  
- Snoozed counts per alert  
- Severity breakdown (Info / Warning / Critical)  
- Active vs. expired alerts  

---

## ⚙️ Quick Start

### 1️⃣ Install dependencies
```bash
npm install

2️⃣ Run locally (development)
npm run dev

3️⃣ Seed sample users/teams/alerts (optional)
npm run seed


Server runs at:
👉 http://localhost:4001

🧪 API Reference
👩‍💼 Admin APIs
Method	Endpoint	Description
POST	/admin/alerts	Create new alert
PUT	/admin/alerts/:id	Update or archive an alert
GET	/admin/alerts	List & filter alerts (`?severity=Info
👤 User APIs
Method	Endpoint	Description
GET	/user/:userId/alerts	Fetch visible alerts for a user
POST	/user/:userId/alerts/:alertId/read	Mark alert as read
POST	/user/:userId/alerts/:alertId/unread	Mark alert as unread
POST	/user/:userId/alerts/:alertId/snooze	Snooze for the current day
🔁 Reminder API
Method	Endpoint	Description
POST	/reminders/trigger	Simulate 2-hour reminder dispatch
📊 Analytics API
Method	Endpoint	Description
GET	/analytics/metrics	Aggregated metrics for all alerts
🧱 Example Usage
🟨 Create an Alert
curl -X POST http://localhost:4001/admin/alerts \
-H "Content-Type: application/json" \
-d '{
  "title": "DB Maintenance",
  "message": "Postgres upgrade scheduled at 01:00",
  "severity": "Warning",
  "deliveryType": "InApp",
  "reminderFrequencyMinutes": 120,
  "startAt": null,
  "expiresAt": null,
  "visibility": { "org": true, "teams": [], "users": [] }
}'

🕑 Trigger Reminders
curl -X POST http://localhost:4001/reminders/trigger

👤 Fetch Alerts for a User
curl http://localhost:4001/user/u-alex/alerts

🧩 Design Overview
🔧 Core Architecture
Layer	Responsibility
Routes	REST API endpoints for Admin, User, Reminders, Analytics
Services	Business logic, notification delivery, user state management
Store	In-memory DB for users, teams, alerts, and alert states
Models	Define entities like Alert, User, Team, UserAlertState
🧠 Object-Oriented Design

Strategy Pattern:
NotificationChannel → InAppChannel (easily extend to EmailChannel, SmsChannel)

State Pattern:
UserAlertState tracks per-user state (read, snoozed, lastNotifiedAt)

Observer Pattern (conceptual):
User subscriptions to alerts simulate notification propagation

Separation of Concerns:

AlertService handles CRUD and audience resolution

NotificationService manages recurring logic and delivery

UserStateService tracks user interactions

VisibilityService resolves eligible users by team/org/user

🧩 Data Model Summary
Model	Description
Alert	Title, message, severity, start/expiry, visibility rules
User	ID, name, team ID
Team	ID, name
UserAlertState	Read/unread/snooze/lastNotifiedAt state
NotificationDelivery	Log of sent reminders
🌱 Seed Data

Predefined sample data for demo/testing:

Teams
ID	Name
t-eng	Engineering
t-mkt	Marketing
Users
ID	Name	Team
u-alex	Alex	Engineering
u-bella	Bella	Marketing
u-chen	Chen	Engineering
🧠 Design Highlights

✅ DRY & SRP Compliant — Each service is isolated and testable

🧩 Extensible — Add new delivery channels without modifying existing logic

🕒 Scalable Reminder Logic — Supports simulated or real schedulers

📊 Analytics Ready — Aggregate and analyze system-wide stats easily

🧱 Plug-and-Play — Replace in-memory store.ts with database adapter

🔐 Future Ready — Extendable to Email, SMS, and Push channels

💡 Notes

Data is stored in-memory for this MVP (no persistence).

Reminder scheduler is manual (API-triggered) to demonstrate modularity.

Snooze logic resets automatically on the next calendar day.

All timestamps follow ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).

🌐 Deployment (Demo Links)

Backend API: https://alerting-platform-backend.onrender.com

Frontend Dashboard: https://alerting-platform-kxsm.onrender.com

👨‍💻 Author

Priyanshu Rai
M.Tech (Software Engineering), IIIT-Allahabad


---

✅ **Why this works perfectly:**
- It matches **every PRD deliverable** clearly.  
- Uses **recruiter-friendly structure** (Overview → Features → API → Design).  
- Emphasizes **OOP principles and extensibility**.  
- Includes **ready-to-run commands**, **example cURL**, and **deployment links**.  
- Gives a **strong first impression** when opened directly on GitHub or shared via Render link.

---

Would you like me to make a **matching README for your frontend repo** (with screenshots & API connection note)?  
That will make your submission **look like a complete end-to-end project** — exactly what recruiters love.
