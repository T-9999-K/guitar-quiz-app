'use client';

import { ChordPattern } from '@/types';

/**
 * ギター音合成エンジン
 * Web Audio APIを使用してギター音を合成・再生
 */
export class GuitarSynthesizer {
  private audioContext!: AudioContext;
  private masterGain!: GainNode;
  private initialized: boolean = false;
  
  constructor() {
    this.initializeAudioContext();
  }
  
  /**
   * AudioContextの初期化
   */
  private initializeAudioContext(): void {
    try {
      // ブラウザ互換性を考慮
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      
      // マスターゲインノードの作成
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      
      this.initialized = true;
    } catch (error) {
      console.error('AudioContext初期化に失敗しました:', error);
      this.initialized = false;
    }
  }
  
  /**
   * 各弦の開放弦周波数（Hz）
   * 6弦から1弦の順序（標準チューニング）
   */
  private readonly openStringFrequencies = [
    82.41,  // 6弦 E2
    110.00, // 5弦 A2  
    146.83, // 4弦 D3
    196.00, // 3弦 G3
    246.94, // 2弦 B3
    329.63  // 1弦 E4
  ];
  
  /**
   * フレット位置から周波数を計算
   * 12平均律に基づく計算
   */
  private getFrequency(stringIndex: number, fret: number): number {
    if (stringIndex < 0 || stringIndex >= this.openStringFrequencies.length) {
      throw new Error(`無効な弦番号: ${stringIndex}`);
    }
    
    const openFreq = this.openStringFrequencies[stringIndex];
    // 12平均律: 1セミトーン = 2^(1/12)
    return openFreq * Math.pow(2, fret / 12);
  }
  
  /**
   * 単音を再生
   */
  private playNote(frequency: number, duration: number = 2, delay: number = 0): void {
    if (!this.initialized || !this.audioContext) return;
    
    const now = this.audioContext.currentTime + delay;
    
    // オシレーター（音源）の作成
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sawtooth'; // ギターらしい波形
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // エンベロープ用ゲインノード
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + 0.01);  // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.1);  // Decay
    gainNode.gain.setValueAtTime(0.3, now + 0.1);  // Sustain開始
    gainNode.gain.exponentialRampToValueAtTime(0.1, now + duration * 0.7);  // Sustain減衰
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);  // Release
    
    // ローパスフィルター（音色調整）
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000 + frequency * 0.5, now);  // 周波数に応じて調整
    filter.Q.setValueAtTime(1.2, now);
    
    // ハイパスフィルター（低域カット）
    const highPassFilter = this.audioContext.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.frequency.setValueAtTime(60, now);
    highPassFilter.Q.setValueAtTime(0.7, now);
    
    // 接続チェーン
    oscillator.connect(filter);
    filter.connect(highPassFilter);
    highPassFilter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // 再生開始・停止
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
  
  /**
   * コード再生（複数音同時）
   */
  public async playChord(chordPattern: ChordPattern, duration: number = 2): Promise<void> {
    if (!this.initialized) {
      console.warn('AudioContextが初期化されていません');
      return;
    }
    
    // ブラウザの自動再生制限対応
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('AudioContext resume失敗:', error);
        return;
      }
    }
    
    // 各弦を順次再生（ストラミング効果）
    chordPattern.frets.forEach((fret, stringIndex) => {
      if (fret !== null) {
        const frequency = this.getFrequency(stringIndex, fret);
        // 弦ごとに少しずつタイミングをずらす（20ms間隔）
        const delay = stringIndex * 0.02;
        this.playNote(frequency, duration, delay);
      }
    });
  }
  
  /**
   * 単弦再生
   */
  public async playString(stringIndex: number, fret: number, duration: number = 1): Promise<void> {
    if (!this.initialized) {
      console.warn('AudioContextが初期化されていません');
      return;
    }
    
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.error('AudioContext resume失敗:', error);
        return;
      }
    }
    
    const frequency = this.getFrequency(stringIndex, fret);
    this.playNote(frequency, duration);
  }
  
  /**
   * 音量設定
   */
  public setVolume(volume: number): void {
    if (!this.initialized) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const now = this.audioContext.currentTime;
    this.masterGain.gain.setValueAtTime(clampedVolume, now);
  }
  
  /**
   * AudioContextの状態確認
   */
  public getAudioContextState(): string {
    return this.audioContext?.state || 'not-initialized';
  }
  
  /**
   * リソース解放
   */
  public dispose(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.initialized = false;
    }
  }
}

/**
 * 効果音生成クラス
 */
export class SoundEffects {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  
  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
  }
  
  /**
   * 正解音（上昇アルペジオ）
   */
  public playSuccess(): void {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    const frequencies = [523.25, 659.25, 783.99]; // C5-E5-G5 (Cメジャー)
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      // 音色設定
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now + index * 0.1);
      
      // フィルター設定
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.Q.setValueAtTime(1, now);
      
      // エンベロープ
      const startTime = now + index * 0.1;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      
      // 接続
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);
      
      // 再生
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }
  
  /**
   * 不正解音（下降音）
   */
  public playError(): void {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    // 音色設定（不協和音的なサウンド）
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, now);
    oscillator.frequency.linearRampToValueAtTime(110, now + 0.3);
    
    // フィルター設定
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(400, now + 0.3);
    filter.Q.setValueAtTime(2, now);
    
    // エンベロープ
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    // 接続
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // 再生
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }
  
  /**
   * ボタンクリック音
   */
  public playClick(): void {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }
  
  /**
   * 音量設定
   */
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.setValueAtTime(clampedVolume, this.audioContext.currentTime);
  }
}

/**
 * オーディオユーティリティ関数
 */
export const AudioUtils = {
  /**
   * Web Audio APIがサポートされているかチェック
   */
  isAudioSupported(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  },
  
  /**
   * 音名から周波数を計算（A4=440Hzベース）
   */
  noteToFrequency(note: string, octave: number): number {
    const noteMap: { [key: string]: number } = {
      'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4,
      'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2
    };
    
    const noteOffset = noteMap[note.toUpperCase()];
    if (noteOffset === undefined) {
      throw new Error(`無効な音名: ${note}`);
    }
    
    const A4 = 440; // A4の周波数
    const semitoneOffset = (octave - 4) * 12 + noteOffset;
    return A4 * Math.pow(2, semitoneOffset / 12);
  },
  
  /**
   * デシベルから線形ゲインに変換
   */
  dbToGain(db: number): number {
    return Math.pow(10, db / 20);
  },
  
  /**
   * 線形ゲインからデシベルに変換
   */
  gainToDb(gain: number): number {
    return 20 * Math.log10(gain);
  }
};