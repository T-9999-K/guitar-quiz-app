'use client';

/**
 * アニメーション関連のユーティリティ関数
 * Web Animations APIを使用したスムーズなアニメーション実装
 */

/**
 * 要素に対してアニメーションを適用する汎用関数
 */
export const animateElement = (
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation => {
  // reduced-motionが有効な場合はアニメーションを無効化
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // アニメーションを即座に完了状態にする
    const finalKeyframe = keyframes[keyframes.length - 1];
    Object.assign(element.style, finalKeyframe);

    // ダミーのAnimationオブジェクトを返す
    return {
      finished: Promise.resolve(),
      cancel: () => {},
      finish: () => {},
      play: () => {},
      pause: () => {},
      reverse: () => {},
      updatePlaybackRate: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as Animation;
  }

  return element.animate(keyframes, options);
};

/**
 * フレットボード押弦アニメーション
 */
export const animateFingerPress = (element: HTMLElement): Animation => {
  return animateElement(element, [
    { transform: 'scale(1)', opacity: '0.8' },
    { transform: 'scale(1.2)', opacity: '1' },
    { transform: 'scale(1)', opacity: '0.9' }
  ], {
    duration: 300,
    easing: 'ease-out'
  });
};

/**
 * 正解フラッシュアニメーション
 */
export const animateSuccess = (element: HTMLElement): Animation => {
  const originalBackground = element.style.backgroundColor;

  const animation = animateElement(element, [
    {
      backgroundColor: 'rgb(34, 197, 94)',
      transform: 'scale(1)',
      boxShadow: '0 0 0 rgba(34, 197, 94, 0)'
    },
    {
      backgroundColor: 'rgb(22, 163, 74)',
      transform: 'scale(1.02)',
      boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)'
    },
    {
      backgroundColor: originalBackground || 'transparent',
      transform: 'scale(1)',
      boxShadow: '0 0 0 rgba(34, 197, 94, 0)'
    }
  ], {
    duration: 1000,
    easing: 'ease-out'
  });

  return animation;
};

/**
 * エラーシェイクアニメーション
 */
export const animateError = (element: HTMLElement): Animation => {
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

/**
 * スコア増加アニメーション
 */
export const animateScoreIncrease = (
  element: HTMLElement,
  points: number,
  options: {
    color?: string;
    fontSize?: string;
    duration?: number;
  } = {}
): Animation => {
  const {
    color = '#10b981',
    fontSize = '14px',
    duration = 1500
  } = options;

  // +ポイント表示要素を作成
  const floatingText = document.createElement('div');
  floatingText.textContent = `+${points}`;
  floatingText.style.cssText = `
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    color: ${color};
    font-weight: bold;
    font-size: ${fontSize};
    pointer-events: none;
    z-index: 1000;
  `;

  // 親要素の position を確認・設定
  const computedStyle = window.getComputedStyle(element);
  if (computedStyle.position === 'static') {
    element.style.position = 'relative';
  }

  element.appendChild(floatingText);

  const animation = animateElement(floatingText, [
    {
      opacity: '0',
      transform: 'translate(-50%, 0) scale(0.8)'
    },
    {
      opacity: '1',
      transform: 'translate(-50%, -10px) scale(1.1)'
    },
    {
      opacity: '0',
      transform: 'translate(-50%, -30px) scale(0.9)'
    }
  ], {
    duration,
    easing: 'ease-out'
  });

  // アニメーション完了後にクリーンアップ
  animation.addEventListener('finish', () => {
    floatingText.remove();
  });

  return animation;
};

/**
 * フェードインアニメーション
 */
export const animateFadeIn = (
  element: HTMLElement,
  options: {
    duration?: number;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
  } = {}
): Animation => {
  const {
    duration = 300,
    delay = 0,
    direction = 'up'
  } = options;

  const transforms = {
    up: 'translateY(20px)',
    down: 'translateY(-20px)',
    left: 'translateX(20px)',
    right: 'translateX(-20px)'
  };

  return animateElement(element, [
    {
      opacity: '0',
      transform: transforms[direction]
    },
    {
      opacity: '1',
      transform: 'translate(0, 0)'
    }
  ], {
    duration,
    delay,
    easing: 'ease-out',
    fill: 'both'
  });
};

/**
 * フェードアウトアニメーション
 */
export const animateFadeOut = (
  element: HTMLElement,
  options: {
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
  } = {}
): Animation => {
  const {
    duration = 300,
    direction = 'up'
  } = options;

  const transforms = {
    up: 'translateY(-20px)',
    down: 'translateY(20px)',
    left: 'translateX(-20px)',
    right: 'translateX(20px)'
  };

  return animateElement(element, [
    {
      opacity: '1',
      transform: 'translate(0, 0)'
    },
    {
      opacity: '0',
      transform: transforms[direction]
    }
  ], {
    duration,
    easing: 'ease-in',
    fill: 'both'
  });
};

/**
 * パルスアニメーション
 */
export const animatePulse = (
  element: HTMLElement,
  options: {
    scale?: number;
    duration?: number;
    iterations?: number;
  } = {}
): Animation => {
  const {
    scale = 1.05,
    duration = 1000,
    iterations = Infinity
  } = options;

  return animateElement(element, [
    { transform: 'scale(1)', opacity: '1' },
    { transform: `scale(${scale})`, opacity: '0.8' },
    { transform: 'scale(1)', opacity: '1' }
  ], {
    duration,
    iterations,
    easing: 'ease-in-out'
  });
};

/**
 * バウンスアニメーション
 */
export const animateBounce = (
  element: HTMLElement,
  options: {
    height?: string;
    duration?: number;
    iterations?: number;
  } = {}
): Animation => {
  const {
    height = '-10px',
    duration = 600,
    iterations = 3
  } = options;

  return animateElement(element, [
    { transform: 'translateY(0)' },
    { transform: `translateY(${height})` },
    { transform: 'translateY(0)' }
  ], {
    duration,
    iterations,
    easing: 'ease-out'
  });
};

/**
 * 回転アニメーション
 */
export const animateRotate = (
  element: HTMLElement,
  options: {
    degrees?: number;
    duration?: number;
    iterations?: number;
  } = {}
): Animation => {
  const {
    degrees = 360,
    duration = 1000,
    iterations = 1
  } = options;

  return animateElement(element, [
    { transform: 'rotate(0deg)' },
    { transform: `rotate(${degrees}deg)` }
  ], {
    duration,
    iterations,
    easing: 'ease-in-out'
  });
};

/**
 * ストリーク効果アニメーション
 */
export const animateStreak = (element: HTMLElement, streakLevel: number): Animation => {
  const colors = [
    '#10b981', // 緑
    '#f59e0b', // 黄
    '#ef4444', // 赤
    '#8b5cf6', // 紫
  ];

  const color = colors[Math.min(streakLevel - 1, colors.length - 1)];

  return animateElement(element, [
    {
      textShadow: `0 0 5px ${color}50`,
      transform: 'scale(1)'
    },
    {
      textShadow: `0 0 15px ${color}80, 0 0 25px ${color}50`,
      transform: 'scale(1.1)'
    },
    {
      textShadow: `0 0 5px ${color}50`,
      transform: 'scale(1)'
    }
  ], {
    duration: 1500,
    iterations: Infinity,
    easing: 'ease-in-out'
  });
};

/**
 * カードフリップアニメーション
 */
export const animateCardFlip = (
  element: HTMLElement,
  options: {
    duration?: number;
    axis?: 'x' | 'y';
  } = {}
): Animation => {
  const {
    duration = 600,
    axis = 'y'
  } = options;

  const rotateProperty = axis === 'y' ? 'rotateY' : 'rotateX';

  return animateElement(element, [
    { transform: `${rotateProperty}(0deg)` },
    { transform: `${rotateProperty}(90deg)` },
    { transform: `${rotateProperty}(0deg)` }
  ], {
    duration,
    easing: 'ease-in-out'
  });
};

/**
 * 複数要素の連続アニメーション
 */
export const animateSequence = (
  elements: HTMLElement[],
  animationFn: (element: HTMLElement, index: number) => Animation,
  delay: number = 100
): Promise<void> => {
  const animations = elements.map((element, index) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const animation = animationFn(element, index);
        animation.addEventListener('finish', () => resolve());
      }, delay * index);
    });
  });

  return Promise.all(animations).then(() => {});
};

/**
 * reduced-motionの設定を確認する関数
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * アニメーション設定のプリセット
 */
export const animationPresets = {
  // 基本的なイージング
  easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',

  // バウンス
  bounceOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // 継続時間
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800
  }
};

const animations = {
  animateElement,
  animateFingerPress,
  animateSuccess,
  animateError,
  animateScoreIncrease,
  animateFadeIn,
  animateFadeOut,
  animatePulse,
  animateBounce,
  animateRotate,
  animateStreak,
  animateCardFlip,
  animateSequence,
  prefersReducedMotion,
  animationPresets
};

export default animations;