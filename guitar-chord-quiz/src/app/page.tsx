'use client';

import { useState } from 'react';
import { QuizGame } from '@/components/quiz/QuizGame';
import { ChordDifficulty } from '@/types';
import { Button, AudioControls } from '@/components/ui';
import { useAudio } from '@/hooks/useAudio';

/**
 * ホームページコンポーネント
 * メインメニューとゲーム画面の切り替えを管理
 */
export default function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChordDifficulty | null>(null);
  const [showGame, setShowGame] = useState(false);
  
  // 音声制御フック
  const audio = useAudio();
  
  const handleStartGame = (difficulty: ChordDifficulty) => {
    setSelectedDifficulty(difficulty);
    setShowGame(true);
    audio.playClick(); // ボタンクリック音
  };
  
  const handleGameEnd = () => {
    setShowGame(false);
    setSelectedDifficulty(null);
  };
  
  // ゲーム画面
  if (showGame && selectedDifficulty) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={handleGameEnd}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="メニューに戻る"
          >
            <span className="mr-2">←</span>
            メニューに戻る
          </button>
        </div>
        <QuizGame 
          difficulty={selectedDifficulty}
          onGameEnd={handleGameEnd}
          audioHook={audio}
        />
      </div>
    );
  }
  
  // メニュー画面
  return (
    <div className="max-w-6xl mx-auto">
      {/* ヒーローセクション */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="flex justify-center items-center mb-6">
          <div className="text-6xl mr-4">🎸</div>
          <h1 className="text-5xl font-bold text-gray-900">
            ギターコードクイズ
          </h1>
        </div>
        
        {/* 音声コントロール */}
        <div className="flex justify-center mb-6">
          <AudioControls
            isEnabled={audio.isEnabled}
            isInitialized={audio.isInitialized}
            isSupported={audio.isSupported}
            audioContextState={audio.audioContextState}
            volume={audio.volume}
            effectsVolume={audio.effectsVolume}
            onToggle={audio.toggleAudio}
            onVolumeChange={audio.changeVolume}
            onEffectsVolumeChange={audio.changeEffectsVolume}
            onEnable={audio.enableAudio}
            className="bg-white rounded-xl shadow-lg p-4"
          />
        </div>
        <p className="text-2xl text-gray-600 mb-4 font-medium">
          フレットボード上の指板位置からコード名を当てよう！
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          ギターコードを視覚的に覚えて演奏スキルを向上させましょう。
          初級から上級まで段階的に学習できます。
        </p>
      </div>
      
      {/* 難易度選択セクション */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">難易度を選択</h2>
          <p className="text-lg text-gray-600">
            あなたのレベルに合った難易度でスタートしましょう
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 初級 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-200">
            <div className="text-6xl mb-6">🌱</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">初級</h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              基本的なオープンコード<br/>
              <span className="font-semibold">C, G, D, A, E, Am, Em, Dm, F</span>
            </p>
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  初心者向けの簡単なコード
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  オープンコード中心
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  フレット1-4使用
                </li>
              </ul>
            </div>
            <Button
              onClick={() => handleStartGame('beginner')}
              className="w-full py-4 bg-green-500 text-white font-bold rounded-xl
                       hover:bg-green-600 transform hover:scale-105 transition-all duration-200
                       focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              初級でスタート
            </Button>
          </div>
          
          {/* 中級 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-orange-200">
            <div className="text-6xl mb-6">🔥</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">中級</h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              バレーコード・セブンスコード<br/>
              <span className="font-semibold">F, Bm, B, G7, C7, D7, A7</span>
            </p>
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <ul className="text-sm text-orange-700 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  バレーコードを含む
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  セブンスコード
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  フレット1-7使用
                </li>
              </ul>
            </div>
            <Button
              onClick={() => handleStartGame('intermediate')}
              className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl
                       hover:bg-orange-600 transform hover:scale-105 transition-all duration-200
                       focus:outline-none focus:ring-4 focus:ring-orange-300"
            >
              中級でスタート
            </Button>
          </div>
          
          {/* 上級 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-red-200">
            <div className="text-6xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">上級</h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              複雑なコード・テンションコード<br/>
              <span className="font-semibold">Cmaj7, Dm7, Gsus4, Fadd9</span>
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <ul className="text-sm text-red-700 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  テンションコード
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  複雑な指使い
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  フレット1-12使用
                </li>
              </ul>
            </div>
            <Button
              onClick={() => handleStartGame('advanced')}
              className="w-full py-4 bg-red-500 text-white font-bold rounded-xl
                       hover:bg-red-600 transform hover:scale-105 transition-all duration-200
                       focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              上級でスタート
            </Button>
          </div>
        </div>
      </div>
      
      {/* 機能紹介セクション */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">アプリの特徴</h2>
          <p className="text-lg text-gray-600">
            学習効果を最大化する充実した機能
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="text-5xl mb-4">🎸</div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">リアルなフレットボード</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              実際のギターと同じ比率で描画されたフレットボード。
              正確な指板感覚で学習できます。
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">レスポンシブ対応</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              スマートフォン・タブレット・PCで最適な表示。
              いつでもどこでも学習できます。
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">段階的学習</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              初級から上級まで段階的にスキルアップ。
              着実にレベルアップできます。
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
            <div className="text-5xl mb-4">💡</div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">ヒント機能</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              ルート音・コードタイプのヒントで学習をサポート。
              つまづいても安心です。
            </p>
          </div>
        </div>
      </div>

      {/* アクセシビリティ・技術情報セクション */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">技術仕様・アクセシビリティ</h2>
          <p className="text-lg text-gray-600">
            最新技術と完全アクセシビリティ対応
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 技術スタック */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">⚡</div>
              <h3 className="text-xl font-bold text-gray-900">技術スタック</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Next.js 15 + TypeScript
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Tailwind CSS
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                PWA対応
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Web Audio API
              </li>
            </ul>
          </div>

          {/* アクセシビリティ */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">♿</div>
              <h3 className="text-xl font-bold text-gray-900">アクセシビリティ</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                WCAG 2.1 AAA準拠
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                Apple HIG準拠
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                キーボード操作対応
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                スクリーンリーダー対応
              </li>
            </ul>
          </div>

          {/* デザイン */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🎨</div>
              <h3 className="text-xl font-bold text-gray-900">デザイン</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                44px最小タッチターゲット
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                7:1コントラスト比
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                高コントラストモード対応
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                モーション配慮対応
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            すべてのユーザーが平等にご利用いただけるよう設計されています
          </p>
        </div>
      </div>

      {/* 使い方ガイド */}
      <div className="mt-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">使い方</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">難易度選択</h3>
              <p className="text-sm text-gray-600">
                初級・中級・上級から選択
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">コード認識</h3>
              <p className="text-sm text-gray-600">
                フレットボードを見てコード名を回答
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">スキルアップ</h3>
              <p className="text-sm text-gray-600">
                繰り返し練習で確実に上達
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}