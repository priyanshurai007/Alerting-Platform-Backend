import dayjs from 'dayjs';
import { InAppChannel, NotificationChannel } from '../channels';
import { db } from '../store';
import { Alert, isAlertActive } from '../models';
import { VisibilityService } from './VisibilityService';
import { UserStateService } from './UserStateService';

export class NotificationService {
  private channels: Map<string, NotificationChannel>;
  private visibility = new VisibilityService();
  private userState = new UserStateService();

  constructor() {
    this.channels = new Map();
    const inapp = new InAppChannel();
    this.channels.set(inapp.type, inapp);
  }

  /** Send initial or reminder notifications for a single alert to eligible users */
  dispatchForAlert(alert: Alert) {
    if (!alert.remindersEnabled) return;
    const nowISO = dayjs().toISOString();
    if (!isAlertActive(alert, nowISO)) return;

    const targets = this.visibility.resolveUsersForAlert(alert);
    const channel = this.channels.get(alert.deliveryType);
    if (!channel) return;

    for (const u of targets) {
      const state = this.userState.getOrCreate(u.id, alert.id);

      // Skip if snoozed today
      if (this.userState.isSnoozedForToday(u.id, alert.id)) continue;

      // Check frequency
      const last = state.lastNotifiedAt ? dayjs(state.lastNotifiedAt) : null;
      const due = !last || last.add(alert.reminderFrequencyMinutes, 'minute').isBefore(nowISO);
      if (!due) continue;

      const delivery = channel.send(u.id, alert.id);
      this.userState.updateLastNotified(u.id, alert.id, delivery.deliveredAt);
    }
  }

  /** Iterate all alerts and dispatch as needed (cron-like simulation) */
  triggerAllEligible() {
    for (const a of db.alerts) this.dispatchForAlert(a);
  }
}
