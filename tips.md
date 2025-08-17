# Claude Code コマンドリファレンス

## 基本コマンド

### 起動・セッション管理
```bash
# インタラクティブセッション開始
claude

# ワンライン実行（パイプ対応）
claude -p "質問内容"

# 最新セッションを継続
claude -c
claude --continue

# 特定セッションを再開
claude -r [sessionId]
claude --resume [sessionId]

# セッション一覧表示
claude sessions

# バージョン確認
claude --version
claude -v
```

### 出力形式オプション
```bash
# テキスト出力（デフォルト）
claude -p --output-format text "質問"

# JSON出力
claude -p --output-format json "質問"

# ストリーミングJSON出力
claude -p --output-format stream-json "質問"
```

### モデル指定
```bash
# モデル指定（エイリアス）
claude --model sonnet "質問"
claude --model opus "質問"

# フルモデル名指定
claude --model claude-sonnet-4-20250514 "質問"

# フォールバックモデル設定
claude -p --fallback-model opus "質問"
```

## 権限・ツール制御

### 権限モード
```bash
# 編集を自動承認
claude --permission-mode acceptEdits

# 権限チェックをバイパス
claude --permission-mode bypassPermissions

# プランモード
claude --permission-mode plan

# デフォルト権限
claude --permission-mode default
```

### ツール制御
```bash
# 特定ツールのみ許可
claude --allowedTools "Bash(git:*) Edit"

# 特定ツールを禁止
claude --disallowedTools "Bash(git:*) Edit"

# 権限チェック完全バイパス（サンドボックス環境用）
claude --dangerously-skip-permissions
```

### ディレクトリアクセス
```bash
# 追加ディレクトリへのアクセス許可
claude --add-dir /path/to/dir1 /path/to/dir2
```

## 設定管理（config）

### 設定の取得・表示
```bash
# 全設定一覧
claude config list
claude config ls

# 特定設定値の取得
claude config get <key>

# グローバル設定の取得
claude config get -g <key>
```

### 設定の変更
```bash
# 設定値の設定
claude config set <key> <value>

# グローバル設定
claude config set -g <key> <value>

# 配列に項目追加
claude config add <key> <values...>

# 設定値の削除
claude config remove <key>
claude config rm <key>
```

### よく使う設定例
```bash
# テーマ設定
claude config set -g theme dark
claude config set -g theme light

# デバッグモード
claude config set -g debug true
```

## MCP（Model Context Protocol）管理

### MCPサーバー管理
```bash
# MCPサーバー一覧
claude mcp list

# MCPサーバー追加
claude mcp add <name> <commandOrUrl> [args...]

# JSON設定でMCPサーバー追加
claude mcp add-json <name> <json>

# MCPサーバー削除
claude mcp remove <name>

# MCPサーバー詳細取得
claude mcp get <name>

# Claude Desktopからインポート（Mac/WSL）
claude mcp add-from-claude-desktop

# プロジェクトスコープ選択リセット
claude mcp reset-project-choices
```

### MCPサーバー起動
```bash
# Claude Code MCPサーバー開始
claude mcp serve
```

### MCP設定オプション
```bash
# カスタムMCP設定ファイル使用
claude --mcp-config config1.json config2.json

# MCP設定ファイルのみ使用
claude --strict-mcp-config --mcp-config config.json

# MCPデバッグモード（非推奨、--debugを使用）
claude --mcp-debug
```

## システム管理

### 診断・更新
```bash
# システム診断
claude doctor

# アップデート確認・実行
claude update

# 特定バージョンインストール
claude install stable
claude install latest
claude install 1.0.83
```

### 認証・移行
```bash
# 長期認証トークン設定
claude setup-token

# npmグローバルからローカルに移行
claude migrate-installer
```

## 高度なオプション

### セッション管理
```bash
# 特定セッションID使用
claude --session-id <uuid>

# IDE自動接続
claude --ide
```

### システムプロンプト
```bash
# システムプロンプト追加
claude --append-system-prompt "追加指示"
```

### 設定ファイル
```bash
# 設定ファイル指定
claude --settings /path/to/settings.json
claude --settings '{"key": "value"}'
```

### デバッグ
```bash
# デバッグモード
claude -d
claude --debug

# 詳細モード
claude --verbose
```

## 入力形式
```bash
# ストリーミングJSON入力
claude -p --input-format stream-json

# テキスト入力（デフォルト）
claude -p --input-format text
```

## 使用例

### 開発ワークフロー
```bash
# プロジェクト開始
claude --add-dir ./src --permission-mode acceptEdits

# コードレビュー
claude -p "このコードをレビューして" < file.js

# Git操作付きで作業
claude --allowedTools "Bash(git:*) Edit Read"

# デバッグセッション
claude --debug --verbose
```

### 設定例
```bash
# 初期設定
claude config set -g theme dark
claude config set -g permission-mode acceptEdits
claude config add -g allowedTools "Bash(git:*)"

# MCP設定
claude mcp add filesystem npx @modelcontextprotocol/server-filesystem /path/to/project
claude mcp add github npx @modelcontextprotocol/server-github
```

## 注意事項

- `--dangerously-skip-permissions` はサンドボックス環境でのみ使用
- MCPサーバーは適切に設定してから使用
- セッションIDは有効なUUID形式である必要がある
- ツール制御はスペース区切りまたはカンマ区切りで複数指定可能
