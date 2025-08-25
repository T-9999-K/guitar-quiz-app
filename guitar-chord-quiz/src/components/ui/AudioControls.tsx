'use client';

import React from 'react';
import { Button } from './Button';

/**
 * 音声制御コンポーネントのプロパティ
 */
interface AudioControlsProps {
  /** 音声が有効かどうか */
  isEnabled: boolean;
  /** 音声システムが初期化されているかどうか */
  isInitialized: boolean;
  /** Web Audio APIがサポートされているかどうか */
  isSupported: boolean;
  /** AudioContextの状態 */
  audioContextState: string;
  /** 楽器音の音量 (0-1) */
  volume: number;
  /** 効果音の音量 (0-1) */
  effectsVolume: number;
  /** 音声ON/OFF切り替え */
  onToggle: () => void;
  /** 楽器音音量変更 */
  onVolumeChange: (volume: number) => void;
  /** 効果音音量変更 */
  onEffectsVolumeChange: (volume: number) => void;
  /** 音声有効化（初期化） */
  onEnable: () => void;
  /** コンパクト表示モード */
  compact?: boolean;
  /** クラス名 */
  className?: string;
}

/**
 * 音声制御コンポーネント
 * Web Audio API による音声制御のUIを提供
 */
export const AudioControls: React.FC<AudioControlsProps> = ({
  isEnabled,
  isInitialized,
  isSupported,
  audioContextState,
  volume,
  effectsVolume,
  onToggle,
  onVolumeChange,
  onEffectsVolumeChange,
  onEnable,
  compact = false,
  className = '',
}) => {
  // Web Audio APIがサポートされていない場合
  if (!isSupported) {
    return (
      <div className={`flex items-center text-gray-500 ${className}`}>
        <span className="text-sm">🔇 音声はサポートされていません</span>
      </div>
    );
  }

  // 初期化前の場合
  if (!isInitialized) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Button
          onClick={onEnable}
          variant="primary"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <span className="mr-2">🔊</span>
          音声を有効化
        </Button>
        {!compact && (
          <span className="text-sm text-gray-600">
            クリックして音声システムを開始
          </span>
        )}
      </div>
    );
  }

  // AudioContextが中断されている場合
  if (audioContextState === 'suspended') {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <Button
          onClick={onEnable}
          variant="secondary"
          size="sm"
          className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
        >
          <span className="mr-2">⏯️</span>
          音声を再開
        </Button>
        {!compact && (
          <span className="text-sm text-yellow-600">
            ブラウザにより音声が中断されています
          </span>
        )}
      </div>
    );
  }

  // メイン制御UI
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* 音声ON/OFFボタン */}
      <button
        onClick={onToggle}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-all duration-200
          ${isEnabled 
            ? 'bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600' 
            : 'bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200 hover:border-gray-400'
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
        title={isEnabled ? '音声をOFFにする' : '音声をONにする'}
        aria-label={isEnabled ? '音声をOFFにする' : '音声をONにする'}
      >
        <span className="text-lg">
          {isEnabled ? '🔊' : '🔇'}
        </span>
      </button>

      {/* 音量制御（音声が有効な場合のみ） */}
      {isEnabled && !compact && (
        <>
          {/* 楽器音音量 */}
          <div className="flex items-center space-x-2 min-w-[120px]">
            <span className="text-sm text-gray-600" title="楽器音">🎸</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="
                flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-blue-500
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:hover:bg-blue-600
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-blue-500
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:border-none
              "
              title={`楽器音音量: ${Math.round(volume * 100)}%`}
              aria-label="楽器音音量"
            />
            <span className="text-xs text-gray-500 w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* 効果音音量 */}
          <div className="flex items-center space-x-2 min-w-[120px]">
            <span className="text-sm text-gray-600" title="効果音">🎵</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={effectsVolume}
              onChange={(e) => onEffectsVolumeChange(parseFloat(e.target.value))}
              className="
                flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-purple-500
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-purple-500
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:hover:bg-purple-600
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-purple-500
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:border-none
              "
              title={`効果音音量: ${Math.round(effectsVolume * 100)}%`}
              aria-label="効果音音量"
            />
            <span className="text-xs text-gray-500 w-8 text-right">
              {Math.round(effectsVolume * 100)}%
            </span>
          </div>
        </>
      )}

      {/* コンパクトモードでの音声状態表示 */}
      {isEnabled && compact && (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            音量: {Math.round(volume * 100)}%
          </span>
        </div>
      )}

      {/* AudioContext状態表示（開発用・デバッグ時のみ） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400">
          State: {audioContextState}
        </div>
      )}
    </div>
  );
};