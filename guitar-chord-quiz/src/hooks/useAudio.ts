'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { GuitarSynthesizer, SoundEffects, AudioUtils } from '@/lib/audio';
import { ChordPattern } from '@/types';

/**
 * 音声制御カスタムフック
 * Web Audio APIを使用した音声機能を管理
 */
export const useAudio = () => {
  const synthesizerRef = useRef<GuitarSynthesizer | null>(null);
  const soundEffectsRef = useRef<SoundEffects | null>(null);
  
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [effectsVolume, setEffectsVolume] = useState(0.4);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [audioContextState, setAudioContextState] = useState<string>('not-initialized');
  
  /**
   * 音声システムの初期化
   */
  const initializeAudio = useCallback(async () => {
    try {
      // Web Audio APIサポートチェック
      if (!AudioUtils.isAudioSupported()) {
        console.warn('Web Audio APIがサポートされていません');
        setIsSupported(false);
        return false;
      }
      
      if (!synthesizerRef.current) {
        // シンセサイザーの初期化
        synthesizerRef.current = new GuitarSynthesizer();
        
        // 効果音エンジンの初期化
        const audioContext = (synthesizerRef.current as any).audioContext;
        if (audioContext) {
          soundEffectsRef.current = new SoundEffects(audioContext);
          
          // 音量設定の適用
          synthesizerRef.current.setVolume(volume);
          soundEffectsRef.current.setVolume(effectsVolume);
          
          setAudioContextState(audioContext.state);
          setIsInitialized(true);
          
          // AudioContextの状態変化を監視
          const checkState = () => {
            if (audioContext) {
              setAudioContextState(audioContext.state);
            }
          };
          
          audioContext.addEventListener('statechange', checkState);
          
          console.log('音声システムが初期化されました');
          return true;
        }
      }
      
      return true;
    } catch (error) {
      console.error('音声システムの初期化に失敗:', error);
      setIsEnabled(false);
      setIsSupported(false);
      return false;
    }
  }, [volume, effectsVolume]);
  
  /**
   * ユーザー操作による音声有効化
   * ブラウザの自動再生制限対応
   */
  const enableAudio = useCallback(async () => {
    try {
      if (!isInitialized) {
        const success = await initializeAudio();
        if (!success) return;
      }
      
      // AudioContextが中断されている場合は再開
      if (synthesizerRef.current) {
        const state = synthesizerRef.current.getAudioContextState();
        if (state === 'suspended') {
          // resume処理はplayChordやplayString内で実行される
        }
      }
      
      setIsEnabled(true);
      console.log('音声が有効化されました');
    } catch (error) {
      console.error('音声有効化に失敗:', error);
      setIsEnabled(false);
    }
  }, [initializeAudio, isInitialized]);
  
  /**
   * コード再生
   */
  const playChord = useCallback(async (chordPattern: ChordPattern, duration?: number) => {
    if (!isEnabled || !isSupported || !synthesizerRef.current) {
      return;
    }
    
    try {
      await synthesizerRef.current.playChord(chordPattern, duration);
    } catch (error) {
      console.error('コード再生エラー:', error);
    }
  }, [isEnabled, isSupported]);
  
  /**
   * 単弦再生
   */
  const playString = useCallback(async (stringIndex: number, fret: number, duration?: number) => {
    if (!isEnabled || !isSupported || !synthesizerRef.current) {
      return;
    }
    
    try {
      await synthesizerRef.current.playString(stringIndex, fret, duration);
    } catch (error) {
      console.error('単弦再生エラー:', error);
    }
  }, [isEnabled, isSupported]);
  
  /**
   * 正解音再生
   */
  const playSuccess = useCallback(() => {
    if (!isEnabled || !isSupported || !soundEffectsRef.current) {
      return;
    }
    
    try {
      soundEffectsRef.current.playSuccess();
    } catch (error) {
      console.error('正解音再生エラー:', error);
    }
  }, [isEnabled, isSupported]);
  
  /**
   * 不正解音再生
   */
  const playError = useCallback(() => {
    if (!isEnabled || !isSupported || !soundEffectsRef.current) {
      return;
    }
    
    try {
      soundEffectsRef.current.playError();
    } catch (error) {
      console.error('不正解音再生エラー:', error);
    }
  }, [isEnabled, isSupported]);
  
  /**
   * クリック音再生
   */
  const playClick = useCallback(() => {
    if (!isEnabled || !isSupported || !soundEffectsRef.current) {
      return;
    }
    
    try {
      soundEffectsRef.current.playClick();
    } catch (error) {
      console.error('クリック音再生エラー:', error);
    }
  }, [isEnabled, isSupported]);
  
  /**
   * 音量変更（楽器音）
   */
  const changeVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (synthesizerRef.current) {
      synthesizerRef.current.setVolume(clampedVolume);
    }
  }, []);
  
  /**
   * 効果音音量変更
   */
  const changeEffectsVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setEffectsVolume(clampedVolume);
    
    if (soundEffectsRef.current) {
      soundEffectsRef.current.setVolume(clampedVolume);
    }
  }, []);
  
  /**
   * 音声ON/OFF切り替え
   */
  const toggleAudio = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);
  
  /**
   * 音声システムリセット
   */
  const resetAudio = useCallback(() => {
    if (synthesizerRef.current) {
      synthesizerRef.current.dispose();
      synthesizerRef.current = null;
    }
    
    soundEffectsRef.current = null;
    setIsInitialized(false);
    setAudioContextState('not-initialized');
  }, []);
  
  /**
   * 音声設定のローカルストレージ保存
   */
  const saveAudioSettings = useCallback(() => {
    const settings = {
      isEnabled,
      volume,
      effectsVolume,
    };
    
    try {
      localStorage.setItem('guitar-quiz-audio-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('音声設定の保存に失敗:', error);
    }
  }, [isEnabled, volume, effectsVolume]);
  
  /**
   * 音声設定のローカルストレージ読み込み
   */
  const loadAudioSettings = useCallback(() => {
    try {
      const saved = localStorage.getItem('guitar-quiz-audio-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        setIsEnabled(settings.isEnabled ?? true);
        setVolume(settings.volume ?? 0.3);
        setEffectsVolume(settings.effectsVolume ?? 0.4);
      }
    } catch (error) {
      console.warn('音声設定の読み込みに失敗:', error);
    }
  }, []);
  
  /**
   * 初期化とクリーンアップ
   */
  useEffect(() => {
    // 保存された設定を読み込み
    loadAudioSettings();
    
    // クリーンアップ
    return () => {
      if (synthesizerRef.current) {
        synthesizerRef.current.dispose();
      }
    };
  }, [loadAudioSettings]);
  
  /**
   * 設定変更時の保存
   */
  useEffect(() => {
    saveAudioSettings();
  }, [saveAudioSettings]);
  
  return {
    // 状態
    isEnabled,
    isInitialized,
    isSupported,
    audioContextState,
    volume,
    effectsVolume,
    
    // 制御関数
    enableAudio,
    toggleAudio,
    changeVolume,
    changeEffectsVolume,
    resetAudio,
    
    // 再生関数
    playChord,
    playString,
    playSuccess,
    playError,
    playClick,
    
    // 設定管理
    saveAudioSettings,
    loadAudioSettings,
  };
};