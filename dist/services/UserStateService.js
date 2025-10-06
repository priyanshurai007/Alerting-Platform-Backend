"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStateService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const store_1 = require("../store");
class UserStateService {
    getOrCreate(userId, alertId) {
        let s = store_1.db.userAlertStates.find(x => x.userId === userId && x.alertId === alertId);
        if (!s) {
            s = { userId, alertId, read: false, snoozedUntilDate: null, lastNotifiedAt: null };
            store_1.db.userAlertStates.push(s);
        }
        return s;
    }
    markRead(userId, alertId) {
        const s = this.getOrCreate(userId, alertId);
        s.read = true;
        return s;
    }
    markUnread(userId, alertId) {
        const s = this.getOrCreate(userId, alertId);
        s.read = false;
        return s;
    }
    snoozeToday(userId, alertId) {
        const s = this.getOrCreate(userId, alertId);
        s.snoozedUntilDate = (0, dayjs_1.default)().format('YYYY-MM-DD');
        return s;
    }
    isSnoozedForToday(userId, alertId) {
        const s = this.getOrCreate(userId, alertId);
        return s.snoozedUntilDate === (0, dayjs_1.default)().format('YYYY-MM-DD');
    }
    updateLastNotified(userId, alertId, whenISO) {
        const s = this.getOrCreate(userId, alertId);
        s.lastNotifiedAt = whenISO;
    }
}
exports.UserStateService = UserStateService;
