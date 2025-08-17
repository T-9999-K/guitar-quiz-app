/**
 * Fretboard Calculation Utilities
 * 
 * @description フレットボード描画・音程計算に必要なユーティリティ関数
 * @author Claude Code
 */

import { ChordPattern } from '../types';

// =============================================================================
// Constants - 定数定義
// =============================================================================

/**
 * 標準的なギターの開放弦周波数 (Hz) - 6弦から1弦
 * E2(82.41) - A2(110.00) - D3(146.83) - G3(196.00) - B3(246.94) - E4(329.63)
 */
const OPEN_STRING_FREQUENCIES = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63] as const;

/**
 * 標準的なギターの開放弦音名 - 6弦から1弦
 */
const OPEN_STRING_NOTES = ['E', 'A', 'D', 'G', 'B', 'E'] as const;

/**
 * セミトーン比（12平均律）
 */
const SEMITONE_RATIO = Math.pow(2, 1/12);

/**
 * 基準フレットボードサイズ（sample/fretboard-design-sample.html基準）
 */
const BASE_FRETBOARD_SIZE = {
  width: 800,
  height: 300,
  frets: 5 as number,
  stringSpacing: 40, // 弦間隔
  fretSpacing: 120   // フレット間隔
} as const;

/**
 * フレットボード描画用の座標オフセット
 */
const COORDINATE_OFFSETS = {
  horizontal: {
    leftMargin: 100,  // 左側余白（弦名表示用）
    topMargin: 50,    // 上側余白
    stringY: [60, 100, 140, 180, 220, 260], // 各弦のY座標
    fretX: [100, 220, 340, 460, 580, 700]   // 各フレットのX座標
  }
} as const;

// =============================================================================
// Fret Position Calculations - フレット位置計算
// =============================================================================

/**
 * フレット位置の数学的計算（12平均律）
 * 
 * @param fret フレット番号（0 = 開放弦）
 * @param totalFrets 総フレット数
 * @returns 0-1の範囲での相対位置
 */
export const calculateFretPosition = (fret: number, totalFrets: number): number => {
  if (fret <= 0) return 0;
  if (fret >= totalFrets) return 1;
  
  // 12平均律による指数的フレット間隔計算
  // 各フレットは前のフレットとの距離の約94.4%の位置にある
  const ratio = 1 - Math.pow(SEMITONE_RATIO, -fret);
  return ratio * (totalFrets / 24); // 24フレット基準で正規化
};

/**
 * 実際のSVG描画用フレット位置計算
 * 
 * @param fret フレット番号
 * @param fretboardWidth フレットボードの幅
 * @param startX 開始X座標
 * @returns 実際のX座標
 */
export const calculateActualFretPosition = (
  fret: number, 
  fretboardWidth: number, 
  startX: number = COORDINATE_OFFSETS.horizontal.leftMargin
): number => {
  if (fret <= 0) return startX;
  
  // 実際のフレット間隔は指数的に狭くなる
  const scaleLength = fretboardWidth - startX;
  const fretPosition = scaleLength * (1 - Math.pow(2, -fret/12));
  
  return startX + fretPosition;
};

// =============================================================================
// Frequency Calculations - 周波数計算
// =============================================================================

/**
 * 弦の周波数計算
 * 
 * @param stringNumber 弦番号（1-6、1が最高音）
 * @param fret フレット番号（0 = 開放弦）
 * @param capoPosition カポタストの位置（デフォルト: 0）
 * @returns 周波数（Hz）
 */
export const getStringFrequency = (
  stringNumber: number, 
  fret: number, 
  capoPosition: number = 0
): number => {
  // 弦番号を配列インデックスに変換（1-6 → 5-0）
  const stringIndex = 6 - stringNumber;
  
  if (stringIndex < 0 || stringIndex >= OPEN_STRING_FREQUENCIES.length) {
    throw new Error(`Invalid string number: ${stringNumber}. Must be 1-6.`);
  }
  
  if (fret < 0) {
    throw new Error(`Invalid fret number: ${fret}. Must be 0 or greater.`);
  }
  
  // カポタストを考慮した実際のフレット位置
  const actualFret = fret + capoPosition;
  
  // 開放弦周波数 × セミトーン比^フレット数
  const openFrequency = OPEN_STRING_FREQUENCIES[stringIndex];
  return openFrequency * Math.pow(SEMITONE_RATIO, actualFret);
};

/**
 * 周波数から音名を取得
 * 
 * @param frequency 周波数（Hz）
 * @returns 音名（例: "C", "C#", "D"）
 */
export const getNoteName = (frequency: number): string => {
  // A4 = 440Hz を基準とした音名計算
  const A4_FREQUENCY = 440;
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // A4からのセミトーン差を計算
  const semitonesFromA4 = Math.round(12 * Math.log2(frequency / A4_FREQUENCY));
  
  // A = 9番目の音（0ベース）なので、9を加算してから12で剰余
  const noteIndex = ((semitonesFromA4 + 9) % 12 + 12) % 12;
  
  return noteNames[noteIndex];
};

// =============================================================================
// SVG Coordinate Calculations - SVG座標計算
// =============================================================================

/**
 * フレットボード上の押弦位置のSVG座標を計算
 * 
 * @param stringNumber 弦番号（1-6、1が最高音）
 * @param fret フレット番号（0 = 開放弦）
 * @param orientation 表示方向（現在は'horizontal'固定）
 * @param width フレットボードの幅
 * @param height フレットボードの高さ
 * @returns SVG座標 {x, y}
 */
export const getFretCoordinates = (
  stringNumber: number,
  fret: number,
  orientation: 'horizontal' = 'horizontal',
  width: number = BASE_FRETBOARD_SIZE.width,
  height: number = BASE_FRETBOARD_SIZE.height
): { x: number; y: number } => {
  if (stringNumber < 1 || stringNumber > 6) {
    throw new Error(`Invalid string number: ${stringNumber}. Must be 1-6.`);
  }
  
  if (fret < 0) {
    throw new Error(`Invalid fret number: ${fret}. Must be 0 or greater.`);
  }
  
  // 弦番号を配列インデックスに変換（1-6 → 0-5）
  const stringIndex = stringNumber - 1;
  
  // 横向きフレットボードの座標計算
  const stringY = COORDINATE_OFFSETS.horizontal.stringY[stringIndex];
  
  let fretX: number;
  if (fret === 0) {
    // 開放弦の場合はナット位置
    fretX = COORDINATE_OFFSETS.horizontal.leftMargin;
  } else if (fret <= 5) {
    // 1-5フレットは定義済み座標を使用
    fretX = COORDINATE_OFFSETS.horizontal.fretX[fret - 1];
  } else {
    // 5フレット以上は計算で求める
    fretX = calculateActualFretPosition(fret, width);
  }
  
  return { x: fretX, y: stringY };
};

/**
 * クリック可能エリアの座標とサイズを計算
 * 
 * @param stringNumber 弦番号（1-6）
 * @param fret フレット番号
 * @param width フレットボードの幅
 * @param height フレットボードの高さ
 * @returns クリック可能エリア {x, y, width, height}
 */
export const getClickableArea = (
  stringNumber: number,
  fret: number,
  width: number = BASE_FRETBOARD_SIZE.width,
  height: number = BASE_FRETBOARD_SIZE.height
): { x: number; y: number; width: number; height: number } => {
  const coords = getFretCoordinates(stringNumber, fret, 'horizontal', width, height);
  
  // クリック可能エリアのサイズ
  const clickWidth = 80;  // フレット間隔
  const clickHeight = 35; // 弦間隔
  
  return {
    x: coords.x - clickWidth / 2,
    y: coords.y - clickHeight / 2,
    width: clickWidth,
    height: clickHeight
  };
};

// =============================================================================
// Responsive Size Calculations - レスポンシブサイズ計算
// =============================================================================

/**
 * 画面サイズに応じたフレットボードサイズを計算
 * 
 * @param screenWidth 画面幅
 * @param orientation 表示方向（現在は'horizontal'固定）
 * @returns フレットボードサイズ情報
 */
export const calculateFretboardSize = (
  screenWidth: number,
  orientation: 'horizontal' = 'horizontal'
): { width: number; height: number; frets: number; scale: number } => {
  // 基準サイズからのスケール計算
  const maxWidth = Math.min(screenWidth * 0.9, 1200); // 画面幅の90%、最大1200px
  const scale = maxWidth / BASE_FRETBOARD_SIZE.width;
  
  // フレット数の調整
  let frets = BASE_FRETBOARD_SIZE.frets;
  if (screenWidth < 600) {
    frets = 4; // モバイルでは4フレット
  } else if (screenWidth < 900) {
    frets = 5; // タブレットでは5フレット
  } else {
    frets = 6; // デスクトップでは6フレット
  }
  
  return {
    width: Math.round(BASE_FRETBOARD_SIZE.width * scale),
    height: Math.round(BASE_FRETBOARD_SIZE.height * scale),
    frets,
    scale
  };
};

/**
 * デバイス種別の判定
 * 
 * @param screenWidth 画面幅
 * @returns デバイス種別
 */
export const getDeviceType = (screenWidth: number): 'mobile' | 'tablet' | 'desktop' => {
  if (screenWidth < 600) return 'mobile';
  if (screenWidth < 900) return 'tablet';
  return 'desktop';
};

// =============================================================================
// Capo Support - カポタスト対応
// =============================================================================

/**
 * カポタストを考慮したコードパターンの変換
 * 
 * @param chordPattern 元のコードパターン
 * @param capoPosition カポタストの位置（0 = カポなし）
 * @returns カポを考慮したコードパターン
 */
export const applyCapo = (
  chordPattern: ChordPattern, 
  capoPosition: number
): ChordPattern => {
  if (capoPosition === 0) return chordPattern;
  
  if (capoPosition < 0 || capoPosition > 12) {
    throw new Error(`Invalid capo position: ${capoPosition}. Must be 0-12.`);
  }
  
  // フレット位置の調整
  const adjustedFrets = chordPattern.frets.map(fret => {
    if (fret === null) return null;
    
    const adjustedFret = fret - capoPosition;
    return adjustedFret < 0 ? null : adjustedFret;
  });
  
  return {
    ...chordPattern,
    frets: adjustedFrets,
    name: `${chordPattern.name} (Capo ${capoPosition})`
  };
};

/**
 * カポタストを考慮した実際のコード名を取得
 * 
 * @param chordPattern コードパターン
 * @param capoPosition カポタストの位置
 * @returns 実際のコード名
 */
export const getActualChordName = (
  chordPattern: ChordPattern,
  capoPosition: number
): string => {
  if (capoPosition === 0) return chordPattern.name;
  
  // ルート音をカポ分上げる
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootIndex = noteNames.indexOf(chordPattern.root);
  
  if (rootIndex === -1) return chordPattern.name;
  
  const newRootIndex = (rootIndex + capoPosition) % 12;
  const newRoot = noteNames[newRootIndex];
  
  // コード名の置換（簡易版）
  return chordPattern.name.replace(chordPattern.root, newRoot);
};

// =============================================================================
// Validation Functions - バリデーション関数
// =============================================================================

/**
 * フレットボード座標の妥当性検証
 * 
 * @param stringNumber 弦番号
 * @param fret フレット番号
 * @returns 妥当性チェック結果
 */
export const isValidFretboardPosition = (
  stringNumber: number, 
  fret: number
): boolean => {
  return (
    stringNumber >= 1 && 
    stringNumber <= 6 && 
    fret >= 0 && 
    fret <= 24 &&
    Number.isInteger(stringNumber) && 
    Number.isInteger(fret)
  );
};

/**
 * 押弦パターンの妥当性検証
 * 
 * @param chordPattern コードパターン
 * @returns 妥当性チェック結果
 */
export const isValidChordPattern = (chordPattern: ChordPattern): boolean => {
  if (chordPattern.frets.length !== 6 || chordPattern.fingers.length !== 6) {
    return false;
  }
  
  return chordPattern.frets.every((fret, index) => {
    const finger = chordPattern.fingers[index];
    
    // フレットがnullの場合、指もnullでなければならない
    if (fret === null) return finger === null;
    
    // フレットが数値の場合の妥当性チェック
    if (typeof fret !== 'number' || fret < 0 || fret > 24) return false;
    
    // 指の妥当性チェック
    if (finger !== null && (typeof finger !== 'number' || finger < 1 || finger > 4)) {
      return false;
    }
    
    return true;
  });
};

// =============================================================================
// Utility Functions - その他のユーティリティ
// =============================================================================

/**
 * フレットボード上の2点間の距離を計算
 * 
 * @param point1 座標1
 * @param point2 座標2
 * @returns 距離（ピクセル）
 */
export const calculateDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * フレットボードの描画に必要な基本情報を取得
 * 
 * @param screenWidth 画面幅
 * @returns 描画情報
 */
export const getFretboardRenderInfo = (screenWidth: number) => {
  const size = calculateFretboardSize(screenWidth);
  const deviceType = getDeviceType(screenWidth);
  
  return {
    ...size,
    deviceType,
    coordinates: COORDINATE_OFFSETS.horizontal,
    baseSize: BASE_FRETBOARD_SIZE
  };
};