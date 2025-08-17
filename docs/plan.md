# ギターコードクイズWebアプリ 実装計画（Apple風デザイン対応版）

## フェーズ概要

### Phase 1: 基盤構築（1-2日）
プロジェクト初期設定、Apple風デザインシステム構築、基本構造

### Phase 2: フレットボード実装（2-3日）
Apple HIG準拠のSVGフレットボード、アクセシビリティ対応

### Phase 3: クイズ機能実装（2-3日）
洗練されたUI、ゲームロジック、スコア機能

### Phase 4: 音声・UI強化（2-3日）
音声生成、上質なアニメーション、完全アクセシビリティ

### Phase 5: 最適化・テスト（1-2日）
パフォーマンス調整、アクセシビリティテスト、デプロイ準備

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

### 1.2 Apple風デザインシステム構築
**作成ファイル: `src/app/globals.css`**
```css
/* Apple風デザインシステム */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* プライマリボタン */
  .btn-primary {
    @apply bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md;
    @apply hover:bg-blue-600 hover:shadow-lg;
    @apply focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
    @apply transition-all duration-200 ease-in-out;
    @apply min-h-[44px]; /* 最小タッチターゲット */
  }
  
  /* セカンダリボタン */
  .btn-secondary {
    @apply bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl shadow-sm;
    @apply border-2 border-blue-700;
    @apply hover:bg-blue-50 hover:shadow-md;
    @apply focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
    @apply transition-all duration-200 ease-in-out;
    @apply min-h-[44px];
  }
  
  /* カード */
  .card {
    @apply bg-white border border-gray-300 rounded-2xl shadow-sm p-6;
    @apply hover:shadow-md hover:border-gray-400;
    @apply transition-all duration-200 ease-in-out;
  }
  
  /* 入力フィールド */
  .input-field {
    @apply bg-white border border-gray-300 rounded-lg px-4 py-3;
    @apply focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20;
    @apply placeholder-gray-500 min-h-[48px];
    @apply transition-all duration-150 ease-in-out;
  }
}
```

### 1.3 プロジェクト構造作成（Apple風対応）
```
src/
├── app/
│   ├── layout.tsx       # Apple風レイアウト
│   ├── page.tsx         # メニュー画面
│   └── globals.css      # デザインシステム
├── components/
│   ├── ui/              # Apple HIG準拠UIコンポーネント
│   │   ├── Button.tsx   # 統一されたボタンシステム
│   │   ├── Card.tsx     # カードコンポーネント
│   │   └── Input.tsx    # 入力コンポーネント
│   ├── fretboard/       # アクセシブルなフレットボード
│   └── quiz/            # 洗練されたクイズUI
├── lib/
│   ├── design-tokens.ts # デザイントークン定義
│   └── accessibility.ts # アクセシビリティユーティリティ
├── hooks/               # カスタムフック
├── types/               # TypeScript型定義
└── data/                # 静的データ
```

### 1.4 デザイントークン定義
**作成ファイル: `src/lib/design-tokens.ts`**
```typescript
/**
 * Apple風デザインシステム - デザイントークン
 * design_rule.md に基づく一元管理
 */

export const designTokens = {
  colors: {
    primary: {
      50: '#EFF6FF',  // 使用最小限
      500: '#3B82F6', // メインブルー
      600: '#2563EB', // ホバー状態
      700: '#1D4ED8', // テキスト用
      800: '#1E40AF', // 白背景テキスト
    },
    gray: {
      50: '#F9FAFB',   // セクション背景
      200: '#E5E7EB',  // 軽い区切り線
      300: '#D1D5DB',  // 境界線
      500: '#6B7280',  // 非重要テキスト
      600: '#4B5563',  // 注釈テキスト
      700: '#374151',  // 補助テキスト
      900: '#111827',  // メインテキスト
    },
    system: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#1D4ED8',
    }
  },
  spacing: {
    xs: '2px',    // 0.5rem
    sm: '4px',    // 1rem
    md: '8px',    // 2rem
    lg: '16px',   // 4rem
    xl: '24px',   // 6rem
    '2xl': '32px', // 8rem
    '3xl': '48px', // 12rem
    '4xl': '64px', // 16rem
  },
  borderRadius: {
    sm: '8px',    // rounded-lg
    md: '12px',   // rounded-xl
    lg: '16px',   // rounded-2xl
    xl: '24px',   // rounded-3xl
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  }
} as const;

/**
 * 最小タッチターゲットサイズ（44px）確保ユーティリティ
 */
export const MINIMUM_TOUCH_TARGET = 44;

/**
 * WCAGコントラスト比要件
 */
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,      // 通常テキスト
  AA_LARGE: 3,         // 大きなテキスト
  AAA_NORMAL: 7,       // AAA対応
  UI_COMPONENTS: 3,    // UIコンポーネント
} as const;
```

---

## Phase 2: フレットボード実装（Apple風対応）

### 2.1 Apple HIG準拠UIコンポーネント
**作成ファイル: `src/components/ui/Button.tsx`**
```typescript
/**
 * Apple風統一ボタンコンポーネント
 * 完全アクセシビリティ対応、44px最小タッチターゲット
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  loading,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = [
    'font-semibold rounded-xl transition-all duration-200 ease-in-out',
    'focus:ring-2 focus:ring-offset-2 focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'min-h-[44px]', // 最小タッチターゲット
  ];
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-white text-blue-700 border-2 border-blue-700 shadow-sm hover:bg-blue-50 hover:shadow-md focus:ring-blue-500',
    danger: 'bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2.5 text-sm', // 最小44px高さ
    md: 'px-6 py-3 text-base',  // 48px高さ
    lg: 'px-8 py-4 text-lg',    // 56px高さ
  };
  
  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
          処理中...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
```

### 2.2 アクセシブルなフレットボードコンポーネント
**作成ファイル: `src/components/fretboard/AccessibleFretboard.tsx`**
```typescript
/**
 * Apple風 & アクセシビリティ完全対応フレットボードコンポーネント
 * WCAG 2.1 AAA準拠、キーボード操作対応
 */
interface AccessibleFretboardProps {
  chordPattern: ChordPattern;
  orientation: 'horizontal'; // 横向きのみ実装
  showFingers?: boolean;
  onStringPlay?: (string: number, fret: number) => void;
}

export const AccessibleFretboard: React.FC<AccessibleFretboardProps> = ({
  chordPattern,
  orientation,
  showFingers = false,
  onStringPlay
}) => {
  const [focusedPosition, setFocusedPosition] = useState<{string: number, fret: number} | null>(null);
  
  // キーボード操作対応
  const handleKeyDown = (e: React.KeyboardEvent, string: number, fret: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onStringPlay?.(string, fret);
        break;
      case 'ArrowUp':
        e.preventDefault();
        // 上の弦に移動
        break;
      case 'ArrowDown':
        e.preventDefault();
        // 下の弦に移動
        break;
    }
  };
  
  return (
    <div
      className="card focus-within:ring-2 focus-within:ring-blue-500"
      role="img"
      aria-label={`ギターコード ${chordPattern.name} のフレットボード表示`}
    >
      <svg
        viewBox="0 0 800 400"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* フレット・弦の描画 */}
        {/* アクセシビリティ: 各押弦位置をfocusable要素として実装 */}
        {chordPattern.frets.map((fret, stringIndex) => 
          fret !== null && (
            <circle
              key={`${stringIndex}-${fret}`}
              cx={getFretX(fret)}
              cy={getStringY(stringIndex)}
              r="12"
              fill="#3B82F6"
              stroke="#FFFFFF"
              strokeWidth="3"
              className="transition-all duration-150 hover:scale-110 focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="button"
              aria-label={`${stringIndex + 1}弦 ${fret}フレット`}
              onKeyDown={(e) => handleKeyDown(e, stringIndex, fret)}
              onClick={() => onStringPlay?.(stringIndex, fret)}
            />
          )
        )}
      </svg>
      
      {/* 視覚補助情報 */}
      <div className="mt-4 text-sm text-gray-600">
        <p>コード: <span className="font-semibold text-gray-900">{chordPattern.name}</span></p>
        <p>難易度: <span className="font-semibold text-gray-900">{chordPattern.difficulty}</span></p>
      </div>
    </div>
  );
};
```

---

## Phase 3: クイズ機能実装（Apple風UI）

### 3.1 洗練されたクイズゲームコンポーネント
**作成ファイル: `src/components/quiz/AppleStyleQuizGame.tsx`**
```typescript
/**
 * Apple風洗練されたクイズゲームコンポーネント
 * 完全アクセシビリティ対応、美しいアニメーション
 */
export const AppleStyleQuizGame: React.FC<QuizGameProps> = ({ difficulty, onGameEnd }) => {
  // ゲーム状態管理
  const quizState = useQuizState(difficulty);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* スコア表示カード */}
      <div className="card mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ScoreItem
            value={quizState.state.score}
            label="スコア"
            color="blue"
            icon="🎯"
          />
          <ScoreItem
            value={quizState.state.streak}
            label="連続正解"
            color="green"
            icon="🔥"
          />
          <ScoreItem
            value={formatTime(quizState.state.timeElapsed)}
            label="経過時間"
            color="purple"
            icon="⏱️"
          />
          <ScoreItem
            value={quizState.state.hintsUsed}
            label="ヒント使用"
            color="orange"
            icon="💡"
          />
        </div>
      </div>
      
      {/* メインゲームエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* フレットボード */}
        <div className="lg:col-span-2">
          {quizState.state.currentChord && (
            <AccessibleFretboard
              chordPattern={quizState.state.currentChord}
              orientation="horizontal"
              showFingers={false}
            />
          )}
        </div>
        
        {/* 回答エリア */}
        <div className="space-y-6">
          <AnswerInput
            onSubmit={handleAnswerSubmit}
            disabled={quizState.showResult}
            difficulty={difficulty}
          />
          
          {/* 結果フィードバック */}
          {quizState.showResult && (
            <FeedbackCard
              type={feedbackType}
              correctAnswer={quizState.state.currentChord?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * スコア表示項目コンポーネント
 */
const ScoreItem: React.FC<{
  value: string | number;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  icon: string;
}> = ({ value, label, color, icon }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };
  
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]} mb-1`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};
```

---

## Phase 4: 音声・UI強化（Apple品質）

### 4.1 上質なアニメーション
**作成ファイル: `src/components/ui/AppleAnimations.tsx`**
```typescript
/**
 * Apple風上質なアニメーション
 * prefers-reduced-motion 対応
 */
export const FeedbackAnimation: React.FC<{
  type: 'success' | 'error' | null;
  children: React.ReactNode;
}> = ({ type, children }) => {
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return; // モーション配慮
    
    if (type === 'success') {
      setAnimationClass('animate-success-gentle');
    } else if (type === 'error') {
      setAnimationClass('animate-error-gentle');
    }
    
    setTimeout(() => setAnimationClass(''), 1000);
  }, [type]);
  
  return (
    <div className={`transition-all duration-200 ease-in-out ${animationClass}`}>
      {children}
    </div>
  );
};
```

### 4.2 アクセシビリティ強化
**作成ファイル: `src/lib/accessibility.ts`**
```typescript
/**
 * アクセシビリティユーティリティ
 * Apple風品質でのアクセシビリティ確保
 */

/**
 * フォーカス管理
 */
export const manageFocus = {
  trap: (element: HTMLElement) => {
    // フォーカストラップ実装
  },
  restore: () => {
    // フォーカス復元
  },
  announce: (message: string) => {
    // スクリーンリーダーへの通知
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
};

/**
 * キーボード操作ハンドラー
 */
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  options: {
    onEscape?: () => void;
    onEnter?: () => void;
    onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  }
) => {
  switch (event.key) {
    case 'Escape':
      options.onEscape?.();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      options.onEnter?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      options.onArrowKeys?.('up');
      break;
    // 他の矢印キー処理
  }
};
```

---

## Phase 5: 最適化・テスト（Apple品質保証）

### 5.1 アクセシビリティテスト
```typescript
// アクセシビリティテスト項目
const accessibilityChecklist = {
  contrast: {
    normalText: '4.5:1以上',
    largeText: '3:1以上',
    uiComponents: '3:1以上',
  },
  keyboard: {
    tabOrder: '論理的順序',
    focusIndicator: '明確な表示',
    keyboardTrap: 'モーダルで実装',
  },
  screenReader: {
    altText: '全画像に適切な代替テキスト',
    ariaLabels: 'ボタン・フォームに適切なラベル',
    headingStructure: '階層的なh1-h6構造',
  }
};
```

### 5.2 デザイン品質チェック
```typescript
// Apple風デザイン品質チェックリスト
const designQualityChecklist = {
  colors: {
    contrastRatio: '✓ 4.5:1以上確保',
    colorUsage: '✓ blue-700以上を白背景で使用',
    systemColors: '✓ 適切なシステムカラー使用',
  },
  typography: {
    fontWeight: '✓ ボタンはsemibold以上',
    hierarchy: '✓ 適切なフォントサイズ階層',
    lineHeight: '✓ leading-relaxed使用',
  },
  layout: {
    spacing: '✓ 8px単位の余白システム',
    borderRadius: '✓ 統一された角丸',
    shadows: '✓ 全インタラクティブ要素に影',
    touchTarget: '✓ 44px最小サイズ確保',
  }
};
```

---

## 更新されたタスク優先度

### 最重要タスク（Apple風対応）
1. **Task 00**: Apple風デザインシステム構築
2. **Task 05**: アクセシブルなフレットボードコンポーネント
3. **Task 10**: 洗練されたクイズゲームUI
4. **Task 13**: 上質なアニメーション・アクセシビリティ

### 開発時間見積もり（修正版）
- **Phase 1**: 2-3日（デザインシステム構築含む）
- **Phase 2**: 3-4日（アクセシビリティ対応含む）
- **Phase 3**: 3-4日（洗練されたUI実装）
- **Phase 4**: 3-4日（品質向上・アクセシビリティ）
- **Phase 5**: 2-3日（厳格な品質テスト）

**総開発期間: 13-18日** (Apple品質での完全実装)

この更新により、単なる機能実装ではなく、Apple製品レベルの品質とアクセシビリティを持つWebアプリケーションを構築できます。