import React from 'react';

/**
 * 遅延ローディング関数
 *
 * @description 動的インポートによるコンポーネント遅延ローディング
 * @param importFunc - 動的インポート関数
 * @returns 遅延ローディングされたコンポーネント
 */
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

/**
 * メモ化されたコンポーネント作成
 *
 * @description React.memoによるコンポーネント最適化
 * @param Component - 対象コンポーネント
 * @param areEqual - カスタム比較関数（オプション）
 * @returns メモ化されたコンポーネント
 */
export const createMemoComponent = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual);
};

/**
 * 画像最適化プロパティ
 *
 * @description 画像の遅延ローディング・非同期デコーディング設定
 * @param src - 画像ソース
 * @param alt - 代替テキスト
 * @returns 最適化されたimg要素プロパティ
 */
export const optimizedImageProps = (src: string, alt: string) => ({
  src,
  alt,
  loading: 'lazy' as const,
  decoding: 'async' as const,
});

/**
 * パフォーマンス監視
 *
 * @description Core Web Vitals指標の監視
 */
export const performanceObserver = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('CLS:', (entry as any).value);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // 一部のブラウザで対応していない場合のフォールバック
      console.warn('Performance monitoring not fully supported');
    }

    return () => observer.disconnect();
  }
};

/**
 * 重いタスクの分割実行
 *
 * @description requestIdleCallbackを使用した非ブロッキング処理
 * @param tasks - 実行するタスク配列
 * @param timeSlice - 1回の実行時間制限（ミリ秒）
 */
export const scheduleWork = (
  tasks: (() => void)[],
  timeSlice = 5
): Promise<void> => {
  return new Promise((resolve) => {
    const processTask = () => {
      const startTime = performance.now();

      while (tasks.length > 0 && performance.now() - startTime < timeSlice) {
        const task = tasks.shift();
        if (task) task();
      }

      if (tasks.length > 0) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(processTask);
        } else {
          setTimeout(processTask, 0);
        }
      } else {
        resolve();
      }
    };

    processTask();
  });
};

/**
 * リソースヒント追加
 *
 * @description DNS prefetch, preconnect, preload等のヒント追加
 * @param url - リソースURL
 * @param rel - リソースヒントタイプ
 */
export const addResourceHint = (url: string, rel: 'dns-prefetch' | 'preconnect' | 'preload' | 'prefetch') => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = url;

    if (rel === 'preload') {
      link.as = 'script';
    }

    document.head.appendChild(link);
  }
};