# Coding Standards and Conventions

## TypeScript厳密モード設定
- `strict: true` - 厳密型チェック有効
- `noEmit: true` - 型チェックのみ実行
- 明示的な型定義必須、`any`型禁止

## 命名規則
### インターフェース・型
- **PascalCase**: `ChordPattern`, `QuizState`, `GameSettings`
- **型エイリアス**: `type ChordDifficulty = 'beginner' | 'intermediate' | 'advanced'`

### 変数・関数
- **camelCase**: `currentChordPattern`, `isGameActive`
- **boolean値**: `is/has/can`で始める (`isLoading`, `hasPermission`)
- **定数**: `SCREAMING_SNAKE_CASE` (`MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT`)

## JSDoc必須事項
すべてのpublic関数・クラス・インターフェースに詳細なJSDocを記述:

```typescript
/**
 * 関数の概要説明（1行で簡潔に）
 * 
 * @param paramName - パラメータの説明
 * @returns 戻り値の説明
 * @throws {ErrorType} エラーが発生する条件
 * @example
 * ```typescript
 * const result = functionName('value');
 * ```
 */
```

## React コンポーネント規約
- **Props型定義**: 明示的なインターフェース定義
- **React.memo**: パフォーマンス最適化
- **JSDoc**: コンポーネント用途・使用例記述

## エラーハンドリング
- カスタムエラークラス使用
- Result型パターン推奨
- 適切な例外処理実装

## Apple風デザインシステム
- Apple HIG準拠のデザイントークン使用
- WCAG 2.1 AAA準拠アクセシビリティ
- 44px最小タッチターゲット
- 高コントラストモード対応