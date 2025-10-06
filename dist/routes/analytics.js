"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analytics = void 0;
const express_1 = require("express");
const AnalyticsService_1 = require("../services/AnalyticsService");
exports.analytics = (0, express_1.Router)();
const svc = new AnalyticsService_1.AnalyticsService();
exports.analytics.get('/metrics', (_req, res) => {
    res.json(svc.metrics());
});
