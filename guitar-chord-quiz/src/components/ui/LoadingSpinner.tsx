'use client';

import React from 'react';

/**
 * ローディングスピナーコンポーネントのプロパティ
 */
interface LoadingSpinnerProps {
  /** サイズ */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 色 */
  color?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
  /** 表示メッセージ */
  message?: string;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * ローディングスピナーコンポーネント
 *
 * 読み込み中の状態を視覚的に表示します。
 * アクセシビリティを考慮し、スクリーンリーダー対応も含んでいます。
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  message,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500',
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* スピナー本体 */}
      <div
        className={`
          ${sizeClasses[size]}
          border-gray-200
          ${colorClasses[color]}
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label={message || '読み込み中'}
      />

      {/* メッセージ表示 */}
      {message && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}

      {/* スクリーンリーダー用テキスト */}
      <span className="sr-only">{message || '読み込み中です。しばらくお待ちください。'}</span>
    </div>
  );
};

/**
 * フレットボードローダーコンポーネント
 *
 * フレットボード読み込み時の専用ローダー
 */
export const FretboardLoader: React.FC<{ message?: string }> = ({
  message = 'フレットボードを準備中...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-gray-50 rounded-lg">
      {/* ギター型ローディングアニメーション */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">🎸</span>
        </div>
      </div>

      {/* メッセージ */}
      <p className="text-gray-600 font-medium animate-pulse">{message}</p>

      {/* プログレスドット */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

/**
 * 音声ローダーコンポーネント
 *
 * 音声システム初期化時の専用ローダー
 */
export const AudioLoader: React.FC<{ message?: string }> = ({
  message = '音声システムを初期化中...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      {/* 音声波形風ローディングアニメーション */}
      <div className="flex items-end space-x-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-2 bg-green-500 rounded-t-sm animate-pulse"
            style={{
              height: `${Math.random() * 20 + 10}px`,
              animationDelay: `${index * 0.1}s`,
              animationDuration: '0.8s',
            }}
          />
        ))}
      </div>

      {/* 音声アイコン */}
      <div className="text-3xl animate-bounce">🔊</div>

      {/* メッセージ */}
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
};

/**
 * クイズローダーコンポーネント
 *
 * クイズ問題生成時の専用ローダー
 */
export const QuizLoader: React.FC<{ message?: string }> = ({
  message = '次の問題を準備中...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      {/* 回転するクエスチョンマーク */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-purple-600 animate-pulse">?</span>
        </div>
      </div>

      {/* メッセージ */}
      <p className="text-gray-600 font-medium">{message}</p>

      {/* 進行状況表示 */}
      <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

/**
 * ページローダーコンポーネント
 *
 * ページ全体の読み込み時の専用ローダー
 */
export const PageLoader: React.FC<{ message?: string }> = ({
  message = 'ページを読み込み中...'
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      {/* メインローダー */}
      <div className="relative">
        {/* 外側のリング */}
        <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>

        {/* 内側のリング */}
        <div className="absolute inset-2 border-4 border-gray-100 border-b-purple-500 rounded-full animate-spin"
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>

        {/* 中央のアイコン */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl animate-pulse">🎸</span>
        </div>
      </div>

      {/* メッセージ */}
      <p className="mt-6 text-gray-700 font-medium text-lg">{message}</p>

      {/* サブテキスト */}
      <p className="mt-2 text-gray-500 text-sm">少々お待ちください</p>

      {/* プログレスドット */}
      <div className="mt-4 flex space-x-2">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * インラインローダーコンポーネント
 *
 * ボタン内などの小さなスペース用ローダー
 */
export const InlineLoader: React.FC<{
  size?: 'xs' | 'sm';
  color?: 'white' | 'gray' | 'blue';
}> = ({
  size = 'sm',
  color = 'white'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
  };

  const colorClasses = {
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
    blue: 'border-blue-500 border-t-transparent',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${colorClasses[color]}
        rounded-full
        animate-spin
      `}
      role="status"
      aria-label="読み込み中"
    />
  );
};

export default LoadingSpinner;