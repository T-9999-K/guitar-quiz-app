# Task 00: プロジェクト初期設定

## 概要
Next.js TypeScriptプロジェクトの作成と基本パッケージのインストール

## 実行内容
1. Next.js TypeScriptプロジェクト作成
2. 必要なパッケージのインストール
3. 基本設定ファイルの準備

## 具体的なコマンド
```bash
# プロジェクト作成
npx create-next-app@latest guitar-chord-quiz --typescript --tailwind --app

# プロジェクトディレクトリに移動
cd guitar-chord-quiz

# 追加パッケージインストール
npm install clsx

# 開発用パッケージ
npm install -D @types/node
```

## 確認項目
- [ ] プロジェクトが正常に作成される
- [ ] `npm run dev` でローカルサーバーが起動する
- [ ] TypeScript設定が有効になっている
- [ ] Tailwind CSSが動作している

## 成果物
- Next.jsプロジェクト基盤
- package.json with dependencies
- 基本的なtsconfig.json
- tailwind.config.js

## 所要時間
15分