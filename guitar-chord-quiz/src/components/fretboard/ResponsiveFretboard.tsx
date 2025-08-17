/**
 * レスポンシブフレットボードコンポーネント
 * 
 * @description 画面サイズに応じて自動的にサイズ・フレット数を調整するフレットボード
 * @author Claude Code
 */

'use client';

import React, { useMemo } from 'react';
import { ChordPattern } from '../../types';
import { useResponsiveBreakpoints, useScreenWidth, useIsTouchDevice } from '../../hooks/useMediaQuery';
import { calculateFretboardSize } from '../../lib/fretboard';
import { AccessibleFretboard } from './AccessibleFretboard';
import clsx from 'clsx';

// =============================================================================
// Types - 型定義
// =============================================================================

/**
 * レスポンシブフレットボードコンポーネントのプロパティ
 */
interface ResponsiveFretboardProps {
  /** 表示するコードパターン */
  chordPattern: ChordPattern;
  /** 指番号を表示するか */
  showFingers?: boolean;
  /** カポタストの位置（0は未使用） */
  capoPosition?: number;
  /** 追加のCSSクラス */
  className?: string;
  /** 弦再生時のコールバック */
  onStringPlay?: (string: number, fret: number) => void;
  /** インタラクティブ回答モード対応 */
  interactive?: boolean;
  /** 押弦位置設定/解除のコールバック */
  onFretToggle?: (string: number, fret: number) => void;
  /** フレット範囲を手動で指定（省略時は画面サイズに応じて自動設定） */
  fretRange?: { start: number; end: number };
}

/**
 * デバイス別設定の型定義
 */
interface DeviceSettings {
  maxFrets: number;
  orientation: 'horizontal';
  scale: number;
  touchOptimized: boolean;
}

// =============================================================================
// Device Settings - デバイス別設定
// =============================================================================

/**
 * デバイスタイプに応じた設定を取得
 */
const getDeviceSettings = (
  deviceType: 'mobile' | 'tablet' | 'desktop',
  screenWidth: number,
  isTouchDevice: boolean
): DeviceSettings => {
  const fretboardSize = calculateFretboardSize(screenWidth, 'horizontal');
  
  switch (deviceType) {
    case 'mobile':
      return {
        maxFrets: 5,
        orientation: 'horizontal',
        scale: fretboardSize.scale,
        touchOptimized: true,
      };
    
    case 'tablet':
      return {
        maxFrets: 8,
        orientation: 'horizontal',
        scale: fretboardSize.scale,
        touchOptimized: isTouchDevice,
      };
    
    case 'desktop':
    default:
      return {
        maxFrets: 12,
        orientation: 'horizontal',
        scale: fretboardSize.scale,
        touchOptimized: isTouchDevice,
      };
  }
};

// =============================================================================
// Main Component - メインコンポーネント
// =============================================================================

/**
 * レスポンシブフレットボードコンポーネント
 * 
 * 画面サイズに応じて自動的にサイズ・向きを調整する
 * 
 * @example
 * ```tsx
 * <ResponsiveFretboard
 *   chordPattern={cMajorChord}
 *   showFingers={true}
 *   onStringPlay={handleStringPlay}
 * />
 * ```
 */
export const ResponsiveFretboard: React.FC<ResponsiveFretboardProps> = ({
  chordPattern,
  showFingers = false,
  capoPosition = 0,
  className,
  onStringPlay,
  interactive = false,
  onFretToggle,
  fretRange,
}) => {
  // レスポンシブ設定を取得
  const {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    prefersReducedMotion,
    prefersHighContrast,
  } = useResponsiveBreakpoints();
  
  const screenWidth = useScreenWidth();
  const isTouchDevice = useIsTouchDevice();

  // デバイス設定を計算
  const deviceSettings = useMemo(() => 
    getDeviceSettings(deviceType, screenWidth, isTouchDevice),
    [deviceType, screenWidth, isTouchDevice]
  );

  // フレット範囲を決定（手動指定がない場合は自動設定）
  const effectiveFretRange = useMemo(() => {
    if (fretRange) {
      return fretRange;
    }

    // コードパターンで使用されている最大フレットを確認
    const usedFrets = chordPattern.frets.filter(fret => fret !== null) as number[];
    const maxUsedFret = usedFrets.length > 0 ? Math.max(...usedFrets) : 0;
    
    // デバイス設定の最大フレット数と使用フレット数を考慮
    const endFret = Math.max(deviceSettings.maxFrets, maxUsedFret + 2);
    
    return {
      start: 0,
      end: Math.min(endFret, 24), // 最大24フレットまで
    };
  }, [fretRange, chordPattern.frets, deviceSettings.maxFrets]);

  // レスポンシブスタイルを生成
  const responsiveStyles = useMemo(() => ({
    // デバイス別のパディング調整
    padding: isMobile ? '1rem' : isTablet ? '1.5rem' : '2rem',
    // タッチデバイス用の最小タッチターゲットサイズ確保
    minHeight: isTouchDevice ? '44px' : 'auto',
    // 高コントラストモード対応
    filter: prefersHighContrast ? 'contrast(150%)' : 'none',
  }), [isMobile, isTablet, isTouchDevice, prefersHighContrast]);

  return (
    <div
      className={clsx(
        'responsive-fretboard',
        'transition-all duration-300 ease-in-out',
        // アニメーション低減設定対応
        prefersReducedMotion && 'transition-none',
        // デバイス別クラス
        {
          'mobile-layout': isMobile,
          'tablet-layout': isTablet,
          'desktop-layout': isDesktop,
          'touch-optimized': isTouchDevice,
        },
        className
      )}
      style={responsiveStyles}
    >
      {/* デバイス情報表示（開発用 - 本番では削除推奨） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <div>Device: {deviceType} | Width: {screenWidth}px</div>
          <div>Frets: {effectiveFretRange.start}-{effectiveFretRange.end} | Touch: {isTouchDevice ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* アクセシブルフレットボード */}
      <AccessibleFretboard
        chordPattern={chordPattern}
        orientation={deviceSettings.orientation}
        showFingers={showFingers}
        capoPosition={capoPosition}
        onStringPlay={onStringPlay}
        fretRange={effectiveFretRange}
        interactive={interactive}
        onFretToggle={onFretToggle}
        className={clsx(
          'responsive-fretboard__inner',
          // デバイス別スタイル調整
          {
            'text-sm': isMobile,
            'text-base': isTablet,
            'text-lg': isDesktop,
          }
        )}
      />

      {/* レスポンシブ情報（アクセシビリティ用） */}
      <div className="sr-only" aria-live="polite">
        {deviceType}デバイスで{effectiveFretRange.end - effectiveFretRange.start}フレット表示中
      </div>
    </div>
  );
};

// =============================================================================
// Utility Components - ユーティリティコンポーネント
// =============================================================================

/**
 * フレットボードプレビューコンポーネント
 * 複数のコードを一覧表示する際に使用
 */
export const FretboardPreview: React.FC<{
  chordPattern: ChordPattern;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ chordPattern, size = 'medium', className }) => {
  const { isMobile } = useResponsiveBreakpoints();
  
  // サイズに応じたフレット範囲を設定
  const previewFretRange = useMemo(() => {
    const usedFrets = chordPattern.frets.filter(fret => fret !== null) as number[];
    const maxUsedFret = usedFrets.length > 0 ? Math.max(...usedFrets) : 3;
    
    const fretCounts = {
      small: 4,
      medium: isMobile ? 5 : 6,
      large: isMobile ? 6 : 8,
    };
    
    return {
      start: 0,
      end: Math.max(fretCounts[size], maxUsedFret + 1),
    };
  }, [chordPattern.frets, size, isMobile]);

  return (
    <div className={clsx('fretboard-preview', `size-${size}`, className)}>
      <ResponsiveFretboard
        chordPattern={chordPattern}
        fretRange={previewFretRange}
        showFingers={size !== 'small'}
        className="preview-fretboard"
      />
    </div>
  );
};

export default ResponsiveFretboard;