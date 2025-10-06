import { Router } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';

export const analytics = Router();
const svc = new AnalyticsService();

analytics.get('/metrics', (_req, res) => {
  res.json(svc.metrics());
});
