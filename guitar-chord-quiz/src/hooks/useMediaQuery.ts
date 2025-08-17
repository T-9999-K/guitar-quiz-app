/**
 * MediaQuery カスタムフック
 * 
 * @description 画面サイズやメディアクエリの状態を監視するReactフック
 * @author Claude Code
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * メディアクエリの状態を監視するカスタムフック
 * 
 * @param query - CSSメディアクエリ文字列
 * @returns メディアクエリにマッチするかどうかのboolean値
 * 
 * @example
 * ```typescript
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * ```
 */
export const useMediaQuery = (query: string): boolean => {
  // SSR対応: 初期値をfalseに設定
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // 初期状態を設定
    setMatches(mediaQuery.matches);

    // メディアクエリの変更を監視
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // イベントリスナーを追加
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 古いブラウザ対応
      mediaQuery.addListener(handleChange);
    }

    // クリーンアップ
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // 古いブラウザ対応
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
};

/**
 * 定義済みのレスポンシブブレークポイント用フック
 */
export const useResponsiveBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  // 高コントラストモード検出
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  
  // アニメーション低減設定検出
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // ダークモード検出
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    prefersHighContrast,
    prefersReducedMotion,
    prefersDarkMode,
    // デバイスタイプを文字列で返す
    deviceType: isMobile ? 'mobile' as const : isTablet ? 'tablet' as const : 'desktop' as const,
    // 画面幅に応じたフレット数を返す
    maxFrets: isMobile ? 5 : isTablet ? 8 : 12,
  };
};

/**
 * 画面幅を数値で取得するフック
 * 
 * @returns 現在の画面幅（ピクセル）
 */
export const useScreenWidth = (): number => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    // SSR対応
    if (typeof window === 'undefined') return;

    // 初期値を設定
    setScreenWidth(window.innerWidth);

    // リサイズイベントを監視
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenWidth;
};

/**
 * タッチデバイス検出フック
 * 
 * @returns タッチデバイスかどうかのboolean値
 */
export const useIsTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // SSR対応
    if (typeof window === 'undefined') return;

    // タッチイベントのサポートを確認
    const hasTouch = 'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0 || 
                     // @ts-ignore - IE/Edge対応
                     navigator.msMaxTouchPoints > 0;

    setIsTouchDevice(hasTouch);
  }, []);

  return isTouchDevice;
};

export default useMediaQuery;