/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Additional Timezones - 配置额外显示的时区（支持 IANA 名称如 Asia/Shanghai 或 UTC 偏移如 UTC+8，多个用逗号分隔） */
  "additionalTimezones": string,
  /** Refresh Interval - UI 刷新间隔（毫秒，范围 100-1000） */
  "refreshInterval": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `index` command */
  export type Index = ExtensionPreferences & {}
  /** Preferences accessible in the `timestamp-converter` command */
  export type TimestampConverter = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `index` command */
  export type Index = {}
  /** Arguments passed to the `timestamp-converter` command */
  export type TimestampConverter = {
  /** 输入时间戳（10位秒或13位毫秒） */
  "timestamp": string
}
}

