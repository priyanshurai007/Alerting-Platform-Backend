import dayjs from "dayjs";
import { db } from "../store";
import { UserAlertState } from "../models";

/**
 * UserStateService
 * -----------------------------------------------------
 * Manages per-user alert states:
 *  - read / unread
 *  - snooze today (resets next day)
 *  - last notification timestamp
 *  - optional snooze history and read timestamps
 */
export class UserStateService {
  /** Find or create state record for a given user-alert pair */
  getOrCreate(userId: string, alertId: string): UserAlertState {
    let s = db.userAlertStates.find(
      (x) => x.userId === userId && x.alertId === alertId
    );
    if (!s) {
      s = {
        userId,
        alertId,
        read: false,
        readAt: null,
        snoozedUntilDate: null,
        snoozedHistory: [],
        lastNotifiedAt: null,
      };
      db.userAlertStates.push(s);
    }
    return s;
  }

  /** Mark alert as read */
  markRead(userId: string, alertId: string): UserAlertState {
    const s = this.getOrCreate(userId, alertId);
    s.read = true;
    s.readAt = dayjs().toISOString();
    return s;
  }

  /** Mark alert as unread */
  markUnread(userId: string, alertId: string): UserAlertState {
    const s = this.getOrCreate(userId, alertId);
    s.read = false;
    s.readAt = null;
    return s;
  }

  /** Snooze this alert for the current day (resumes next day) */
  snoozeToday(userId: string, alertId: string): UserAlertState {
    const s = this.getOrCreate(userId, alertId);
    const today = dayjs().format("YYYY-MM-DD");
    s.snoozedUntilDate = today;
    s.snoozedHistory = s.snoozedHistory || [];
    if (!s.snoozedHistory.includes(today)) s.snoozedHistory.push(today);
    return s;
  }

  /** Check if alert is snoozed for the current day */
  isSnoozedForToday(userId: string, alertId: string): boolean {
    const s = this.getOrCreate(userId, alertId);
    return s.snoozedUntilDate === dayjs().format("YYYY-MM-DD");
  }

  /** Update timestamp of last notification sent to user */
  updateLastNotified(userId: string, alertId: string, whenISO: string) {
    const s = this.getOrCreate(userId, alertId);
    s.lastNotifiedAt = whenISO;
  }

  /** Optional: Reset snoozes from previous days (simulate daily reset) */
  resetDailySnoozes() {
    const today = dayjs().format("YYYY-MM-DD");
    for (const s of db.userAlertStates) {
      if (s.snoozedUntilDate && s.snoozedUntilDate < today) {
        s.snoozedUntilDate = null;
      }
    }
  }

  /** Optional: Get snooze history for a user */
  getSnoozeHistory(userId: string): { alertId: string; dates: string[] }[] {
    return db.userAlertStates
      .filter((s) => s.userId === userId && s.snoozedHistory?.length)
      .map((s) => ({ alertId: s.alertId, dates: s.snoozedHistory! }));
  }
}
