/**
 * クイズ状態管理カスタムフック
 * 
 * @description クイズのゲーム状態・進行制御・スコア計算を管理
 * @author Claude Code
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChordPattern, QuizState, DifficultyLevel, GameStatistics } from '../types';
import { getRandomChord, getChordsByDifficulty } from '../data/chord-patterns';

// =============================================================================
// Types - 型定義
// =============================================================================

/**
 * クイズ状態管理フックの戻り値
 */
interface UseQuizStateReturn {
  /** 現在のクイズ状態 */
  state: QuizState;
  /** ゲームがアクティブかどうか */
  gameActive: boolean;
  /** 結果表示中かどうか */
  showResult: boolean;
  /** 最後の回答が正解かどうか */
  lastAnswerCorrect: boolean | null;
  /** ゲーム統計 */
  statistics: GameStatistics;
  /** ゲーム開始 */
  startQuiz: () => void;
  /** クイズリセット */
  resetQuiz: () => void;
  /** 回答提出 */
  submitAnswer: (answer: string) => boolean;
  /** 次のコードに進む */
  nextChord: () => void;
  /** ヒント使用 */
  useHint: () => string;
  /** ゲーム一時停止 */
  pauseGame: () => void;
  /** ゲーム再開 */
  resumeGame: () => void;
  /** 難易度変更 */
  changeDifficulty: (newDifficulty: DifficultyLevel) => void;
}

/**
 * ローカルストレージキー
 */
const STORAGE_KEYS = {
  QUIZ_STATE: 'guitar-quiz-state',
  STATISTICS: 'guitar-quiz-statistics',
  SETTINGS: 'guitar-quiz-settings',
} as const;

/**
 * ゲーム設定
 */
interface GameSettings {
  /** 自動進行するかどうか */
  autoProgress: boolean;
  /** 自動進行の遅延時間（ミリ秒） */
  autoProgressDelay: number;
  /** ヒント機能を有効にするか */
  hintsEnabled: boolean;
  /** タイマー表示を有効にするか */
  timerEnabled: boolean;
  /** 音声フィードバックを有効にするか */
  audioEnabled: boolean;
}

// =============================================================================
// Utility Functions - ユーティリティ関数
// =============================================================================

/**
 * 初期クイズ状態を生成
 */
const createInitialState = (difficulty: DifficultyLevel): QuizState => ({
  currentChord: null,
  userAnswer: null,
  score: 0,
  streak: 0,
  totalAnswers: 0,
  correctAnswers: 0,
  timeElapsed: 0,
  difficulty,
  hintsUsed: 0,
  isGameActive: false,
  currentRound: 0,
});

/**
 * 統計情報を計算
 */
const calculateStatistics = (state: QuizState): GameStatistics => {
  const accuracy = state.totalAnswers > 0 ? (state.correctAnswers / state.totalAnswers) * 100 : 0;
  const averageTime = state.totalAnswers > 0 ? state.timeElapsed / state.totalAnswers : 0;
  
  return {
    gamesPlayed: state.currentRound,
    totalScore: state.score,
    bestStreak: state.streak, // 実際の実装では最高記録を保存すべき
    accuracy,
    averageTimePerQuestion: averageTime,
    totalTimeElapsed: state.timeElapsed,
    hintsUsed: state.hintsUsed,
    difficulty: state.difficulty,
  };
};

/**
 * スコア計算
 */
const calculateScore = (
  isCorrect: boolean,
  timeElapsed: number,
  hintsUsed: number,
  streak: number,
  difficulty: DifficultyLevel
): number => {
  if (!isCorrect) return 0;

  // 基本スコア（難易度に応じて変動）
  const baseScore = {
    beginner: 10,
    intermediate: 15,
    advanced: 20,
  }[difficulty];

  // 時間ボーナス（30秒以内で満点、それ以降は減点）
  const timeBonus = Math.max(0, Math.floor((30 - timeElapsed) / 3));
  
  // ストリークボーナス
  const streakBonus = Math.min(streak * 2, 20);
  
  // ヒント使用によるペナルティ
  const hintPenalty = hintsUsed * 2;

  return Math.max(1, baseScore + timeBonus + streakBonus - hintPenalty);
};

/**
 * ローカルストレージからデータを読み込み
 */
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * ローカルストレージにデータを保存
 */
const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// =============================================================================
// Main Hook - メインフック
// =============================================================================

/**
 * クイズ状態管理カスタムフック
 * 
 * @param difficulty - 初期難易度
 * @returns クイズ状態と操作関数
 * 
 * @example
 * ```typescript
 * const {
 *   state,
 *   gameActive,
 *   startQuiz,
 *   submitAnswer,
 *   nextChord
 * } = useQuizState('beginner');
 * ```
 */
export const useQuizState = (difficulty: DifficultyLevel): UseQuizStateReturn => {
  // 状態管理
  const [state, setState] = useState<QuizState>(() => 
    loadFromStorage(STORAGE_KEYS.QUIZ_STATE, createInitialState(difficulty))
  );
  
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // 設定
  const [settings] = useState<GameSettings>(() => 
    loadFromStorage(STORAGE_KEYS.SETTINGS, {
      autoProgress: true,
      autoProgressDelay: 2000,
      hintsEnabled: true,
      timerEnabled: true,
      audioEnabled: false,
    })
  );

  // タイマー用ref
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const autoProgressRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const questionStartTime = useRef<number>(0);

  // 統計情報を計算
  const statistics = calculateStatistics(state);

  // ローカルストレージに状態を保存
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.QUIZ_STATE, state);
  }, [state]);

  // ゲーム開始
  const startQuiz = useCallback(() => {
    try {
      const randomChord = getRandomChord(difficulty);
      const newState: QuizState = {
        ...createInitialState(difficulty),
        currentChord: randomChord,
        isGameActive: true,
        currentRound: state.currentRound + 1,
      };
      
      setState(newState);
      setGameActive(true);
      setShowResult(false);
      setLastAnswerCorrect(null);
      setIsPaused(false);
      questionStartTime.current = Date.now();
    } catch (error) {
      console.error('Failed to start quiz:', error);
    }
  }, [difficulty, state.currentRound]);

  // クイズリセット
  const resetQuiz = useCallback(() => {
    setState(createInitialState(difficulty));
    setGameActive(false);
    setShowResult(false);
    setLastAnswerCorrect(null);
    setIsPaused(false);
    
    // タイマーをクリア
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoProgressRef.current) clearTimeout(autoProgressRef.current);
  }, [difficulty]);

  // 回答提出
  const submitAnswer = useCallback((answer: string): boolean => {
    if (!state.currentChord || !gameActive || showResult) return false;

    const isCorrect = answer.toLowerCase().trim() === state.currentChord.name.toLowerCase().trim();
    const questionTime = Math.floor((Date.now() - questionStartTime.current) / 1000);
    
    // スコア計算
    const points = calculateScore(
      isCorrect, 
      questionTime, 
      state.hintsUsed, 
      state.streak, 
      state.difficulty
    );

    setState(prev => ({
      ...prev,
      userAnswer: answer,
      score: prev.score + points,
      streak: isCorrect ? prev.streak + 1 : 0,
      totalAnswers: prev.totalAnswers + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      timeElapsed: prev.timeElapsed + questionTime,
    }));

    setLastAnswerCorrect(isCorrect);
    setShowResult(true);

    // 自動進行設定
    if (settings.autoProgress) {
      autoProgressRef.current = setTimeout(() => {
        nextChord();
      }, settings.autoProgressDelay);
    }

    return isCorrect;
  }, [state, gameActive, showResult, settings]);

  // 次のコードに進む
  const nextChord = useCallback(() => {
    if (!gameActive) return;

    try {
      const randomChord = getRandomChord(state.difficulty);
      setState(prev => ({
        ...prev,
        currentChord: randomChord,
        userAnswer: null,
        hintsUsed: 0, // 新しい問題でヒント使用回数をリセット
      }));
      
      setShowResult(false);
      setLastAnswerCorrect(null);
      questionStartTime.current = Date.now();
      
      // 自動進行タイマーをクリア
      if (autoProgressRef.current) {
        clearTimeout(autoProgressRef.current);
      }
    } catch (error) {
      console.error('Failed to load next chord:', error);
    }
  }, [gameActive, state.difficulty]);

  // ヒント使用
  const useHint = useCallback((): string => {
    if (!state.currentChord || !settings.hintsEnabled) return '';

    setState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));

    // ヒント内容を生成
    const chord = state.currentChord;
    const hints = [
      `ルート音は${chord.root}です`,
      `コード品質は${chord.quality}です`,
      `難易度は${chord.difficulty}です`,
      `最初の文字は${chord.name.charAt(0)}です`,
    ];

    return hints[Math.min(state.hintsUsed, hints.length - 1)];
  }, [state.currentChord, state.hintsUsed, settings.hintsEnabled]);

  // ゲーム一時停止
  const pauseGame = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoProgressRef.current) clearTimeout(autoProgressRef.current);
  }, []);

  // ゲーム再開
  const resumeGame = useCallback(() => {
    setIsPaused(false);
    questionStartTime.current = Date.now();
  }, []);

  // 難易度変更
  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setState(prev => ({
      ...prev,
      difficulty: newDifficulty,
    }));
    
    // ゲーム中の場合は新しい難易度でコードを取得
    if (gameActive && !showResult) {
      try {
        const randomChord = getRandomChord(newDifficulty);
        setState(prev => ({
          ...prev,
          currentChord: randomChord,
          hintsUsed: 0,
        }));
        questionStartTime.current = Date.now();
      } catch (error) {
        console.error('Failed to change difficulty:', error);
      }
    }
  }, [gameActive, showResult]);

  // タイマー管理
  useEffect(() => {
    if (gameActive && !showResult && !isPaused && settings.timerEnabled) {
      timerRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameActive, showResult, isPaused, settings.timerEnabled]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoProgressRef.current) clearTimeout(autoProgressRef.current);
    };
  }, []);

  return {
    state,
    gameActive,
    showResult,
    lastAnswerCorrect,
    statistics,
    startQuiz,
    resetQuiz,
    submitAnswer,
    nextChord,
    useHint,
    pauseGame,
    resumeGame,
    changeDifficulty,
  };
};

export default useQuizState;