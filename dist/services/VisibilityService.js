"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisibilityService = void 0;
const store_1 = require("../store");
/** Resolves the target users for an alert based on its visibility rules. */
class VisibilityService {
    resolveUsersForAlert(alert) {
        if (alert.visibility.org)
            return store_1.db.users;
        const set = new Set();
        for (const teamId of alert.visibility.teams) {
            store_1.db.users.filter(u => u.teamId === teamId).forEach(u => set.add(u.id));
        }
        for (const userId of alert.visibility.users)
            set.add(userId);
        return store_1.db.users.filter(u => set.has(u.id));
    }
}
exports.VisibilityService = VisibilityService;
