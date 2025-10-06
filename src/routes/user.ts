import { Router } from "express";
import { db } from "../store";
import { VisibilityService } from "../services/VisibilityService";
import { isAlertActive } from "../models";
import dayjs from "dayjs";
import { UserStateService } from "../services/UserStateService";

export const user = Router();
const visibility = new VisibilityService();
const state = new UserStateService();

// 🧩 Fetch all alerts visible to a specific user
user.get("/:userId/alerts", (req, res) => {
  const { userId } = req.params;
  const nowISO = dayjs().toISOString();

  // Only active alerts
  const activeAlerts = db.alerts.filter((a) => isAlertActive(a, nowISO));

  // Alerts visible to this user
  const visibleAlerts = activeAlerts.filter((a) => {
    const userIds = visibility.resolveUsersForAlert(a).map((u) => u.id);
    return userIds.includes(userId);
  });

  // Attach user state (read/unread/snooze)
  const response = visibleAlerts.map((a) => {
    const s = state.getOrCreate(userId, a.id);
    const visibleTo = visibility.resolveUsersForAlert(a).map((u) => u.id);
    return { alert: a, state: s, visibleTo }; // ✅ debug who sees what
  });

  res.json(response);
});

// 🟢 Mark alert as read
user.post("/:userId/alerts/:alertId/read", (req, res) => {
  const s = state.markRead(req.params.userId, req.params.alertId);
  res.json(s);
});

// 🔵 Mark alert as unread
user.post("/:userId/alerts/:alertId/unread", (req, res) => {
  const s = state.markUnread(req.params.userId, req.params.alertId);
  res.json(s);
});

// 🟠 Snooze alert for today
user.post("/:userId/alerts/:alertId/snooze", (req, res) => {
  const s = state.snoozeToday(req.params.userId, req.params.alertId);
  res.json(s);
});
