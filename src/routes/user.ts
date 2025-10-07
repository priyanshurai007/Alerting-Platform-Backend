import { Router } from "express";
import { db } from "../store";
import { VisibilityService } from "../services/VisibilityService";
import { isAlertActive } from "../models";
import dayjs from "dayjs";
import { UserStateService } from "../services/UserStateService";

export const user = Router();
const visibility = new VisibilityService();
const state = new UserStateService();

/**
 * GET /user/:userId/alerts
 * Fetches all active and visible alerts for a user
 */
user.get("/:userId/alerts", (req, res) => {
  const { userId } = req.params;
  const nowISO = dayjs().toISOString();

  console.log(`\n[🔍 FETCH ALERTS] For User: ${userId} at ${nowISO}`);
  console.log(`[DB] Total alerts stored: ${db.alerts.length}`);

  // 1️⃣ Filter active alerts
  const activeAlerts = db.alerts.filter((a) => {
    const active = isAlertActive(a, nowISO);
    if (!active)
      console.log(
        `🚫 Skipping "${a.title}" — Not active (start=${a.startAt}, end=${a.expiresAt})`
      );
    return active;
  });

  // 2️⃣ Filter alerts visible to this user
  const visibleAlerts = activeAlerts.filter((a) => {
    const userIds = visibility.resolveUsersForAlert(a).map((u) => u.id);
    const visible = userIds.includes(userId);
    if (!visible)
      console.log(`👁️  "${a.title}" not visible to user ${userId}`);
    return visible;
  });

  // 3️⃣ Attach per-user state (read/unread/snooze)
  const response = visibleAlerts.map((a) => {
    const s = state.getOrCreate(userId, a.id);
    return {
      alert: a,
      state: s,
    };
  });

  console.log(`[✅ Result] Returning ${response.length} visible alerts\n`);
  res.json(response);
});

/**
 * POST /user/:userId/alerts/:alertId/read
 */
user.post("/:userId/alerts/:alertId/read", (req, res) => {
  const s = state.markRead(req.params.userId, req.params.alertId);
  res.json(s);
});

/**
 * POST /user/:userId/alerts/:alertId/unread
 */
user.post("/:userId/alerts/:alertId/unread", (req, res) => {
  const s = state.markUnread(req.params.userId, req.params.alertId);
  res.json(s);
});

/**
 * POST /user/:userId/alerts/:alertId/snooze
 */
user.post("/:userId/alerts/:alertId/snooze", (req, res) => {
  const s = state.snoozeToday(req.params.userId, req.params.alertId);
  res.json(s);
});
