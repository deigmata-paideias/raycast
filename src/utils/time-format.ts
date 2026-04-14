/**
 * Time formatting utilities for Raycast Time Tools extension.
 * Provides functions for formatting time with millisecond precision.
 */

/**
 * Result of getting current time with millisecond precision.
 */
export interface TimeResult {
  /** Current Date object */
  date: Date;
  /** Unix timestamp in milliseconds */
  timestampMs: number;
  /** Unix timestamp in seconds */
  timestampSec: number;
  /** Milliseconds part (0-999) */
  milliseconds: number;
  /** Formatted time string (HH:mm:ss.SSS) */
  formatted: string;
}

/**
 * Get current time with millisecond precision.
 */
export function getCurrentTime(): TimeResult {
  const now = new Date();
  const timestampMs = now.getTime();
  const milliseconds = timestampMs % 1000;

  return {
    date: now,
    timestampMs,
    timestampSec: Math.floor(timestampMs / 1000),
    milliseconds,
    formatted: formatTimeWithMs(now, milliseconds),
  };
}

/**
 * Format time with milliseconds (HH:mm:ss.SSS).
 */
export function formatTimeWithMs(date: Date, ms?: number): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const msValue = ms ?? date.getTime() % 1000;
  const msStr = msValue.toString().padStart(3, "0");
  return `${hours}:${minutes}:${seconds}.${msStr}`;
}

/**
 * Format time without milliseconds (HH:mm:ss).
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format date string (YYYY-MM-DD).
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Chinese weekday names.
 */
const WEEKDAYS_ZH = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

/**
 * Format date with weekday (YYYY-MM-DD 星期X).
 */
export function formatDateWithWeekday(
  date: Date,
  locale: string = "zh-CN",
): string {
  const dateStr = formatDateString(date);
  const weekday =
    locale === "zh-CN"
      ? WEEKDAYS_ZH[date.getDay()]
      : date.toLocaleDateString(locale, { weekday: "long" });
  return `${dateStr} ${weekday}`;
}

/**
 * Format full date and time (YYYY-MM-DD HH:mm:ss 星期X).
 */
export function formatFullDateTime(
  date: Date,
  locale: string = "zh-CN",
): string {
  const dateStr = formatDateWithWeekday(date, locale);
  const timeStr = formatTime(date);
  return `${dateStr} ${timeStr}`;
}

/**
 * Convert timestamp to date and formatted result.
 */
export interface ConversionResult {
  /** Converted Date object */
  date: Date;
  /** Formatted full date time with weekday */
  formatted: string;
  /** ISO 8601 string */
  iso: string;
  /** Unix timestamp in seconds */
  unixSec: number;
  /** Unix timestamp in milliseconds */
  unixMs: number;
}

/**
 * Convert timestamp string to ConversionResult.
 * @param input - Timestamp string (10-digit seconds or 13-digit milliseconds)
 * @param unit - 'auto' for auto-detect, 'seconds' or 'milliseconds' for explicit
 */
export function convertTimestamp(
  input: string,
  unit: "auto" | "seconds" | "milliseconds" = "auto",
): ConversionResult | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return null;

  let ms: number;

  if (unit === "auto") {
    // Auto-detect: 10-digit = seconds, 13-digit = milliseconds
    ms = trimmed.length === 10 ? num * 1000 : num;
  } else if (unit === "seconds") {
    ms = num * 1000;
  } else {
    ms = num;
  }

  const date = new Date(ms);
  if (isNaN(date.getTime())) return null;

  return {
    date,
    formatted: formatDateWithWeekday(date) + " " + formatTime(date),
    iso: date.toISOString(),
    unixSec: Math.floor(ms / 1000),
    unixMs: ms,
  };
}
