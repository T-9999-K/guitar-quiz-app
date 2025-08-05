# Task 03: コードデータベース作成

## 概要
ギターコードのパターンデータを定義・作成

## 実行内容
1. 基本的なギターコードパターンの定義
2. 難易度別コード分類
3. コード検索・フィルタリング関数の実装

## 作成ファイル
`src/data/chord-patterns.ts`

## 実装するコード
### 初級コード（10個程度）
- C, G, D, A, E, Am, Em, Dm, F, Cadd9

### 中級コード（15個程度）
- F, Bm, B, C#m, F#m, G7, C7, D7, A7, E7, etc.

### 上級コード（10個程度）
- Cmaj7, Dm7, G7sus4, Fadd9, Am7, etc.

## データ構造例
```typescript
export const CHORD_PATTERNS: ChordPattern[] = [
  {
    name: 'C',
    frets: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    difficulty: 'beginner',
    root: 'C',
    quality: 'major'
  },
  // ... 他のコード
];

// ユーティリティ関数
export const getChordsByDifficulty = (difficulty: ChordPattern['difficulty']) => {...};
export const getRandomChord = (difficulty?: ChordPattern['difficulty']) => {...};
```

## 確認項目
- [ ] 35個以上のコードパターンが定義されている
- [ ] 各難易度に適切な数のコードがある
- [ ] フレット・指番号が正確に設定されている
- [ ] ユーティリティ関数が正常に動作する

## 成果物
- `src/data/chord-patterns.ts`（完全なコードデータベース）

## 所要時間
45分