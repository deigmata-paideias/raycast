/**
 * Timezone utilities for Raycast Time Tools extension.
 * Supports both IANA timezone names and UTC offset formats.
 */

import { formatTime } from "./time-format";

/**
 * Timezone information.
 */
export interface TimeZoneInfo {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Type: 'iana' for IANA name, 'offset' for UTC offset */
  type: "iana" | "offset";
  /** IANA name or offset string */
  value: string;
  /** Offset minutes from UTC (only for offset type) */
  offsetMinutes?: number;
}

/**
 * Parse a timezone string into TimeZoneInfo.
 * Supports:
 * - IANA names: Asia/Shanghai, America/New_York, Europe/London
 * - UTC offsets: UTC+8, UTC-5, UTC+5:30
 *
 * @param input - Timezone string
 * @returns TimeZoneInfo or null if invalid
 */
export function parseTimezoneString(input: string): TimeZoneInfo | null {
  const trimmed = input.trim();

  // Check UTC offset format: UTC+8, UTC-5:30, UTC+0
  const offsetMatch = trimmed.match(/^UTC([+-])(\d{1,2})(:?(\d{2}))?$/i);
  if (offsetMatch) {
    const sign = offsetMatch[1] === "+" ? 1 : -1;
    const hours = parseInt(offsetMatch[2], 10);
    const minutes = offsetMatch[4] ? parseInt(offsetMatch[4], 10) : 0;

    // Validate ranges
    if (hours > 14 || minutes > 59) return null;

    const offsetMinutes = sign * (hours * 60 + minutes);
    return {
      id: `offset-${offsetMinutes}`,
      name: trimmed.toUpperCase(),
      type: "offset",
      value: trimmed,
      offsetMinutes,
    };
  }

  // Assume IANA timezone name, validate with Intl.DateTimeFormat
  try {
    // Test if the timezone is valid
    new Intl.DateTimeFormat("en", { timeZone: trimmed });
    return {
      id: `iana-${trimmed}`,
      name: trimmed,
      type: "iana",
      value: trimmed,
    };
  } catch {
    return null;
  }
}

/**
 * Parse multiple timezone strings separated by comma.
 */
export function parseTimezones(input: string): TimeZoneInfo[] {
  if (!input || !input.trim()) return [];

  const parts = input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  const results: TimeZoneInfo[] = [];

  for (const part of parts) {
    const tz = parseTimezoneString(part);
    if (tz) {
      results.push(tz);
    }
  }

  return results;
}

/**
 * Format time in a specific timezone.
 * @param date - Reference date (local time)
 * @param tz - TimeZoneInfo
 * @returns Formatted time string (HH:mm:ss)
 */
export function formatTimeInZone(date: Date, tz: TimeZoneInfo): string {
  if (tz.type === "iana") {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: tz.value,
      hour12: false,
    });
    return formatter.format(date);
  } else {
    // UTC offset calculation
    const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
    const targetMs = utcMs + (tz.offsetMinutes ?? 0) * 60000;
    const targetDate = new Date(targetMs);
    return formatTime(targetDate);
  }
}

/**
 * Format full date and time in a specific timezone.
 */
export function formatDateTimeInZone(date: Date, tz: TimeZoneInfo): string {
  if (tz.type === "iana") {
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: tz.value,
      hour12: false,
    });
    return formatter.format(date);
  } else {
    // UTC offset calculation
    const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
    const targetMs = utcMs + (tz.offsetMinutes ?? 0) * 60000;
    const targetDate = new Date(targetMs);
    const year = targetDate.getFullYear();
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const day = targetDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${formatTime(targetDate)}`;
  }
}

/**
 * Get the current time in a specific timezone.
 */
export function getCurrentTimeInZone(tz: TimeZoneInfo): Date {
  const now = new Date();
  if (tz.type === "iana") {
    // For IANA, we can't easily get a Date object in that zone
    // Return the local date but format it using the zone
    return now;
  } else {
    // UTC offset calculation
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const targetMs = utcMs + (tz.offsetMinutes ?? 0) * 60000;
    return new Date(targetMs);
  }
}

/**
 * Common timezone presets for quick access.
 */
export const COMMON_TIMEZONES: TimeZoneInfo[] = [
  {
    id: "iana-Asia/Shanghai",
    name: "Asia/Shanghai",
    type: "iana",
    value: "Asia/Shanghai",
  },
  {
    id: "iana-America/New_York",
    name: "America/New_York",
    type: "iana",
    value: "America/New_York",
  },
  {
    id: "iana-Europe/London",
    name: "Europe/London",
    type: "iana",
    value: "Europe/London",
  },
  { id: "iana-UTC", name: "UTC", type: "iana", value: "UTC" },
  {
    id: "offset-8",
    name: "UTC+8",
    type: "offset",
    value: "UTC+8",
    offsetMinutes: 480,
  },
  {
    id: "offset--5",
    name: "UTC-5",
    type: "offset",
    value: "UTC-5",
    offsetMinutes: -300,
  },
];
