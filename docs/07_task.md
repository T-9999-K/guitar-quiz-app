# Task 07: クイズ状態管理フック

## 概要
クイズのゲーム状態を管理するカスタムフックを作成

## 実行内容
1. クイズ状態管理ロジック実装
2. ゲーム進行制御関数
3. スコア・統計計算
4. ローカルストレージ連携

## 作成ファイル
`src/hooks/useQuizState.ts`

## 実装する機能
```typescript
export const useQuizState = (difficulty: ChordPattern['difficulty']) => {
  const [state, setState] = useState<QuizState>({
    currentChord: null,
    score: 0,
    streak: 0,
    timeElapsed: 0,
    difficulty,
    hintsUsed: 0
  });
  
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // ゲーム開始
  const startQuiz = useCallback(() => {
    const randomChord = getRandomChord(difficulty);
    setState(prev => ({
      ...prev,
      currentChord: randomChord,
      score: 0,
      streak: 0,
      timeElapsed: 0,
      hintsUsed: 0
    }));
    setGameActive(true);
    setShowResult(false);
  }, [difficulty]);
  
  // 回答提出
  const submitAnswer = useCallback((answer: string) => {
    if (!state.currentChord) return;
    
    const isCorrect = answer.toLowerCase() === state.currentChord.name.toLowerCase();
    
    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 10 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0
    }));
    
    setShowResult(true);
    
    // 次の問題への遷移（2秒後）
    setTimeout(() => {
      nextChord();
    }, 2000);
    
    return isCorrect;
  }, [state.currentChord]);
  
  // 次のコード
  const nextChord = useCallback(() => {
    const randomChord = getRandomChord(difficulty);
    setState(prev => ({
      ...prev,
      currentChord: randomChord
    }));
    setShowResult(false);
  }, [difficulty]);
  
  // ヒント使用
  const useHint = useCallback(() => {
    setState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1
    }));
  }, []);
  
  // タイマー管理
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && !showResult) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, showResult]);
  
  return {
    state,
    gameActive,
    showResult,
    startQuiz,
    submitAnswer,
    nextChord,
    useHint
  };
};
```

## 確認項目
- [ ] ゲーム状態が正しく管理される
- [ ] スコア計算が正確に動作する
- [ ] タイマーが適切に動作する
- [ ] 回答判定が正しく機能する
- [ ] ヒント機能が動作する

## 成果物
- `src/hooks/useQuizState.ts`

## 所要時間
45分