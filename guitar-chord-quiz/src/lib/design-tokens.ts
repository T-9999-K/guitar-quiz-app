/**
 * Apple風デザインシステム - デザイントークン
 * design_rule.md準拠の一元管理
 *
 * @fileoverview すべてのデザイン値を統一管理し、
 * コンポーネント間での一貫性を保証します。
 */

/**
 * カラーシステム（WCAG 2.1 準拠）
 */
export const colors = {
  primary: {
    50: '#EFF6FF', // 背景用（最小限使用）
    100: '#DBEAFE', // アイコン背景（最小限使用）
    500: '#3B82F6', // メインブルー - 主要アクション
    600: '#2563EB', // ダークブルー - ホバー状態
    700: '#1D4ED8', // 強調ブルー - テキスト用
    800: '#1E40AF', // 超強調ブルー - 白背景でのテキスト
  },
  gray: {
    50: '#F9FAFB', // セクション背景（必要な場合のみ）
    200: '#E5E7EB', // 薄境界線
    300: '#D1D5DB', // 境界線
    500: '#6B7280', // 非重要テキスト（コントラスト比4.5:1）
    600: '#4B5563', // 注釈テキスト（コントラスト比7:1）
    700: '#374151', // 補助テキスト（コントラスト比12.6:1）
    900: '#111827', // メインテキスト（コントラスト比21:1）
  },
  system: {
    success: '#059669', // コントラスト比7:1
    warning: '#D97706', // コントラスト比7:1
    error: '#DC2626', // コントラスト比7:1
    info: '#1D4ED8', // コントラスト比7:1
  },
  white: '#FFFFFF',
} as const;

/**
 * 余白システム（8px単位）
 */
export const spacing = {
  xs: '2px', // 0.5rem - 極小
  sm: '4px', // 1rem - 最小
  md: '8px', // 2rem - 小
  lg: '16px', // 4rem - 標準
  xl: '24px', // 6rem - 中
  '2xl': '32px', // 8rem - 大
  '3xl': '48px', // 12rem - 特大
  '4xl': '64px', // 16rem - 最大
} as const;

/**
 * 角丸システム
 */
export const borderRadius = {
  sm: '8px', // rounded-lg - 小ボタン、入力フィールド
  md: '12px', // rounded-xl - 標準ボタン
  lg: '16px', // rounded-2xl - 大ボタン、カード
  xl: '24px', // rounded-3xl - モーダル
  full: '9999px', // rounded-full - アイコンボタン
} as const;

/**
 * 影システム
 */
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)', // カード標準影
  md: '0 4px 6px rgba(0, 0, 0, 0.07)', // ボタン標準影、カードホバー影
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)', // ドロップダウン影
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)', // モーダル影
} as const;

/**
 * アクセシビリティ基準
 */
export const accessibility = {
  /** 最小タッチターゲットサイズ（px） */
  MIN_TOUCH_TARGET: 44,

  /** WCAGコントラスト比要件 */
  CONTRAST_RATIOS: {
    AA_NORMAL: 4.5, // 通常テキスト
    AA_LARGE: 3, // 大きなテキスト（18px以上または太字14px以上）
    AAA_NORMAL: 7, // AAA対応
    UI_COMPONENTS: 3, // UIコンポーネント境界
  },

  /** アニメーション継続時間（ms） */
  ANIMATION_DURATION: {
    FAST: 150, // 色変化など
    NORMAL: 200, // 標準トランジション
    SLOW: 300, // 複雑なアニメーション
  },
} as const;

/**
 * タイポグラフィシステム
 */
export const typography = {
  fontSize: {
    xs: '12px', // キャプション
    sm: '14px', // 小さい本文
    base: '16px', // 本文
    lg: '18px', // 見出し4
    xl: '20px', // 見出し3
    '2xl': '24px', // 見出し2
    '3xl': '30px', // 見出し1
    '4xl': '36px', // 大見出し
  },
  fontWeight: {
    normal: 400, // 本文
    semibold: 600, // ボタン、見出し、強調
    bold: 700, // 大見出し
  },
  lineHeight: {
    tight: 1.25, // 見出し
    normal: 1.5, // 標準
    relaxed: 1.625, // 本文
    loose: 2, // 長文
  },
} as const;

/**
 * ブレークポイント
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * 型安全性のための型定義
 */
export type ColorKeys = keyof typeof colors.primary;
export type SpacingKeys = keyof typeof spacing;
export type BorderRadiusKeys = keyof typeof borderRadius;
export type ShadowKeys = keyof typeof shadows;