'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChordPattern, ChordDifficulty } from '@/types';
import { CHORD_PATTERNS, getChordsByDifficulty } from '@/data/chord-patterns';

/**
 * インタラクティブクイズ状態管理フック
 * ユーザーがフレットボード上でコードを作成するクイズモードの状態管理
 */
interface InteractiveQuizState {
  /** 現在の問題 */
  currentChord: ChordPattern | null;
  /** ユーザーの回答パターン */
  userPattern: Set<string>;
  /** 現在のスコア */
  score: number;
  /** 使用済みヒント */
  hints: string[];
  /** 使用済みヒント数 */
  hintsUsed: number;
  /** 最大ヒント数 */
  maxHints: number;
  /** 問題番号 */
  questionNumber: number;
  /** 総問題数 */
  totalQuestions: number;
  /** クイズ状態 */
  quizStatus: 'idle' | 'playing' | 'paused' | 'completed';
  /** 正解数 */
  correctAnswers: number;
  /** 開始時刻 */
  startTime: number | null;
  /** 経過時間（秒） */
  elapsedTime: number;
  /** 利用可能なコード一覧 */
  availableChords: ChordPattern[];
}

export const useInteractiveQuiz = (difficulty: ChordDifficulty) => {
  const [state, setState] = useState<InteractiveQuizState>(() => {
    const chords = getChordsByDifficulty(difficulty);
    return {
      currentChord: null,
      userPattern: new Set(),
      score: 0,
      hints: [],
      hintsUsed: 0,
      maxHints: 3,
      questionNumber: 0,
      totalQuestions: Math.min(chords.length, 10), // 最大10問
      quizStatus: 'idle',
      correctAnswers: 0,
      startTime: null,
      elapsedTime: 0,
      availableChords: chords,
    };
  });

  /**
   * 新しい問題を生成
   */
  const generateNewQuestion = useCallback(() => {
    if (state.availableChords.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * state.availableChords.length);
    const newChord = state.availableChords[randomIndex];
    
    setState(prev => ({
      ...prev,
      currentChord: newChord,
      userPattern: new Set(),
      hints: [],
      hintsUsed: 0,
      questionNumber: prev.questionNumber + 1,
    }));
  }, [state.availableChords]);

  /**
   * ヒントを生成
   */
  const generateHint = useCallback((chord: ChordPattern): string => {
    const existingHints = state.hints;
    
    // 段階的ヒント生成
    const hintOptions = [
      `このコードは${chord.frets.filter(f => f !== null).length}本の弦を押弦します`,
      `使用するフレットは${Math.min(...chord.frets.filter(f => f !== null) as number[])}〜${Math.max(...chord.frets.filter(f => f !== null) as number[])}フレットの範囲です`,
      `このコードの種類は${chord.name.includes('m') && !chord.name.includes('maj') ? 'マイナー' : 'メジャー'}コードです`,
      `ルート音は${chord.name.charAt(0)}です`,
      `${chord.category || 'その他'}カテゴリのコードです`,
    ];
    
    // まだ使用されていないヒントを選択
    const availableHints = hintOptions.filter(hint => !existingHints.includes(hint));
    if (availableHints.length === 0) return '追加のヒントはありません';
    
    return availableHints[0];
  }, [state.hints]);

  /**
   * ヒント要求
   */
  const requestHint = useCallback(() => {
    if (!state.currentChord || state.hintsUsed >= state.maxHints) return;
    
    const newHint = generateHint(state.currentChord);
    setState(prev => ({
      ...prev,
      hints: [...prev.hints, newHint],
      hintsUsed: prev.hintsUsed + 1,
      score: Math.max(0, prev.score - 10), // ヒント使用でスコア減点
    }));
  }, [state.currentChord, state.hintsUsed, state.maxHints, generateHint]);

  /**
   * 回答処理
   */
  const submitAnswer = useCallback((isCorrect: boolean, userPattern: Set<string>) => {
    setState(prev => {
      const timeBonus = Math.max(0, 100 - prev.elapsedTime); // 時間ボーナス
      const baseScore = isCorrect ? 100 : 0;
      const hintPenalty = prev.hintsUsed * 10;
      const finalScore = baseScore + timeBonus - hintPenalty;
      
      return {
        ...prev,
        userPattern,
        score: prev.score + Math.max(0, finalScore),
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      };
    });
  }, []);

  /**
   * 次の問題へ進む
   */
  const nextQuestion = useCallback(() => {
    if (state.questionNumber >= state.totalQuestions) {
      setState(prev => ({ ...prev, quizStatus: 'completed' }));
      return;
    }
    
    generateNewQuestion();
  }, [state.questionNumber, state.totalQuestions, generateNewQuestion]);

  /**
   * クイズ開始
   */
  const startQuiz = useCallback(() => {
    setState(prev => ({
      ...prev,
      quizStatus: 'playing',
      startTime: Date.now(),
      questionNumber: 0,
      score: 0,
      correctAnswers: 0,
      elapsedTime: 0,
    }));
    generateNewQuestion();
  }, [generateNewQuestion]);

  /**
   * クイズリセット
   */
  const resetQuiz = useCallback(() => {
    const chords = getChordsByDifficulty(difficulty);
    setState({
      currentChord: null,
      userPattern: new Set(),
      score: 0,
      hints: [],
      hintsUsed: 0,
      maxHints: 3,
      questionNumber: 0,
      totalQuestions: Math.min(chords.length, 10),
      quizStatus: 'idle',
      correctAnswers: 0,
      startTime: null,
      elapsedTime: 0,
      availableChords: chords,
    });
  }, [difficulty]);

  /**
   * クイズ一時停止/再開
   */
  const togglePause = useCallback(() => {
    setState(prev => ({
      ...prev,
      quizStatus: prev.quizStatus === 'playing' ? 'paused' : 'playing',
    }));
  }, []);

  /**
   * パターンクリア
   */
  const clearPattern = useCallback(() => {
    setState(prev => ({
      ...prev,
      userPattern: new Set(),
    }));
  }, []);

  /**
   * タイマー更新
   */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (state.quizStatus === 'playing' && state.startTime) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - (prev.startTime || 0)) / 1000),
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.quizStatus, state.startTime]);

  /**
   * 統計情報計算
   */
  const statistics = {
    accuracy: state.questionNumber > 0 ? (state.correctAnswers / state.questionNumber) * 100 : 0,
    averageTime: state.questionNumber > 0 ? state.elapsedTime / state.questionNumber : 0,
    hintsPerQuestion: state.questionNumber > 0 ? state.hintsUsed / state.questionNumber : 0,
    totalScore: state.score,
  };

  return {
    // 状態
    currentChord: state.currentChord,
    userPattern: state.userPattern,
    score: state.score,
    hints: state.hints,
    hintsUsed: state.hintsUsed,
    maxHints: state.maxHints,
    questionNumber: state.questionNumber,
    totalQuestions: state.totalQuestions,
    quizStatus: state.quizStatus,
    correctAnswers: state.correctAnswers,
    elapsedTime: state.elapsedTime,
    statistics,
    
    // アクション
    startQuiz,
    resetQuiz,
    togglePause,
    requestHint,
    submitAnswer,
    nextQuestion,
    clearPattern,
    generateNewQuestion,
  };
};