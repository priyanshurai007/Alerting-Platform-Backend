import { db } from "../store";
import { Alert, User } from "../models";

/**
 * Resolves which users are eligible to receive a given alert,
 * based on its visibility configuration.
 */
export class VisibilityService {
  resolveUsersForAlert(alert: Alert): User[] {
    const set = new Set<string>();

    // 🌍 Org-wide alerts
    if (alert.visibility.org) {
      db.users.forEach((u) => set.add(u.id));
    }

    // 👥 Team-based alerts
    if (alert.visibility.teams?.length) {
      db.users
        .filter((u) => u.teamId && alert.visibility.teams.includes(u.teamId))
        .forEach((u) => set.add(u.id));
    }

    // 👤 User-specific alerts
    if (alert.visibility.users?.length) {
      alert.visibility.users.forEach((uid) => set.add(uid));
    }

    // Return resolved users
    return db.users.filter((u) => set.has(u.id));
  }
}
