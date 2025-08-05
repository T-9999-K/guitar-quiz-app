# Task 01: プロジェクト構造作成

## 概要
アプリケーション全体のディレクトリ構造を作成

## 実行内容
1. srcディレクトリ配下の基本構造作成
2. 各機能別ディレクトリの準備
3. 初期ファイルの配置

## 作成するディレクトリ・ファイル
```
src/
├── components/
│   ├── ui/
│   ├── fretboard/
│   └── quiz/
├── lib/
├── hooks/
├── types/
└── data/
```

## 具体的な作業
1. `mkdir -p src/components/{ui,fretboard,quiz}`
2. `mkdir -p src/{lib,hooks,types,data}`
3. 各ディレクトリにindex.tsファイル作成（エクスポート用）

## 確認項目
- [ ] 全ディレクトリが作成されている
- [ ] ディレクトリ構造がplan.mdと一致している
- [ ] 各ディレクトリにindex.tsが存在する

## 成果物
- 完全なプロジェクト構造
- 各ディレクトリのindex.tsファイル

## 所要時間
10分