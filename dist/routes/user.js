"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const express_1 = require("express");
const store_1 = require("../store");
const VisibilityService_1 = require("../services/VisibilityService");
const models_1 = require("../models");
const dayjs_1 = __importDefault(require("dayjs"));
const UserStateService_1 = require("../services/UserStateService");
exports.user = (0, express_1.Router)();
const visibility = new VisibilityService_1.VisibilityService();
const state = new UserStateService_1.UserStateService();
exports.user.get('/:userId/alerts', (req, res) => {
    const { userId } = req.params;
    const nowISO = (0, dayjs_1.default)().toISOString();
    const visibleAlerts = store_1.db.alerts.filter(a => {
        if (!(0, models_1.isAlertActive)(a, nowISO))
            return false;
        const users = visibility.resolveUsersForAlert(a).map(u => u.id);
        return users.includes(userId);
    });
    const response = visibleAlerts.map(a => {
        const s = state.getOrCreate(req.params.userId, a.id);
        return { alert: a, state: s };
    });
    res.json(response);
});
exports.user.post('/:userId/alerts/:alertId/read', (req, res) => {
    const s = state.markRead(req.params.userId, req.params.alertId);
    res.json(s);
});
exports.user.post('/:userId/alerts/:alertId/unread', (req, res) => {
    const s = state.markUnread(req.params.userId, req.params.alertId);
    res.json(s);
});
exports.user.post('/:userId/alerts/:alertId/snooze', (req, res) => {
    const s = state.snoozeToday(req.params.userId, req.params.alertId);
    res.json(s);
});
