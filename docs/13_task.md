# Task 13: UI強化・アニメーション実装

## 概要
ユーザーエクスペリエンス向上のためのアニメーション・視覚フィードバックを実装

## 実行内容
1. 回答フィードバックアニメーション
2. フレットボード操作時のエフェクト
3. スコア更新アニメーション
4. ローディング・遷移アニメーション

## 作成ファイル
1. `src/components/ui/FeedbackAnimation.tsx`
2. `src/components/ui/LoadingSpinner.tsx`
3. `src/lib/animations.ts`

## フィードバックアニメーション実装
`src/components/ui/FeedbackAnimation.tsx`
```typescript
import { useEffect, useState } from 'react';

interface FeedbackAnimationProps {
  type: 'success' | 'error' | null;
  onComplete?: () => void;
  children: React.ReactNode;
}

export const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  type,
  onComplete,
  children
}) => {
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    if (type === 'success') {
      setAnimationClass('animate-success');
      setTimeout(() => {
        setAnimationClass('');
        onComplete?.();
      }, 1000);
    } else if (type === 'error') {
      setAnimationClass('animate-error');
      setTimeout(() => {
        setAnimationClass('');
        onComplete?.();
      }, 800);
    }
  }, [type, onComplete]);
  
  return (
    <div className={`transition-all duration-300 ${animationClass}`}>
      {children}
    </div>
  );
};

// スコアアニメーション
interface ScoreAnimationProps {
  score: number;
  previousScore: number;
}

export const ScoreAnimation: React.FC<ScoreAnimationProps> = ({
  score,
  previousScore
}) => {
  const [displayScore, setDisplayScore] = useState(previousScore);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (score !== previousScore) {
      setIsAnimating(true);
      
      // カウントアップアニメーション
      const duration = 800;
      const startTime = Date.now();
      const scoreDiff = score - previousScore;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // イージング関数（ease-out）
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScore = Math.round(previousScore + scoreDiff * easeOut);
        
        setDisplayScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [score, previousScore]);
  
  return (
    <span className={`font-bold transition-all duration-200 ${
      isAnimating ? 'text-green-600 scale-110' : 'text-blue-600'
    }`}>
      {displayScore}
    </span>
  );
};

// ストリークアニメーション
interface StreakAnimationProps {
  streak: number;
}

export const StreakAnimation: React.FC<StreakAnimationProps> = ({ streak }) => {
  const [prevStreak, setPrevStreak] = useState(streak);
  const [showBonus, setShowBonus] = useState(false);
  
  useEffect(() => {
    if (streak > prevStreak && streak > 1) {
      setShowBonus(true);
      setTimeout(() => setShowBonus(false), 2000);
    }
    setPrevStreak(streak);
  }, [streak, prevStreak]);
  
  return (
    <div className="relative">
      <span className={`font-bold transition-all duration-300 ${
        streak > 3 ? 'text-orange-600' : 'text-green-600'
      }`}>
        {streak}
      </span>
      
      {/* ストリークボーナス表示 */}
      {showBonus && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                       bg-orange-500 text-white text-xs px-2 py-1 rounded
                       animate-bounce">
          {streak > 5 ? '🔥 HOT STREAK!' : '✨ STREAK BONUS!'}
        </div>
      )}
    </div>
  );
};
```

## ローディングスピナー実装
`src/components/ui/LoadingSpinner.tsx`
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500'
  };
  
  return (
    <div className={`
      ${sizeClasses[size]} 
      border-2 border-gray-200 
      ${colorClasses[color]} 
      border-t-transparent 
      rounded-full 
      animate-spin
    `} />
  );
};

// フレットボード読み込み表示
export const FretboardLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <LoadingSpinner size="lg" color="blue" />
      <p className="text-gray-600">フレットボードを準備中...</p>
    </div>
  );
};
```

## アニメーションユーティリティ
`src/lib/animations.ts`
```typescript
// アニメーション関連のユーティリティ関数

export const animateElement = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation => {
  return element.animate(keyframes, options);
};

// フレットボード押弦アニメーション
export const animateFingerPress = (element: HTMLElement) => {
  return animateElement(element, [
    { transform: 'scale(1)', opacity: 0.8 },
    { transform: 'scale(1.2)', opacity: 1 },
    { transform: 'scale(1)', opacity: 0.9 }
  ], {
    duration: 300,
    easing: 'ease-out'
  });
};

// 正解フラッシュアニメーション
export const animateSuccess = (element: HTMLElement) => {
  return animateElement(element, [
    { backgroundColor: 'rgb(34, 197, 94)', transform: 'scale(1)' },
    { backgroundColor: 'rgb(22, 163, 74)', transform: 'scale(1.02)' },
    { backgroundColor: 'transparent', transform: 'scale(1)' }
  ], {
    duration: 1000,
    easing: 'ease-out'
  });
};

// エラーシェイクアニメーション
export const animateError = (element: HTMLElement) => {
  return animateElement(element, [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(0)' }
  ], {
    duration: 500,
    easing: 'ease-in-out'
  });
};

// スコア増加アニメーション
export const animateScoreIncrease = (element: HTMLElement, points: number) => {
  // +10ポイント表示
  const floatingText = document.createElement('div');
  floatingText.textContent = `+${points}`;
  floatingText.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-600 font-bold pointer-events-none';
  
  element.style.position = 'relative';
  element.appendChild(floatingText);
  
  const animation = animateElement(floatingText, [
    { opacity: 0, transform: 'translate(-50%, 0)' },
    { opacity: 1, transform: 'translate(-50%, -10px)' },
    { opacity: 0, transform: 'translate(-50%, -20px)' }
  ], {
    duration: 1500,
    easing: 'ease-out'
  });
  
  animation.addEventListener('finish', () => {
    floatingText.remove();
  });
  
  return animation;
};
```

## CSS アニメーション追加
`src/app/globals.css` に追加
```css
/* 既存のスタイルに追加 */

/* 成功アニメーション */
@keyframes success-flash {
  0% { background-color: transparent; }
  50% { background-color: rgba(34, 197, 94, 0.3); }
  100% { background-color: transparent; }
}

.animate-success {
  animation: success-flash 1s ease-out;
}

/* エラーアニメーション */
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-error {
  animation: error-shake 0.5s ease-in-out;
}

/* パルスアニメーション */
@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    transform: scale(1.05);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* フレットボード押弦エフェクト */
.fret-press {
  transition: all 0.2s ease-out;
}

.fret-press:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

/* ストリーク効果 */
@keyframes streak-glow {
  0% { text-shadow: 0 0 5px rgba(249, 115, 22, 0.5); }
  50% { text-shadow: 0 0 20px rgba(249, 115, 22, 1), 0 0 30px rgba(249, 115, 22, 0.5); }
  100% { text-shadow: 0 0 5px rgba(249, 115, 22, 0.5); }
}

.streak-glow {
  animation: streak-glow 1.5s infinite;
}

/* フェードイン・アウト */
.fade-enter {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease-out;
}

.fade-exit {
  opacity: 1;
  transform: translateY(0);
}

.fade-exit-active {
  opacity: 0;
  transform: translateY(-10px);
  transition: all 300ms ease-in;
}
```

## アニメーション統合
QuizGameコンポーネントに統合する際の使用例
```typescript
// QuizGame.tsx での使用例
const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
const [previousScore, setPreviousScore] = useState(0);

const handleAnswerSubmit = (answer: string) => {
  const isCorrect = submitAnswer(answer);
  
  if (isCorrect) {
    setFeedbackType('success');
    playSuccess();
  } else {
    setFeedbackType('error');
    playError();
  }
  
  setPreviousScore(state.score);
};

// JSXでの使用
<FeedbackAnimation type={feedbackType} onComplete={() => setFeedbackType(null)}>
  <ResponsiveFretboard {...props} />
</FeedbackAnimation>

<ScoreAnimation score={state.score} previousScore={previousScore} />
<StreakAnimation streak={state.streak} />
```

## 確認項目
- [ ] 正解・不正解時のアニメーションが動作する
- [ ] スコア更新がスムーズにアニメーションする
- [ ] ストリークボーナス表示が機能する
- [ ] ローディング表示が適切に動作する
- [ ] アニメーションのパフォーマンスが良好
- [ ] レスポンシブ環境でアニメーションが適切

## 成果物
- フィードバックアニメーションシステム
- スコア・ストリークアニメーション
- ローディング・遷移エフェクト

## 所要時間
60分