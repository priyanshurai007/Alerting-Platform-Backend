import dayjs from 'dayjs';

export type Severity = 'Info' | 'Warning' | 'Critical';
export type DeliveryType = 'InApp' | 'Email' | 'SMS';

export interface Team {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  teamId?: string;
}

export interface AlertVisibility {
  org: boolean;
  teams: string[]; // team ids
  users: string[]; // user ids
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  deliveryType: DeliveryType;
  startAt?: string | null;     // ISO
  expiresAt?: string | null;   // ISO
  reminderFrequencyMinutes: number; // default 120
  remindersEnabled: boolean;
  archived: boolean;
  visibility: AlertVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDelivery {
  id: string;
  alertId: string;
  userId: string;
  channel: DeliveryType;
  deliveredAt: string; // ISO
}

export interface UserAlertState {
  userId: string;
  alertId: string;
  read: boolean;
  // snoozedUntilDate: 'YYYY-MM-DD' when snoozed; only valid for that day
  snoozedUntilDate?: string | null;
  lastNotifiedAt?: string | null; // ISO of last reminder
}

export function isAlertActive(a: Alert, nowISO: string): boolean {
  if (a.archived) return false;
  const now = dayjs(nowISO);
  if (a.startAt && now.isBefore(dayjs(a.startAt))) return false;
  if (a.expiresAt && now.isAfter(dayjs(a.expiresAt))) return false;
  return true;
}
