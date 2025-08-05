# セッションログ形式規約

## 目的
Claude Codeとのセッション履歴を構造化された形式で記録し、後の参照・学習・引き継ぎに活用する。

## ファイル命名規則
```
./log/YYYYMMDD.log
```
- **YYYY**: 4桁年
- **MM**: 2桁月（ゼロパディング）
- **DD**: 2桁日（ゼロパディング）

例: `./log/20250805.log`

## ログ形式仕様

### 基本構造
```
=== Guitar Chord Quiz Project Session Log ===
Session Date: YYYY-MM-DD
Project: Guitar Chord Quiz Web Application
Claude Model: claude-sonnet-4-20250514

[HH:MM:SS] [USER] ユーザーの入力内容

[HH:MM:SS] [CLAUDE] Claude の応答内容
- Tool calls がある場合は記録
- 主要な作業内容を要約

[HH:MM:SS] [TASK_UPDATE] タスク状態変更
- ToDo 更新内容

[HH:MM:SS] [FILE_CREATED] ファイル作成
- 作成されたファイル名とパス

[HH:MM:SS] [FILE_UPDATED] ファイル更新
- 更新されたファイル名とパス

[HH:MM:SS] [GIT_COMMIT] Git操作
- コミット内容・プッシュ結果

=== Session Summary ===
- 主要な成果
- 作成・更新されたファイル一覧
- 次のセッションに向けた注意事項
```

### エントリ種別

#### [USER] - ユーザー入力
```
[14:30:15] [USER] ギターのフレットの押弦位置からコードを当てるクイズのwebアプリを作りたいです。いくつか必要な機能を提案して
```

#### [CLAUDE] - Claude応答
```
[14:30:45] [CLAUDE] ギターのフレット押弦位置からコードを当てるクイズWebアプリの機能を提案します：

## 基本機能
- フレットボード表示: 視覚的なギターネック（6弦×12フレット程度）
- 押弦位置表示: ドットでフレット位置を表示
- コード入力: プルダウンまたは入力フィールド
- 正解判定: 即座のフィードバック表示

## 追加機能案
- 難易度選択: 初級（基本コード）、中級（バレーコード）、上級（複雑なコード）
- スコア機能: 連続正解数、正答率の記録
...

Tool calls:
- Write: docs/requirements.md (機能要件定義書作成)
```

#### [TASK_UPDATE] - タスク状態更新
```
[14:35:20] [TASK_UPDATE] Todo状態変更
- Task ID: 1
- Content: "Create ./docs/requirements.md with guitar chord quiz web app features"
- Status: completed (was: in_progress)
- Priority: high
```

#### [FILE_CREATED] - ファイル作成
```
[14:32:10] [FILE_CREATED] 新規ファイル作成
- Path: ./docs/requirements.md
- Size: 3,247 bytes
- Description: ギターコードクイズWebアプリの機能要件定義書
```

#### [FILE_UPDATED] - ファイル更新
```
[15:45:22] [FILE_UPDATED] ファイル更新
- Path: ./CLAUDE.md
- Description: Apple風デザインシステム対応の重要更新情報を追加
- Changes: +12 lines, -2 lines
```

#### [GIT_COMMIT] - Git操作
```
[16:20:35] [GIT_COMMIT] Git操作実行
- Action: commit + push
- Files: 5 files changed, 1450 insertions(+), 2 deletions(-)
- Commit: "Update implementation plan for Apple-style design system"
- Remote: https://github.com/T-9999-K/guitar-quiz-app.git
- Status: SUCCESS
```

#### [SYSTEM] - システム情報・エラー
```
[16:25:10] [SYSTEM] システム情報
- Working Directory: C:\development\work\claude-sand
- Git Status: On branch main, up to date with origin/main
- Next.js Version: Not yet initialized
```

### セッション要約形式
```
=== Session Summary ===
Duration: 2h 15m
Main Achievements:
- ✅ プロジェクト要件定義完了（requirements.md）
- ✅ 詳細実装計画策定（plan.md + 16タスクファイル）
- ✅ Apple風デザインシステム設計（design_rule.md準拠）
- ✅ TypeScriptコーディング規約策定（coding-rules.md）
- ✅ 開発環境設定（ESLint, Prettier, VSCode）

Files Created/Updated:
- docs/requirements.md (NEW)
- docs/plan.md (NEW)
- docs/coding-rules.md (NEW)
- docs/00_task.md - 15_task.md (NEW, 16 files)
- docs/plan-updated.md (NEW)
- docs/00_task_updated.md (NEW)
- docs/05_task_updated.md (NEW)
- CLAUDE.md (UPDATED)
- .eslintrc.json (NEW)
- .prettierrc (NEW)
- .vscode/settings.json (NEW)

Git Operations:
- 3 commits, 24 files added/modified
- Repository: https://github.com/T-9999-K/guitar-quiz-app.git

Next Session TODO:
- Task 00: Apple風デザインシステム構築（Next.jsプロジェクト作成）
- デザインシステムの実装とテスト
- アクセシビリティ基盤の構築

Current Status:
- Project Phase: Phase 1 - 基盤構築
- Progress: 計画完了、実装開始準備完了
- Quality Target: Apple HIG準拠 + WCAG 2.1 AAA
```

## ログ記録ルール

### リアルタイム更新ルール
**重要**: Claude Codeは各会話ターンの後に必ずログファイルを更新する

#### 更新タイミング
1. **ユーザー入力後**: [USER]エントリを即座に追記
2. **Claude応答完了後**: [CLAUDE]エントリを即座に追記
3. **Tool実行後**: 対応するエントリ（[FILE_CREATED], [GIT_COMMIT]等）を追記
4. **セッション終了時**: [SESSION_SUMMARY]を追記

#### 更新方法
```bash
# ログファイルが存在しない場合は新規作成
# 存在する場合は末尾に追記（append mode）
echo "[$(date +%H:%M:%S)] [USER] ユーザー入力内容" >> ./log/$(date +%Y%m%d).log
echo "[$(date +%H:%M:%S)] [CLAUDE] Claude応答内容" >> ./log/$(date +%Y%m%d).log
```

#### 必須実装事項
- **自動化**: ユーザー・Claude間の各やりとりで自動ログ追記
- **即時性**: 応答完了と同時にログ更新
- **整合性**: タイムスタンプの正確性確保
- **耐障害性**: ログ書き込み失敗時の適切な処理

### 必須記録項目
1. **ユーザーの全入力**: 質問・指示・フィードバック
2. **Claudeの主要応答**: 提案・説明・作業内容
3. **Tool calls**: 実行されたツールと結果
4. **ファイル操作**: 作成・更新・削除
5. **Git操作**: コミット・プッシュ・ブランチ操作
6. **タスク状態変更**: Todo管理の更新

### 省略可能項目
- システムリマインダー（system-reminder）
- 詳細なエラー出力（要点のみ記録）
- 冗長な確認メッセージ

### ログ更新の実装例
```typescript
// Claude Code内部での自動ログ更新
const updateLog = (type: 'USER' | 'CLAUDE', content: string) => {
  const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false });
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const logEntry = `[${timestamp}] [${type}] ${content}\n`;
  
  // ログファイルに追記
  appendToFile(`./log/${date}.log`, logEntry);
};

// 使用例
updateLog('USER', 'ギターのフレットの押弦位置からコードを当てるクイズのwebアプリを作りたいです');
updateLog('CLAUDE', '機能提案: フレットボード表示、コード入力、正解判定等を実装予定');
```

### 時刻記録
- **形式**: [HH:MM:SS] 24時間制
- **タイムゾーン**: セッション開始地域の現地時間
- **精度**: 秒単位

### 文字エンコーディング
- **UTF-8 BOM無し**
- **改行コード**: LF（\n）
- **インデント**: スペース2個

### ファイルサイズ制限
- **1日あたり最大**: 10MB
- **超過時の対応**: 新しいファイル（YYYYMMDD_02.log）に分割

## ログの活用方法

### 引き継ぎ時
1. 前回セッションの要約を確認
2. 未完了タスクの特定
3. 作業コンテキストの復元

### 学習・改善
1. 作業効率の分析
2. エラーパターンの特定
3. ベストプラクティスの抽出

### プロジェクト管理
1. 進捗状況の追跡
2. 作業時間の把握
3. 成果物の一覧化

## 運用ルール

### Claude Code実装要件
以下の動作を各会話ターンで実行する：

1. **ユーザー入力検出時**
   ```bash
   echo "[$(date +%H:%M:%S)] [USER] ${user_input}" >> ./log/$(date +%Y%m%d).log
   ```

2. **Claude応答完了時**
   ```bash
   echo "[$(date +%H:%M:%S)] [CLAUDE] ${claude_response_summary}" >> ./log/$(date +%Y%m%d).log
   ```

3. **Tool実行時**
   ```bash
   echo "[$(date +%H:%M:%S)] [TOOL_CALL] ${tool_name}: ${tool_description}" >> ./log/$(date +%Y%m%d).log
   ```

4. **ファイル操作時**
   ```bash
   echo "[$(date +%H:%M:%S)] [FILE_CREATED] ${file_path}" >> ./log/$(date +%Y%m%d).log
   echo "[$(date +%H:%M:%S)] [FILE_UPDATED] ${file_path}" >> ./log/$(date +%Y%m%d).log
   ```

### 必須チェック項目
- [ ] ログディレクトリ`./log/`の存在確認
- [ ] 当日ログファイルの初期化（セッション開始時）
- [ ] 各ターン後のログ更新実行
- [ ] エラー時の適切なフォールバック処理
- [ ] セッション終了時の要約追記

### エラーハンドリング
```bash
# ログ書き込みエラー時の処理例
log_entry="[$(date +%H:%M:%S)] [USER] ${user_input}"
echo "$log_entry" >> "./log/$(date +%Y%m%d).log" 2>/dev/null || {
    echo "LOG_ERROR: Failed to write to log file at $(date)"
    # フォールバック: 一時ファイルに保存
    echo "$log_entry" >> "/tmp/claude_session_backup.log"
}
```

## メンテナンス

### ログローテーション
- **保存期間**: 30日
- **アーカイブ**: ./log/archive/ に移動
- **圧縮**: gzip形式で保存

### バックアップ
- **頻度**: 毎セッション終了時
- **場所**: Git リポジトリに含める
- **除外対象**: 一時ファイル、機密情報

## セキュリティ

### 機密情報の扱い
1. **APIキー・パスワード**: [REDACTED] で置換
2. **個人情報**: 匿名化または削除
3. **システムパス**: 相対パスに変換

### アクセス制御
- **読み取り**: プロジェクトメンバーのみ
- **書き込み**: Claude Code セッションのみ
- **削除**: プロジェクトオーナーのみ