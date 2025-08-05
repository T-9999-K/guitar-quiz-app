# Task 05: 基本SVGフレットボードコンポーネント

## 概要
SVGを使用した基本的なフレットボード描画コンポーネントを作成

## 実行内容
1. SVGベースのフレットボード描画
2. 弦・フレット・ポジションマークの描画
3. 押弦位置の表示
4. 基本的なスタイリング

## 作成ファイル
`src/components/fretboard/Fretboard.tsx`

## 実装する機能
```typescript
interface FretboardProps {
  chordPattern: ChordPattern;
  orientation: 'horizontal' | 'vertical';
  showFingers?: boolean;
  capoPosition?: number;
  className?: string;
}

export const Fretboard: React.FC<FretboardProps> = ({
  chordPattern,
  orientation,
  showFingers = true,
  capoPosition = 0,
  className
}) => {
  // SVG描画ロジック
};
```

## SVG要素
1. **背景・枠線**: フレットボードの外枠
2. **弦**: 6本の縦線（横向き時は横線）
3. **フレット**: フレット位置の線
4. **ポジションマーク**: 3, 5, 7, 9, 12フレットのマーク
5. **押弦ドット**: コードパターンに応じた円
6. **指番号**: showFingersがtrueの場合の数字表示

## スタイリング
- Tailwind CSSクラス使用
- ダーク・ライトテーマ対応
- アニメーション準備（後のタスクで実装）

## 確認項目
- [ ] SVGが正しく描画される
- [ ] 全ての弦・フレットが表示される
- [ ] 押弦位置が正確に表示される
- [ ] 横・縦両方向の描画が正常
- [ ] 指番号表示のon/offが動作する

## 成果物
- `src/components/fretboard/Fretboard.tsx`

## 所要時間
60分