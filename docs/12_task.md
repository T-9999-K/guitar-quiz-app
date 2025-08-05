# Task 12: 音声生成システム実装

## 概要
Web Audio APIを使用したギター音の合成・再生システムを実装

## 実行内容
1. ギター音合成エンジン作成
2. コード音の同時再生
3. 音声制御フック実装
4. 音量・エフェクト調整

## 作成ファイル
1. `src/lib/audio.ts`
2. `src/hooks/useAudio.ts`

## 音声合成エンジン実装
`src/lib/audio.ts`
```typescript
export class GuitarSynthesizer {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  
  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
  }
  
  // 各弦の開放弦周波数（Hz）
  private openStringFrequencies = [
    82.41,  // 6弦 E
    110.00, // 5弦 A
    146.83, // 4弦 D
    196.00, // 3弦 G
    246.94, // 2弦 B
    329.63  // 1弦 E
  ];
  
  // フレット位置から周波数を計算
  private getFrequency(stringIndex: number, fret: number): number {
    const openFreq = this.openStringFrequencies[stringIndex];
    // 12平均律: 1セミトーン = 2^(1/12)
    return openFreq * Math.pow(2, fret / 12);
  }
  
  // 単音再生
  private playNote(frequency: number, duration: number = 2): void {
    const now = this.audioContext.currentTime;
    
    // オシレーター（音源）
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sawtooth'; // ギターらしい波形
    oscillator.frequency.setValueAtTime(frequency, now);
    
    // エンベロープ（音量変化）
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.8, now + 0.01); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.1); // Decay
    gainNode.gain.exponentialRampToValueAtTime(0.1, now + duration * 0.7); // Sustain
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Release
    
    // フィルター（音色調整）
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.Q.setValueAtTime(1, now);
    
    // 接続
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    // 再生・停止
    oscillator.start(now);
    oscillator.stop(now + duration);
  }
  
  // コード再生（複数音同時）
  public playChord(chordPattern: ChordPattern, duration: number = 2): void {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    chordPattern.frets.forEach((fret, stringIndex) => {
      if (fret !== null) {
        const frequency = this.getFrequency(stringIndex, fret);
        // 少しずつタイミングをずらしてストラミング感を演出
        setTimeout(() => {
          this.playNote(frequency, duration);
        }, stringIndex * 20);
      }
    });
  }
  
  // 単弦再生
  public playString(stringIndex: number, fret: number, duration: number = 1): void {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    const frequency = this.getFrequency(stringIndex, fret);
    this.playNote(frequency, duration);
  }
  
  // 音量設定
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.setValueAtTime(clampedVolume, this.audioContext.currentTime);
  }
  
  // リソース解放
  public dispose(): void {
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// 効果音生成
export class SoundEffects {
  private audioContext: AudioContext;
  
  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }
  
  // 正解音
  public playSuccess(): void {
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }
  
  // 不正解音
  public playError(): void {
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, now); // A3
    oscillator.frequency.linearRampToValueAtTime(110, now + 0.3); // A2
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }
}
```

## 音声制御フック実装
`src/hooks/useAudio.ts`
```typescript
import { useEffect, useRef, useState, useCallback } from 'react';
import { GuitarSynthesizer, SoundEffects } from '@/lib/audio';
import { ChordPattern } from '@/types';

export const useAudio = () => {
  const synthesizerRef = useRef<GuitarSynthesizer | null>(null);
  const soundEffectsRef = useRef<SoundEffects | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 初期化
  const initializeAudio = useCallback(async () => {
    try {
      if (!synthesizerRef.current) {
        synthesizerRef.current = new GuitarSynthesizer();
        soundEffectsRef.current = new SoundEffects(synthesizerRef.current['audioContext']);
        setIsInitialized(true);
      }
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      setIsEnabled(false);
    }
  }, []);
  
  // ユーザー操作で初期化（ブラウザの自動再生制限対応）
  const enableAudio = useCallback(async () => {
    if (!isInitialized) {
      await initializeAudio();
    }
    setIsEnabled(true);
  }, [initializeAudio, isInitialized]);
  
  // コード再生
  const playChord = useCallback((chordPattern: ChordPattern, duration?: number) => {
    if (isEnabled && synthesizerRef.current) {
      synthesizerRef.current.playChord(chordPattern, duration);
    }
  }, [isEnabled]);
  
  // 単弦再生
  const playString = useCallback((stringIndex: number, fret: number, duration?: number) => {
    if (isEnabled && synthesizerRef.current) {
      synthesizerRef.current.playString(stringIndex, fret, duration);
    }
  }, [isEnabled]);
  
  // 正解音
  const playSuccess = useCallback(() => {
    if (isEnabled && soundEffectsRef.current) {
      soundEffectsRef.current.playSuccess();
    }
  }, [isEnabled]);
  
  // 不正解音
  const playError = useCallback(() => {
    if (isEnabled && soundEffectsRef.current) {
      soundEffectsRef.current.playError();
    }
  }, [isEnabled]);
  
  // 音量変更
  const changeVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (synthesizerRef.current) {
      synthesizerRef.current.setVolume(newVolume);
    }
  }, []);
  
  // クリーンアップ
  useEffect(() => {
    return () => {
      if (synthesizerRef.current) {
        synthesizerRef.current.dispose();
      }
    };
  }, []);
  
  return {
    isEnabled,
    isInitialized,
    volume,
    enableAudio,
    setIsEnabled,
    changeVolume,
    playChord,
    playString,
    playSuccess,
    playError
  };
};
```

## 音声設定コンポーネント
`src/components/ui/AudioControls.tsx`
```typescript
interface AudioControlsProps {
  isEnabled: boolean;
  volume: number;
  onToggle: (enabled: boolean) => void;
  onVolumeChange: (volume: number) => void;
  onEnable: () => void;
  isInitialized: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isEnabled,
  volume,
  onToggle,
  onVolumeChange,
  onEnable,
  isInitialized
}) => {
  return (
    <div className="flex items-center space-x-4">
      {/* 音声有効化ボタン（初期化前） */}
      {!isInitialized && (
        <button
          onClick={onEnable}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          🔊 音声を有効化
        </button>
      )}
      
      {/* 音声ON/OFF */}
      {isInitialized && (
        <>
          <button
            onClick={() => onToggle(!isEnabled)}
            className={`p-2 rounded-lg ${
              isEnabled 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
          >
            {isEnabled ? '🔊' : '🔇'}
          </button>
          
          {/* 音量スライダー */}
          {isEnabled && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">🔉</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-sm">🔊</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
```

## 確認項目
- [ ] Web Audio APIが正常に初期化される
- [ ] コード音が正確に再生される
- [ ] 効果音（正解・不正解）が再生される
- [ ] 音量調整が機能する
- [ ] ブラウザの自動再生制限に対応している
- [ ] 複数音の同時再生が正常

## 成果物
- ギター音合成システム
- 音声制御フック
- 音声設定UI

## 所要時間
75分