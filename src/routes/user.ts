import { Router } from 'express';
import { db } from '../store';
import { VisibilityService } from '../services/VisibilityService';
import { isAlertActive } from '../models';
import dayjs from 'dayjs';
import { UserStateService } from '../services/UserStateService';

export const user = Router();
const visibility = new VisibilityService();
const state = new UserStateService();

user.get('/:userId/alerts', (req, res) => {
  const { userId } = req.params;
  const nowISO = dayjs().toISOString();
  const visibleAlerts = db.alerts.filter(a => {
    if (!isAlertActive(a, nowISO)) return false;
    const users = visibility.resolveUsersForAlert(a).map(u => u.id);
    return users.includes(userId);
  });
  const response = visibleAlerts.map(a => {
    const s = state.getOrCreate(req.params.userId, a.id);
    return { alert: a, state: s };
  });
  res.json(response);
});

user.post('/:userId/alerts/:alertId/read', (req, res) => {
  const s = state.markRead(req.params.userId, req.params.alertId);
  res.json(s);
});

user.post('/:userId/alerts/:alertId/unread', (req, res) => {
  const s = state.markUnread(req.params.userId, req.params.alertId);
  res.json(s);
});

user.post('/:userId/alerts/:alertId/snooze', (req, res) => {
  const s = state.snoozeToday(req.params.userId, req.params.alertId);
  res.json(s);
});
