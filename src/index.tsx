import {
  List,
  ActionPanel,
  Action,
  Icon,
  showToast,
  Toast,
  getPreferenceValues,
} from "@raycast/api";
import { useState, useEffect } from "react";
import {
  getCurrentTime,
  formatDateWithWeekday,
  formatDateString,
  TimeResult,
} from "./utils/time-format";
import { formatTimeInZone, TimeZoneInfo } from "./utils/timezone";
import { parsePreferences } from "./utils/preferences";

/**
 * Preferences type for Raycast.
 */
interface Preferences {
  additionalTimezones: string;
  refreshInterval: string;
}

/**
 * Main command: Show current time with millisecond precision.
 */
export default function ShowCurrentTime() {
  // Get and parse preferences
  const rawPrefs = getPreferenceValues<Preferences>();
  const parsedPrefs = parsePreferences(rawPrefs);

  // State for current time
  const [timeState, setTimeState] = useState<TimeResult>(() =>
    getCurrentTime(),
  );

  // Real-time update effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeState(getCurrentTime());
    }, parsedPrefs.refreshIntervalMs);

    return () => clearInterval(interval);
  }, [parsedPrefs.refreshIntervalMs]);

  // Show errors as toast if any
  useEffect(() => {
    if (parsedPrefs.errors.length > 0) {
      showToast({
        style: Toast.Style.Failure,
        title: "配置警告",
        message: parsedPrefs.errors.join("; "),
      });
    }
  }, []);

  // Format values
  const formattedTime = timeState.formatted;
  const formattedDate = formatDateWithWeekday(timeState.date);
  const isoString = timeState.date.toISOString();

  /**
   * Action that copies the current moment (not the rendered state).
   */
  const CopyCurrentTimeAction = ({
    title,
    format,
  }: {
    title: string;
    format: "full" | "date-weekday" | "iso" | "unix-sec" | "unix-ms";
  }) => {
    const getContent = (): string => {
      const now = getCurrentTime();
      switch (format) {
        case "full":
          return now.formatted;
        case "date-weekday":
          return formatDateWithWeekday(now.date);
        case "iso":
          return now.date.toISOString();
        case "unix-sec":
          return String(now.timestampSec);
        case "unix-ms":
          return String(now.timestampMs);
        default:
          return now.formatted;
      }
    };

    return <Action.CopyToClipboard title={title} content={getContent()} />;
  };

  return (
    <List navigationTitle="Time Tools" searchBarPlaceholder="Current time...">
      {/* Section 1: Local Current Time */}
      <List.Section title="Current Time (Local)">
        <List.Item
          id="main-time"
          title={formattedTime}
          subtitle={formatDateString(timeState.date)}
          accessories={[{ text: `Unix: ${timeState.timestampSec}` }]}
          icon={Icon.Clock}
          actions={
            <ActionPanel title="Time Actions">
              <CopyCurrentTimeAction title="Copy Current Time" format="full" />
              <CopyCurrentTimeAction
                title="Copy Date + Weekday"
                format="date-weekday"
              />
              <CopyCurrentTimeAction
                title="Copy Unix Timestamp (Seconds)"
                format="unix-sec"
              />
              <CopyCurrentTimeAction
                title="Copy Unix Timestamp (Milliseconds)"
                format="unix-ms"
              />
              <CopyCurrentTimeAction title="Copy ISO String" format="iso" />
              <Action.Paste
                title="Paste Current Time"
                content={getCurrentTime().formatted}
              />
            </ActionPanel>
          }
        />
        <List.Item
          id="unix-seconds"
          title={`Unix (seconds): ${timeState.timestampSec}`}
          subtitle="Seconds since 1970-01-01"
          accessories={[{ tag: { value: "s", color: "#3498db" } }]}
          icon={Icon.Code}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy Unix Timestamp (Seconds)"
                content={String(timeState.timestampSec)}
              />
              <Action.CopyToClipboard
                title="Copy Unix Timestamp (Milliseconds)"
                content={String(timeState.timestampMs)}
              />
            </ActionPanel>
          }
        />
        <List.Item
          id="unix-milliseconds"
          title={`Unix (milliseconds): ${timeState.timestampMs}`}
          subtitle="Milliseconds since 1970-01-01"
          accessories={[{ tag: { value: "ms", color: "#e74c3c" } }]}
          icon={Icon.Code}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy Unix Timestamp (Milliseconds)"
                content={String(timeState.timestampMs)}
              />
            </ActionPanel>
          }
        />
        <List.Item
          id="iso-string"
          title={isoString}
          subtitle="ISO 8601 format"
          icon={Icon.Document}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy ISO String"
                content={isoString}
              />
            </ActionPanel>
          }
        />
        <List.Item
          id="date-weekday"
          title={formattedDate}
          subtitle="Date with weekday"
          icon={Icon.Calendar}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard
                title="Copy Date + Weekday"
                content={formattedDate}
              />
            </ActionPanel>
          }
        />
      </List.Section>

      {/* Section 2: Additional Timezones */}
      {parsedPrefs.timezones.length > 0 && (
        <List.Section title="Additional Timezones">
          {parsedPrefs.timezones.map((tz: TimeZoneInfo) => {
            const tzTime = formatTimeInZone(timeState.date, tz);
            return (
              <List.Item
                key={tz.id}
                id={`timezone-${tz.id}`}
                title={tzTime}
                subtitle={tz.name}
                accessories={[{ text: tz.type === "iana" ? "IANA" : "Offset" }]}
                icon={Icon.Globe}
                actions={
                  <ActionPanel title={`${tz.name} Time Actions`}>
                    <Action.CopyToClipboard
                      title={`Copy ${tz.name} Time`}
                      content={formatTimeInZone(getCurrentTime().date, tz)}
                    />
                    <Action.CopyToClipboard
                      title={`Copy ${tz.name} Timezone`}
                      content={tz.value}
                    />
                  </ActionPanel>
                }
              />
            );
          })}
        </List.Section>
      )}
    </List>
  );
}
