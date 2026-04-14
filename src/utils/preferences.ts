/**
 * Preferences parsing and validation utilities.
 */

import { TimeZoneInfo, parseTimezones } from "./timezone";

/**
 * Raw preferences from Raycast getPreferenceValues.
 */
export interface RawPreferences {
  additionalTimezones: string;
  refreshInterval: string;
}

/**
 * Parsed and validated preferences.
 */
export interface ParsedPreferences {
  /** Valid timezone list */
  timezones: TimeZoneInfo[];
  /** Refresh interval in ms (clamped to 100-1000) */
  refreshIntervalMs: number;
  /** Parsing error messages */
  errors: string[];
}

/**
 * Parse and validate preferences.
 */
export function parsePreferences(raw: RawPreferences): ParsedPreferences {
  const errors: string[] = [];

  // Parse refresh interval
  let refreshIntervalMs = 100;
  const intervalNum = parseInt(raw.refreshInterval, 10);

  if (isNaN(intervalNum) || intervalNum < 100) {
    refreshIntervalMs = 100;
    if (raw.refreshInterval.trim()) {
      errors.push("刷新间隔无效，使用默认值 100ms");
    }
  } else if (intervalNum > 1000) {
    refreshIntervalMs = 1000;
    errors.push("刷新间隔过大，限制为 1000ms");
  } else {
    refreshIntervalMs = intervalNum;
  }

  // Parse timezones
  const timezones = parseTimezones(raw.additionalTimezones);

  // Check for invalid timezones in input
  const tzStrings = raw.additionalTimezones
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
  if (tzStrings.length > timezones.length) {
    // Some timezones were invalid
    for (const tzStr of tzStrings) {
      const tz = parseTimezones(tzStr);
      if (tz.length === 0 && tzStr) {
        errors.push(`无效时区: ${tzStr}`);
      }
    }
  }

  return {
    timezones,
    refreshIntervalMs,
    errors,
  };
}

/**
 * Re-export parseTimezones for convenience.
 */
export { parseTimezones } from "./timezone";
