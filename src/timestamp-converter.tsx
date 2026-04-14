import {
  Form,
  ActionPanel,
  Action,
  Icon,
  showToast,
  Toast,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { convertTimestamp, ConversionResult } from "./utils/time-format";

/**
 * Arguments passed from Raycast command.
 */
interface Arguments {
  timestamp?: string;
}

/**
 * Timestamp converter command.
 * Converts Unix timestamp (seconds or milliseconds) to readable date/time.
 */
export default function TimestampConverter(props: { arguments?: Arguments }) {
  // Get initial timestamp from arguments
  const initialTimestamp = props.arguments?.timestamp ?? "";

  // Form state
  const [timestamp, setTimestamp] = useState<string>(initialTimestamp);
  const [unit, setUnit] = useState<string>("auto");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-convert when timestamp changes (if auto mode)
  useEffect(() => {
    if (unit === "auto" && timestamp.trim()) {
      handleConvert();
    }
  }, [timestamp, unit]);

  /**
   * Handle conversion.
   */
  function handleConvert(): void {
    setError(null);
    setResult(null);

    const trimmed = timestamp.trim();
    if (!trimmed) {
      return;
    }

    const converted = convertTimestamp(
      trimmed,
      unit as "auto" | "seconds" | "milliseconds",
    );

    if (converted === null) {
      setError("无效的时间戳格式");
      showToast({
        style: Toast.Style.Failure,
        title: "转换失败",
        message: "请输入有效的数字时间戳",
      });
      return;
    }

    setResult(converted);
    showToast({
      style: Toast.Style.Success,
      title: "转换成功",
      message: converted.formatted,
    });
  }

  /**
   * Handle form submission.
   */
  function handleSubmit(values: { timestamp: string; unit: string }): void {
    setTimestamp(values.timestamp);
    setUnit(values.unit);
    handleConvert();
  }

  return (
    <Form
      navigationTitle="Timestamp Converter"
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Convert Timestamp"
            onSubmit={handleSubmit}
            icon={Icon.ArrowRight}
          />
          {result && (
            <>
              <Action.CopyToClipboard
                title="Copy Converted Time"
                content={result.formatted}
              />
              <Action.CopyToClipboard
                title="Copy ISO String"
                content={result.iso}
              />
              <Action.CopyToClipboard
                title="Copy Unix Timestamp (Seconds)"
                content={String(result.unixSec)}
              />
              <Action.CopyToClipboard
                title="Copy Unix Timestamp (Milliseconds)"
                content={String(result.unixMs)}
              />
              <Action.Paste
                title="Paste Converted Time"
                content={result.formatted}
              />
            </>
          )}
        </ActionPanel>
      }
    >
      <Form.TextField
        id="timestamp"
        title="Timestamp"
        placeholder="输入时间戳（如 1704067200）"
        value={timestamp}
        onChange={setTimestamp}
      />

      <Form.Dropdown id="unit" title="Unit" value={unit} onChange={setUnit}>
        <Form.Dropdown.Item
          title="Auto Detect (10位=秒, 13位=毫秒)"
          value="auto"
        />
        <Form.Dropdown.Item title="Seconds (秒)" value="seconds" />
        <Form.Dropdown.Item title="Milliseconds (毫秒)" value="milliseconds" />
      </Form.Dropdown>

      {error && <Form.Description title="Error" text={`❌ ${error}`} />}

      {result && (
        <>
          <Form.Separator />
          <Form.Description title="Conversion Result" text="" />
          <Form.Description text={`📅 ${result.formatted}`} />
          <Form.Description text={`🌐 ${result.iso}`} />
          <Form.Description text={`⏱️ Unix (s): ${result.unixSec}`} />
          <Form.Description text={`⏱️ Unix (ms): ${result.unixMs}`} />
        </>
      )}
    </Form>
  );
}
