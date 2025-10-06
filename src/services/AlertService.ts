import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { db } from '../store';
import { Alert, AlertVisibility, DeliveryType, Severity, isAlertActive } from '../models';

export class AlertService {
  create(params: {
    title: string;
    message: string;
    severity: Severity;
    deliveryType?: DeliveryType;
    reminderFrequencyMinutes?: number;
    startAt?: string | null;
    expiresAt?: string | null;
    visibility: AlertVisibility;
  }): Alert {
    const now = dayjs().toISOString();
    const alert: Alert = {
      id: uuid(),
      title: params.title,
      message: params.message,
      severity: params.severity,
      deliveryType: params.deliveryType ?? 'InApp',
      reminderFrequencyMinutes: params.reminderFrequencyMinutes ?? 120,
      startAt: params.startAt ?? null,
      expiresAt: params.expiresAt ?? null,
      remindersEnabled: true,
      archived: false,
      visibility: params.visibility,
      createdAt: now,
      updatedAt: now
    };
    db.alerts.push(alert);
    return alert;
  }

  update(id: string, patch: Partial<Omit<Alert, 'id'|'createdAt'>>): Alert | undefined {
    const a = db.alerts.find(x => x.id == id);
    if (!a) return undefined;
    Object.assign(a, patch);
    a.updatedAt = dayjs().toISOString();
    return a;
  }

  list(filter?: { severity?: Severity; status?: 'active' | 'expired'; audience?: 'org' | 'team' | 'user' }): Alert[] {
    const nowISO = dayjs().toISOString();
    return db.alerts.filter(a => {
      if (filter?.severity && a.severity !== filter.severity) return false;
      if (filter?.status) {
        const active = isAlertActive(a, nowISO);
        if (filter.status === 'active' && !active) return false;
        if (filter.status === 'expired' && active) return false;
      }
      if (filter?.audience) {
        if (filter.audience === 'org' && !a.visibility.org) return false;
        if (filter.audience === 'team' && a.visibility.teams.length === 0) return false;
        if (filter.audience === 'user' && a.visibility.users.length === 0) return false;
      }
      return true;
    });
  }
}
