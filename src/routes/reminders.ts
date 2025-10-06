import { Router } from 'express';
import { NotificationService } from '../services/NotificationService';

export const reminders = Router();
const svc = new NotificationService();

// Simulation endpoint for a cron-like tick
reminders.post('/trigger', (_req, res) => {
  svc.triggerAllEligible();
  res.json({ ok: true });
});
