"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlertActive = isAlertActive;
const dayjs_1 = __importDefault(require("dayjs"));
function isAlertActive(a, nowISO) {
    if (a.archived)
        return false;
    const now = (0, dayjs_1.default)(nowISO);
    if (a.startAt && now.isBefore((0, dayjs_1.default)(a.startAt)))
        return false;
    if (a.expiresAt && now.isAfter((0, dayjs_1.default)(a.expiresAt)))
        return false;
    return true;
}
