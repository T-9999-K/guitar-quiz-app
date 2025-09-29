'use client';

/**
 * テーマ管理フック
 *
 * @description ダーク・ライトモードの切り替えとシステム設定の管理
 * @author Claude Code
 */

import { useEffect, useState, useCallback } from 'react';
import { useGameSettings } from './useLocalStorage';

export type Theme = 'light' | 'dark' | 'system';

/**
 * テーマ管理フック
 *
 * @returns テーマ状態と操作関数
 *
 * @example
 * ```typescript
 * const { theme, setTheme, isDark, mounted } = useTheme();
 * ```
 */
export const useTheme = () => {
  const { settings, updateSettings } = useGameSettings();
  const [mounted, setMounted] = useState(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // システムテーマの検出
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // マウント状態の管理（SSR対応）
  useEffect(() => {
    setMounted(true);
  }, []);

  // 実際に適用されるテーマの計算
  const resolvedTheme = settings.theme === 'system' ? systemTheme : settings.theme;

  // DOMにテーマクラスを適用
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolvedTheme);

      // メタテーマカラーの更新
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
        );
      }
    }
  }, [resolvedTheme, mounted]);

  // テーマの設定
  const setTheme = useCallback((newTheme: Theme) => {
    updateSettings({ theme: newTheme });
  }, [updateSettings]);

  // テーマの切り替え（light ↔ dark）
  const toggleTheme = useCallback(() => {
    const currentResolved = settings.theme === 'system' ? systemTheme : settings.theme;
    const newTheme = currentResolved === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [settings.theme, systemTheme, setTheme]);

  // システムテーマに戻す
  const useSystemTheme = useCallback(() => {
    setTheme('system');
  }, [setTheme]);

  // SSR対応：マウント前は安全なデフォルト値を返す
  if (!mounted) {
    return {
      theme: 'light' as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
      useSystemTheme: () => {},
      isDark: false,
      isLight: true,
      isSystem: false,
      resolvedTheme: 'light' as const,
      mounted: false,
      systemTheme: 'light' as const,
    };
  }

  return {
    theme: settings.theme,
    setTheme,
    toggleTheme,
    useSystemTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: settings.theme === 'system',
    resolvedTheme,
    mounted: true,
    systemTheme,
  };
};

/**
 * テーマカスタマイゼーション関数
 */
export const themeUtils = {
  /**
   * テーマに応じたCSSクラスの取得
   */
  getThemeClasses: (baseClasses: string, lightClasses: string, darkClasses: string) => {
    return `${baseClasses} ${lightClasses} dark:${darkClasses}`;
  },

  /**
   * テーマに応じた値の取得
   */
  getThemeValue: <T>(lightValue: T, darkValue: T, isDark: boolean): T => {
    return isDark ? darkValue : lightValue;
  },

  /**
   * アニメーション配慮のチェック
   */
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * コントラスト比の計算（アクセシビリティ用）
   */
  calculateContrastRatio: (color1: string, color2: string): number => {
    // 簡易実装 - 実際のプロダクションではより精密な計算が必要
    const getLuminance = (color: string): number => {
      // 基本的な luminance 計算
      const rgb = parseInt(color.replace('#', ''), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const rsRGB = r / 255;
      const gsRGB = g / 255;
      const bsRGB = b / 255;

      return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },
};

export default useTheme;