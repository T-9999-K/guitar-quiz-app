# TypeScript コーディングルール & JSDoc規約

## 基本原則

1. **型安全性を最優先**
2. **可読性と保守性を重視**
3. **一貫性のあるコードスタイル**
4. **適切なドキュメント化**

---

## TypeScript ルール

### 1. 型定義

#### ✅ Good
```typescript
// 明示的な型定義
interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  preferences?: UserPreferences;
}

// Union Types の使用
type Theme = 'light' | 'dark';
type Status = 'loading' | 'success' | 'error';

// Generic Types の適切な使用
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

#### ❌ Bad
```typescript
// any の使用
const userData: any = fetchUser();

// 型推論に頼りすぎ
const config = {
  theme: 'light', // string型として推論される
  timeout: 5000
};
```

### 2. 命名規則

#### インターフェース・型
```typescript
// PascalCase、説明的な名前
interface ChordPattern {
  name: string;
  difficulty: ChordDifficulty;
}

// 型エイリアスもPascalCase
type ChordDifficulty = 'beginner' | 'intermediate' | 'advanced';

// Utility型の適切な使用
type PartialChord = Partial<ChordPattern>;
type RequiredSettings = Required<GameSettings>;
```

#### 変数・関数
```typescript
// camelCase、動詞＋名詞
const currentChordPattern = getRandomChord();
const isGameActive = checkGameStatus();

// boolean値はis/has/canで始める
const isLoading = false;
const hasPermission = true;
const canPlayAudio = checkAudioSupport();

// 定数はSCREAMING_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 5000;
```

### 3. 関数定義

#### ✅ Good
```typescript
/**
 * ランダムなギターコードを取得します
 * @param difficulty - 難易度レベル
 * @param excludePatterns - 除外するコードパターン
 * @returns 選択されたコードパターン
 * @throws {Error} 該当する難易度のコードが見つからない場合
 */
function getRandomChord(
  difficulty: ChordDifficulty,
  excludePatterns: string[] = []
): ChordPattern {
  const availableChords = CHORD_PATTERNS.filter(
    chord => chord.difficulty === difficulty && 
    !excludePatterns.includes(chord.name)
  );
  
  if (availableChords.length === 0) {
    throw new Error(`No chords available for difficulty: ${difficulty}`);
  }
  
  return availableChords[Math.floor(Math.random() * availableChords.length)];
}

// Arrow function（短い関数の場合）
const calculateScore = (correct: number, total: number): number => 
  Math.round((correct / total) * 100);
```

### 4. エラーハンドリング

```typescript
// カスタムエラー型
class ChordNotFoundError extends Error {
  constructor(
    public readonly chordName: string,
    public readonly difficulty: ChordDifficulty
  ) {
    super(`Chord "${chordName}" not found in ${difficulty} difficulty`);
    this.name = 'ChordNotFoundError';
  }
}

// Result型パターン
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function parseChordPattern(input: string): Result<ChordPattern> {
  try {
    const pattern = JSON.parse(input);
    return { success: true, data: pattern };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### 5. React コンポーネント

```typescript
/**
 * フレットボード表示コンポーネント
 */
interface FretboardProps {
  /** 表示するコードパターン */
  chordPattern: ChordPattern;
  /** フレットボードの向き */
  orientation: 'horizontal' | 'vertical';
  /** 指番号を表示するか */
  showFingers?: boolean;
  /** カポタストの位置（0は未使用） */
  capoPosition?: number;
  /** 追加のCSSクラス */
  className?: string;
  /** コード再生時のコールバック */
  onChordPlay?: (pattern: ChordPattern) => void;
}

/**
 * ギターのフレットボードを SVG で描画するコンポーネント
 * 
 * @example
 * ```tsx
 * <Fretboard
 *   chordPattern={cMajorChord}
 *   orientation="horizontal"
 *   showFingers={true}
 *   onChordPlay={handleChordPlay}
 * />
 * ```
 */
export const Fretboard = React.memo<FretboardProps>(({
  chordPattern,
  orientation,
  showFingers = false,
  capoPosition = 0,
  className,
  onChordPlay
}) => {
  // コンポーネント実装
});
```

### 6. Custom Hooks

```typescript
/**
 * クイズゲームの状態を管理するカスタムフック
 * 
 * @param difficulty - ゲームの難易度
 * @returns ゲーム状態とアクション関数
 * 
 * @example
 * ```tsx
 * const { state, startQuiz, submitAnswer } = useQuizState('beginner');
 * ```
 */
function useQuizState(difficulty: ChordDifficulty) {
  const [state, setState] = useState<QuizState>(() => ({
    currentChord: null,
    score: 0,
    streak: 0,
    timeElapsed: 0,
    difficulty,
    hintsUsed: 0
  }));

  const startQuiz = useCallback(() => {
    // 実装
  }, [difficulty]);

  return { state, startQuiz, submitAnswer, nextChord };
}
```

---

## JSDoc 規約

### 1. 基本構文

```typescript
/**
 * 関数の概要説明（1行で簡潔に）
 * 
 * より詳細な説明が必要な場合はここに記述します。
 * 複数行にわたって説明することも可能です。
 * 
 * @param paramName - パラメータの説明
 * @param optionalParam - オプションパラメータの説明（デフォルト値があれば記載）
 * @returns 戻り値の説明
 * @throws {ErrorType} エラーが発生する条件
 * 
 * @example
 * ```typescript
 * // 使用例
 * const result = functionName('value', { option: true });
 * ```
 * 
 * @see {@link RelatedFunction} 関連する関数
 * @since 1.0.0
 */
```

### 2. パラメータ記述

```typescript
/**
 * ユーザー情報を更新します
 * 
 * @param userId - 更新対象のユーザーID
 * @param updates - 更新するフィールド
 * @param updates.name - ユーザー名（オプション）
 * @param updates.email - メールアドレス（オプション）
 * @param options - 更新オプション
 * @param [options.validateEmail=true] - メールアドレスの検証を行うか
 * @param [options.sendNotification=false] - 更新通知を送信するか
 * @returns 更新されたユーザー情報
 */
function updateUser(
  userId: string,
  updates: {
    name?: string;
    email?: string;
  },
  options: {
    validateEmail?: boolean;
    sendNotification?: boolean;
  } = {}
): Promise<User>
```

### 3. 型記述

```typescript
/**
 * @typedef {Object} ChordPattern
 * @property {string} name - コード名
 * @property {(number|null)[]} frets - フレット位置配列
 * @property {'beginner'|'intermediate'|'advanced'} difficulty - 難易度
 */

/**
 * コードパターンのコレクション
 * @type {ChordPattern[]}
 */
const CHORD_PATTERNS = [];

/**
 * @template T
 * @param {T[]} array - 配列
 * @returns {T|undefined} ランダムな要素またはundefined
 */
function getRandomElement<T>(array: T[]): T | undefined
```

### 4. React コンポーネント

```typescript
/**
 * クイズゲームのメインコンポーネント
 * 
 * フレットボード表示、回答入力、スコア管理を統合した
 * メインゲーム画面を提供します。
 * 
 * @component
 * @example
 * ```tsx
 * <QuizGame
 *   difficulty="beginner"
 *   onGameEnd={(score) => console.log('Final score:', score)}
 * />
 * ```
 */
interface QuizGameProps {
  /** ゲームの難易度レベル */
  difficulty: ChordDifficulty;
  /** ゲーム終了時に呼び出されるコールバック関数 */
  onGameEnd?: (finalScore: number) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ difficulty, onGameEnd }) => {
  // 実装
};
```

### 5. イベントハンドラー

```typescript
/**
 * フレットボード上のコード押弦位置をクリックしたときの処理
 * 
 * @param event - マウスクリックイベント
 * @param stringIndex - 弦のインデックス（0-5）
 * @param fretIndex - フレットのインデックス（0-12）
 * 
 * @listens click
 * @fires fretboard:stringPlay
 */
const handleFretClick = (
  event: React.MouseEvent<SVGElement>,
  stringIndex: number,
  fretIndex: number
): void => {
  // 実装
};
```

### 6. 定数・設定

```typescript
/**
 * ギターの標準チューニングにおける各弦の開放弦周波数（Hz）
 * 
 * インデックス 0 = 6弦（低音E）, インデックス 5 = 1弦（高音E）
 * 
 * @constant
 * @type {readonly number[]}
 * @default
 */
const OPEN_STRING_FREQUENCIES = [
  82.41,  // 6弦 E
  110.00, // 5弦 A  
  146.83, // 4弦 D
  196.00, // 3弦 G
  246.94, // 2弦 B
  329.63  // 1弦 E
] as const;

/**
 * デフォルトのゲーム設定
 * 
 * @namespace
 */
const DEFAULT_GAME_SETTINGS = {
  /** デフォルトの難易度 */
  difficulty: 'beginner' as const,
  /** 音声再生の有効/無効 */
  soundEnabled: true,
  /** カポタストの初期位置 */
  capoPosition: 0,
  /** UIテーマ */
  theme: 'light' as const
} as const;
```

### 7. エラー・例外

```typescript
/**
 * 音声再生に関連するエラー
 * 
 * @extends Error
 */
class AudioPlaybackError extends Error {
  /**
   * AudioPlaybackError インスタンスを作成
   * 
   * @param message - エラーメッセージ
   * @param cause - 原因となったエラー
   */
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'AudioPlaybackError';
  }
}
```

---

## ESLint/Prettier 設定

### ESLint 設定 (`.eslintrc.json`)
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error"
  }
}
```

### Prettier 設定 (`.prettierrc`)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

---

## VSCode 設定

### 設定ファイル (`.vscode/settings.json`)
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.variableTypes.enabled": true
}
```

---

## まとめ

1. **型安全性**: `any`を避け、明示的な型定義を行う
2. **命名**: 一貫した命名規則（PascalCase, camelCase, SCREAMING_SNAKE_CASE）
3. **JSDoc**: 全ての public な関数・クラス・インターフェースに適切なドキュメントを追加
4. **エラーハンドリング**: 適切な例外処理とカスタムエラー型の使用
5. **可読性**: コードの意図が明確になるような記述を心がける

これらのルールに従うことで、保守性が高く、チーム開発に適したコードベースを構築できます。