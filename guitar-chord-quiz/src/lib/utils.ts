/**
 * Utility Functions - ユーティリティ関数
 * 
 * @description 汎用的なヘルパー関数を定義
 * @author Claude Code
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS クラス名を結合・マージするユーティリティ
 * 
 * @param inputs - クラス名のリスト
 * @returns マージされたクラス名文字列
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 遅延実行ユーティリティ
 * 
 * @param ms - 遅延時間（ミリ秒）
 * @returns Promise
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ランダムな整数を生成
 * 
 * @param min - 最小値（含む）
 * @param max - 最大値（含む）
 * @returns ランダムな整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 配列からランダムな要素を選択
 * 
 * @param array - 配列
 * @returns ランダムな要素
 */
export function randomChoice<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * 配列をシャッフル（Fisher-Yates algorithm）
 * 
 * @param array - シャッフル対象の配列
 * @returns シャッフルされた新しい配列
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 数値を指定桁数でゼロ埋め
 * 
 * @param num - 数値
 * @param digits - 桁数
 * @returns ゼロ埋めされた文字列
 */
export function padZero(num: number, digits: number): string {
  return String(num).padStart(digits, '0');
}

/**
 * 時間（秒）を MM:SS 形式でフォーマット
 * 
 * @param seconds - 秒数
 * @returns フォーマットされた時間文字列
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${padZero(mins, 2)}:${padZero(secs, 2)}`;
}

/**
 * パーセンテージを計算（小数点以下1桁）
 * 
 * @param value - 値
 * @param total - 全体
 * @returns パーセンテージ
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 10) / 10;
}

/**
 * 文字列を安全にトリム
 * 
 * @param str - 文字列（null/undefinedの可能性あり）
 * @returns トリムされた文字列またはからの文字列
 */
export function safeTrim(str: string | null | undefined): string {
  return str?.trim() ?? '';
}

/**
 * オブジェクトから指定のキーを除外
 * 
 * @param obj - 元のオブジェクト
 * @param keys - 除外するキーの配列
 * @returns 新しいオブジェクト
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * オブジェクトから指定のキーのみを抽出
 * 
 * @param obj - 元のオブジェクト
 * @param keys - 抽出するキーの配列
 * @returns 新しいオブジェクト
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * デバウンス処理
 * 
 * @param func - デバウンス対象の関数
 * @param delay - 遅延時間（ミリ秒）
 * @returns デバウンスされた関数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
}

/**
 * スロットル処理
 * 
 * @param func - スロットル対象の関数
 * @param limit - 制限時間（ミリ秒）
 * @returns スロットルされた関数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}