import { db } from '../store';
import { Alert, User } from '../models';

/** Resolves the target users for an alert based on its visibility rules. */
export class VisibilityService {
  resolveUsersForAlert(alert: Alert): User[] {
    if (alert.visibility.org) return db.users;
    const set = new Set<string>();
    for (const teamId of alert.visibility.teams) {
      db.users.filter(u => u.teamId === teamId).forEach(u => set.add(u.id));
    }
    for (const userId of alert.visibility.users) set.add(userId);
    return db.users.filter(u => set.has(u.id));
  }
}
