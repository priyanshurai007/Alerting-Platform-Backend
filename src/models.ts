import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/* ------------------------------ ENUM TYPES ------------------------------ */
export type Severity = 'Info' | 'Warning' | 'Critical';
export type DeliveryType = 'InApp' | 'Email' | 'SMS';

/* ------------------------------ CORE MODELS ------------------------------ */
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
  org: boolean;          // true = visible to everyone
  teams: string[];       // team ids
  users: string[];       // user ids
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  deliveryType: DeliveryType;
  startAt?: string | null;           // ISO date/time string
  expiresAt?: string | null;         // ISO date/time string
  reminderFrequencyMinutes: number;  // e.g. 120 minutes (2 hours)
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
  deliveredAt: string; // ISO timestamp
}

export interface UserAlertState {
  userId: string;
  alertId: string;
  read: boolean;
  readAt?: string | null;            // When marked as read
  snoozedUntilDate?: string | null;  // e.g. "2025-10-06" (resets daily)
  snoozedHistory?: string[];         // Dates when snoozed
  lastNotifiedAt?: string | null;    // ISO of last notification
}

/* ------------------------------ LOGIC HELPERS ------------------------------ */
/**
 * Determines whether an alert is currently "active"
 * based on startAt, expiresAt, and archive status.
 *
 * Fixes timezone mismatch (UTC vs local).
 */
export function isAlertActive(a: Alert, nowISO: string): boolean {
  if (a.archived) return false;

  // Use local timezone for accurate comparison (default: Asia/Kolkata)
  const tz = process.env.TZ || 'Asia/Kolkata';
  const now = dayjs(nowISO).tz(tz);
  const starts = a.startAt ? dayjs(a.startAt).tz(tz) : null;
  const ends = a.expiresAt ? dayjs(a.expiresAt).tz(tz) : null;

  if (starts && now.isBefore(starts)) return false;  // Not started yet
  if (ends && now.isAfter(ends)) return false;        // Already expired
  return true;
}
