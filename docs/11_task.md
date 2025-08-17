# Task 11: インタラクティブ回答モード・メインページ実装

## 概要
インタラクティブ回答モード機能とアプリケーションのメインページを実装

## 実行内容
1. インタラクティブ回答モードコンポーネント実装
2. ルートレイアウトの設定
3. ホームページ（メニュー）の実装
4. ゲームモード選択機能
5. ナビゲーション・ヘッダー

## 作成・更新ファイル
1. `src/components/quiz/InteractiveAnswerMode.tsx` **（新規）**
2. `src/app/layout.tsx`
3. `src/app/page.tsx`
4. `src/app/globals.css`
5. `src/hooks/useInteractiveQuiz.ts` **（新規）**

## インタラクティブ回答モード実装
**作成ファイル: `src/components/quiz/InteractiveAnswerMode.tsx`**
```typescript
/**
 * インタラクティブ回答モードコンポーネント
 * sample/fretboard-design-sample.html のJavaScript機能を移植
 */
interface InteractiveAnswerModeProps {
  chordPattern: ChordPattern;
  onAnswer: (isCorrect: boolean, userPattern: Set<string>) => void;
  onHint: () => void;
}

export const InteractiveAnswerMode: React.FC<InteractiveAnswerModeProps> = ({
  chordPattern,
  onAnswer,
  onHint
}) => {
  const [userFrets, setUserFrets] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // toggleFret関数の実装
  const handleFretToggle = (string: number, fret: number) => {
    const fretKey = `${string}-${fret}`;
    const newUserFrets = new Set(userFrets);
    
    if (newUserFrets.has(fretKey)) {
      newUserFrets.delete(fretKey);
    } else {
      newUserFrets.add(fretKey);
    }
    
    setUserFrets(newUserFrets);
  };

  // checkAnswer関数の実装
  const handleAnswerCheck = () => {
    const correctPattern = new Set(chordPattern.frets
      .map((fret, stringIndex) => fret !== null ? `${stringIndex + 1}-${fret}` : null)
      .filter(Boolean) as string[]
    );
    
    const isCorrect = userFrets.size === correctPattern.size && 
                     Array.from(userFrets).every(fret => correctPattern.has(fret));
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowResult(true);
    onAnswer(isCorrect, userFrets);
  };

  return (
    <div className="space-y-6">
      {/* 出題表示 */}
      <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg text-center">
        <h3 className="text-3xl font-bold text-purple-900 mb-2">問題</h3>
        <div className="text-5xl font-bold text-purple-600 mb-3">{chordPattern.name}</div>
        <p className="text-lg text-purple-800 mb-4">フレットボード上に押弦位置を設定してください</p>
      </div>

      {/* インタラクティブフレットボード */}
      <AccessibleFretboard
        chordPattern={{ ...chordPattern, frets: Array(6).fill(null) }}
        orientation="horizontal"
        interactive={true}
        onFretToggle={handleFretToggle}
      />

      {/* 操作ボタン */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button variant="secondary" onClick={() => setUserFrets(new Set())}>
          すべてクリア
        </Button>
        <Button variant="secondary" onClick={onHint}>
          ヒントを表示
        </Button>
        <Button variant="primary" onClick={handleAnswerCheck} disabled={userFrets.size === 0}>
          答え合わせ
        </Button>
        <Button variant="secondary" onClick={() => /* showCorrectAnswer logic */}>
          正解を表示
        </Button>
      </div>

      {/* 結果表示 */}
      {showResult && (
        <div className={`p-4 rounded-lg border ${
          feedback === 'correct' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          {/* フィードバック表示 */}
        </div>
      )}
    </div>
  );
};
```

## カスタムフック実装
**作成ファイル: `src/hooks/useInteractiveQuiz.ts`**
```typescript
/**
 * インタラクティブクイズ状態管理フック
 */
export const useInteractiveQuiz = (difficulty: ChordDifficulty) => {
  const [currentChord, setCurrentChord] = useState<ChordPattern | null>(null);
  const [userPattern, setUserPattern] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState<string[]>([]);

  const generateHint = useCallback((chord: ChordPattern) => {
    const hintOptions = [
      `このコードは${chord.frets.filter(f => f !== null).length}本の弦を押弦します`,
      `使用するフレットは1〜5フレットの範囲です`,
      `このコードの種類は${chord.name.includes('m') ? 'マイナー' : 'メジャー'}コードです`
    ];
    return hintOptions[Math.floor(Math.random() * hintOptions.length)];
  }, []);

  return {
    currentChord,
    userPattern,
    score,
    hints,
    generateHint,
    // その他の制御関数
  };
};
```

## ルートレイアウト実装
`src/app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ギターコードクイズ',
  description: 'フレットボード上の指板位置からコード名を当てるクイズゲーム',
  keywords: 'ギター, コード, クイズ, 音楽, 練習',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-gray-900">
                ギターコードクイズ
              </h1>
              <nav>
                {/* 後で設定ページなどを追加 */}
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
```

## ホームページ実装
`src/app/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { QuizGame } from '@/components/quiz/QuizGame';
import { ChordPattern } from '@/types';

export default function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChordPattern['difficulty'] | null>(null);
  const [showGame, setShowGame] = useState(false);
  
  const handleStartGame = (difficulty: ChordPattern['difficulty']) => {
    setSelectedDifficulty(difficulty);
    setShowGame(true);
  };
  
  const handleGameEnd = () => {
    setShowGame(false);
    setSelectedDifficulty(null);
  };
  
  // ゲーム画面
  if (showGame && selectedDifficulty) {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleGameEnd}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            ← メニューに戻る
          </button>
        </div>
        <QuizGame 
          difficulty={selectedDifficulty}
          onGameEnd={handleGameEnd}
        />
      </div>
    );
  }
  
  // メニュー画面
  return (
    <div className="max-w-4xl mx-auto">
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ギターコードクイズ
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          フレットボード上の指板位置からコード名を当てよう！
        </p>
        <p className="text-gray-500">
          ギターコードを視覚的に覚えて演奏スキルを向上させましょう
        </p>
      </div>
      
      {/* 難易度選択 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">難易度を選択</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 初級 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-green-500 text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold mb-2">初級</h3>
            <p className="text-gray-600 mb-4">
              基本的なオープンコード<br/>
              C, G, D, A, E, Am, Em, Dm, F
            </p>
            <ul className="text-sm text-gray-500 mb-6 text-left">
              <li>• 初心者向けの簡単なコード</li>
              <li>• オープンコード中心</li>
              <li>• フレット1-4使用</li>
            </ul>
            <button
              onClick={() => handleStartGame('beginner')}
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg
                       hover:bg-green-600 transition-colors"
            >
              初級でスタート
            </button>
          </div>
          
          {/* 中級 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-orange-500 text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-bold mb-2">中級</h3>
            <p className="text-gray-600 mb-4">
              バレーコード・セブンスコード<br/>
              F, Bm, B, G7, C7, D7, A7
            </p>
            <ul className="text-sm text-gray-500 mb-6 text-left">
              <li>• バレーコードを含む</li>
              <li>• セブンスコード</li>
              <li>• フレット1-7使用</li>
            </ul>
            <button
              onClick={() => handleStartGame('intermediate')}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg
                       hover:bg-orange-600 transition-colors"
            >
              中級でスタート
            </button>
          </div>
          
          {/* 上級 */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">上級</h3>
            <p className="text-gray-600 mb-4">
              複雑なコード・テンションコード<br/>
              Cmaj7, Dm7, Gsus4, Fadd9
            </p>
            <ul className="text-sm text-gray-500 mb-6 text-left">
              <li>• テンションコード</li>
              <li>• 複雑な指使い</li>
              <li>• フレット1-12使用</li>
            </ul>
            <button
              onClick={() => handleStartGame('advanced')}
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg
                       hover:bg-red-600 transition-colors"
            >
              上級でスタート
            </button>
          </div>
        </div>
      </div>
      
      {/* 機能紹介 */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">特徴</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-blue-500 text-3xl mb-3">🎸</div>
            <h3 className="font-semibold mb-2">リアルなフレットボード</h3>
            <p className="text-sm text-gray-600">
              実際のギターと同じ比率で描画されたフレットボード
            </p>
          </div>
          <div className="text-center">
            <div className="text-purple-500 text-3xl mb-3">📱</div>
            <h3 className="font-semibold mb-2">レスポンシブ対応</h3>
            <p className="text-sm text-gray-600">
              スマートフォン・タブレット・PCで最適な表示
            </p>
          </div>
          <div className="text-center">
            <div className="text-green-500 text-3xl mb-3">🎯</div>
            <h3 className="font-semibent mb-2">段階的学習</h3>
            <p className="text-sm text-gray-600">
              初級から上級まで段階的にスキルアップ
            </p>
          </div>
          <div className="text-center">
            <div className="text-orange-500 text-3xl mb-3">💡</div>
            <h3 className="font-semibold mb-2">ヒント機能</h3>
            <p className="text-sm text-gray-600">
              ルート音・コードタイプのヒントで学習をサポート
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## グローバルスタイル更新
`src/app/globals.css`に追加
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムスタイル */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-lg p-6;
  }
}

/* アニメーション */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

## 確認項目
- [ ] ページが正常に表示される
- [ ] 難易度選択が動作する
- [ ] ゲーム画面への遷移が正常
- [ ] メニューへの戻る機能が動作
- [ ] レスポンシブレイアウトが適切
- [ ] ヘッダー・フッターが正しく表示

## 成果物
- 完全なメインページ・レイアウト
- 難易度選択機能
- ナビゲーション

## 所要時間
40分