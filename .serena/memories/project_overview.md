# Guitar Chord Quiz Project Overview

## プロジェクト概要
フレットボード上の指板位置からコード名を当てるクイズWebアプリケーション

## 技術スタック
- **フレームワーク**: Next.js 15.4.6 (App Router)
- **言語**: TypeScript (厳密な型チェック enabled)
- **UI**: React 19.1.0
- **スタイリング**: Tailwind CSS v4
- **状態管理**: React Hooks (useState, useReducer, Context API)
- **音声**: Web Audio API (ギター音合成)
- **データ永続化**: LocalStorage
- **デプロイ**: Static Export対応

## プロジェクト構造
```
guitar-chord-quiz/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # ルートレイアウト
│   │   ├── page.tsx        # ホームページ
│   │   └── globals.css     # グローバルスタイル
│   ├── components/         # Reactコンポーネント
│   │   ├── ui/            # 汎用UIコンポーネント
│   │   ├── fretboard/     # フレットボード関連
│   │   └── quiz/          # クイズ機能
│   ├── lib/               # ユーティリティ・ロジック
│   ├── hooks/             # カスタムフック
│   ├── types/             # TypeScript型定義
│   └── data/              # 静的データ
├── docs/                  # ドキュメント
└── public/                # 静的アセット
```

## 重要な特徴
- **完全クライアントサイド**: APIサーバー不要
- **レスポンシブ**: モバイル・デスクトップ両対応
- **音声合成**: 音声ファイル不使用、Web Audio APIで生成
- **Apple風デザイン**: Apple HIG準拠デザインシステム
- **アクセシビリティ**: WCAG 2.1 AAA完全準拠
- **PWA対応**: オフライン利用可能