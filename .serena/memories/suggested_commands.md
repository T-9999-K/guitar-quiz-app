# Suggested Commands for Guitar Chord Quiz Development

## 必須開発コマンド (guitar-chord-quiz/ ディレクトリ内で実行)

### 開発・ビルド
```bash
# 開発サーバー起動 (Turbopack使用)
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm run start

# 静的エクスポート (デプロイ用)
npm run export
```

### コード品質管理
```bash
# ESLint実行
npm run lint

# TypeScript型チェック
npm run type-check
```

### Windows用システムコマンド
```bash
# ディレクトリ一覧
dir

# ファイル検索
findstr /S /I "pattern" *.ts *.tsx

# ディレクトリ移動
cd guitar-chord-quiz

# ファイル内容表示
type filename.ts
```

### Git操作
```bash
# 変更確認
git status
git diff

# コミット（Claude Code署名付き）
git add .
git commit -m "Task XX: 実装内容"

# リモートプッシュ
git push
```

## タスク完了時の必須手順
1. `npm run lint` - ESLintチェック
2. `npm run type-check` - TypeScript型チェック  
3. `npm run build` - ビルド確認
4. `git commit` → `git push` - 変更をプッシュ

## プロジェクト固有の注意事項
- 作業ディレクトリは必ず `guitar-chord-quiz/` 内で実行
- すべてのコードはTypeScript厳密モードに準拠
- Apple HIGデザインガイドライン遵守