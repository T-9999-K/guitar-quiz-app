/**
 * LocalStorage管理フック
 * 
 * @description ブラウザのLocalStorageを使用したデータ永続化フック
 * @author Claude Code
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChordPattern, GameSettings, DifficultyLevel } from '../types';

// =============================================================================
// Types - 型定義
// =============================================================================

/**
 * スコア記録の型定義
 */
export interface ScoreRecord {
  /** 記録日時（ISO文字列） */
  date: string;
  /** 獲得スコア */
  score: number;
  /** プレイした難易度 */
  difficulty: DifficultyLevel;
  /** 総問題数 */
  totalQuestions: number;
  /** 正解数 */
  correctAnswers: number;
  /** 最高連続正解数 */
  streak: number;
  /** 経過時間（秒） */
  timeElapsed: number;
  /** プレイ時間（秒） - timeElapsedのエイリアス */
  timeSpent: number;
  /** 使用したヒント数 */
  hintsUsed: number;
  /** ゲームID（重複チェック用） */
  gameId?: string;
}

/**
 * 統計情報の型定義
 */
export interface OverallStats {
  /** 総ゲーム数 */
  totalGames: number;
  /** 平均スコア */
  averageScore: number;
  /** 最高スコア */
  bestScore: number;
  /** 最高連続正解数 */
  bestStreak: number;
  /** 最も頻繁にプレイした難易度 */
  favoriteDifficulty: DifficultyLevel;
  /** 総プレイ時間（秒） */
  totalPlayTime: number;
  /** 平均正答率（%） */
  averageAccuracy: number;
  /** 難易度別統計 */
  byDifficulty: Record<DifficultyLevel, {
    games: number;
    averageScore: number;
    bestScore: number;
    accuracy: number;
  }>;
}

/**
 * LocalStorageのキー定数
 */
export const STORAGE_KEYS = {
  GAME_SETTINGS: 'guitar-quiz-settings',
  SCORE_HISTORY: 'guitar-quiz-scores',
  USER_PREFERENCES: 'guitar-quiz-preferences',
  QUIZ_STATE: 'guitar-quiz-state',
} as const;

// =============================================================================
// Utility Functions - ユーティリティ関数
// =============================================================================

/**
 * 最も頻繁にプレイされた難易度を取得
 */
const getMostFrequentDifficulty = (records: ScoreRecord[]): DifficultyLevel => {
  if (records.length === 0) return 'beginner';
  
  const counts = records.reduce((acc, record) => {
    acc[record.difficulty] = (acc[record.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<DifficultyLevel, number>);
  
  return Object.entries(counts).reduce((a, b) => 
    counts[a[0] as DifficultyLevel] > counts[b[0] as DifficultyLevel] ? a : b
  )[0] as DifficultyLevel;
};

/**
 * 難易度別統計を計算
 */
const calculateDifficultyStats = (records: ScoreRecord[]) => {
  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
  const stats: Record<DifficultyLevel, { games: number; averageScore: number; bestScore: number; accuracy: number }> = {} as any;
  
  difficulties.forEach(difficulty => {
    const difficultyRecords = records.filter(record => record.difficulty === difficulty);
    
    if (difficultyRecords.length === 0) {
      stats[difficulty] = {
        games: 0,
        averageScore: 0,
        bestScore: 0,
        accuracy: 0,
      };
    } else {
      const totalScore = difficultyRecords.reduce((sum, record) => sum + record.score, 0);
      const totalCorrect = difficultyRecords.reduce((sum, record) => sum + record.correctAnswers, 0);
      const totalQuestions = difficultyRecords.reduce((sum, record) => sum + record.totalQuestions, 0);
      
      stats[difficulty] = {
        games: difficultyRecords.length,
        averageScore: totalScore / difficultyRecords.length,
        bestScore: Math.max(...difficultyRecords.map(record => record.score)),
        accuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      };
    }
  });
  
  return stats;
};

/**
 * ユニークなゲームIDを生成
 */
const generateGameId = (): string => {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// =============================================================================
// Main Hooks - メインフック
// =============================================================================

/**
 * 汎用LocalStorageフック
 * 
 * @param key - LocalStorageのキー
 * @param initialValue - 初期値
 * @returns [値, setter関数]
 * 
 * @example
 * ```typescript
 * const [count, setCount] = useLocalStorage('counter', 0);
 * const [settings, setSettings] = useLocalStorage('settings', defaultSettings);
 * ```
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // SSR対応の初期値設定
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // SSR環境での安全な処理
      if (typeof window === 'undefined') {
        return initialValue;
      }
      
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // クライアントサイドでの初期化
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}" on mount:`, error);
    }
  }, [key]);

  // 値の設定関数
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // クライアントサイドでのみLocalStorageに保存
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // カスタムイベントを発火（他のタブでの同期用）
        window.dispatchEvent(new StorageEvent('localStorage', {
          key,
          newValue: JSON.stringify(valueToStore),
          oldValue: window.localStorage.getItem(key),
          storageArea: window.localStorage,
          url: window.location.href,
        }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 他のタブでの変更を監視
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};

/**
 * ゲーム設定管理フック
 * 
 * @returns 設定値と更新関数
 * 
 * @example
 * ```typescript
 * const { settings, updateSettings, resetSettings } = useGameSettings();
 * ```
 */
export const useGameSettings = () => {
  const defaultSettings: GameSettings = {
    difficulty: 'beginner',
    soundEnabled: true,
    capoPosition: 0,
    theme: 'light',
  };

  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.GAME_SETTINGS, defaultSettings);

  // 設定の部分更新
  const updateSettings = useCallback((updates: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, [setSettings]);

  // 設定のリセット
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  // 設定の検証
  const validateSettings = useCallback((settingsToValidate: GameSettings): boolean => {
    return (
      ['beginner', 'intermediate', 'advanced'].includes(settingsToValidate.difficulty) &&
      typeof settingsToValidate.soundEnabled === 'boolean' &&
      typeof settingsToValidate.capoPosition === 'number' &&
      settingsToValidate.capoPosition >= 0 &&
      settingsToValidate.capoPosition <= 12 &&
      ['light', 'dark'].includes(settingsToValidate.theme)
    );
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    validateSettings,
  };
};

/**
 * スコア履歴管理フック
 * 
 * @returns 履歴データと操作関数
 * 
 * @example
 * ```typescript
 * const { history, addScore, getStats, clearHistory } = useScoreHistory();
 * ```
 */
export const useScoreHistory = () => {
  const [history, setHistory] = useLocalStorage<ScoreRecord[]>(STORAGE_KEYS.SCORE_HISTORY, []);

  // スコア記録を追加
  const addScore = useCallback((record: Omit<ScoreRecord, 'date' | 'gameId'>) => {
    const newRecord: ScoreRecord = {
      ...record,
      date: new Date().toISOString(),
      gameId: generateGameId(),
    };

    setHistory(prev => {
      // 重複チェック（同じタイムスタンプの記録を避ける）
      const filtered = prev.filter(existingRecord => 
        existingRecord.date !== newRecord.date
      );
      
      // 最新100件を保持（メモリ使用量を制限）
      return [newRecord, ...filtered].slice(0, 100);
    });

    return newRecord.gameId;
  }, [setHistory]);

  // 統計情報を計算
  const getStats = useCallback((): OverallStats | null => {
    if (history.length === 0) return null;

    const totalQuestions = history.reduce((sum, record) => sum + record.totalQuestions, 0);
    const totalCorrect = history.reduce((sum, record) => sum + record.correctAnswers, 0);

    return {
      totalGames: history.length,
      averageScore: history.reduce((sum, record) => sum + record.score, 0) / history.length,
      bestScore: Math.max(...history.map(record => record.score)),
      bestStreak: Math.max(...history.map(record => record.streak)),
      favoriteDifficulty: getMostFrequentDifficulty(history),
      totalPlayTime: history.reduce((sum, record) => sum + record.timeElapsed, 0),
      averageAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      byDifficulty: calculateDifficultyStats(history),
    };
  }, [history]);

  // 特定期間の履歴を取得
  const getHistoryByDateRange = useCallback((startDate: Date, endDate: Date): ScoreRecord[] => {
    return history.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }, [history]);

  // 難易度別履歴を取得
  const getHistoryByDifficulty = useCallback((difficulty: DifficultyLevel): ScoreRecord[] => {
    return history.filter(record => record.difficulty === difficulty);
  }, [history]);

  // 履歴をクリア
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  // 特定の記録を削除
  const removeRecord = useCallback((gameId: string) => {
    setHistory(prev => prev.filter(record => record.gameId !== gameId));
  }, [setHistory]);

  // データのエクスポート
  const exportData = useCallback(() => {
    return {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: history,
    };
  }, [history]);

  // データのインポート
  const importData = useCallback((importedData: { data: ScoreRecord[] }) => {
    if (Array.isArray(importedData.data)) {
      setHistory(importedData.data.slice(0, 100)); // 最新100件まで
    }
  }, [setHistory]);

  return {
    history,
    addScore,
    getStats,
    getHistoryByDateRange,
    getHistoryByDifficulty,
    clearHistory,
    removeRecord,
    exportData,
    importData,
  };
};

/**
 * ユーザー設定管理フック（UIプリファレンス用）
 * 
 * @returns ユーザー設定と操作関数
 */
export const useUserPreferences = () => {
  interface UserPreferences {
    /** フレットボードに指番号を表示するか */
    showFingers: boolean;
    /** アニメーションを有効にするか */
    enableAnimations: boolean;
    /** 自動進行を有効にするか */
    autoProgress: boolean;
    /** 自動進行の遅延時間（ミリ秒） */
    autoProgressDelay: number;
    /** ヒント機能を有効にするか */
    hintsEnabled: boolean;
    /** 言語設定 */
    language: 'ja' | 'en';
  }

  const defaultPreferences: UserPreferences = {
    showFingers: true,
    enableAnimations: true,
    autoProgress: true,
    autoProgressDelay: 2000,
    hintsEnabled: true,
    language: 'ja',
  };

  const [preferences, setPreferences] = useLocalStorage(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences]);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  };
};

export default useLocalStorage;