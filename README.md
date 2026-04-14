# Time Tools - Raycast 时间工具插件

高精度时间显示插件，支持毫秒级精度、多时区显示和时间戳转换。

## 功能特性

- **实时时间显示**：毫秒级精度，默认 100ms 刷新
- **多时区支持**：支持 IANA 名称（如 `Asia/Shanghai`）和 UTC 偏移（如 `UTC+8`）
- **多种复制格式**：
  - 完整时间：`HH:mm:ss.SSS`
  - 日期 + 星期：`YYYY-MM-DD 星期X`
  - Unix 时间戳（秒/毫秒）
  - ISO 8601 字符串
- **时间戳转换**：自动识别 10 位秒/13 位毫秒时间戳

## 安装到本地 Raycast

### 方法一：开发模式（推荐用于测试）

1. 确保已安装 [Raycast](https://raycast.com) 和 Node.js 22+

2. 克隆或下载本项目到本地：
   ```bash
   cd ~/workspace/typescript/raycast
   ```

3. 安装依赖：
   ```bash
   npm install
   ```

4. 启动开发模式：
   ```bash
   npm run dev
   ```

5. 在 Raycast 中搜索 "Time Tools" 即可使用

6. 开发完成后，按 `Ctrl+C` 停止开发服务器

### 方法二：构建后安装

1. 构建插件：
   ```bash
   npm run build
   ```

2. 在 Raycast 中打开设置 → Extensions → 点击 "+" → 选择 "Import Local Extension"

3. 选择本项目目录 `/Users/shown/workspace/typescript/raycast`

### 方法三：发布到 Raycast Store（需要 Raycast 开发者账号）

1. 修改 `package.json` 中的 `author` 为你的 Raycast 用户名

2. 发布：
   ```bash
   npm run publish
   ```

## 配置偏好设置

在 Raycast 中打开插件偏好设置可配置：

- **Additional Timezones**：额外显示的时区（逗号分隔）
  - 支持 IANA 名称：`Asia/Shanghai,America/New_York,Europe/London`
  - 支持 UTC 偏移：`UTC+8,UTC-5,UTC+5:30`

- **Refresh Interval**：UI 刷新间隔（毫秒，范围 100-1000）

## 使用方式

### Show Current Time 命令

显示实时时间，支持以下操作：

| 操作 | 快捷键 |
|------|--------|
| 复制当前时间 | `Cmd+Enter` |
| 复制日期 + 星期 | `Cmd+Shift+C` |
| 复制 Unix 秒 | `Cmd+U` |
| 粘贴时间 | `Cmd+P` |

### Convert Timestamp 命令

转换时间戳为可读时间：

- 支持命令参数：在 Raycast 搜索后直接输入时间戳
- 自动识别：10 位数字 = 秒，13 位数字 = 毫秒
- 可手动指定单位（秒/毫秒）

## 项目结构

```
src/
├── index.tsx              # 主时间显示命令
├── timestamp-converter.tsx # 时间戳转换命令
└── utils/
    ├── time-format.ts     # 时间格式化函数
    ├── timezone.ts        # 时区处理（IANA + UTC 偏移）
    └── preferences.ts     # 偏好解析和校验
```

## 开发命令

```bash
npm run dev        # 启动开发模式
npm run build      # 构建插件
npm run lint       # 代码检查
npm run fix-lint   # 自动修复格式问题
```

## 许可证

MIT