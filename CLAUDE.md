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

## 次のタスク
現在: Task 00 - プロジェクト初期設定
→ Next.js TypeScriptプロジェクト作成中