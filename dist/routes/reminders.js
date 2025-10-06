"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminders = void 0;
const express_1 = require("express");
const NotificationService_1 = require("../services/NotificationService");
exports.reminders = (0, express_1.Router)();
const svc = new NotificationService_1.NotificationService();
// Simulation endpoint for a cron-like tick
exports.reminders.post('/trigger', (_req, res) => {
    svc.triggerAllEligible();
    res.json({ ok: true });
});
