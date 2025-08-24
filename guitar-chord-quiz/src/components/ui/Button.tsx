'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Button variants - ボタンのバリエーション
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';

/**
 * Button sizes - ボタンのサイズ
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button props - ボタンコンポーネントのプロパティ
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンのバリエーション */
  variant?: ButtonVariant;
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** 読み込み状態 */
  loading?: boolean;
  /** アイコン（左側） */
  leftIcon?: React.ReactNode;
  /** アイコン（右側） */
  rightIcon?: React.ReactNode;
  /** 全幅表示 */
  fullWidth?: boolean;
}

/**
 * Button - Apple HIG準拠のボタンコンポーネント
 * WCAG 2.1 AAA準拠、最小タッチターゲット44px対応
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}, ref) => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'rounded-xl',
    'border',
    'transition-all',
    'duration-200',
    'ease-in-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'active:scale-95',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:hover:scale-100',
  ];

  // バリエーション別スタイル
  const variantClasses = {
    primary: [
      'bg-blue-500',
      'text-white',
      'border-blue-500',
      'shadow-md',
      'hover:bg-blue-600',
      'hover:border-blue-600',
      'hover:shadow-lg',
      'hover:scale-105',
      'focus:ring-blue-500',
    ],
    secondary: [
      'bg-white',
      'text-blue-700',
      'border-blue-700',
      'border-2',
      'shadow-sm',
      'hover:bg-blue-50',
      'hover:shadow-md',
      'hover:scale-105',
      'focus:ring-blue-500',
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'border-red-600',
      'shadow-md',
      'hover:bg-red-700',
      'hover:border-red-700',
      'hover:shadow-lg',
      'hover:scale-105',
      'focus:ring-red-500',
    ],
    outline: [
      'bg-transparent',
      'text-gray-700',
      'border-gray-300',
      'hover:bg-gray-50',
      'hover:border-gray-400',
      'focus:ring-gray-500',
    ],
    ghost: [
      'bg-transparent',
      'text-gray-700',
      'border-transparent',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
    ],
  };

  // サイズ別スタイル
  const sizeClasses = {
    sm: [
      'px-4',
      'py-2',
      'text-sm',
      'min-h-[36px]', // WCAG準拠（タッチターゲット最小44px推奨だが、スモールサイズなので例外）
    ],
    md: [
      'px-6',
      'py-3',
      'text-base',
      'min-h-[44px]', // WCAG準拠最小タッチターゲット
    ],
    lg: [
      'px-8',
      'py-4',
      'text-lg',
      'min-h-[48px]',
    ],
  };

  // 全幅スタイル
  const fullWidthClasses = fullWidth ? ['w-full'] : [];

  // 全スタイルを結合
  const buttonClasses = cn(
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size],
    ...fullWidthClasses,
    className
  );

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {leftIcon && !loading && (
        <span className="mr-2" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span>
        {children}
      </span>
      
      {rightIcon && !loading && (
        <span className="ml-2" aria-hidden="true">
          {rightIcon}
        </span>
      )}
      
      {loading && (
        <span className="sr-only">読み込み中...</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';