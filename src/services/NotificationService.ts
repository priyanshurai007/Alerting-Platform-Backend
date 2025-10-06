import dayjs from "dayjs";
import { InAppChannel, NotificationChannel } from "../channels";
import { db } from "../store";
import { Alert, isAlertActive } from "../models";
import { VisibilityService } from "./VisibilityService";
import { UserStateService } from "./UserStateService";

/**
 * NotificationService
 * -----------------------------------------------------
 * Handles delivery and reminder scheduling for alerts.
 * Implements:
 *  - Strategy Pattern (pluggable notification channels)
 *  - Observer Pattern (UserStateService updates)
 *  - Reminder logic (every X minutes)
 *  - Snooze and expiry handling
 */
export class NotificationService {
  private channels: Map<string, NotificationChannel>;
  private visibility = new VisibilityService();
  private userState = new UserStateService();

  constructor() {
    this.channels = new Map();
    const inApp = new InAppChannel();
    this.channels.set(inApp.type, inApp);
  }

  /** Send notifications or reminders for one alert */
  dispatchForAlert(alert: Alert) {
    if (!alert.remindersEnabled) return;

    const nowISO = dayjs().toISOString();
    if (!isAlertActive(alert, nowISO)) return;

    const targets = this.visibility.resolveUsersForAlert(alert);
    const channel = this.channels.get(alert.deliveryType);
    if (!channel) return;

    let sent = 0;
    let skippedSnoozed = 0;
    let skippedNotDue = 0;

    for (const u of targets) {
      const state = this.userState.getOrCreate(u.id, alert.id);

      // Skip if snoozed for today
      if (this.userState.isSnoozedForToday(u.id, alert.id)) {
        skippedSnoozed++;
        continue;
      }

      // Skip if within reminder cooldown
      const last = state.lastNotifiedAt ? dayjs(state.lastNotifiedAt) : null;
      const due =
        !last ||
        last.add(alert.reminderFrequencyMinutes, "minute").isBefore(nowISO);
      if (!due) {
        skippedNotDue++;
        continue;
      }

      // Deliver through the selected channel
      const delivery = channel.send(u.id, alert.id);
      this.userState.updateLastNotified(u.id, alert.id, delivery.deliveredAt);
      sent++;
    }

    console.log(
      `[Reminder] "${alert.title}" | Sent: ${sent}, Snoozed: ${skippedSnoozed}, Not due: ${skippedNotDue}`
    );
  }

  /** Trigger reminder for a single alert by ID */
  triggerSingle(alertId: string) {
    const alert = db.alerts.find((a) => a.id === alertId);
    if (!alert) return { error: "Alert not found" };
    this.dispatchForAlert(alert);
    return { ok: true };
  }

  /** Simulate cron job: check all alerts and dispatch if due */
  triggerAllEligible() {
    let totalSent = 0;
    for (const a of db.alerts) {
      const before = db.deliveries.length;
      this.dispatchForAlert(a);
      totalSent += db.deliveries.length - before;
    }
    console.log(`[Scheduler] Total notifications dispatched: ${totalSent}`);
    return { totalSent };
  }
}
