# Guitar Chord Quiz Project

## プロジェクト概要
フレットボード上の指板位置からコード名を当てるクイズWebアプリケーション

## 技術スタック
- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript (厳密な型チェック)
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (useState, useReducer, Context API)
- **音声**: Web Audio API (ギター音合成)
- **データ永続化**: LocalStorage
- **デプロイ**: Static Export対応

## プロジェクト構造
```
guitar-chord-quiz/
├── docs/                    # ドキュメント
│   ├── requirements.md      # 機能要件
│   ├── plan.md             # 実装計画
│   ├── coding-rules.md     # コーディング規約
│   └── 00_task.md - 15_task.md  # 詳細タスク
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # Reactコンポーネント
│   │   ├── ui/            # 汎用UIコンポーネント
│   │   ├── fretboard/     # フレットボード関連
│   │   └── quiz/          # クイズ機能
│   ├── lib/               # ユーティリティ・ロジック
│   ├── hooks/             # カスタムフック
│   ├── types/             # TypeScript型定義
│   └── data/              # 静的データ
└── public/                # 静的アセット
```

## 開発フェーズ
1. **Phase 1**: 基盤構築 (Task 00-03)
2. **Phase 2**: フレットボード実装 (Task 04-06)
3. **Phase 3**: クイズ機能実装 (Task 07-11)
4. **Phase 4**: 音声・UI強化 (Task 12-14)
5. **Phase 5**: 最適化・デプロイ (Task 15)

## 重要な設計判断
- **完全クライアントサイド**: APIサーバー不要
- **レスポンシブ**: モバイル・デスクトップ両対応
- **音声合成**: 音声ファイル不使用、Web Audio APIで生成
- **PWA対応**: オフライン利用可能

## コーディング規約
- TypeScriptの厳密な型チェック
- ESLint + Prettier による品質管理
- JSDocによる詳細なドキュメント化
- 関数型プログラミングスタイル優先

## 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 静的エクスポート
npm run export

# テスト実行
npm test

# 型チェック
npm run type-check

# リント実行
npm run lint
```

## Git 運用
- main ブランチでの直接開発
- 機能ごとに commit
- コミットメッセージに Claude Code 署名
- **タスク完了時の必須手順**: `git commit` → `git push` を自動実行

## 開発環境
**作業ディレクトリ**: `guitar-chord-quiz/`
- 全てのタスク実行は`guitar-chord-quiz`フォルダ内で行う
- Next.jsプロジェクトの標準構造に準拠
- 実装ファイルは全て`guitar-chord-quiz/src/`配下に配置

## 重要な更新情報
**Apple風デザインシステム対応完了**
- design_rule.md に基づくApple HIG準拠デザイン
- WCAG 2.1 AAA完全準拠のアクセシビリティ
- 44px最小タッチターゲット、厳密なコントラスト比
- 完全キーボード操作対応、スクリーンリーダー対応

## 更新されたファイル
- `docs/plan-updated.md` - Apple風対応実装計画
- `docs/00_task_updated.md` - デザインシステム構築タスク
- `docs/05_task_updated.md` - アクセシブルフレットボードタスク

## タスク進行状況

### 完了済みタスク
✅ **Task 00** - Apple風デザインシステム構築 (完了)
- Next.js 15.4.6 + TypeScript + Tailwind CSS基盤構築
- Apple HIGに準拠したデザインシステム実装
- WCAG 2.1 AA/AAA準拠アクセシビリティ対応
- 型安全なデザイントークンシステム完成

✅ **Task 01** - プロジェクト構造作成 (完了)
- components配下のディレクトリ構造作成 (ui, fretboard, quiz)
- lib, hooks, types, dataディレクトリ作成
- 各ディレクトリにindex.tsファイル配置
- 完全なプロジェクト構造構築

✅ **Task 02** - TypeScript型定義作成 (完了)
- 包括的なTypeScript型定義システム実装 (`src/types/index.ts`)
- 主要インターフェース: ChordPattern, QuizState, GameSettings, FretboardProps
- 型ガード関数とユーティリティ型実装
- 定数定義とデフォルト値設定
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 03** - コードデータベース作成 (完了)
- 包括的なギターコードデータベース実装 (`src/data/chord-patterns.ts`)
- 初級10個、中級15個、上級10個の計35個のコードパターン定義
- 正確なフレット位置・指使い情報設定
- 包括的ユーティリティ関数群（検索・フィルタリング・統計・カポタスト対応等）
- TypeScript型安全性確保、コンパイルエラーなし確認済み

✅ **Task 04** - フレットボード計算ユーティリティ (完了)
- 包括的なフレットボード計算システム実装 (`src/lib/fretboard.ts`)
- 12平均律に基づく数学的に正確なフレット位置計算
- 弦の周波数計算と音名変換機能
- sample基準のSVG座標計算（横向きフレットボード対応）
- レスポンシブ対応（モバイル・タブレット・デスクトップ）
- カポタスト対応（フレット位置・コード名自動調整）
- バリデーション関数とユーティリティ関数群

✅ **Task 05** - アクセシブルフレットボードコンポーネント (完了)
- Apple HIG準拠の完全アクセシブルなSVGフレットボード実装
- WCAG 2.1 AAA準拠（コントラスト比7:1以上、44px最小タッチターゲット）
- 完全キーボード操作対応（矢印キー、Enter/Space、Home/End）
- スクリーンリーダー対応（適切なaria-label、role設定）
- 高コントラストモード自動検出・対応
- フォーカス管理ユーティリティ実装
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 06** - レスポンシブフレットボードコンポーネント (完了)
- 画面サイズ検出カスタムフック実装 (`src/hooks/useMediaQuery.ts`)
- レスポンシブフレットボードコンポーネント実装 (`src/components/fretboard/ResponsiveFretboard.tsx`)
- モバイル(5フレット)・タブレット(8フレット)・デスクトップ(12フレット)対応
- タッチデバイス最適化・高コントラストモード対応
- SSR対応・アクセシビリティ配慮済み
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 07** - クイズ状態管理フック (完了)
- 包括的なクイズ状態管理カスタムフック実装 (`src/hooks/useQuizState.ts`)
- ゲーム進行制御（開始・一時停止・再開・リセット・難易度変更）
- 高度なスコア計算システム（時間ボーナス・ストリークボーナス・ヒントペナルティ）
- ローカルストレージ連携（状態保存・復元・設定管理）
- 統計情報計算（正答率・平均時間・総合成績）
- 型定義拡張（QuizState・GameStatistics追加）
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 08** - ローカルストレージ管理フック (完了)
- 汎用LocalStorageフック実装 (`src/hooks/useLocalStorage.ts`)
- ゲーム設定管理フック（難易度・音声・カポ・テーマ）
- スコア履歴管理フック（記録保存・統計計算・データ管理）
- ユーザー設定管理フック（UIプリファレンス）
- SSR対応・型安全性確保・エラーハンドリング完備
- タブ間同期・データエクスポート/インポート対応
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 09** - 回答入力コンポーネント (完了)
- レスポンシブ回答入力コンポーネント実装 (`src/components/quiz/AnswerInput.tsx`)
- モバイル向けボタン型入力（グリッド表示・ページネーション・検索機能）
- デスクトップ向けドロップダウン入力（自動補完・キーボードナビゲーション）
- 高度な入力補完機能（完全一致・前方一致・部分一致の優先順位）
- Apple HIG準拠アクセシビリティ（44px最小タッチターゲット・WAI-ARIA）
- キーボード操作対応（Enter・矢印キー・Tab・Escape）
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 10** - メインクイズゲームコンポーネント (完了)
- 統合クイズゲームコンポーネント実装 (`src/components/quiz/QuizGame.tsx`)
- ゲーム全体統括（フレットボード・回答入力・スコア管理統合）
- レスポンシブゲーム進行制御（開始・一時停止・終了・スキップ）
- リアルタイムスコア表示（正答率・連続正解・経過時間・ヒント使用数）
- 高度な結果表示・フィードバック（正解/不正解・詳細情報・連続ボーナス）
- ヒント機能（段階的ヒント・使用制限・視覚的フィードバック）
- デバッグモード・アクセシビリティ対応
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 11** - インタラクティブ回答モード・メインページ統合完了 (完了)
- レスポンシブ回答入力コンポーネント統合 (`src/components/quiz/AnswerInput.tsx`)
- メインページ統合・ナビゲーション実装
- インタラクティブ回答モード実装（モバイル・デスクトップ対応）
- ユーザーエクスペリエンス最適化
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 12** - Web Audio API音声生成システム・音響フィードバック完了 (完了)
- Web Audio API包括的音声合成システム実装 (`src/lib/audio.ts`, `src/hooks/useAudio.ts`)
- リアルタイム音響フィードバック実装
- AudioVisualizerコンポーネント実装 (`src/components/ui/AudioVisualizer.tsx`)
- 弦別音声生成・コード再生機能
- 音量制御・エフェクト音システム
- パフォーマンス最適化・メモリ効率実装
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 13** - UI強化・アニメーション実装完了 (完了)
- FeedbackAnimationコンポーネント実装 (`src/components/ui/FeedbackAnimation.tsx`)
- LoadingSpinnerコンポーネント実装 (`src/components/ui/LoadingSpinner.tsx`)
- Web Animations APIライブラリ実装 (`src/lib/animations.ts`)
- globals.css大幅拡張（20+種類のCSSアニメーション追加）
- QuizGameコンポーネントアニメーション完全統合
- リアルタイム視覚フィードバック（成功/エラー）
- スムーズスコアカウントアップ・ストリーク視覚化
- ポイント獲得フローティング表示・ヒントアニメーション
- WCAG 2.1 AAA accessibility完全準拠（reduced-motion対応）
- パフォーマンス最適化（60fps維持、メモリ効率実装）
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 14** - 設定・カスタマイズ機能実装完了 (完了)
- 設定画面コンポーネント実装 (`src/components/settings/SettingsPanel.tsx`)
- ユーザープリファレンス管理システム実装
- テーマ・難易度・音声・カポタスト設定カスタマイズ
- データエクスポート/インポート機能実装
- 設定値検証・デフォルト値復元機能
- アクセシビリティ対応設定画面
- TypeScriptコンパイルエラーなし確認済み

✅ **Task 15** - テスト・最適化・デプロイ準備完了 (完了)
- Playwright E2Eテストスイート実装 (`tests/`)
- GitHub Actions CI/CDパイプライン構築 (`.github/workflows/`)
- パフォーマンス最適化・バンドルサイズ最適化
- 静的エクスポート対応・デプロイ設定完了
- 包括的テストカバレッジ（Unit・Integration・E2E）
- プロダクション環境対応・品質保証完了
- ドキュメント整備・デプロイガイド作成

### プロジェクト進捗状況
- **完了**: 16/16 タスク（**100%**）
- **ステータス**: 🎉 **全タスク完了** 🎉
- **現在フェーズ**: Phase 5完了 → **プロジェクト完成**

## セッションログ自動記録ルール

### 必須実装事項
Claude Codeは**すべての会話ターン**で以下を実行する：

1. **ユーザー入力検出時**
   - `./log/YYYYMMDD.log`にタイムスタンプ付きでユーザー入力を記録
   - 形式: `[HH:MM:SS] [USER] ユーザーの入力内容`

2. **Claude応答完了時**
   - 主要な作業内容を要約してログに記録
   - Tool callsがある場合は使用ツール名も記録
   - 形式: `[HH:MM:SS] [CLAUDE] 応答要約`

3. **ファイル操作時**
   - ファイル作成・更新時は詳細情報を記録
   - 形式: `[HH:MM:SS] [FILE_CREATED/FILE_UPDATED] Path: ファイルパス, Description: 説明`

4. **タスク状態変更時**
   - TodoWrite使用時はタスク状態変更を記録
   - 形式: `[HH:MM:SS] [TASK_UPDATE] Task ID: X, Content: "内容", Status: 変更内容`

### ログ形式仕様
- ファイル名: `./log/YYYYMMDD.log`
- タイムスタンプ: `[HH:MM:SS]` 24時間制
- エンコーディング: UTF-8
- 詳細仕様: `docs/log-format-rules.md` 参照

### 自動化要件
- **各会話ターン後に必ず実行**: ユーザーとClaude間のやりとりは漏れなく記録
- **リアルタイム更新**: 応答完了と同時にログ更新
- **エラー時の継続**: ログ書き込み失敗時も処理を継続
- **一貫性確保**: タイムスタンプの正確性とフォーマット統一

### 実装ステータス
✅ ログ形式仕様策定完了 (`docs/log-format-rules.md`)  
✅ 手動ログ記録実装済み (`./log/20250817.log`)  
🔄 **次回から自動ログ記録開始** - 本ルール追加後のすべての会話で自動実行