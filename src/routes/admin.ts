import { Router } from 'express';
import { AlertService } from '../services/AlertService';

export const admin = Router();
const alertSvc = new AlertService();

admin.post('/alerts', (req, res) => {
  const a = alertSvc.create(req.body);
  res.json(a);
});

admin.put('/alerts/:id', (req, res) => {
  const a = alertSvc.update(req.params.id, req.body);
  if (!a) return res.status(404).json({ error: 'Not found' });
  res.json(a);
});

admin.get('/alerts', (req, res) => {
  const { severity, status, audience } = req.query as any;
  const list = alertSvc.list({ severity, status, audience });
  res.json(list);
});
