# Task 06: レスポンシブフレットボードコンポーネント

## 概要
画面サイズに応じて自動的にサイズ・向きを調整するレスポンシブフレットボード

## 実行内容
1. 画面サイズ検出カスタムフック作成
2. レスポンシブフレットボードコンポーネント作成
3. 各画面サイズでの表示テスト

## 作成ファイル
1. `src/hooks/useMediaQuery.ts`
2. `src/components/fretboard/ResponsiveFretboard.tsx`

## useMediaQueryフック
```typescript
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);
  
  return matches;
};
```

## ResponsiveFretboardコンポーネント
```typescript
export const ResponsiveFretboard: React.FC<{
  chordPattern: ChordPattern;
  showFingers?: boolean;
  capoPosition?: number;
}> = ({ chordPattern, showFingers, capoPosition }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // 画面サイズに応じた設定
  const orientation = isMobile ? 'vertical' : 'horizontal';
  const maxFrets = isMobile ? 5 : isTablet ? 8 : 12;
  
  return (
    <Fretboard
      chordPattern={chordPattern}
      orientation={orientation}
      showFingers={showFingers}
      capoPosition={capoPosition}
    />
  );
};
```

## レスポンシブ設定
- **Mobile (~768px)**: 縦向き、5フレット表示
- **Tablet (768px-1024px)**: 横向き、8フレット表示
- **Desktop (1024px~)**: 横向き、12フレット表示

## 確認項目
- [ ] 画面サイズ変更で自動的に向きが変わる
- [ ] 各画面サイズで適切なフレット数が表示される
- [ ] レスポンシブ変更時にレイアウト崩れがない
- [ ] タッチデバイスでの表示が適切

## 成果物
- `src/hooks/useMediaQuery.ts`
- `src/components/fretboard/ResponsiveFretboard.tsx`

## 所要時間
30分