/**
 * 回答入力コンポーネント
 * 
 * @description デバイスに最適化された回答入力UIコンポーネント
 * @author Claude Code
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChordPattern, DifficultyLevel } from '../../types';
import { CHORD_PATTERNS } from '../../data/chord-patterns';
import { useResponsiveBreakpoints } from '../../hooks/useMediaQuery';
import clsx from 'clsx';

// =============================================================================
// Types - 型定義
// =============================================================================

/**
 * 回答入力コンポーネントのプロパティ
 */
interface AnswerInputProps {
  /** 回答提出時のコールバック */
  onSubmit: (answer: string) => void;
  /** 入力無効化フラグ */
  disabled?: boolean;
  /** 現在の難易度（コード候補の絞り込み用） */
  difficulty: DifficultyLevel;
  /** 追加のCSSクラス */
  className?: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 自動フォーカス */
  autoFocus?: boolean;
}

/**
 * モバイル回答入力コンポーネントのプロパティ
 */
interface MobileAnswerInputProps extends AnswerInputProps {
  /** ページあたりのアイテム数 */
  itemsPerPage?: number;
}

/**
 * デスクトップ回答入力コンポーネントのプロパティ
 */
interface DesktopAnswerInputProps extends AnswerInputProps {
  /** 最大表示候補数 */
  maxSuggestions?: number;
}

// =============================================================================
// Utility Functions - ユーティリティ関数
// =============================================================================

/**
 * 難易度に応じたコード候補を取得
 */
const getChordOptions = (difficulty: DifficultyLevel): string[] => {
  return CHORD_PATTERNS
    .filter(chord => chord.difficulty === difficulty)
    .map(chord => chord.name)
    .sort((a, b) => {
      // 基本的なコードを優先する簡易ソート
      const basicChords = ['C', 'G', 'D', 'A', 'E', 'Am', 'Em', 'Dm', 'F'];
      const aIndex = basicChords.indexOf(a);
      const bIndex = basicChords.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
};

/**
 * 入力値に基づいて候補を絞り込み
 */
const filterSuggestions = (input: string, options: string[], maxResults: number = 5): string[] => {
  if (!input.trim()) return [];
  
  const lowercaseInput = input.toLowerCase();
  
  // 完全一致を最優先
  const exactMatches = options.filter(option => 
    option.toLowerCase() === lowercaseInput
  );
  
  // 前方一致を次に優先
  const prefixMatches = options.filter(option => 
    option.toLowerCase().startsWith(lowercaseInput) && 
    !exactMatches.includes(option)
  );
  
  // 部分一致を最後に
  const partialMatches = options.filter(option => 
    option.toLowerCase().includes(lowercaseInput) && 
    !exactMatches.includes(option) && 
    !prefixMatches.includes(option)
  );
  
  return [...exactMatches, ...prefixMatches, ...partialMatches].slice(0, maxResults);
};

// =============================================================================
// Mobile Component - モバイルコンポーネント
// =============================================================================

/**
 * モバイル向けボタン型回答入力コンポーネント
 */
const MobileAnswerInput: React.FC<MobileAnswerInputProps> = ({
  onSubmit,
  disabled = false,
  difficulty,
  className,
  itemsPerPage = 6,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const chordOptions = getChordOptions(difficulty);
  const filteredOptions = searchQuery 
    ? filterSuggestions(searchQuery, chordOptions, 50)
    : chordOptions;
  
  const totalPages = Math.ceil(filteredOptions.length / itemsPerPage);
  const paginatedOptions = filteredOptions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // 検索クエリが変更されたらページを最初に戻す
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const handleSubmit = useCallback((answer: string) => {
    onSubmit(answer);
    setSearchQuery('');
    setCurrentPage(0);
  }, [onSubmit]);

  const handlePageChange = useCallback((direction: 'prev' | 'next') => {
    setCurrentPage(prev => {
      if (direction === 'prev') {
        return Math.max(0, prev - 1);
      } else {
        return Math.min(totalPages - 1, prev + 1);
      }
    });
  }, [totalPages]);

  return (
    <div className={clsx('space-y-4', className)}>
      {/* 検索入力 */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="コード名で検索..."
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-3 text-lg border-2 rounded-lg',
            'focus:outline-none transition-colors duration-200',
            disabled
              ? 'bg-gray-100 border-gray-300 text-gray-500'
              : 'bg-white border-gray-300 focus:border-blue-500'
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            ✕
          </button>
        )}
      </div>

      {/* 結果表示 */}
      {filteredOptions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? '該当するコードが見つかりません' : 'コードがありません'}
        </div>
      ) : (
        <>
          {/* コードボタングリッド */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {paginatedOptions.map((chord) => (
              <button
                key={chord}
                onClick={() => handleSubmit(chord)}
                disabled={disabled}
                className={clsx(
                  'h-12 rounded-lg font-semibold text-lg transition-all duration-200',
                  'min-w-[44px] min-h-[44px]', // Apple HIG準拠の最小タッチターゲット
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  disabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 active:scale-95'
                )}
                aria-label={`コード ${chord} を選択`}
              >
                {chord}
              </button>
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 0 || disabled}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                  'min-w-[44px] min-h-[44px]',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  currentPage === 0 || disabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                aria-label="前のページ"
              >
                ←
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-600">
                {currentPage + 1} / {totalPages}
                {searchQuery && ` (${filteredOptions.length}件)`}
              </span>
              
              <button
                onClick={() => handlePageChange('next')}
                disabled={currentPage >= totalPages - 1 || disabled}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                  'min-w-[44px] min-h-[44px]',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  currentPage >= totalPages - 1 || disabled
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
                aria-label="次のページ"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// =============================================================================
// Desktop Component - デスクトップコンポーネント
// =============================================================================

/**
 * デスクトップ向けドロップダウン回答入力コンポーネント
 */
const DesktopAnswerInput: React.FC<DesktopAnswerInputProps> = ({
  onSubmit,
  disabled = false,
  difficulty,
  className,
  placeholder = 'コード名を入力...',
  autoFocus = false,
  maxSuggestions = 8,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const chordOptions = getChordOptions(difficulty);

  // オートフォーカス
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    const filtered = filterSuggestions(value, chordOptions, maxSuggestions);
    setSuggestions(filtered);
    setSelectedIndex(-1);
    setShowSuggestions(value.length > 0 && filtered.length > 0);
  }, [chordOptions, maxSuggestions]);

  const handleSubmit = useCallback((answer: string) => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSubmit(suggestions[selectedIndex]);
        } else if (inputValue.trim()) {
          handleSubmit(inputValue.trim());
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (showSuggestions && suggestions.length > 0) {
          const newIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
          setSelectedIndex(newIndex);
          suggestionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (showSuggestions && suggestions.length > 0) {
          const newIndex = Math.max(selectedIndex - 1, -1);
          setSelectedIndex(newIndex);
          if (newIndex >= 0) {
            suggestionRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' });
          }
        }
        break;

      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;

      case 'Tab':
        if (showSuggestions && selectedIndex >= 0 && suggestions[selectedIndex]) {
          e.preventDefault();
          setInputValue(suggestions[selectedIndex]);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
    }
  }, [disabled, selectedIndex, suggestions, showSuggestions, inputValue, handleSubmit]);

  return (
    <div className={clsx('relative', className)}>
      {/* メイン入力フィールド */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // 少し遅延させて候補選択を可能にする
            setTimeout(() => {
              setShowSuggestions(false);
              setSelectedIndex(-1);
            }, 150);
          }}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            'w-full px-4 py-3 text-lg border-2 rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            disabled
              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-white border-gray-300 focus:border-blue-500'
          )}
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        
        {/* クリアボタン */}
        {inputValue && !disabled && (
          <button
            onClick={() => {
              setInputValue('');
              setSuggestions([]);
              setShowSuggestions(false);
              setSelectedIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="入力をクリア"
          >
            ✕
          </button>
        )}
      </div>

      {/* 入力補完候補リスト */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className={clsx(
            'absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg',
            'max-h-48 overflow-y-auto'
          )}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              ref={(el) => { suggestionRefs.current[index] = el; }}
              onMouseDown={(e) => {
                e.preventDefault(); // onBlurの前に実行される
                handleSubmit(suggestion);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={clsx(
                'px-4 py-2 cursor-pointer transition-colors duration-150',
                index === selectedIndex
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-900 hover:bg-gray-100'
              )}
              role="option"
              aria-selected={index === selectedIndex}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* 送信ボタン */}
      <button
        onClick={() => handleSubmit(inputValue)}
        disabled={disabled || !inputValue.trim()}
        className={clsx(
          'mt-3 w-full py-3 font-semibold rounded-lg transition-all duration-200',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          disabled || !inputValue.trim()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        )}
        aria-label="回答を送信"
      >
        回答
      </button>
    </div>
  );
};

// =============================================================================
// Main Component - メインコンポーネント
// =============================================================================

/**
 * レスポンシブ回答入力コンポーネント
 * 
 * デバイスに応じて最適な入力UIを自動切り替え
 * 
 * @example
 * ```tsx
 * <AnswerInput
 *   onSubmit={handleAnswer}
 *   difficulty="beginner"
 *   disabled={gameState.showResult}
 * />
 * ```
 */
export const AnswerInput: React.FC<AnswerInputProps> = (props) => {
  const { isMobile } = useResponsiveBreakpoints();

  // モバイルデバイスでは視覚的なボタン選択
  // デスクトップでは効率的なテキスト入力
  return isMobile ? (
    <MobileAnswerInput {...props} />
  ) : (
    <DesktopAnswerInput {...props} />
  );
};

export default AnswerInput;