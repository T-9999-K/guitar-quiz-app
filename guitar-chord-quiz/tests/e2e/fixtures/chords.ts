/**
 * Guitar Chord Quiz - E2E Test Fixtures
 *
 * @description テスト用のコードデータとモック設定
 * @author Claude Code
 */

import { ChordPattern } from '../../../src/types';

export const testChords = {
  beginner: [
    {
      name: 'C',
      frets: [null, 3, 2, 0, 1, 0],
      fingers: [null, 3, 2, null, 1, null],
      difficulty: 'beginner' as const,
      root: 'C',
      quality: 'major'
    },
    {
      name: 'G',
      frets: [3, 2, 0, 0, 3, 3],
      fingers: [3, 2, null, null, 4, 4],
      difficulty: 'beginner' as const,
      root: 'G',
      quality: 'major'
    },
    {
      name: 'Am',
      frets: [null, 0, 2, 2, 1, 0],
      fingers: [null, null, 2, 3, 1, null],
      difficulty: 'beginner' as const,
      root: 'A',
      quality: 'minor'
    }
  ],
  intermediate: [
    {
      name: 'F',
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      difficulty: 'intermediate' as const,
      root: 'F',
      quality: 'major'
    },
    {
      name: 'Bm',
      frets: [2, 2, 4, 4, 3, 2],
      fingers: [1, 1, 3, 4, 2, 1],
      difficulty: 'intermediate' as const,
      root: 'B',
      quality: 'minor'
    }
  ],
  advanced: [
    {
      name: 'F#m7',
      frets: [2, 4, 2, 2, 2, 2],
      fingers: [1, 3, 1, 1, 1, 1],
      difficulty: 'advanced' as const,
      root: 'F#',
      quality: 'minor7'
    }
  ]
};

export const testSettings = {
  default: {
    difficulty: 'beginner' as const,
    soundEnabled: true,
    theme: 'light' as const,
    capoPosition: 0
  },
  darkMode: {
    difficulty: 'intermediate' as const,
    soundEnabled: false,
    theme: 'dark' as const,
    capoPosition: 0
  },
  advanced: {
    difficulty: 'advanced' as const,
    soundEnabled: true,
    theme: 'system' as const,
    capoPosition: 2
  }
};

export const mockGameData = {
  completedGame: {
    score: 85,
    streak: 5,
    totalQuestions: 10,
    correctAnswers: 8,
    timeElapsed: 120,
    hintsUsed: 2
  },
  perfectGame: {
    score: 100,
    streak: 10,
    totalQuestions: 10,
    correctAnswers: 10,
    timeElapsed: 90,
    hintsUsed: 0
  }
};