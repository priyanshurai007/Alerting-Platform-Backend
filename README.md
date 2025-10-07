🧠 Alerting & Notification Platform — Backend (MVP)

A modular TypeScript + Express backend implementing the complete Alerting & Notification Platform per PRD.
Designed with OOP principles (Strategy, State, and SRP) for clarity, reusability, and extensibility.

🚀 Features Implemented
👩‍💼 Admin Features

Create, update, and list alerts

Configure visibility:

Entire organization

Specific teams

Specific users

Filter alerts by severity and status (active / expired)

Enable or disable recurring reminders (2 hours default)

👤 End-User Features

Fetch alerts visible to the logged-in user

Mark alerts as read / unread

Snooze alerts for the day (reminders resume next day)

⏰ Reminder Logic

Reminds users every 2 hours until snoozed or expired

/reminders/trigger endpoint simulates the recurring scheduler

📊 Analytics Dashboard (API)

Total alerts created

Alerts delivered vs. read

Snoozed counts per alert

Severity breakdown (Info / Warning / Critical)

Active vs. expired alert count

🧱 Tech Stack
Component	Technology
Language	TypeScript
Framework	Express.js
Storage	In-memory store (seeded users & teams)
Design Patterns	Strategy, State, Observer
Scheduler	Manual trigger endpoint (/reminders/trigger)
Deployment Ready	✅ Compatible with Render / Vercel / Localhost
⚙️ Setup & Usage
1️⃣ Clone & Install
git clone https://github.com/priyanshurai007/Alerting-Platform-Backend.git
cd Alerting-Platform-Backend
npm install

2️⃣ Run Locally
npm run dev


Server runs on 👉 http://localhost:4001

3️⃣ Seed Data (Predefined Users & Teams)

This populates mock data for testing visibility.

curl -X POST http://localhost:4001/seed


Sample Data Created

{
  "teams": [
    { "id": "t-eng", "name": "Engineering" },
    { "id": "t-mkt", "name": "Marketing" }
  ],
  "users": [
    { "id": "u-alex", "name": "Alex", "teamId": "t-eng" },
    { "id": "u-bella", "name": "Bella", "teamId": "t-mkt" },
    { "id": "u-chen", "name": "Chen", "teamId": "t-eng" }
  ]
}

🧪 API Endpoints (Testable via Postman or cURL)
🟣 Admin APIs
➤ Create an Alert
curl -X POST http://localhost:4001/admin/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Server Maintenance",
    "message": "Scheduled downtime at midnight.",
    "severity": "Warning",
    "deliveryType": "InApp",
    "reminderFrequencyMinutes": 120,
    "visibility": { "org": true, "teams": [], "users": [] },
    "startAt": null,
    "expiresAt": null
  }'

➤ List Alerts
curl http://localhost:4001/admin/alerts

➤ Filter Alerts
curl "http://localhost:4001/admin/alerts?severity=Warning&status=active"

➤ Update Alert
curl -X PUT http://localhost:4001/admin/alerts/<alertId> \
  -H "Content-Type: application/json" \
  -d '{"remindersEnabled": false}'

🔵 User APIs
➤ Fetch User Alerts
curl http://localhost:4001/user/u-alex/alerts

➤ Mark Alert as Read
curl -X POST http://localhost:4001/user/u-alex/alerts/<alertId>/read

➤ Mark Alert as Unread
curl -X POST http://localhost:4001/user/u-alex/alerts/<alertId>/unread

➤ Snooze Alert (for the current day)
curl -X POST http://localhost:4001/user/u-alex/alerts/<alertId>/snooze

🕓 Reminder Trigger (Demo Scheduler)
➤ Trigger Reminders Manually
curl -X POST http://localhost:4001/reminders/trigger

📈 Analytics API
➤ Get System Metrics
curl http://localhost:4001/analytics/metrics


Example Response:

{
  "totalAlerts": 2,
  "deliveries": 5,
  "reads": 3,
  "snoozedCounts": { "37b0a7...": 2 },
  "severityBreakdown": { "Info": 1, "Warning": 1, "Critical": 0 },
  "active": 2,
  "expired": 0
}

🧩 Architecture Overview
src/
├── models/                # Core types and interfaces (Alert, User, Team, etc.)
├── routes/
│   ├── admin.ts           # Admin: Create, Update, List alerts
│   ├── user.ts            # User: Read, Unread, Snooze alerts
│   ├── analytics.ts       # Analytics: Aggregated metrics
│   └── reminders.ts       # Reminder trigger simulation
├── services/
│   ├── AlertService.ts    # Business logic for alerts
│   ├── NotificationService.ts # Handles recurring reminders
│   ├── VisibilityService.ts   # Resolves user/team/org audience
│   └── UserStateService.ts    # Tracks read/snooze states
└── store.ts               # In-memory data store with mock users/teams

🧠 Design Highlights
Principle	Implementation
SRP (Single Responsibility)	Each service handles one concern (Alert, Visibility, UserState, etc.)
OCP (Open/Closed)	Easily extend channels (Email, SMS) without modifying existing logic
Strategy Pattern	Used for pluggable delivery channels (InAppChannel, future EmailChannel)
State Pattern	Manages user-specific alert states (read/unread/snoozed)
Observer Principle	Users are dynamically resolved for each alert via visibility mapping
📌 Evaluation-Ready Highlights

✅ Fully modular OOP design
✅ All required APIs implemented per PRD
✅ Readable code, easily extensible
✅ Includes visibility management, reminder logic, analytics
✅ Pre-seeded test data for immediate testing

🧑‍💻 Author

Priyanshu Rai
M.Tech (Software Engineering) — IIIT-Allahabad
📧 priyanshurai0007@gmail.com

🔗 GitHub
 | LinkedIn
