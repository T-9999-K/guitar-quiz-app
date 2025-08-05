# Task 02: TypeScript型定義作成

## 概要
アプリケーション全体で使用するTypeScript型定義を作成

## 実行内容
1. 基本的な型インターフェース定義
2. ユーティリティ型の作成
3. 型ガード関数の実装

## 作成ファイル
`src/types/index.ts`

## 実装する型
```typescript
// コードパターン
export interface ChordPattern {
  name: string;
  frets: (number | null)[];
  fingers: (number | null)[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  root: string;
  quality: string;
}

// クイズ状態
export interface QuizState {
  currentChord: ChordPattern | null;
  score: number;
  streak: number;
  timeElapsed: number;
  difficulty: ChordPattern['difficulty'];
  hintsUsed: number;
}

// ゲーム設定
export interface GameSettings {
  difficulty: ChordPattern['difficulty'];
  soundEnabled: boolean;
  capoPosition: number;
  theme: 'light' | 'dark';
}

// フレットボード描画用
export interface FretboardProps {
  chordPattern: ChordPattern;
  orientation: 'horizontal' | 'vertical';
  showFingers?: boolean;
  capoPosition?: number;
}
```

## 確認項目
- [ ] 全ての型定義が正しく作成されている
- [ ] TypeScriptコンパイルエラーがない
- [ ] 型のエクスポートが適切に設定されている

## 成果物
- `src/types/index.ts`（完全な型定義）

## 所要時間
20分