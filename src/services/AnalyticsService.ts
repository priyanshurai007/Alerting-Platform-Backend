import { db } from '../store';
import { Severity, isAlertActive } from '../models';
import dayjs from 'dayjs';

export class AnalyticsService {
  metrics() {
    const nowISO = dayjs().toISOString();
    const totalAlerts = db.alerts.length;
    const delivered = db.deliveries.length;
    const read = db.userAlertStates.filter(s => s.read).length;

    const snoozedCounts: Record<string, number> = {};
    for (const s of db.userAlertStates) {
      if (s.snoozedUntilDate === dayjs().format('YYYY-MM-DD')) {
        snoozedCounts[s.alertId] = (snoozedCounts[s.alertId] || 0) + 1;
      }
    }

    const severityBreakdown: Record<Severity, number> = { Info: 0, Warning: 0, Critical: 0 };
    for (const a of db.alerts) severityBreakdown[a.severity]++;

    const active = db.alerts.filter(a => isAlertActive(a, nowISO)).length;
    const expired = totalAlerts - active;

    return {
      totalAlerts,
      deliveries: delivered,
      reads: read,
      snoozedCounts,
      severityBreakdown,
      active,
      expired
    };
  }
}
