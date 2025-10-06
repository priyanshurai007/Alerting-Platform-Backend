"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("./routes/admin");
const user_1 = require("./routes/user");
const reminders_1 = require("./routes/reminders");
const analytics_1 = require("./routes/analytics");
const store_1 = require("./store");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express_1.default.json());
app.get('/', (_req, res) => res.json({ ok: true }));
app.use('/admin', admin_1.admin);
app.use('/user', user_1.user);
app.use('/reminders', reminders_1.reminders);
app.use('/analytics', analytics_1.analytics);
// seed minimal data if empty
app.post('/seed', (_req, res) => {
    if (store_1.db.teams.length === 0) {
        store_1.db.teams.push({ id: 't-eng', name: 'Engineering' }, { id: 't-mkt', name: 'Marketing' });
    }
    if (store_1.db.users.length === 0) {
        store_1.db.users.push({ id: 'u-alex', name: 'Alex', teamId: 't-eng' }, { id: 'u-bella', name: 'Bella', teamId: 't-mkt' }, { id: 'u-chen', name: 'Chen', teamId: 't-eng' });
    }
    res.json({ teams: store_1.db.teams, users: store_1.db.users });
});
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Alerting Platform listening on http://localhost:${PORT}`);
});
