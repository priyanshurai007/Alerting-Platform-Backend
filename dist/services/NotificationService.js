"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const channels_1 = require("../channels");
const store_1 = require("../store");
const models_1 = require("../models");
const VisibilityService_1 = require("./VisibilityService");
const UserStateService_1 = require("./UserStateService");
class NotificationService {
    constructor() {
        this.visibility = new VisibilityService_1.VisibilityService();
        this.userState = new UserStateService_1.UserStateService();
        this.channels = new Map();
        const inapp = new channels_1.InAppChannel();
        this.channels.set(inapp.type, inapp);
    }
    /** Send initial or reminder notifications for a single alert to eligible users */
    dispatchForAlert(alert) {
        if (!alert.remindersEnabled)
            return;
        const nowISO = (0, dayjs_1.default)().toISOString();
        if (!(0, models_1.isAlertActive)(alert, nowISO))
            return;
        const targets = this.visibility.resolveUsersForAlert(alert);
        const channel = this.channels.get(alert.deliveryType);
        if (!channel)
            return;
        for (const u of targets) {
            const state = this.userState.getOrCreate(u.id, alert.id);
            // Skip if snoozed today
            if (this.userState.isSnoozedForToday(u.id, alert.id))
                continue;
            // Check frequency
            const last = state.lastNotifiedAt ? (0, dayjs_1.default)(state.lastNotifiedAt) : null;
            const due = !last || last.add(alert.reminderFrequencyMinutes, 'minute').isBefore(nowISO);
            if (!due)
                continue;
            const delivery = channel.send(u.id, alert.id);
            this.userState.updateLastNotified(u.id, alert.id, delivery.deliveredAt);
        }
    }
    /** Iterate all alerts and dispatch as needed (cron-like simulation) */
    triggerAllEligible() {
        for (const a of store_1.db.alerts)
            this.dispatchForAlert(a);
    }
}
exports.NotificationService = NotificationService;
