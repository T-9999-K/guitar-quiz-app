'use client';

/**
 * 統計表示コンポーネント
 *
 * @description プレイ統計と履歴の可視化
 * @author Claude Code
 */

import React, { useState, useMemo } from 'react';
import { useScoreHistory } from '../../hooks/useLocalStorage';
import { DifficultyLevel } from '../../types';
import clsx from 'clsx';

/**
 * 統計コンポーネントのプロパティ
 */
interface StatisticsProps {
  /** 追加のCSSクラス */
  className?: string;
  /** コンパクト表示モード */
  compact?: boolean;
}

/**
 * 統計表示コンポーネント
 *
 * @example
 * ```tsx
 * <Statistics />
 * ```
 */
export const Statistics: React.FC<StatisticsProps> = ({
  className = '',
  compact = false,
}) => {
  const { history, getStats, clearHistory } = useScoreHistory();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');

  const stats = getStats();

  // 難易度別の統計計算
  const difficultyStats = useMemo(() => {
    if (!history.length) return null;

    const difficulties: (DifficultyLevel | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];
    const result: Record<string, any> = {};

    difficulties.forEach(diff => {
      const filteredHistory = diff === 'all'
        ? history
        : history.filter(record => record.difficulty === diff);

      if (filteredHistory.length > 0) {
        result[diff] = {
          totalGames: filteredHistory.length,
          averageScore: Math.round(filteredHistory.reduce((sum, record) => sum + record.score, 0) / filteredHistory.length),
          bestScore: Math.max(...filteredHistory.map(record => record.score)),
          averageAccuracy: Math.round(
            filteredHistory.reduce((sum, record) =>
              sum + (record.correctAnswers / record.totalQuestions * 100), 0
            ) / filteredHistory.length
          ),
          bestStreak: Math.max(...filteredHistory.map(record => record.streak)),
        };
      }
    });

    return result;
  }, [history]);

  // 最近のゲーム履歴（選択された難易度）
  const filteredHistory = useMemo(() => {
    return selectedDifficulty === 'all'
      ? history
      : history.filter(record => record.difficulty === selectedDifficulty);
  }, [history, selectedDifficulty]);

  // フォーマット関数
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyLabel = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return '🟢 初級';
      case 'intermediate': return '🟡 中級';
      case 'advanced': return '🔴 上級';
      default: return difficulty;
    }
  };

  const getDifficultyEmoji = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '⚪';
    }
  };

  // データクリア処理
  const handleClearHistory = () => {
    if (showClearConfirm) {
      clearHistory();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  // データがない場合
  if (!stats || !difficultyStats) {
    return (
      <div className={clsx(
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200',
        className
      )}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          📊 統計
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
            まだゲームをプレイしていません
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            最初のゲームを始めて統計を確認しましょう！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors duration-200',
      className
    )}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          📊 統計
        </h2>
        {!compact && (
          <button
            onClick={handleClearHistory}
            className={clsx(
              'px-3 py-1 text-xs rounded-lg transition-all duration-200',
              'focus:ring-2 focus:ring-offset-2',
              showClearConfirm
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
              'dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
          >
            {showClearConfirm ? '🚨 本当に削除？' : '🗑️ 履歴削除'}
          </button>
        )}
      </div>

      {/* 難易度選択 */}
      {!compact && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: '📈 全体' },
              { value: 'beginner', label: '🟢 初級' },
              { value: 'intermediate', label: '🟡 中級' },
              { value: 'advanced', label: '🔴 上級' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedDifficulty(value as DifficultyLevel | 'all')}
                className={clsx(
                  'px-3 py-2 text-sm rounded-lg transition-all duration-200',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  selectedDifficulty === value
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  'dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
                aria-pressed={selectedDifficulty === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 全体統計 */}
      <div className={clsx(
        'grid gap-4 mb-6',
        compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
      )}>
        <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {difficultyStats[selectedDifficulty]?.totalGames || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">プレイ回数</div>
        </div>
        <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {difficultyStats[selectedDifficulty]?.averageScore || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">平均スコア</div>
        </div>
        {!compact && (
          <>
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {difficultyStats[selectedDifficulty]?.bestScore || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">最高スコア</div>
            </div>
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {difficultyStats[selectedDifficulty]?.bestStreak || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">最高連続</div>
            </div>
          </>
        )}
      </div>

      {/* 精度表示 */}
      {!compact && difficultyStats[selectedDifficulty]?.averageAccuracy && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            🎯 平均正答率
          </h3>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${difficultyStats[selectedDifficulty].averageAccuracy}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-600 dark:text-gray-400 mt-1">
            {difficultyStats[selectedDifficulty].averageAccuracy}%
          </div>
        </div>
      )}

      {/* 最近のスコア */}
      <div>
        <h3 className={clsx(
          'font-semibold text-gray-900 dark:text-white mb-4',
          compact ? 'text-base' : 'text-lg'
        )}>
          🏆 最近のスコア
        </h3>
        <div className={clsx(
          'space-y-2 overflow-y-auto',
          compact ? 'max-h-48' : 'max-h-64'
        )}>
          {filteredHistory.slice(0, compact ? 5 : 10).map((record, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700
                       rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {record.score}点
                  </span>
                  <span className="text-xs">
                    {getDifficultyEmoji(record.difficulty)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  正解率: {Math.round((record.correctAnswers / record.totalQuestions) * 100)}% •
                  連続: {record.streak}
                  {!compact && record.timeSpent && (
                    <> • 時間: {formatTime(record.timeSpent)}</>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(record.date).toLocaleDateString('ja-JP', {
                  month: 'short',
                  day: 'numeric',
                  ...(compact ? {} : { year: 'numeric' })
                })}
              </div>
            </div>
          ))}
          {filteredHistory.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              この難易度のデータがありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;