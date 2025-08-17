/**
 * Guitar Chord Patterns Database
 * 
 * @description ギターコードパターンのデータベースとユーティリティ関数
 * @author Claude Code
 */

import { ChordPattern, DifficultyLevel, NoteName, ChordQuality } from '../types';

// =============================================================================
// Chord Patterns Database - コードパターンデータベース
// =============================================================================

/**
 * 初級コードパターン (10個)
 * 基本的なオープンコードを中心とした初心者向けコード
 */
const BEGINNER_CHORDS: ChordPattern[] = [
  {
    name: 'C',
    frets: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    difficulty: 'beginner',
    root: 'C',
    quality: 'major'
  },
  {
    name: 'G',
    frets: [3, 2, 0, 0, 3, 3],
    fingers: [3, 1, null, null, 4, 4],
    difficulty: 'beginner',
    root: 'G',
    quality: 'major'
  },
  {
    name: 'D',
    frets: [null, null, 0, 2, 3, 2],
    fingers: [null, null, null, 1, 3, 2],
    difficulty: 'beginner',
    root: 'D',
    quality: 'major'
  },
  {
    name: 'A',
    frets: [null, 0, 2, 2, 2, 0],
    fingers: [null, null, 2, 3, 1, null],
    difficulty: 'beginner',
    root: 'A',
    quality: 'major'
  },
  {
    name: 'E',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [null, 2, 3, 1, null, null],
    difficulty: 'beginner',
    root: 'E',
    quality: 'major'
  },
  {
    name: 'Am',
    frets: [null, 0, 2, 2, 1, 0],
    fingers: [null, null, 2, 3, 1, null],
    difficulty: 'beginner',
    root: 'A',
    quality: 'minor'
  },
  {
    name: 'Em',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [null, 2, 3, null, null, null],
    difficulty: 'beginner',
    root: 'E',
    quality: 'minor'
  },
  {
    name: 'Dm',
    frets: [null, null, 0, 2, 3, 1],
    fingers: [null, null, null, 1, 3, 2],
    difficulty: 'beginner',
    root: 'D',
    quality: 'minor'
  },
  {
    name: 'F',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    difficulty: 'beginner',
    root: 'F',
    quality: 'major'
  },
  {
    name: 'Cadd9',
    frets: [null, 3, 2, 0, 3, 0],
    fingers: [null, 2, 1, null, 3, null],
    difficulty: 'beginner',
    root: 'C',
    quality: 'major'
  }
];

/**
 * 中級コードパターン (15個)
 * バレーコードやセブンスコードなど中級者向けコード
 */
const INTERMEDIATE_CHORDS: ChordPattern[] = [
  {
    name: 'Bm',
    frets: [null, 2, 4, 4, 3, 2],
    fingers: [null, 1, 3, 4, 2, 1],
    difficulty: 'intermediate',
    root: 'B',
    quality: 'minor'
  },
  {
    name: 'B',
    frets: [null, 2, 4, 4, 4, 2],
    fingers: [null, 1, 2, 3, 4, 1],
    difficulty: 'intermediate',
    root: 'B',
    quality: 'major'
  },
  {
    name: 'C#m',
    frets: [null, null, 6, 6, 5, 4],
    fingers: [null, null, 3, 4, 2, 1],
    difficulty: 'intermediate',
    root: 'C#',
    quality: 'minor'
  },
  {
    name: 'F#m',
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    difficulty: 'intermediate',
    root: 'F#',
    quality: 'minor'
  },
  {
    name: 'G7',
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, null, null, null, 1],
    difficulty: 'intermediate',
    root: 'G',
    quality: 'dominant7'
  },
  {
    name: 'C7',
    frets: [null, 3, 2, 3, 1, 0],
    fingers: [null, 3, 2, 4, 1, null],
    difficulty: 'intermediate',
    root: 'C',
    quality: 'dominant7'
  },
  {
    name: 'D7',
    frets: [null, null, 0, 2, 1, 2],
    fingers: [null, null, null, 2, 1, 3],
    difficulty: 'intermediate',
    root: 'D',
    quality: 'dominant7'
  },
  {
    name: 'A7',
    frets: [null, 0, 2, 0, 2, 0],
    fingers: [null, null, 2, null, 3, null],
    difficulty: 'intermediate',
    root: 'A',
    quality: 'dominant7'
  },
  {
    name: 'E7',
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [null, 2, null, 1, null, null],
    difficulty: 'intermediate',
    root: 'E',
    quality: 'dominant7'
  },
  {
    name: 'F#',
    frets: [2, 4, 4, 3, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    difficulty: 'intermediate',
    root: 'F#',
    quality: 'major'
  },
  {
    name: 'Bb',
    frets: [null, 1, 3, 3, 3, 1],
    fingers: [null, 1, 2, 3, 4, 1],
    difficulty: 'intermediate',
    root: 'A#',
    quality: 'major'
  },
  {
    name: 'Gm',
    frets: [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1],
    difficulty: 'intermediate',
    root: 'G',
    quality: 'minor'
  },
  {
    name: 'Cm',
    frets: [null, 3, 5, 5, 4, 3],
    fingers: [null, 1, 3, 4, 2, 1],
    difficulty: 'intermediate',
    root: 'C',
    quality: 'minor'
  },
  {
    name: 'Am7',
    frets: [null, 0, 2, 0, 1, 0],
    fingers: [null, null, 2, null, 1, null],
    difficulty: 'intermediate',
    root: 'A',
    quality: 'minor7'
  },
  {
    name: 'Esus4',
    frets: [0, 2, 2, 2, 0, 0],
    fingers: [null, 1, 2, 3, null, null],
    difficulty: 'intermediate',
    root: 'E',
    quality: 'sus4'
  }
];

/**
 * 上級コードパターン (10個)
 * 複雑な押さえ方やジャズコードなど上級者向けコード
 */
const ADVANCED_CHORDS: ChordPattern[] = [
  {
    name: 'Cmaj7',
    frets: [null, 3, 2, 0, 0, 0],
    fingers: [null, 3, 2, null, null, null],
    difficulty: 'advanced',
    root: 'C',
    quality: 'major7'
  },
  {
    name: 'Dm7',
    frets: [null, null, 0, 2, 1, 1],
    fingers: [null, null, null, 2, 1, 1],
    difficulty: 'advanced',
    root: 'D',
    quality: 'minor7'
  },
  {
    name: 'G7sus4',
    frets: [3, 3, 0, 0, 1, 1],
    fingers: [3, 4, null, null, 1, 2],
    difficulty: 'advanced',
    root: 'G',
    quality: 'sus4'
  },
  {
    name: 'Fadd9',
    frets: [1, 3, 1, 2, 1, 1],
    fingers: [1, 4, 1, 3, 1, 1],
    difficulty: 'advanced',
    root: 'F',
    quality: 'major'
  },
  {
    name: 'Fmaj7',
    frets: [1, 3, 2, 2, 1, 0],
    fingers: [1, 4, 2, 3, 1, null],
    difficulty: 'advanced',
    root: 'F',
    quality: 'major7'
  },
  {
    name: 'Bm7',
    frets: [null, 2, 0, 2, 0, 2],
    fingers: [null, 1, null, 2, null, 3],
    difficulty: 'advanced',
    root: 'B',
    quality: 'minor7'
  },
  {
    name: 'Em7',
    frets: [0, 2, 0, 0, 0, 0],
    fingers: [null, 2, null, null, null, null],
    difficulty: 'advanced',
    root: 'E',
    quality: 'minor7'
  },
  {
    name: 'Asus2',
    frets: [null, 0, 2, 2, 0, 0],
    fingers: [null, null, 1, 2, null, null],
    difficulty: 'advanced',
    root: 'A',
    quality: 'sus2'
  },
  {
    name: 'Dsus2',
    frets: [null, null, 0, 2, 3, 0],
    fingers: [null, null, null, 1, 2, null],
    difficulty: 'advanced',
    root: 'D',
    quality: 'sus2'
  },
  {
    name: 'Cadd9/E',
    frets: [0, 3, 2, 0, 3, 0],
    fingers: [null, 2, 1, null, 3, null],
    difficulty: 'advanced',
    root: 'C',
    quality: 'major'
  }
];

/**
 * 全コードパターンのマスターリスト
 */
export const CHORD_PATTERNS: ChordPattern[] = [
  ...BEGINNER_CHORDS,
  ...INTERMEDIATE_CHORDS,
  ...ADVANCED_CHORDS
];

// =============================================================================
// Utility Functions - ユーティリティ関数
// =============================================================================

/**
 * 難易度別でコードをフィルタリング
 */
export const getChordsByDifficulty = (difficulty: DifficultyLevel): ChordPattern[] => {
  return CHORD_PATTERNS.filter(chord => chord.difficulty === difficulty);
};

/**
 * ランダムにコードを選択
 */
export const getRandomChord = (difficulty?: DifficultyLevel): ChordPattern => {
  const targetChords = difficulty 
    ? getChordsByDifficulty(difficulty)
    : CHORD_PATTERNS;
  
  if (targetChords.length === 0) {
    throw new Error(`No chords found for difficulty: ${difficulty}`);
  }
  
  const randomIndex = Math.floor(Math.random() * targetChords.length);
  return targetChords[randomIndex];
};

/**
 * コード名で検索
 */
export const getChordByName = (name: string): ChordPattern | undefined => {
  return CHORD_PATTERNS.find(chord => chord.name === name);
};

/**
 * ルート音でコードをフィルタリング
 */
export const getChordsByRoot = (root: NoteName): ChordPattern[] => {
  return CHORD_PATTERNS.filter(chord => chord.root === root);
};

/**
 * コード品質でコードをフィルタリング
 */
export const getChordsByQuality = (quality: ChordQuality): ChordPattern[] => {
  return CHORD_PATTERNS.filter(chord => chord.quality === quality);
};

/**
 * 複数の条件でコードをフィルタリング
 */
export const filterChords = (options: {
  difficulty?: DifficultyLevel;
  root?: NoteName;
  quality?: ChordQuality;
}): ChordPattern[] => {
  let filteredChords = [...CHORD_PATTERNS];
  
  if (options.difficulty) {
    filteredChords = filteredChords.filter(chord => chord.difficulty === options.difficulty);
  }
  
  if (options.root) {
    filteredChords = filteredChords.filter(chord => chord.root === options.root);
  }
  
  if (options.quality) {
    filteredChords = filteredChords.filter(chord => chord.quality === options.quality);
  }
  
  return filteredChords;
};

/**
 * コードパターンの統計情報を取得
 */
export const getChordStatistics = () => {
  const stats = {
    total: CHORD_PATTERNS.length,
    byDifficulty: {
      beginner: getChordsByDifficulty('beginner').length,
      intermediate: getChordsByDifficulty('intermediate').length,
      advanced: getChordsByDifficulty('advanced').length
    },
    byQuality: {} as Record<string, number>
  };
  
  // 品質別の統計を計算
  CHORD_PATTERNS.forEach(chord => {
    stats.byQuality[chord.quality] = (stats.byQuality[chord.quality] || 0) + 1;
  });
  
  return stats;
};

/**
 * カポタストを考慮したフレット位置の調整
 */
export const adjustForCapo = (chord: ChordPattern, capoPosition: number): ChordPattern => {
  if (capoPosition === 0) return chord;
  
  const adjustedFrets = chord.frets.map(fret => {
    if (fret === null) return null;
    return Math.max(0, fret - capoPosition);
  });
  
  return {
    ...chord,
    frets: adjustedFrets
  };
};

/**
 * 指使いの難易度を計算（簡易版）
 */
export const calculateFingeringDifficulty = (chord: ChordPattern): number => {
  let difficulty = 0;
  
  // 使用する指の数
  const usedFingers = chord.fingers.filter(finger => finger !== null).length;
  difficulty += usedFingers;
  
  // バレーコードの検出（同じ指番号が複数ある場合）
  const fingerCounts = chord.fingers.reduce((acc, finger) => {
    if (finger !== null) {
      acc[finger] = (acc[finger] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
  
  Object.values(fingerCounts).forEach(count => {
    if (count > 1) difficulty += 2; // バレーコードはより難しい
  });
  
  // 高いフレットは難しい
  const maxFret = Math.max(...chord.frets.filter(fret => fret !== null) as number[]);
  if (maxFret > 5) difficulty += Math.floor(maxFret / 3);
  
  return difficulty;
};

// =============================================================================
// Constants - 定数
// =============================================================================

/**
 * 難易度別の統計情報
 */
export const DIFFICULTY_STATS = {
  beginner: BEGINNER_CHORDS.length,
  intermediate: INTERMEDIATE_CHORDS.length,
  advanced: ADVANCED_CHORDS.length,
  total: CHORD_PATTERNS.length
} as const;

/**
 * 利用可能なルート音のリスト
 */
export const AVAILABLE_ROOTS = Array.from(
  new Set(CHORD_PATTERNS.map(chord => chord.root))
).sort() as NoteName[];

/**
 * 利用可能なコード品質のリスト
 */
export const AVAILABLE_QUALITIES = Array.from(
  new Set(CHORD_PATTERNS.map(chord => chord.quality))
).sort() as ChordQuality[];