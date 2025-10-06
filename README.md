# Alerting & Notification Platform (MVP)

TypeScript + Express implementation following the PRD.

## Features (MVP)
- Admin:
  - Create/Update/List/Archive Alerts
  - Configure visibility: Org / Team / User
  - Start/Expiry, severity (Info|Warning|Critical), delivery type (InApp), enable/disable reminders
- End User:
  - Fetch alerts (assigned by visibility)
  - Mark Read/Unread
  - Snooze (per day; resets next day)
- Reminder Logic:
  - Every 2 hours (default) until snoozed (for the day) or expired
  - `POST /reminders/trigger` endpoint simulates the scheduler
- Analytics:
  - Aggregated metrics across the system

## Quick Start
```bash
# in this folder
npm i
npm run dev
# (optional) seed sample users/teams/alerts:
npm run seed
```

Server will default to `http://localhost:4001`.

## API (Selected)
- Admin
  - `POST /admin/alerts` create alert
  - `PUT /admin/alerts/:id` update/archive/enableReminders
  - `GET /admin/alerts` list and filter (?severity=Info|Warning|Critical&status=active|expired)
- User
  - `GET /user/:userId/alerts` list relevant alerts for a user
  - `POST /user/:userId/alerts/:alertId/read` mark read
  - `POST /user/:userId/alerts/:alertId/unread` mark unread
  - `POST /user/:userId/alerts/:alertId/snooze` snooze for the current day
- Reminders
  - `POST /reminders/trigger` simulate 2h reminder dispatching
- Analytics
  - `GET /analytics/metrics` totals, delivered vs read, snoozed counts, severity breakdown

### Example: Create an Alert
```bash
curl -X POST http://localhost:4001/admin/alerts   -H "Content-Type: application/json"   -d '{
    "title": "DB maintenance",
    "message": "Postgres upgrade at 01:00",
    "severity": "Warning",
    "deliveryType": "InApp",
    "reminderFrequencyMinutes": 120,
    "startAt": null,
    "expiresAt": null,
    "visibility": { "org": true, "teams": [], "users": [] }
  }'
```

### Example: Trigger Reminders
```bash
curl -X POST http://localhost:4001/reminders/trigger
```

## Design
- **Strategy Pattern** for delivery channels (`NotificationChannel` + `InAppChannel`).
- **State Pattern** for per-user alert state (`UserAlertState` manages read/unread/snooze).
- **Separation of Concerns**: Alert CRUD & audience resolution vs. Delivery vs. Reminder scheduling.
- **Extensible**: Add `EmailChannel`/`SmsChannel` without changing services.

## Notes
- Storage is in-memory for the MVP (simple arrays). Replace with DB by swapping `store.ts`.
- Reminder window uses `lastNotifiedAt` to decide eligibility (`>= frequency`) and ignores snoozed/expired.
- Snooze resets by calendar day.
