"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const express_1 = require("express");
const AlertService_1 = require("../services/AlertService");
exports.admin = (0, express_1.Router)();
const alertSvc = new AlertService_1.AlertService();
exports.admin.post('/alerts', (req, res) => {
    const a = alertSvc.create(req.body);
    res.json(a);
});
exports.admin.put('/alerts/:id', (req, res) => {
    const a = alertSvc.update(req.params.id, req.body);
    if (!a)
        return res.status(404).json({ error: 'Not found' });
    res.json(a);
});
exports.admin.get('/alerts', (req, res) => {
    const { severity, status, audience } = req.query;
    const list = alertSvc.list({ severity, status, audience });
    res.json(list);
});
