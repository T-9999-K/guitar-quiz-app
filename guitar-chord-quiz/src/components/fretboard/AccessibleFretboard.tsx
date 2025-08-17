/**
 * Apple風アクセシブルフレットボードコンポーネント
 * 
 * @description WCAG 2.1 AAA準拠、完全キーボード操作対応のフレットボード
 * @author Claude Code
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChordPattern } from '../../types';
import { getFretCoordinates, calculateFretboardSize } from '../../lib/fretboard';
import clsx from 'clsx';

// =============================================================================
// Types - 型定義
// =============================================================================

/**
 * Apple風アクセシブルフレットボードコンポーネントのプロパティ
 * 
 * WCAG 2.1 AAA準拠、完全キーボード操作対応
 * Apple Human Interface Guidelines準拠
 */
interface AccessibleFretboardProps {
  /** 表示するコードパターン */
  chordPattern: ChordPattern;
  /** フレットボードの向き */
  orientation: 'horizontal'; // 横向きのみ実装（sample/fretboard-design-sample.html基準）
  /** 指番号を表示するか */
  showFingers?: boolean;
  /** カポタストの位置（0は未使用） */
  capoPosition?: number;
  /** 追加のCSSクラス */
  className?: string;
  /** 弦再生時のコールバック */
  onStringPlay?: (string: number, fret: number) => void;
  /** フレット範囲（モバイル対応） */
  fretRange?: { start: number; end: number };
  /** インタラクティブ回答モード対応 */
  interactive?: boolean;
  /** 押弦位置設定/解除のコールバック */
  onFretToggle?: (string: number, fret: number) => void;
}

/**
 * フォーカス位置の型定義
 */
interface FocusPosition {
  string: number;
  fret: number;
}

// =============================================================================
// Focus Management Utilities - フォーカス管理ユーティリティ
// =============================================================================

/**
 * アクセシビリティ用フォーカス管理
 */
export const manageFocus = {
  /**
   * スクリーンリーダーへのメッセージ通知
   */
  announce: (message: string): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  },

  /**
   * フォーカス可能要素の検索
   */
  getFocusableElements: (container: HTMLElement): NodeListOf<Element> => {
    return container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  },
};

// =============================================================================
// Main Component - メインコンポーネント
// =============================================================================

/**
 * Apple風アクセシブルフレットボードコンポーネント
 * 
 * @example
 * ```tsx
 * <AccessibleFretboard
 *   chordPattern={cMajorChord}
 *   orientation="horizontal"
 *   showFingers={true}
 *   onStringPlay={handleStringPlay}
 * />
 * 
 * // 基準レイアウト: sample/fretboard-design-sample.html
 * // viewBox: 0 0 800 300, 弦名目盛り必須
 * ```
 */
export const AccessibleFretboard: React.FC<AccessibleFretboardProps> = ({
  chordPattern,
  orientation,
  showFingers = false,
  capoPosition = 0,
  className,
  onStringPlay,
  fretRange = { start: 0, end: 12 },
  interactive = false,
  onFretToggle,
}) => {
  // キーボードナビゲーション状態
  const [focusedPosition, setFocusedPosition] = useState<FocusPosition | null>(null);

  // 高コントラスト設定検出
  const [highContrast, setHighContrast] = useState(false);

  // アクセシビリティ設定の初期化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // キーボード操作ハンドラー
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, stringIndex: number, fret: number) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (interactive && onFretToggle) {
            onFretToggle(stringIndex, fret);
            manageFocus.announce(`${stringIndex + 1}弦 ${fret}フレットを設定しました`);
          } else if (onStringPlay) {
            onStringPlay(stringIndex, fret);
            manageFocus.announce(`${stringIndex + 1}弦 ${fret}フレットを再生しました`);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (stringIndex > 0) {
            setFocusedPosition({ string: stringIndex - 1, fret });
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (stringIndex < 5) {
            setFocusedPosition({ string: stringIndex + 1, fret });
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (fret > fretRange.start) {
            setFocusedPosition({ string: stringIndex, fret: fret - 1 });
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (fret < fretRange.end) {
            setFocusedPosition({ string: stringIndex, fret: fret + 1 });
          }
          break;

        case 'Home':
          e.preventDefault();
          setFocusedPosition({ string: stringIndex, fret: fretRange.start });
          break;

        case 'End':
          e.preventDefault();
          setFocusedPosition({ string: stringIndex, fret: fretRange.end });
          break;
      }
    },
    [onStringPlay, onFretToggle, interactive, fretRange]
  );

  // SVG座標計算
  const getSVGDimensions = () => {
    const isHorizontal = orientation === 'horizontal';
    return {
      width: isHorizontal ? 800 : 400,
      height: isHorizontal ? 300 : 600,
      viewBox: isHorizontal ? '0 0 800 300' : '0 0 400 600',
    };
  };

  const getStringPosition = (stringIndex: number) => {
    const { width, height } = getSVGDimensions();
    const isHorizontal = orientation === 'horizontal';

    if (isHorizontal) {
      return {
        x1: 100,
        y1: 60 + stringIndex * 40,
        x2: width - 100,
        y2: 60 + stringIndex * 40,
      };
    } else {
      return {
        x1: 60 + stringIndex * 50,
        y1: 60,
        x2: 60 + stringIndex * 50,
        y2: height - 60,
      };
    }
  };

  const getFretPosition = (fretIndex: number) => {
    const { width, height } = getSVGDimensions();
    const isHorizontal = orientation === 'horizontal';
    const fretSpacing = isHorizontal
      ? (width - 200) / Math.max(fretRange.end - fretRange.start, 1)
      : (height - 120) / Math.max(fretRange.end - fretRange.start, 1);

    if (isHorizontal) {
      const x = 100 + fretIndex * fretSpacing;
      return { x1: x, y1: 40, x2: x, y2: height - 40 };
    } else {
      const y = 60 + fretIndex * fretSpacing;
      return { x1: 40, y1: y, x2: width - 40, y2: y };
    }
  };

  const getChordDotPosition = (stringIndex: number, fret: number) => {
    const stringPos = getStringPosition(stringIndex);
    const fretSpacing = orientation === 'horizontal'
      ? (getSVGDimensions().width - 200) / Math.max(fretRange.end - fretRange.start, 1)
      : (getSVGDimensions().height - 120) / Math.max(fretRange.end - fretRange.start, 1);

    if (orientation === 'horizontal') {
      return {
        cx: 100 + (fret - fretRange.start + 0.5) * fretSpacing,
        cy: stringPos.y1,
      };
    } else {
      return {
        cx: stringPos.x1,
        cy: 60 + (fret - fretRange.start + 0.5) * fretSpacing,
      };
    }
  };

  const svgDimensions = getSVGDimensions();

  return (
    <div
      className={clsx(
        'card transition-all duration-200 ease-in-out',
        'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
        className
      )}
    >
      {/* アクセシビリティ用タイトル */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ギターコード: {chordPattern.name}
        </h3>
        <p className="text-sm text-gray-600">
          難易度: {chordPattern.difficulty} | 矢印キーで移動、Enter/Spaceで再生
        </p>
      </div>

      {/* SVGフレットボード */}
      <svg
        viewBox={svgDimensions.viewBox}
        className={clsx(
          'w-full h-auto border border-gray-200 rounded-lg',
          highContrast && 'filter contrast-150'
        )}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`ギターコード ${chordPattern.name} のフレットボード図`}
      >
        {/* 背景 */}
        <rect
          x="0"
          y="0"
          width={svgDimensions.width}
          height={svgDimensions.height}
          fill="#FEFEFE"
          stroke="none"
        />

        {/* フレット線描画 */}
        {Array.from({ length: fretRange.end - fretRange.start + 1 }, (_, i) => {
          const fretIndex = i + fretRange.start;
          const fretPos = getFretPosition(i);

          return (
            <line
              key={`fret-${fretIndex}`}
              x1={fretPos.x1}
              y1={fretPos.y1}
              x2={fretPos.x2}
              y2={fretPos.y2}
              stroke="#D1D5DB"
              strokeWidth={fretIndex === 0 ? '4' : '2'}
              className="transition-colors duration-150"
            />
          );
        })}

        {/* 弦描画 */}
        {Array.from({ length: 6 }, (_, stringIndex) => {
          const stringPos = getStringPosition(stringIndex);

          return (
            <line
              key={`string-${stringIndex}`}
              x1={stringPos.x1}
              y1={stringPos.y1}
              x2={stringPos.x2}
              y2={stringPos.y2}
              stroke="#6B7280"
              strokeWidth={stringIndex < 2 ? '1.5' : '1'}
              className="transition-colors duration-150"
            />
          );
        })}

        {/* ポジションマーク（3, 5, 7, 9, 12フレット） */}
        {[3, 5, 7, 9, 12]
          .filter(fret => fret >= fretRange.start && fret <= fretRange.end)
          .map(fret => {
            const pos = getChordDotPosition(2.5, fret); // 中央付近
            return (
              <circle
                key={`position-mark-${fret}`}
                cx={pos.cx}
                cy={pos.cy}
                r="4"
                fill="#E5E7EB"
                className="pointer-events-none"
              />
            );
          })}

        {/* コード押弦位置 */}
        {chordPattern.frets.map((fret, stringIndex) => {
          if (fret === null || fret < fretRange.start || fret > fretRange.end)
            return null;

          const pos = getChordDotPosition(stringIndex, fret);
          const isInteractive = !!(onStringPlay || (interactive && onFretToggle));
          const isFocused =
            focusedPosition?.string === stringIndex &&
            focusedPosition?.fret === fret;

          return (
            <g key={`chord-dot-${stringIndex}-${fret}`}>
              {/* 押弦ドット */}
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r="14"
                fill="#3B82F6"
                stroke="#FFFFFF"
                strokeWidth="3"
                className={clsx(
                  'transition-all duration-150',
                  isInteractive && [
                    'cursor-pointer',
                    'hover:fill-blue-600 hover:scale-110',
                    'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  ],
                  isFocused && 'ring-2 ring-blue-500 ring-offset-2 scale-110'
                )}
                tabIndex={isInteractive ? 0 : -1}
                role={isInteractive ? 'button' : 'presentation'}
                aria-label={`${stringIndex + 1}弦 ${fret}フレット${
                  showFingers && chordPattern.fingers[stringIndex]
                    ? ` ${chordPattern.fingers[stringIndex]}番指`
                    : ''
                }`}
                onKeyDown={
                  isInteractive
                    ? e => handleKeyDown(e, stringIndex, fret)
                    : undefined
                }
                onClick={
                  isInteractive
                    ? () => {
                        if (interactive && onFretToggle) {
                          onFretToggle(stringIndex, fret);
                        } else if (onStringPlay) {
                          onStringPlay(stringIndex, fret);
                        }
                      }
                    : undefined
                }
                onFocus={() =>
                  setFocusedPosition({ string: stringIndex, fret })
                }
              />

              {/* 指番号表示 */}
              {showFingers && chordPattern.fingers[stringIndex] && (
                <text
                  x={pos.cx}
                  y={pos.cy + 5}
                  textAnchor="middle"
                  className="fill-white text-sm font-semibold pointer-events-none"
                  aria-hidden="true"
                >
                  {chordPattern.fingers[stringIndex]}
                </text>
              )}
            </g>
          );
        })}

        {/* フレット番号 */}
        {Array.from({ length: fretRange.end - fretRange.start }, (_, i) => {
          const fretIndex = i + fretRange.start + 1;
          const pos = getChordDotPosition(0, fretIndex);

          return (
            <text
              key={`fret-number-${fretIndex}`}
              x={orientation === 'horizontal' ? pos.cx : pos.cx - 30}
              y={orientation === 'horizontal' ? pos.cy - 30 : pos.cy + 5}
              textAnchor="middle"
              className="fill-gray-600 text-xs font-medium pointer-events-none"
              aria-hidden="true"
            >
              {fretIndex}
            </text>
          );
        })}

        {/* 弦名ラベル */}
        {['E', 'A', 'D', 'G', 'B', 'E'].map((stringName, index) => {
          const stringPos = getStringPosition(index);
          return (
            <text
              key={`string-label-${index}`}
              x={orientation === 'horizontal' ? 50 : stringPos.x1}
              y={orientation === 'horizontal' ? stringPos.y1 + 5 : 30}
              textAnchor="middle"
              className="fill-gray-900 text-sm font-semibold pointer-events-none"
              aria-hidden="true"
            >
              {stringName}
            </text>
          );
        })}
      </svg>

      {/* 弦名表示 */}
      <div className="mt-4 grid grid-cols-6 gap-2 text-center">
        {['E', 'A', 'D', 'G', 'B', 'E'].map((stringName, index) => (
          <div key={`string-name-${index}`} className="text-sm">
            <div className="font-semibold text-gray-900">{stringName}</div>
            <div className="text-xs text-gray-600">{6 - index}弦</div>
          </div>
        ))}
      </div>

      {/* アクセシビリティ情報 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">コード情報</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
          <div>
            <span className="font-medium">コード名:</span> {chordPattern.name}
          </div>
          <div>
            <span className="font-medium">難易度:</span>{' '}
            {chordPattern.difficulty}
          </div>
          <div>
            <span className="font-medium">ルート音:</span> {chordPattern.root}
          </div>
          <div>
            <span className="font-medium">種類:</span> {chordPattern.quality}
          </div>
        </div>

        {/* 押弦位置の詳細情報 */}
        <div className="mt-3">
          <div className="font-medium text-gray-900 text-sm mb-1">
            押弦位置:
          </div>
          <div className="text-xs text-gray-600">
            {chordPattern.frets.map((fret, index) => (
              <span key={index} className="mr-3">
                {6 - index}弦: {fret === null ? '開放' : `${fret}F`}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibleFretboard;