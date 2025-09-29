'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * フィードバックアニメーションコンポーネントのプロパティ
 */
interface FeedbackAnimationProps {
  /** アニメーションの種類 */
  type: 'success' | 'error' | null;
  /** アニメーション完了時のコールバック */
  onComplete?: () => void;
  /** 子要素 */
  children: React.ReactNode;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * フィードバックアニメーションコンポーネント
 *
 * 正解・不正解時の視覚的フィードバックを提供します。
 * アクセシビリティを考慮し、reduced-motionユーザーにも配慮します。
 */
export const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  type,
  onComplete,
  children,
  className = '',
}) => {
  const [animationClass, setAnimationClass] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 既存のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (type === 'success') {
      setAnimationClass('animate-success-gentle');
      timeoutRef.current = setTimeout(() => {
        setAnimationClass('');
        onComplete?.();
      }, 1000);
    } else if (type === 'error') {
      setAnimationClass('animate-error-gentle');
      timeoutRef.current = setTimeout(() => {
        setAnimationClass('');
        onComplete?.();
      }, 800);
    } else {
      setAnimationClass('');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [type, onComplete]);

  return (
    <div className={`transition-all duration-300 ${animationClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * スコアアニメーションコンポーネントのプロパティ
 */
interface ScoreAnimationProps {
  /** 現在のスコア */
  score: number;
  /** 前回のスコア */
  previousScore: number;
  /** 表示形式 */
  format?: (score: number) => string;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * スコアアニメーションコンポーネント
 *
 * スコアの変化をスムーズなカウントアップアニメーションで表示します。
 */
export const ScoreAnimation: React.FC<ScoreAnimationProps> = ({
  score,
  previousScore,
  format = (s) => s.toString(),
  className = '',
}) => {
  const [displayScore, setDisplayScore] = useState(previousScore);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (score !== previousScore) {
      setIsAnimating(true);

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
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          setDisplayScore(score);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score, previousScore]);

  return (
    <span className={`font-bold transition-all duration-200 ${
      isAnimating ? 'text-green-600 scale-110' : 'text-blue-600'
    } ${className}`}>
      {format(displayScore)}
    </span>
  );
};

/**
 * ストリークアニメーションコンポーネントのプロパティ
 */
interface StreakAnimationProps {
  /** 現在の連続正解数 */
  streak: number;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * ストリークアニメーションコンポーネント
 *
 * 連続正解数の表示とボーナス表示を行います。
 */
export const StreakAnimation: React.FC<StreakAnimationProps> = ({
  streak,
  className = ''
}) => {
  const [prevStreak, setPrevStreak] = useState(streak);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusMessage, setBonusMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (streak > prevStreak && streak > 1) {
      // ボーナスメッセージを設定
      if (streak >= 10) {
        setBonusMessage('🔥 AMAZING STREAK!');
      } else if (streak >= 5) {
        setBonusMessage('🔥 HOT STREAK!');
      } else {
        setBonusMessage('✨ STREAK BONUS!');
      }

      setShowBonus(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setShowBonus(false);
      }, 2000);
    }
    setPrevStreak(streak);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [streak, prevStreak]);

  // ストリークレベルに応じた色とエフェクト
  const getStreakStyle = (streak: number) => {
    if (streak >= 10) {
      return 'text-red-600 streak-glow';
    } else if (streak >= 5) {
      return 'text-orange-600 animate-pulse';
    } else if (streak >= 3) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <span className={`font-bold transition-all duration-300 ${getStreakStyle(streak)}`}>
        {streak}
      </span>

      {/* ストリークボーナス表示 */}
      {showBonus && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2
                       bg-gradient-to-r from-orange-500 to-red-500 text-white
                       text-xs font-bold px-3 py-1 rounded-full
                       animate-bounce shadow-lg z-10">
          {bonusMessage}
        </div>
      )}

      {/* ストリーク数が高い場合のエフェクト */}
      {streak >= 5 && (
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-400
                         opacity-20 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

/**
 * ポイント増加アニメーションコンポーネントのプロパティ
 */
interface PointsAnimationProps {
  /** 獲得ポイント */
  points: number;
  /** 表示トリガー */
  show: boolean;
  /** アニメーション完了時のコールバック */
  onComplete?: () => void;
  /** 表示位置 */
  position?: 'top' | 'bottom' | 'center';
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * ポイント増加アニメーションコンポーネント
 *
 * 獲得ポイントの表示アニメーションを行います。
 */
export const PointsAnimation: React.FC<PointsAnimationProps> = ({
  points,
  show,
  onComplete,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (show && points > 0) {
      setIsVisible(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 1500);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [show, points, onComplete]);

  if (!isVisible) {
    return null;
  }

  const positionClasses = {
    top: '-top-8',
    bottom: '-bottom-8',
    center: 'top-1/2 -translate-y-1/2',
  };

  return (
    <div className={`
      absolute ${positionClasses[position]} left-1/2 transform -translate-x-1/2
      bg-gradient-to-r from-green-500 to-emerald-500 text-white
      text-sm font-bold px-2 py-1 rounded-full shadow-lg
      animate-fadeIn pointer-events-none z-20
      ${className}
    `}>
      +{points}
    </div>
  );
};

/**
 * ヒントアニメーションコンポーネントのプロパティ
 */
interface HintAnimationProps {
  /** ヒントが表示されているかどうか */
  show: boolean;
  /** ヒントテキスト */
  hint: string;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * ヒントアニメーションコンポーネント
 *
 * ヒントの表示・非表示アニメーションを行います。
 */
export const HintAnimation: React.FC<HintAnimationProps> = ({
  show,
  hint,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // 少し遅延してアニメーションを開始
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // アニメーション完了後にDOMから削除
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [show]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`
      transition-all duration-300 ease-out transform
      ${isVisible
        ? 'opacity-100 translate-y-0 scale-100'
        : 'opacity-0 translate-y-2 scale-95'
      }
      ${className}
    `}>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-600 text-xl animate-bounce">💡</div>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">ヒント</h3>
            <p className="text-yellow-700 text-sm">{hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnimation;