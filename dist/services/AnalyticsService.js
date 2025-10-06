"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const store_1 = require("../store");
const models_1 = require("../models");
const dayjs_1 = __importDefault(require("dayjs"));
class AnalyticsService {
    metrics() {
        const nowISO = (0, dayjs_1.default)().toISOString();
        const totalAlerts = store_1.db.alerts.length;
        const delivered = store_1.db.deliveries.length;
        const read = store_1.db.userAlertStates.filter(s => s.read).length;
        const snoozedCounts = {};
        for (const s of store_1.db.userAlertStates) {
            if (s.snoozedUntilDate === (0, dayjs_1.default)().format('YYYY-MM-DD')) {
                snoozedCounts[s.alertId] = (snoozedCounts[s.alertId] || 0) + 1;
            }
        }
        const severityBreakdown = { Info: 0, Warning: 0, Critical: 0 };
        for (const a of store_1.db.alerts)
            severityBreakdown[a.severity]++;
        const active = store_1.db.alerts.filter(a => (0, models_1.isAlertActive)(a, nowISO)).length;
        const expired = totalAlerts - active;
        return {
            totalAlerts,
            deliveries: delivered,
            reads: read,
            snoozedCounts,
            severityBreakdown,
            active,
            expired
        };
    }
}
exports.AnalyticsService = AnalyticsService;
