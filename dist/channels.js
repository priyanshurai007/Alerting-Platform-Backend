"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppChannel = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const uuid_1 = require("uuid");
const store_1 = require("./store");
class InAppChannel {
    constructor() {
        this.type = 'InApp';
    }
    send(toUserId, alertId) {
        const delivery = {
            id: (0, uuid_1.v4)(),
            alertId,
            userId: toUserId,
            channel: this.type,
            deliveredAt: (0, dayjs_1.default)().toISOString()
        };
        store_1.db.deliveries.push(delivery);
        return delivery;
    }
}
exports.InAppChannel = InAppChannel;
// Future: EmailChannel, SmsChannel implementing NotificationChannel.
