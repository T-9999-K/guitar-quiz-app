'use client';

/**
 * 設定コンポーネント
 *
 * @description ユーザー設定とカスタマイゼーション機能
 * @author Claude Code
 */

import React, { useState, useCallback } from 'react';
import { useGameSettings } from '../../hooks/useLocalStorage';
import { useTheme, Theme } from '../../hooks/useTheme';
import { useAudio } from '../../hooks/useAudio';
import { AudioControls } from './AudioControls';
import { DifficultyLevel } from '../../types';
import clsx from 'clsx';

/**
 * 設定コンポーネントのプロパティ
 */
interface SettingsProps {
  /** 閉じるボタンのコールバック */
  onClose?: () => void;
  /** 追加のCSSクラス */
  className?: string;
  /** 埋め込みモード（モーダル以外での表示） */
  embedded?: boolean;
}

/**
 * 設定コンポーネント
 *
 * @example
 * ```tsx
 * <Settings onClose={() => setShowSettings(false)} />
 * ```
 */
export const Settings: React.FC<SettingsProps> = ({
  onClose,
  className = '',
  embedded = false,
}) => {
  const { settings, updateSettings, resetSettings } = useGameSettings();
  const { theme, setTheme, toggleTheme, useSystemTheme, isDark, isSystem, mounted } = useTheme();
  const audioControls = useAudio();
  const [resetConfirm, setResetConfirm] = useState(false);

  // 設定の部分更新
  const updateSetting = useCallback(<K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    updateSettings({ [key]: value });
  }, [updateSettings]);

  // データリセット
  const handleResetData = useCallback(() => {
    if (resetConfirm) {
      // LocalStorageをクリア
      localStorage.clear();
      setResetConfirm(false);
      // ページをリロード
      window.location.reload();
    } else {
      setResetConfirm(true);
    }
  }, [resetConfirm]);

  // テーマラベルの取得
  const getThemeLabel = (themeValue: Theme) => {
    switch (themeValue) {
      case 'light': return '☀️ ライト';
      case 'dark': return '🌙 ダーク';
      case 'system': return '🖥️ システム';
      default: return themeValue;
    }
  };

  // 難易度ラベルの取得
  const getDifficultyLabel = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '上級';
      default: return difficulty;
    }
  };

  // SSR対応
  if (!mounted) {
    return (
      <div className={clsx(
        'bg-white rounded-lg shadow-lg p-6 max-w-md w-full',
        className
      )}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full transition-colors duration-200',
      className
    )}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          ⚙️ 設定
        </h2>
        {onClose && !embedded && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                     transition-colors duration-150 p-1 rounded focus:ring-2 focus:ring-blue-500"
            aria-label="設定を閉じる"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* テーマ設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            🎨 テーマ
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={clsx(
                  'py-2 px-3 rounded-lg border transition-all duration-200 text-sm font-medium',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  theme === themeOption
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400',
                  'dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                )}
                aria-pressed={theme === themeOption}
              >
                {getThemeLabel(themeOption)}
              </button>
            ))}
          </div>
          {isSystem && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              システム設定: {isDark ? 'ダーク' : 'ライト'}モード
            </p>
          )}
        </div>

        {/* デフォルト難易度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🎯 デフォルト難易度
          </label>
          <select
            value={settings.difficulty}
            onChange={(e) => updateSetting('difficulty', e.target.value as DifficultyLevel)}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
                     dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400
                     transition-all duration-150"
          >
            <option value="beginner">🟢 初級 - 基本的なコード</option>
            <option value="intermediate">🟡 中級 - バレーコード等</option>
            <option value="advanced">🔴 上級 - 複雑なコード</option>
          </select>
        </div>

        {/* 音声設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            🔊 音声設定
          </label>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <AudioControls
              isEnabled={audioControls.isEnabled}
              isSupported={audioControls.isSupported}
              audioContextState={audioControls.audioContextState}
              volume={audioControls.volume}
              effectsVolume={audioControls.effectsVolume}
              onToggle={audioControls.toggleAudio}
              onVolumeChange={audioControls.changeVolume}
              onEffectsVolumeChange={audioControls.changeEffectsVolume}
              onEnable={audioControls.enableAudio}
              isInitialized={audioControls.isInitialized}
              compact={false}
            />
          </div>
        </div>

        {/* カポタスト設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            📎 カポタスト位置
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="12"
                value={settings.capoPosition}
                onChange={(e) => updateSetting('capoPosition', parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                         dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                aria-label="カポタスト位置"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                {settings.capoPosition === 0 ? 'なし' : `${settings.capoPosition}F`}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              カポタストを使用してキーを調整できます
            </p>
          </div>
        </div>

        {/* アクセシビリティ設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            ♿ アクセシビリティ
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.highContrast || false}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                         focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                         dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                高コントラストモード
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.reduceMotion || false}
                onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                         focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                         dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                アニメーションを減らす
              </span>
            </label>
          </div>
        </div>

        {/* データ管理 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            🗃️ データ管理
          </label>
          <div className="space-y-3">
            <button
              onClick={resetSettings}
              className="w-full py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600
                       focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
                       transition-all duration-200 font-medium"
            >
              ⚠️ 設定をリセット
            </button>
            <button
              onClick={handleResetData}
              className={clsx(
                'w-full py-2 px-4 rounded-lg font-medium transition-all duration-200',
                'focus:ring-2 focus:ring-offset-2',
                resetConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                  : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
              )}
            >
              {resetConfirm ? '🚨 本当に削除しますか？' : '🗑️ すべてのデータを削除'}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              スコア履歴、設定などすべてのデータが削除されます
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 設定モーダルコンポーネント
 */
interface SettingsModalProps {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** モーダルを閉じるコールバック */
  onClose: () => void;
}

/**
 * 設定モーダル
 *
 * @example
 * ```tsx
 * <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
 * ```
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-fadeIn">
        <Settings onClose={onClose} />
      </div>
    </div>
  );
};

export default Settings;