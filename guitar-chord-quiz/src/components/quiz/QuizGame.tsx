/**
 * メインクイズゲームコンポーネント
 * 
 * @description フレットボード表示・回答入力・スコア管理を統合したメインゲームコンポーネント
 * @author Claude Code
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ChordPattern, DifficultyLevel } from '../../types';
import { useQuizState } from '../../hooks/useQuizState';
import { useResponsiveBreakpoints } from '../../hooks/useMediaQuery';
import { ResponsiveFretboard } from '../fretboard/ResponsiveFretboard';
import { AnswerInput } from './AnswerInput';
import { useAudio } from '../../hooks/useAudio';
import clsx from 'clsx';

// =============================================================================
// Types - 型定義
// =============================================================================

/**
 * クイズゲームコンポーネントのプロパティ
 */
interface QuizGameProps {
  /** 難易度設定 */
  difficulty: DifficultyLevel;
  /** ゲーム終了時のコールバック */
  onGameEnd?: (finalScore: number, statistics: object) => void;
  /** 音声フック（オプション - 親から渡される場合） */
  audioHook?: ReturnType<typeof useAudio>;
  /** 追加のCSSクラス */
  className?: string;
  /** デバッグモード（開発用） */
  debugMode?: boolean;
}

/**
 * スコア表示コンポーネントのプロパティ
 */
interface ScoreDisplayProps {
  /** 現在のスコア */
  score: number;
  /** 連続正解数 */
  streak: number;
  /** 経過時間（秒） */
  timeElapsed: number;
  /** 使用したヒント数 */
  hintsUsed: number;
  /** 総回答数 */
  totalAnswers: number;
  /** 正解数 */
  correctAnswers: number;
}

/**
 * ヒントの種類
 */
type HintType = 'root' | 'quality' | 'difficulty' | 'first-letter';

// =============================================================================
// Score Display Component - スコア表示コンポーネント
// =============================================================================

/**
 * ゲームスコア表示コンポーネント
 */
const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  streak,
  timeElapsed,
  hintsUsed,
  totalAnswers,
  correctAnswers,
}) => {
  const { isMobile } = useResponsiveBreakpoints();

  /**
   * 時間を MM:SS 形式でフォーマット
   */
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * 正答率を計算
   */
  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className={clsx(
        'grid gap-4 text-center',
        isMobile ? 'grid-cols-2' : 'grid-cols-3 md:grid-cols-6'
      )}>
        {/* スコア */}
        <div className="min-w-0">
          <div className="text-2xl font-bold text-blue-600 truncate">{score.toLocaleString()}</div>
          <div className="text-sm text-gray-600">スコア</div>
        </div>
        
        {/* 連続正解 */}
        <div className="min-w-0">
          <div className="text-2xl font-bold text-green-600">{streak}</div>
          <div className="text-sm text-gray-600">連続正解</div>
        </div>
        
        {/* 経過時間 */}
        <div className="min-w-0">
          <div className="text-2xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600">経過時間</div>
        </div>
        
        {/* ヒント使用数 */}
        <div className="min-w-0">
          <div className="text-2xl font-bold text-orange-600">{hintsUsed}</div>
          <div className="text-sm text-gray-600">ヒント使用</div>
        </div>
        
        {/* 正答率 */}
        <div className="min-w-0">
          <div className="text-2xl font-bold text-indigo-600">{accuracy}%</div>
          <div className="text-sm text-gray-600">正答率</div>
        </div>
        
        {/* 問題数 */}
        <div className="min-w-0">
          <div className="text-2xl font-bold text-gray-600">{totalAnswers}</div>
          <div className="text-sm text-gray-600">問題数</div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Game Start Component - ゲーム開始コンポーネント
// =============================================================================

/**
 * ゲーム開始画面コンポーネント
 */
const GameStartScreen: React.FC<{
  difficulty: DifficultyLevel;
  onStart: () => void;
}> = ({ difficulty, onStart }) => {
  const difficultyLabels = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級',
  };

  const difficultyDescriptions = {
    beginner: 'C, G, D, Am などの基本的なコード',
    intermediate: 'F, Bm, セブンスコードなど',
    advanced: 'Cmaj7, Fadd9 などの複雑なコード',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          ギターコードクイズ
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          フレットボードに表示されるコードの名前を当ててください
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          選択された難易度
        </h2>
        <div className="text-center space-y-2">
          <div className={clsx(
            'text-2xl font-bold',
            {
              'text-green-600': difficulty === 'beginner',
              'text-yellow-600': difficulty === 'intermediate',
              'text-red-600': difficulty === 'advanced',
            }
          )}>
            {difficultyLabels[difficulty]}
          </div>
          <p className="text-gray-600 text-sm">
            {difficultyDescriptions[difficulty]}
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className={clsx(
          'px-12 py-4 text-white font-semibold rounded-lg text-xl',
          'transition-all duration-200 transform hover:scale-105',
          'focus:ring-4 focus:ring-blue-500 focus:ring-offset-2',
          'shadow-lg hover:shadow-xl',
          'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
        )}
        aria-label="ゲームを開始"
      >
        ゲーム開始
      </button>

      <div className="text-center text-sm text-gray-500 max-w-md">
        <p>ヒント機能やキーボード操作も利用できます</p>
      </div>
    </div>
  );
};

// =============================================================================
// Main Game Component - メインゲームコンポーネント
// =============================================================================

/**
 * メインクイズゲームコンポーネント
 * 
 * フレットボード表示・回答入力・スコア管理を統合
 * 
 * @example
 * ```tsx
 * <QuizGame
 *   difficulty="beginner"
 *   onGameEnd={(score, stats) => console.log('Game ended', score, stats)}
 * />
 * ```
 */
export const QuizGame: React.FC<QuizGameProps> = ({
  difficulty,
  onGameEnd,
  audioHook,
  className,
  debugMode = false,
}) => {
  // クイズ状態管理
  const {
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
  } = useQuizState(difficulty);

  // ローカル状態
  const [showHintPanel, setShowHintPanel] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [gameEnded, setGameEnded] = useState(false);

  // 音声制御（親から渡されない場合は独自に初期化）
  const localAudio = useAudio();
  const audio = audioHook || localAudio;

  // レスポンシブ設定
  const { isMobile, isTablet } = useResponsiveBreakpoints();

  // ゲーム終了処理
  useEffect(() => {
    if (gameEnded && onGameEnd) {
      onGameEnd(state.score, statistics);
    }
  }, [gameEnded, state.score, statistics, onGameEnd]);

  // 回答処理
  const handleAnswerSubmit = useCallback(async (answer: string) => {
    if (!gameActive || showResult || !state.currentChord) return;

    const isCorrect = submitAnswer(answer);
    
    // 音声フィードバック
    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playError();
    }
    
    // デバッグ情報
    if (debugMode) {
      console.log('Answer submitted:', {
        answer,
        correct: state.currentChord.name,
        isCorrect,
        score: state.score,
      });
    }

    // 結果表示後、一定時間で次の問題へ
    if (isCorrect) {
      setTimeout(() => {
        setShowHintPanel(false);
        setCurrentHint('');
        nextChord();
      }, 1500);
    } else {
      setTimeout(() => {
        setShowHintPanel(false);
        setCurrentHint('');
        nextChord();
      }, 2500);
    }
  }, [gameActive, showResult, state.currentChord, submitAnswer, nextChord, state.score, debugMode]);

  // ヒント表示処理
  const handleHintRequest = useCallback(() => {
    if (!state.currentChord || state.hintsUsed >= 3) return;

    const hint = `ヒント: このコードは${state.currentChord.frets.filter(f => f !== null).length}本の弦を押弦します`;
    setCurrentHint(hint);
    setShowHintPanel(true);

    // ヒント音
    audio.playClick();

    // デバッグ情報
    if (debugMode) {
      console.log('Hint requested:', {
        hint,
        hintsUsed: state.hintsUsed,
        chord: state.currentChord.name,
      });
    }
  }, [state.currentChord, state.hintsUsed, useHint, debugMode, audio]);

  // コード再生処理
  const handlePlayChord = useCallback(() => {
    if (!state.currentChord) return;
    
    audio.playChord(state.currentChord, 2); // 2秒間再生
    
    // デバッグ情報
    if (debugMode) {
      console.log('Chord played:', {
        chord: state.currentChord.name,
        frets: state.currentChord.frets,
      });
    }
  }, [state.currentChord, audio, debugMode]);

  // ゲーム開始処理
  const handleGameStart = useCallback(() => {
    startQuiz();
    setShowHintPanel(false);
    setCurrentHint('');
    setGameEnded(false);
  }, [startQuiz]);

  // ゲーム終了処理
  const handleGameEnd = useCallback(() => {
    setGameEnded(true);
    resetQuiz();
  }, [resetQuiz]);

  // ゲーム開始前の画面
  if (!gameActive) {
    return (
      <div className={clsx('quiz-game-container', className)}>
        <GameStartScreen
          difficulty={difficulty}
          onStart={handleGameStart}
        />
      </div>
    );
  }

  // メインゲーム画面
  return (
    <div className={clsx('quiz-game-container max-w-7xl mx-auto p-4', className)}>
      {/* デバッグ情報 */}
      {debugMode && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
          <strong>Debug:</strong> Current: {state.currentChord?.name}, 
          Score: {state.score}, 
          Active: {gameActive ? 'Yes' : 'No'}, 
          Result: {showResult ? 'Showing' : 'Hidden'}
        </div>
      )}

      {/* スコア表示 */}
      <div className="mb-6">
        <ScoreDisplay
          score={state.score}
          streak={state.streak}
          timeElapsed={state.timeElapsed}
          hintsUsed={state.hintsUsed}
          totalAnswers={state.totalAnswers}
          correctAnswers={state.correctAnswers}
        />
      </div>

      {/* メインゲームエリア */}
      <div className={clsx(
        'grid gap-6',
        isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 xl:grid-cols-3'
      )}>
        {/* フレットボード */}
        <div className={clsx(isMobile ? 'col-span-1' : 'lg:col-span-2')}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              このコードは何でしょう？
            </h2>
            {state.currentChord && (
              <ResponsiveFretboard
                chordPattern={state.currentChord}
                showFingers={false} // 指番号は表示しない（難易度維持のため）
                capoPosition={0}
                className="fretboard-quiz"
              />
            )}
          </div>
        </div>

        {/* サイドパネル */}
        <div className="space-y-4">
          {/* ヒント表示 */}
          {showHintPanel && currentHint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                💡 ヒント
              </h3>
              <p className="text-yellow-700">{currentHint}</p>
            </div>
          )}

          {/* 回答入力エリア */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">回答を入力</h3>
            
            <AnswerInput
              onSubmit={handleAnswerSubmit}
              disabled={showResult}
              difficulty={difficulty}
              autoFocus={!isMobile}
              placeholder="コード名を入力..."
            />

            {/* 操作ボタン */}
            <div className="mt-4 flex gap-3">
              {/* ヒントボタン */}
              {!showResult && state.hintsUsed < 3 && (
                <button
                  onClick={handleHintRequest}
                  disabled={showHintPanel}
                  className={clsx(
                    'flex-1 py-3 rounded-lg font-medium transition-all duration-200',
                    'focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
                    showHintPanel
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700'
                  )}
                  aria-label={`ヒントを表示 (残り${3 - state.hintsUsed}回)`}
                >
                  💡 ヒント ({3 - state.hintsUsed})
                </button>
              )}
              
              {/* コード再生ボタン */}
              {!showResult && (
                <button
                  onClick={handlePlayChord}
                  className="flex-1 py-3 rounded-lg font-medium transition-all duration-200
                           bg-green-500 text-white hover:bg-green-600 active:bg-green-700
                           focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="コードを再生"
                >
                  🔊 音を聞く
                </button>
              )}
            </div>

            {/* ゲーム制御ボタン */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleGameEnd}
                className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
              >
                ゲーム終了
              </button>
              <button
                onClick={() => {
                  setShowHintPanel(false);
                  setCurrentHint('');
                  nextChord();
                }}
                disabled={showResult}
                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 text-sm"
              >
                スキップ
              </button>
            </div>
          </div>

          {/* 結果表示 */}
          {showResult && (
            <div className={clsx(
              'rounded-lg p-6 text-center border-2 transition-all duration-300',
              lastAnswerCorrect
                ? 'bg-green-50 border-green-200 animate-pulse'
                : 'bg-red-50 border-red-200'
            )}>
              <div className={clsx(
                'text-3xl font-bold mb-3',
                lastAnswerCorrect ? 'text-green-800' : 'text-red-800'
              )}>
                {lastAnswerCorrect ? '🎉 正解！' : '❌ 不正解'}
              </div>
              
              {state.currentChord && (
                <div className="space-y-2">
                  <p className={clsx(
                    'text-xl font-semibold',
                    lastAnswerCorrect ? 'text-green-700' : 'text-red-700'
                  )}>
                    正解: {state.currentChord.name}
                  </p>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>ルート音: {state.currentChord.root}</p>
                    <p>種類: {state.currentChord.quality}</p>
                    <p>難易度: {state.currentChord.difficulty}</p>
                  </div>
                </div>
              )}

              {lastAnswerCorrect && state.streak > 1 && (
                <div className="mt-3 text-green-600 font-medium">
                  🔥 {state.streak}連続正解！
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;