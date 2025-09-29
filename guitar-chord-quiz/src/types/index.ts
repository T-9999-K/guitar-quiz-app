/**
 * Guitar Chord Quiz - TypeScript型定義
 * 
 * @description アプリケーション全体で使用する型定義
 * @author Claude Code
 */

// =============================================================================
// Core Types - コア型定義
// =============================================================================

/**
 * 難易度レベル
 */
export type ChordDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * コードパターン - ギターコードの指板位置情報
 */
export interface ChordPattern {
  /** コード名 (例: "C", "Am", "F#m7") */
  name: string;
  /** 各弦のフレット位置 (null = 開放弦または押さえない) */
  frets: (number | null)[];
  /** 各弦を押さえる指番号 (null = 押さえない) */
  fingers: (number | null)[];
  /** 難易度レベル */
  difficulty: ChordDifficulty;
  /** ルート音 (例: "C", "D", "F#") */
  root: string;
  /** コード品質 (例: "major", "minor", "7th") */
  quality: string;
  /** カテゴリ（オプション） */
  category?: string;
  /** 説明（オプション） */
  description?: string;
}

/**
 * クイズ状態 - ゲーム進行情報
 */
export interface QuizState {
  /** 現在表示中のコード */
  currentChord: ChordPattern | null;
  /** ユーザーの回答 */
  userAnswer: string | null;
  /** 現在のスコア */
  score: number;
  /** 連続正解数 */
  streak: number;
  /** 総回答数 */
  totalAnswers: number;
  /** 正解数 */
  correctAnswers: number;
  /** 経過時間（秒） */
  timeElapsed: number;
  /** 現在の難易度設定 */
  difficulty: ChordDifficulty;
  /** 使用したヒント数 */
  hintsUsed: number;
  /** ゲームがアクティブかどうか */
  isGameActive: boolean;
  /** 現在のラウンド数 */
  currentRound: number;
}

/**
 * ゲーム設定 - ユーザー設定情報
 */
export interface GameSettings {
  /** 難易度設定 */
  difficulty: ChordPattern['difficulty'];
  /** 音声有効フラグ */
  soundEnabled: boolean;
  /** カポタストの位置 (0 = カポなし) */
  capoPosition: number;
  /** テーマ設定 */
  theme: 'light' | 'dark' | 'system';
  /** 高コントラストモード */
  highContrast?: boolean;
  /** モーション軽減 */
  reduceMotion?: boolean;
}

/**
 * フレットボード描画プロパティ
 */
export interface FretboardProps {
  /** 表示するコードパターン */
  chordPattern: ChordPattern;
  /** 表示方向 */
  orientation: 'horizontal' | 'vertical';
  /** 指番号表示フラグ */
  showFingers?: boolean;
  /** カポタストの位置 */
  capoPosition?: number;
}

// =============================================================================
// Utility Types - ユーティリティ型
// =============================================================================

/**
 * 音程定義
 */
export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

/**
 * コード品質定義
 */
export type ChordQuality = 
  | 'major' 
  | 'minor' 
  | 'dominant7' 
  | 'major7' 
  | 'minor7' 
  | 'diminished' 
  | 'augmented'
  | 'sus2'
  | 'sus4';

/**
 * 難易度レベル
 */
export type DifficultyLevel = ChordPattern['difficulty'];

/**
 * クイズアクション型
 */
export type QuizAction = 
  | { type: 'START_QUIZ'; difficulty: DifficultyLevel }
  | { type: 'ANSWER_CORRECT'; timeBonus: number }
  | { type: 'ANSWER_INCORRECT' }
  | { type: 'USE_HINT' }
  | { type: 'NEXT_CHORD'; chord: ChordPattern }
  | { type: 'PAUSE_QUIZ' }
  | { type: 'RESUME_QUIZ' }
  | { type: 'END_QUIZ' };

/**
 * ゲーム統計情報
 */
export interface GameStats {
  /** 総プレイ回数 */
  totalGames: number;
  /** 総正解数 */
  totalCorrect: number;
  /** 総問題数 */
  totalQuestions: number;
  /** 最高スコア */
  bestScore: number;
  /** 最長連続正解数 */
  bestStreak: number;
  /** 難易度別統計 */
  byDifficulty: Record<DifficultyLevel, {
    correct: number;
    total: number;
    bestTime: number;
  }>;
}

/**
 * ゲーム統計情報（詳細版）
 */
export interface GameStatistics {
  /** プレイしたゲーム数 */
  gamesPlayed: number;
  /** 総スコア */
  totalScore: number;
  /** 最高連続正解数 */
  bestStreak: number;
  /** 正答率（%） */
  accuracy: number;
  /** 平均回答時間（秒） */
  averageTimePerQuestion: number;
  /** 総経過時間（秒） */
  totalTimeElapsed: number;
  /** 使用したヒント数 */
  hintsUsed: number;
  /** 難易度 */
  difficulty: DifficultyLevel;
}

/**
 * 音声設定
 */
export interface AudioSettings {
  /** マスターボリューム (0-1) */
  volume: number;
  /** 音声有効フラグ */
  enabled: boolean;
  /** 楽器音色設定 */
  instrument: 'acoustic' | 'electric' | 'nylon';
}

// =============================================================================
// Type Guards - 型ガード関数
// =============================================================================

/**
 * ChordPattern型ガード
 */
export function isChordPattern(obj: unknown): obj is ChordPattern {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const pattern = obj as Record<string, unknown>;
  
  return (
    typeof pattern.name === 'string' &&
    Array.isArray(pattern.frets) &&
    Array.isArray(pattern.fingers) &&
    ['beginner', 'intermediate', 'advanced'].includes(pattern.difficulty as string) &&
    typeof pattern.root === 'string' &&
    typeof pattern.quality === 'string' &&
    pattern.frets.length === pattern.fingers.length &&
    pattern.frets.every(fret => typeof fret === 'number' || fret === null) &&
    pattern.fingers.every(finger => typeof finger === 'number' || finger === null)
  );
}

/**
 * QuizState型ガード
 */
export function isQuizState(obj: unknown): obj is QuizState {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const state = obj as Record<string, unknown>;
  
  return (
    (state.currentChord === null || isChordPattern(state.currentChord)) &&
    (state.userAnswer === null || typeof state.userAnswer === 'string') &&
    typeof state.score === 'number' &&
    typeof state.streak === 'number' &&
    typeof state.totalAnswers === 'number' &&
    typeof state.correctAnswers === 'number' &&
    typeof state.timeElapsed === 'number' &&
    ['beginner', 'intermediate', 'advanced'].includes(state.difficulty as string) &&
    typeof state.hintsUsed === 'number' &&
    typeof state.isGameActive === 'boolean' &&
    typeof state.currentRound === 'number'
  );
}

/**
 * GameSettings型ガード
 */
export function isGameSettings(obj: unknown): obj is GameSettings {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const settings = obj as Record<string, unknown>;
  
  return (
    ['beginner', 'intermediate', 'advanced'].includes(settings.difficulty as string) &&
    typeof settings.soundEnabled === 'boolean' &&
    typeof settings.capoPosition === 'number' &&
    ['light', 'dark'].includes(settings.theme as string) &&
    settings.capoPosition >= 0 &&
    settings.capoPosition <= 12
  );
}

/**
 * 音程名型ガード
 */
export function isNoteName(value: unknown): value is NoteName {
  const noteNames: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return noteNames.includes(value as NoteName);
}

/**
 * 難易度レベル型ガード
 */
export function isDifficultyLevel(value: unknown): value is DifficultyLevel {
  return ['beginner', 'intermediate', 'advanced'].includes(value as string);
}

// =============================================================================
// Constants - 定数定義
// =============================================================================

/**
 * デフォルトゲーム設定
 */
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  difficulty: 'beginner',
  soundEnabled: true,
  capoPosition: 0,
  theme: 'light'
} as const;

/**
 * デフォルトクイズ状態
 */
export const DEFAULT_QUIZ_STATE: QuizState = {
  currentChord: null,
  userAnswer: null,
  score: 0,
  streak: 0,
  totalAnswers: 0,
  correctAnswers: 0,
  timeElapsed: 0,
  difficulty: 'beginner',
  hintsUsed: 0,
  isGameActive: false,
  currentRound: 0
} as const;

/**
 * ギター弦数
 */
export const GUITAR_STRINGS = 6 as const;

/**
 * フレットボード最大フレット数
 */
export const MAX_FRETS = 24 as const;

/**
 * スコア計算定数
 */
export const SCORING = {
  CORRECT_ANSWER: 100,
  TIME_BONUS_MULTIPLIER: 10,
  STREAK_BONUS_MULTIPLIER: 50,
  HINT_PENALTY: 25
} as const;