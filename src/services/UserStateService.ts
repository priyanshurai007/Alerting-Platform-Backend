import dayjs from 'dayjs';
import { db } from '../store';
import { UserAlertState } from '../models';

export class UserStateService {
  getOrCreate(userId: string, alertId: string): UserAlertState {
    let s = db.userAlertStates.find(x => x.userId === userId && x.alertId === alertId);
    if (!s) {
      s = { userId, alertId, read: false, snoozedUntilDate: null, lastNotifiedAt: null };
      db.userAlertStates.push(s);
    }
    return s;
  }

  markRead(userId: string, alertId: string): UserAlertState {
    const s = this.getOrCreate(userId, alertId);
    s.read = true;
    return s;
  }

  markUnread(userId: string, alertId: string): UserAlertState {
    const s = this.getOrCreate(userId, alertId);
    s.read = false;
    return s;
  }

  snoozeToday(userId: string, alertId: string): UserAlertState {
    const s = this.getOrCreate(userId, alertId);
    s.snoozedUntilDate = dayjs().format('YYYY-MM-DD');
    return s;
  }

  isSnoozedForToday(userId: string, alertId: string): boolean {
    const s = this.getOrCreate(userId, alertId);
    return s.snoozedUntilDate === dayjs().format('YYYY-MM-DD');
  }

  updateLastNotified(userId: string, alertId: string, whenISO: string) {
    const s = this.getOrCreate(userId, alertId);
    s.lastNotifiedAt = whenISO;
  }
}
