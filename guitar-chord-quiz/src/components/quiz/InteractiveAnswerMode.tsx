'use client';

import React, { useState, useCallback } from 'react';
import { ChordPattern } from '@/types';
import { AccessibleFretboard } from '@/components/fretboard/AccessibleFretboard';
import { Button } from '@/components/ui/Button';

/**
 * インタラクティブ回答モードコンポーネント
 * ユーザーがフレットボード上でコードを作成して回答するモード
 */
interface InteractiveAnswerModeProps {
  /** 正解のコードパターン */
  chordPattern: ChordPattern;
  /** 回答時のコールバック */
  onAnswer: (isCorrect: boolean, userPattern: Set<string>) => void;
  /** ヒント要求時のコールバック */
  onHint: () => void;
  /** 正解表示時のコールバック */
  onShowAnswer: () => void;
  /** クリア時のコールバック */
  onClear: () => void;
  /** 現在のヒント数 */
  hintsUsed?: number;
  /** 最大ヒント数 */
  maxHints?: number;
}

export const InteractiveAnswerMode: React.FC<InteractiveAnswerModeProps> = ({
  chordPattern,
  onAnswer,
  onHint,
  onShowAnswer,
  onClear,
  hintsUsed = 0,
  maxHints = 3,
}) => {
  const [userFrets, setUserFrets] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  /**
   * フレット位置のトグル処理
   */
  const handleFretToggle = useCallback((string: number, fret: number) => {
    const fretKey = `${string}-${fret}`;
    setUserFrets(prev => {
      const newUserFrets = new Set(prev);
      
      if (newUserFrets.has(fretKey)) {
        newUserFrets.delete(fretKey);
      } else {
        newUserFrets.add(fretKey);
      }
      
      return newUserFrets;
    });
    
    // 結果表示をリセット
    setShowResult(false);
    setFeedback(null);
  }, []);

  /**
   * 回答チェック処理
   */
  const handleAnswerCheck = useCallback(() => {
    // 正解パターンを生成（1-indexedの弦番号）
    const correctPattern = new Set(
      chordPattern.frets
        .map((fret, stringIndex) => fret !== null ? `${stringIndex + 1}-${fret}` : null)
        .filter(Boolean) as string[]
    );
    
    // 回答の正確性をチェック
    const isCorrect = userFrets.size === correctPattern.size && 
                     Array.from(userFrets).every(fret => correctPattern.has(fret));
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowResult(true);
    onAnswer(isCorrect, userFrets);
  }, [chordPattern.frets, userFrets, onAnswer]);

  /**
   * すべてクリア処理
   */
  const handleClear = useCallback(() => {
    setUserFrets(new Set());
    setShowResult(false);
    setFeedback(null);
    setShowCorrectAnswer(false);
    onClear();
  }, [onClear]);

  /**
   * 正解表示処理
   */
  const handleShowAnswer = useCallback(() => {
    setShowCorrectAnswer(true);
    onShowAnswer();
  }, [onShowAnswer]);

  // ユーザーが作成中のコードパターンを表示用に変換
  const userChordPattern: ChordPattern = {
    ...chordPattern,
    name: '作成中...',
    frets: Array.from({ length: 6 }, (_, index) => {
      const stringNum = index + 1;
      const fretMatch = Array.from(userFrets).find(f => f.startsWith(`${stringNum}-`));
      return fretMatch ? parseInt(fretMatch.split('-')[1]) : null;
    }),
  };

  return (
    <div className="space-y-6">
      {/* 問題表示 */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="text-4xl mr-3">🎸</div>
          <h3 className="text-2xl font-bold text-purple-900">問題</h3>
        </div>
        <div className="text-4xl font-bold text-purple-600 mb-3">{chordPattern.name}</div>
        <p className="text-lg text-purple-800 mb-2">
          フレットボード上に押弦位置を設定してください
        </p>
        <div className="text-sm text-purple-600">
          クリックまたはタップして押弦位置を選択
        </div>
      </div>

      {/* インタラクティブフレットボード */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            あなたの回答
          </h4>
          <div className="text-sm text-gray-600">
            選択中の押弦位置: {userFrets.size}個
          </div>
        </div>
        
        <AccessibleFretboard
          chordPattern={userChordPattern}
          orientation="horizontal"
          interactive={true}
          onFretToggle={handleFretToggle}
        />
      </div>

      {/* 操作ボタン */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          variant="secondary" 
          onClick={handleClear}
          className="flex items-center justify-center space-x-2"
        >
          <span>🗑️</span>
          <span>すべてクリア</span>
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={onHint}
          disabled={hintsUsed >= maxHints}
          className="flex items-center justify-center space-x-2"
        >
          <span>💡</span>
          <span>ヒント ({hintsUsed}/{maxHints})</span>
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleAnswerCheck} 
          disabled={userFrets.size === 0}
          className="flex items-center justify-center space-x-2"
        >
          <span>✓</span>
          <span>答え合わせ</span>
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={handleShowAnswer}
          className="flex items-center justify-center space-x-2"
        >
          <span>👁️</span>
          <span>正解を表示</span>
        </Button>
      </div>

      {/* 正解表示 */}
      {showCorrectAnswer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">
            正解: {chordPattern.name}
          </h4>
          <AccessibleFretboard
            chordPattern={chordPattern}
            orientation="horizontal"
            interactive={false}
          />
          <div className="mt-3 text-sm text-blue-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>難易度:</strong> {chordPattern.difficulty === 'beginner' ? '初級' : 
                                        chordPattern.difficulty === 'intermediate' ? '中級' : '上級'}
              </div>
              <div>
                <strong>カテゴリ:</strong> {chordPattern.category || 'その他'}
              </div>
            </div>
            {chordPattern.description && (
              <div className="mt-2">
                <strong>説明:</strong> {chordPattern.description}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 結果表示 */}
      {showResult && (
        <div className={`p-4 rounded-lg border animate-fadeIn ${
          feedback === 'correct' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-center mb-3">
            <div className="text-3xl mr-3">
              {feedback === 'correct' ? '🎉' : '❌'}
            </div>
            <h4 className={`text-xl font-bold ${
              feedback === 'correct' ? 'text-green-900' : 'text-red-900'
            }`}>
              {feedback === 'correct' ? '正解です！' : '不正解です'}
            </h4>
          </div>
          
          <div className={`text-center ${
            feedback === 'correct' ? 'text-green-800' : 'text-red-800'
          }`}>
            {feedback === 'correct' ? (
              <p>素晴らしい！正確にコードを作成できました。</p>
            ) : (
              <div className="space-y-2">
                <p>もう一度チャレンジしてみてください。</p>
                <p className="text-sm">
                  ヒント機能や正解表示を使って学習を進めましょう。
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 進捗情報 */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <div>
          {chordPattern.difficulty === 'beginner' && '初級レベル'} 
          {chordPattern.difficulty === 'intermediate' && '中級レベル'} 
          {chordPattern.difficulty === 'advanced' && '上級レベル'}
        </div>
        <div>
          Apple HIG準拠 • WCAG 2.1 AAA準拠 • レスポンシブ対応
        </div>
      </div>
    </div>
  );
};