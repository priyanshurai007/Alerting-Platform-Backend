import dayjs from "dayjs";
import { db } from "../store";
import { Severity, isAlertActive } from "../models";

/**
 * AnalyticsService
 * -----------------------------------------------------
 * Aggregates platform-wide metrics:
 *  - Total alerts created
 *  - Deliveries vs. Reads
 *  - Snoozes per alert (today)
 *  - Severity breakdown
 *  - Active vs. Expired alerts
 *  - Suppression ratio (snoozed/delivered)
 *  - Read counts per alert
 * 
 * Extensible for:
 *  - Time-bounded analytics (e.g., last 7 days)
 *  - Per-user engagement tracking
 */
export class AnalyticsService {
  metrics() {
    const nowISO = dayjs().toISOString();
    const today = dayjs().format("YYYY-MM-DD");

    // --- Core totals ---
    const totalAlerts = db.alerts.length;
    const delivered = db.deliveries.length;
    const read = db.userAlertStates.filter((s) => s.read).length;

    // --- Snoozed counts per alert (for today) ---
    const snoozedCounts: Record<string, number> = {};
    for (const s of db.userAlertStates) {
      if (s.snoozedUntilDate === today) {
        snoozedCounts[s.alertId] = (snoozedCounts[s.alertId] || 0) + 1;
      }
    }

    // --- Severity breakdown ---
    const severityBreakdown: Record<Severity, number> = {
      Info: 0,
      Warning: 0,
      Critical: 0,
    };
    for (const a of db.alerts) severityBreakdown[a.severity]++;

    // --- Active vs. Expired ---
    const active = db.alerts.filter((a) => isAlertActive(a, nowISO)).length;
    const expired = totalAlerts - active;

    // --- Read counts per alert ---
    const readCounts: Record<string, number> = {};
    for (const s of db.userAlertStates) {
      if (s.read) readCounts[s.alertId] = (readCounts[s.alertId] || 0) + 1;
    }

    // --- Suppression ratios (how many users snoozed per alert) ---
    const suppressionRatios: Record<string, number> = {};
    for (const [alertId, snoozedCount] of Object.entries(snoozedCounts)) {
      const totalDeliveredForAlert = db.deliveries.filter(
        (d) => d.alertId === alertId
      ).length;
      suppressionRatios[alertId] = totalDeliveredForAlert
        ? Number((snoozedCount / totalDeliveredForAlert).toFixed(2))
        : 0;
    }

    // --- Return final aggregated metrics ---
    return {
      totalAlerts,
      deliveries: delivered,
      reads: read,
      active,
      expired,
      severityBreakdown,
      snoozedCounts,
      readCounts,
      suppressionRatios,
    };
  }
}
