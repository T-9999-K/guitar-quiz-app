# ギターコードクイズWebアプリ 実装計画

## フェーズ概要

### Phase 1: 基盤構築（1-2日）
プロジェクト初期設定、基本構造、コアデータ

### Phase 2: フレットボード実装（2-3日）
SVGフレットボード描画、レスポンシブ対応

### Phase 3: クイズ機能実装（2-3日）
ゲームロジック、状態管理、スコア機能

### Phase 4: 音声・UI強化（2-3日）
音声生成、アニメーション、ユーザビリティ向上

### Phase 5: 最適化・テスト（1-2日）
パフォーマンス調整、テスト、デプロイ準備

---

## Phase 1: 基盤構築

### 1.1 プロジェクト初期設定
```bash
# Next.js TypeScript プロジェクト作成
npx create-next-app@latest guitar-chord-quiz --typescript --tailwind --app

# 必要パッケージインストール
npm install clsx
npm install -D @types/node
```

### 1.2 プロジェクト構造作成
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (作成)
│   ├── fretboard/ (作成)
│   └── quiz/ (作成)
├── lib/ (作成)
├── hooks/ (作成)
├── types/ (作成)
└── data/ (作成)
```

### 1.3 基本型定義
**作成ファイル: `src/types/index.ts`**
```typescript
export interface ChordPattern {
  name: string;
  frets: (number | null)[];
  fingers: (number | null)[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  root: string;
  quality: string;
}

export interface QuizState {
  currentChord: ChordPattern | null;
  score: number;
  streak: number;
  timeElapsed: number;
  difficulty: ChordPattern['difficulty'];
  hintsUsed: number;
}

export interface GameSettings {
  difficulty: ChordPattern['difficulty'];
  soundEnabled: boolean;
  capoPosition: number;
  theme: 'light' | 'dark';
}
```

### 1.4 コードデータベース作成
**作成ファイル: `src/data/chord-patterns.ts`**
```typescript
import { ChordPattern } from '@/types';

export const CHORD_PATTERNS: ChordPattern[] = [
  // 初級コード
  { name: 'C', frets: [null, 3, 2, 0, 1, 0], fingers: [null, 3, 2, null, 1, null], difficulty: 'beginner', root: 'C', quality: 'major' },
  { name: 'G', frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, null, null, 3, 4], difficulty: 'beginner', root: 'G', quality: 'major' },
  // ... 他のコード
];
```

---

## Phase 2: フレットボード実装

### 2.1 基本SVGフレットボード
**作成ファイル: `src/components/fretboard/Fretboard.tsx`**

#### 機能
- 6弦×12フレットのSVG描画
- フレット番号表示
- 押弦位置のドット表示
- レスポンシブサイズ調整

#### 実装ポイント
```typescript
interface FretboardProps {
  chordPattern: ChordPattern;
  orientation: 'horizontal' | 'vertical';
  showFingers?: boolean;
  capoPosition?: number;
}
```

### 2.2 レスポンシブ対応
**作成ファイル: `src/components/fretboard/ResponsiveFretboard.tsx`**

#### 機能
- 画面サイズ検出（useMediaQuery hook）
- モバイル：縦向き、4-5フレット表示
- デスクトップ：横向き、12フレット表示
- 自動サイズ調整

### 2.3 フレットボードユーティリティ
**作成ファイル: `src/lib/fretboard.ts`**
```typescript
export const calculateFretPosition = (fret: number, totalFrets: number) => {
  // フレット位置の数学的計算
};

export const getStringFrequency = (string: number, fret: number) => {
  // 弦の周波数計算
};
```

---

## Phase 3: クイズ機能実装

### 3.1 クイズ状態管理
**作成ファイル: `src/hooks/useQuizState.ts`**
```typescript
export const useQuizState = () => {
  const [state, setState] = useState<QuizState>({...});
  
  const startQuiz = () => {...};
  const submitAnswer = (answer: string) => {...};
  const nextChord = () => {...};
  const useHint = () => {...};
  
  return { state, startQuiz, submitAnswer, nextChord, useHint };
};
```

### 3.2 メインクイズコンポーネント
**作成ファイル: `src/components/quiz/QuizGame.tsx`**

#### 機能
- フレットボード表示
- 回答入力フォーム
- スコア表示
- ヒント機能
- 正解・不正解フィードバック

### 3.3 回答入力コンポーネント
**作成ファイル: `src/components/quiz/AnswerInput.tsx`**

#### モバイル版
- 大きなボタン型選択肢
- 最頻出コードのクイックボタン

#### デスクトップ版
- ドロップダウン + 入力補完
- キーボードショートカット対応

### 3.4 スコア・統計管理
**作成ファイル: `src/hooks/useLocalStorage.ts`**
```typescript
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // LocalStorage読み書き with TypeScript
};
```

---

## Phase 4: 音声・UI強化

### 4.1 音声生成システム
**作成ファイル: `src/lib/audio.ts`**
```typescript
export class GuitarSynthesizer {
  private audioContext: AudioContext;
  
  constructor() {
    this.audioContext = new AudioContext();
  }
  
  playChord(chordPattern: ChordPattern) {
    // 複数音同時再生
  }
  
  playSingleNote(string: number, fret: number) {
    // 単音再生
  }
}
```

### 4.2 音声制御フック
**作成ファイル: `src/hooks/useAudio.ts`**
```typescript
export const useAudio = () => {
  const [synthesizer] = useState(() => new GuitarSynthesizer());
  const [enabled, setEnabled] = useState(true);
  
  const playChord = useCallback((pattern: ChordPattern) => {
    if (enabled) synthesizer.playChord(pattern);
  }, [synthesizer, enabled]);
  
  return { playChord, enabled, setEnabled };
};
```

### 4.3 アニメーション・フィードバック
**作成ファイル: `src/components/ui/FeedbackAnimation.tsx`**

#### 機能
- 正解時の成功アニメーション
- 不正解時のシェイクエフェクト
- スコア更新のカウントアップ
- CSS Transitions使用

### 4.4 設定・テーマ管理
**作成ファイル: `src/components/ui/Settings.tsx`**

#### 機能
- 難易度選択
- 音声on/off
- カポ位置設定
- ダークモード切替

---

## Phase 5: 最適化・テスト

### 5.1 パフォーマンス最適化
- React.memo適用
- useMemo/useCallback最適化
- SVG描画パフォーマンス調整
- 音声生成の最適化

### 5.2 レスポンシブテスト
- 各画面サイズでの動作確認
- タッチ操作テスト
- パフォーマンス測定

### 5.3 アクセシビリティ
- キーボードナビゲーション
- スクリーンリーダー対応
- コントラスト比確認
- フォーカス管理

### 5.4 デプロイ準備
**作成ファイル: `next.config.js`**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig;
```

### 5.5 PWA設定
- Service Worker設定
- manifest.json作成
- オフライン対応

---

## 実装優先順位

### 必須機能（MVP）
1. フレットボード表示
2. 基本クイズ機能
3. スコア管理
4. レスポンシブ対応

### 追加機能
1. 音声再生
2. ヒント機能
3. 難易度選択
4. アニメーション

### 将来機能
1. カポタスト対応
2. 練習モード
3. PWA対応
4. 詳細統計

---

## 開発スケジュール

| Phase | 期間 | 主要成果物 |
|-------|------|-----------|
| Phase 1 | 1-2日 | プロジェクト基盤、型定義、データ |
| Phase 2 | 2-3日 | フレットボード描画、レスポンシブ |
| Phase 3 | 2-3日 | クイズロジック、状態管理 |
| Phase 4 | 2-3日 | 音声機能、UI強化 |
| Phase 5 | 1-2日 | 最適化、テスト、デプロイ |

**総開発期間: 8-13日**