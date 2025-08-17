# Task 04: フレットボード計算ユーティリティ

## 概要
フレットボード描画・音程計算に必要なユーティリティ関数を作成

## 実行内容
1. フレット位置の数学的計算
2. 弦の周波数計算
3. SVG座標計算関数
4. レスポンシブサイズ計算

## 作成ファイル
`src/lib/fretboard.ts`

## 実装する関数
```typescript
// フレット位置計算（12平均律）
export const calculateFretPosition = (fret: number, totalFrets: number): number => {
  // フレット間隔の計算
};

// 弦の周波数計算
export const getStringFrequency = (string: number, fret: number): number => {
  const openStringFreqs = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]; // E-A-D-G-B-E
  // セミトーン計算
};

// SVG座標計算
export const getFretCoordinates = (
  string: number, 
  fret: number, 
  orientation: 'horizontal' | 'vertical',
  width: number,
  height: number
): { x: number; y: number } => {
  // SVG座標変換
};

// レスポンシブサイズ計算
export const calculateFretboardSize = (
  screenWidth: number,
  orientation: 'horizontal' = 'horizontal' // 横向き固定（sample/fretboard-design-sample.html基準）
): { width: number; height: number; frets: number } => {
  // 画面サイズに応じたフレットボードサイズ（横向きのみ）
  // 基準: viewBox="0 0 800 300"
};

// カポタスト対応
export const applyCapo = (
  chordPattern: ChordPattern, 
  capoPosition: number
): ChordPattern => {
  // カポ位置を考慮したコード変換
};
```

## 確認項目
- [ ] 全ての計算関数が正常に動作する
- [ ] 音程計算が数学的に正確である
- [ ] SVG座標が適切に計算される
- [ ] レスポンシブ計算が各画面サイズで適切

## 成果物
- `src/lib/fretboard.ts`（計算ユーティリティ）

## 所要時間
30分