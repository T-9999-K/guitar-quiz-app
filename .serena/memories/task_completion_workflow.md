# Task Completion Workflow

## タスク完了時の必須手順

### 1. コード品質チェック
```bash
cd guitar-chord-quiz
npm run lint        # ESLintチェック
npm run type-check  # TypeScript型チェック
npm run build       # ビルド確認
```

### 2. Git操作
```bash
git add .
git commit -m "Task XX: 実装内容

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push  # 必須：タスク完了時は自動プッシュ
```

### 3. エラー対応
- リント・型エラーが発生した場合は必ず修正してからコミット
- ビルドエラーは絶対に残さない
- 警告レベルのエラーも可能な限り解決

### 4. 完了確認
- 実装したコンポーネントが正常に動作することを確認
- レスポンシブ対応が適切に機能することを確認
- アクセシビリティ要件を満たしていることを確認

## 重要な注意事項
- **作業ディレクトリ**: すべてのコマンドは `guitar-chord-quiz/` 内で実行
- **自動プッシュ**: タスク完了時は必ずgit pushまで実行
- **型安全性**: TypeScript厳密モードエラーは絶対に残さない
- **デザインシステム**: Apple HIG準拠を維持