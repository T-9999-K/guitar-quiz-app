'use client';

/**
 * 設定ページ
 *
 * @description 設定とカスタマイゼーション機能のメインページ
 * @author Claude Code
 */

import React from 'react';
import Link from 'next/link';
import { Settings } from '../../components/ui/Settings';
import { Statistics } from '../../components/ui/Statistics';

/**
 * 設定ページメタデータ
 */
export const metadata = {
  title: '設定・統計 | Guitar Chord Quiz',
  description: 'ゲーム設定、テーマ切り替え、統計情報の確認'
};

/**
 * 設定ページコンポーネント
 */
export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ページヘッダー */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600
                       dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              aria-label="ホームページに戻る"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>ホームに戻る</span>
            </Link>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ⚙️ 設定・統計
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ゲーム設定をカスタマイズし、プレイ統計を確認できます
            </p>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 設定エリア */}
          <div className="space-y-6">
            <Settings embedded={true} />
          </div>

          {/* 統計エリア */}
          <div className="space-y-6">
            <Statistics />
          </div>
        </div>

        {/* フッター情報 */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">
              🎸 Guitar Chord Quiz - あなたのギター学習をサポート
            </p>
            <div className="flex justify-center space-x-4">
              <span>📱 レスポンシブ対応</span>
              <span>♿ アクセシビリティ準拠</span>
              <span>🌙 ダークモード対応</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}