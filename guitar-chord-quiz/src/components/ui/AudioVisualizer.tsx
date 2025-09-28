'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChordPattern } from '@/types';

/**
 * 音声可視化コンポーネントのプロパティ
 */
interface AudioVisualizerProps {
  /** 現在再生中のコード */
  currentChord?: ChordPattern | null;
  /** 音声が有効かどうか */
  isAudioEnabled: boolean;
  /** 音声システムが初期化されているかどうか */
  isAudioInitialized: boolean;
  /** 楽器音の音量 */
  volume: number;
  /** 効果音の音量 */
  effectsVolume: number;
  /** コンパクト表示モード */
  compact?: boolean;
  /** 追加のCSSクラス */
  className?: string;
}

/**
 * 音声可視化コンポーネント
 *
 * 現在再生中の音声情報や音量レベルを視覚的に表示します。
 * アクセシビリティ対応で音声が聞こえないユーザーにも情報を提供します。
 */
export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  currentChord,
  isAudioEnabled,
  isAudioInitialized,
  volume,
  effectsVolume,
  compact = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStrings, setActiveStrings] = useState<Set<number>>(new Set());
  const [playbackIndicator, setPlaybackIndicator] = useState<'chord' | 'single' | 'effect' | null>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 再生状態のアニメーション管理
   */
  const triggerPlaybackAnimation = (type: 'chord' | 'single' | 'effect', duration: number = 2000) => {
    setIsPlaying(true);
    setPlaybackIndicator(type);

    // 既存のタイマーをクリア
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
    }

    // 指定時間後にアニメーションを停止
    playbackTimeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
      setPlaybackIndicator(null);
      setActiveStrings(new Set());
    }, duration);
  };

  /**
   * コード再生時の視覚効果
   */
  useEffect(() => {
    if (currentChord && isAudioEnabled) {
      const activeStringSet = new Set<number>();
      currentChord.frets.forEach((fret, index) => {
        if (fret !== null) {
          activeStringSet.add(index + 1);
        }
      });
      setActiveStrings(activeStringSet);
      triggerPlaybackAnimation('chord');
    }
  }, [currentChord, isAudioEnabled]);

  /**
   * クリーンアップ
   */
  useEffect(() => {
    return () => {
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
    };
  }, []);

  // 音声システムが無効な場合
  if (!isAudioInitialized) {
    return (
      <div className={`flex items-center text-gray-400 ${className}`}>
        <span className="text-sm">🔇 音声システム未初期化</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* 全体的な音声状態表示 */}
      <div className="flex items-center space-x-2">
        <div
          className={`
            w-3 h-3 rounded-full transition-all duration-300
            ${isAudioEnabled
              ? isPlaying
                ? 'bg-green-500 animate-pulse'
                : 'bg-green-400'
              : 'bg-gray-300'
            }
          `}
          title={isAudioEnabled ? '音声有効' : '音声無効'}
          aria-label={isAudioEnabled ? '音声有効' : '音声無効'}
        />
        <span className="text-xs text-gray-600">
          {isAudioEnabled ? '🔊' : '🔇'}
        </span>
      </div>

      {/* 再生タイプ表示 */}
      {isPlaying && playbackIndicator && !compact && (
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-xs font-medium text-blue-700">
            {playbackIndicator === 'chord' && '🎸 コード再生中'}
            {playbackIndicator === 'single' && '🎵 単音再生中'}
            {playbackIndicator === 'effect' && '🎊 効果音再生中'}
          </span>
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-blue-500 animate-pulse rounded-full"></div>
            <div className="w-1 h-3 bg-blue-500 animate-pulse rounded-full" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 bg-blue-500 animate-pulse rounded-full" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* 音量レベル表示（コンパクトモード以外） */}
      {!compact && (
        <div className="flex items-center space-x-3">
          {/* 楽器音音量バー */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">🎸</span>
            <div className="flex space-x-0.5">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-1 h-3 rounded-full transition-colors duration-200
                    ${volume * 5 > index
                      ? isPlaying && playbackIndicator === 'chord'
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-blue-500'
                      : 'bg-gray-200'
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* 効果音音量バー */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">🎵</span>
            <div className="flex space-x-0.5">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-1 h-3 rounded-full transition-colors duration-200
                    ${effectsVolume * 5 > index
                      ? isPlaying && playbackIndicator === 'effect'
                        ? 'bg-orange-500 animate-pulse'
                        : 'bg-purple-500'
                      : 'bg-gray-200'
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* アクティブな弦の可視化 */}
      {activeStrings.size > 0 && !compact && (
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500">弦:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6].map((stringNum) => (
              <div
                key={stringNum}
                className={`
                  w-2 h-4 rounded-sm transition-all duration-300
                  ${activeStrings.has(stringNum)
                    ? isPlaying
                      ? 'bg-yellow-400 animate-pulse shadow-sm'
                      : 'bg-yellow-300'
                    : 'bg-gray-100 border border-gray-200'
                  }
                `}
                title={`${stringNum}弦${activeStrings.has(stringNum) ? ' (再生中)' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* コード情報表示 */}
      {currentChord && !compact && (
        <div className="flex items-center space-x-2 bg-gray-50 px-2 py-1 rounded-md">
          <span className="text-xs font-medium text-gray-700">
            {currentChord.name}
          </span>
          {isPlaying && (
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-ping"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 簡易音声インジケーターコンポーネント
 * ヘッダーなどの制限されたスペースで使用
 */
export const AudioIndicator: React.FC<{
  isEnabled: boolean;
  isPlaying?: boolean;
  className?: string;
}> = ({ isEnabled, isPlaying = false, className = '' }) => (
  <div className={`flex items-center ${className}`}>
    <div
      className={`
        w-2 h-2 rounded-full transition-all duration-300
        ${isEnabled
          ? isPlaying
            ? 'bg-green-500 animate-pulse shadow-lg'
            : 'bg-green-400'
          : 'bg-gray-300'
        }
      `}
      title={isEnabled ? '音声有効' : '音声無効'}
      aria-label={isEnabled ? '音声有効' : '音声無効'}
    />
  </div>
);

export default AudioVisualizer;