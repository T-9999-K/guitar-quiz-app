# Task 14: 設定・カスタマイズ機能実装

## 概要
ユーザーが各種設定をカスタマイズできる機能を実装

## 実行内容
1. 設定画面・コンポーネント作成
2. テーマ切り替え（ダーク・ライトモード）
3. ゲーム設定（音声、難易度等）
4. 統計・履歴表示機能

## 作成ファイル
1. `src/components/ui/Settings.tsx`
2. `src/components/ui/Statistics.tsx`
3. `src/hooks/useTheme.ts`
4. `src/app/settings/page.tsx`

## テーマ管理フック
`src/hooks/useTheme.ts`
```typescript
import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('guitar-quiz-theme', 'light');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme, mounted]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  // SSR対応
  if (!mounted) {
    return { theme: 'light', toggleTheme, mounted: false };
  }
  
  return { theme, toggleTheme, mounted: true };
};
```

## 設定コンポーネント
`src/components/ui/Settings.tsx`
```typescript
import React from 'react';
import { useGameSettings } from '@/hooks/useLocalStorage';
import { useTheme } from '@/hooks/useTheme';
import { useAudio } from '@/hooks/useAudio';
import { AudioControls } from './AudioControls';
import { ChordPattern } from '@/types';

interface SettingsProps {
  onClose?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings, setSettings } = useGameSettings();
  const { theme, toggleTheme, mounted } = useTheme();
  const audioControls = useAudio();
  
  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  if (!mounted) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">設定</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {/* テーマ設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            テーマ
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleTheme()}
              className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                theme === 'light'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
              }`}
            >
              ☀️ ライト
            </button>
            <button
              onClick={() => toggleTheme()}
              className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
              }`}
            >
              🌙 ダーク
            </button>
          </div>
        </div>
        
        {/* デフォルト難易度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            デフォルト難易度
          </label>
          <select
            value={settings.difficulty}
            onChange={(e) => updateSetting('difficulty', e.target.value as ChordPattern['difficulty'])}
            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="beginner">初級</option>
            <option value="intermediate">中級</option>
            <option value="advanced">上級</option>
          </select>
        </div>
        
        {/* 音声設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            音声設定
          </label>
          <div className="space-y-3">
            <AudioControls
              isEnabled={audioControls.isEnabled}
              volume={audioControls.volume}
              onToggle={audioControls.setIsEnabled}
              onVolumeChange={audioControls.changeVolume}
              onEnable={audioControls.enableAudio}
              isInitialized={audioControls.isInitialized}
            />
          </div>
        </div>
        
        {/* カポタスト設定 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            カポタスト位置
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="12"
              value={settings.capoPosition}
              onChange={(e) => updateSetting('capoPosition', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
              {settings.capoPosition === 0 ? 'なし' : `${settings.capoPosition}F`}
            </span>
          </div>
        </div>
        
        {/* データ管理 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            データ管理
          </label>
          <div className="space-y-2">
            <button
              onClick={() => {
                if (confirm('すべての設定をリセットしますか？')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              すべてのデータをリセット
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

// 設定モーダル
export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Settings onClose={onClose} />
    </div>
  );
};
```

## 統計表示コンポーネント
`src/components/ui/Statistics.tsx`
```typescript
import React from 'react';
import { useScoreHistory } from '@/hooks/useLocalStorage';

export const Statistics: React.FC = () => {
  const { history, getStats } = useScoreHistory();
  const stats = getStats();
  
  if (!stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">統計</h2>
        <p className="text-gray-600 dark:text-gray-400">
          まだゲームをプレイしていません。最初のゲームを始めて統計を確認しましょう！
        </p>
      </div>
    );
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '上級';
      default: return difficulty;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">統計</h2>
      
      {/* 全体統計 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalGames}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">プレイ回数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round(stats.averageScore)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">平均スコア</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.bestScore}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">最高スコア</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.bestStreak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">最高連続</div>
        </div>
      </div>
      
      {/* よくプレイする難易度 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          よくプレイする難易度
        </h3>
        <div className="text-lg text-blue-600 dark:text-blue-400">
          {getDifficultyLabel(stats.favoritedifficulty)}
        </div>
      </div>
      
      {/* 最近のスコア */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          最近のスコア
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.slice(0, 10).map((record, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {record.score}点
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getDifficultyLabel(record.difficulty)} • 
                  正解率: {Math.round((record.correctAnswers / record.totalQuestions) * 100)}% •
                  連続: {record.streak}
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(record.date).toLocaleDateString('ja-JP')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

## 設定ページ
`src/app/settings/page.tsx`
```typescript
'use client';

import { Settings } from '@/components/ui/Settings';
import { Statistics } from '@/components/ui/Statistics';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ナビゲーション */}
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← ホームに戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          設定・統計
        </h1>
      </div>
      
      {/* 設定・統計エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Settings />
        <Statistics />
      </div>
    </div>
  );
}
```

## ダークモード対応CSS追加
`src/app/globals.css` に追加
```css
/* ダークモードの基本スタイル */
@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-rgb: 17, 24, 39;
  }
}

/* ダークモードクラスの定義 */
.dark {
  --foreground-rgb: 255, 255, 255;
  --background-rgb: 17, 24, 39;
}

/* SVGフレットボードのダークモード対応 */
.dark .fretboard-svg {
  filter: invert(0.9);
}

.dark .fretboard-string {
  stroke: #e5e7eb;
}

.dark .fretboard-fret {
  stroke: #d1d5db;
}

.dark .chord-dot {
  fill: #3b82f6;
  stroke: #ffffff;
}
```

## メインレイアウトに設定リンク追加
`src/app/layout.tsx` のナビゲーション部分を更新
```typescript
<nav className="flex space-x-4">
  <Link
    href="/settings"
    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
  >
    設定
  </Link>
</nav>
```

## 確認項目
- [ ] 設定画面が正常に表示される
- [ ] テーマ切り替えが動作する
- [ ] 音声設定が保存・適用される
- [ ] 統計データが正確に表示される
- [ ] LocalStorage連携が正常
- [ ] ダークモード対応が適切
- [ ] レスポンシブ表示が正常

## 成果物
- 設定・カスタマイズ機能
- 統計・履歴表示機能
- テーマ切り替え機能

## 所要時間
70分