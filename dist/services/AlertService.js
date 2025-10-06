"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const uuid_1 = require("uuid");
const store_1 = require("../store");
const models_1 = require("../models");
class AlertService {
    create(params) {
        const now = (0, dayjs_1.default)().toISOString();
        const alert = {
            id: (0, uuid_1.v4)(),
            title: params.title,
            message: params.message,
            severity: params.severity,
            deliveryType: params.deliveryType ?? 'InApp',
            reminderFrequencyMinutes: params.reminderFrequencyMinutes ?? 120,
            startAt: params.startAt ?? null,
            expiresAt: params.expiresAt ?? null,
            remindersEnabled: true,
            archived: false,
            visibility: params.visibility,
            createdAt: now,
            updatedAt: now
        };
        store_1.db.alerts.push(alert);
        return alert;
    }
    update(id, patch) {
        const a = store_1.db.alerts.find(x => x.id == id);
        if (!a)
            return undefined;
        Object.assign(a, patch);
        a.updatedAt = (0, dayjs_1.default)().toISOString();
        return a;
    }
    list(filter) {
        const nowISO = (0, dayjs_1.default)().toISOString();
        return store_1.db.alerts.filter(a => {
            if (filter?.severity && a.severity !== filter.severity)
                return false;
            if (filter?.status) {
                const active = (0, models_1.isAlertActive)(a, nowISO);
                if (filter.status === 'active' && !active)
                    return false;
                if (filter.status === 'expired' && active)
                    return false;
            }
            if (filter?.audience) {
                if (filter.audience === 'org' && !a.visibility.org)
                    return false;
                if (filter.audience === 'team' && a.visibility.teams.length === 0)
                    return false;
                if (filter.audience === 'user' && a.visibility.users.length === 0)
                    return false;
            }
            return true;
        });
    }
}
exports.AlertService = AlertService;
