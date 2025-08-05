# Task 10: メインクイズゲームコンポーネント

## 概要
フレットボード表示・回答入力・スコア管理を統合したメインゲームコンポーネント

## 実行内容
1. ゲーム全体を統括するコンポーネント作成
2. フレットボード・回答入力の統合
3. ゲーム進行制御
4. 結果表示・フィードバック

## 作成ファイル
`src/components/quiz/QuizGame.tsx`

## 実装する機能
```typescript
interface QuizGameProps {
  difficulty: ChordPattern['difficulty'];
  onGameEnd?: (finalScore: number) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ difficulty, onGameEnd }) => {
  const {
    state,
    gameActive,
    showResult,
    startQuiz,
    submitAnswer,
    nextChord,
    useHint
  } = useQuizState(difficulty);
  
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState<'root' | 'quality' | null>(null);
  
  // 回答処理
  const handleAnswerSubmit = async (answer: string) => {
    const isCorrect = submitAnswer(answer);
    setLastAnswerCorrect(isCorrect);
    
    // サウンド再生（後のタスクで実装）
    if (isCorrect) {
      // 正解音・正解アニメーション
    } else {
      // 不正解音・シェイクアニメーション
    }
  };
  
  // ヒント表示
  const handleHintRequest = () => {
    if (!state.currentChord) return;
    
    useHint();
    setShowHint(true);
    
    // ヒントの種類を決定
    if (state.hintsUsed === 0) {
      setHintType('root');
    } else {
      setHintType('quality');
    }
  };
  
  // ゲーム開始状態
  if (!gameActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          ギターコードクイズ
        </h2>
        <p className="text-gray-600 text-center">
          フレットボードに表示されるコードの名前を当ててください
        </p>
        <button
          onClick={startQuiz}
          className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg
                   hover:bg-blue-600 text-lg"
        >
          ゲーム開始
        </button>
      </div>
    );
  }
  
  // メインゲーム画面
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* スコア表示 */}
      <div className="mb-6">
        <ScoreDisplay
          score={state.score}
          streak={state.streak}
          timeElapsed={state.timeElapsed}
          hintsUsed={state.hintsUsed}
        />
      </div>
      
      {/* メインゲームエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* フレットボード */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {state.currentChord && (
              <ResponsiveFretboard
                chordPattern={state.currentChord}
                showFingers={false} // 指番号は表示しない
                capoPosition={0}
              />
            )}
          </div>
        </div>
        
        {/* 回答・ヒントエリア */}
        <div className="space-y-4">
          {/* ヒント表示 */}
          {showHint && state.currentChord && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">ヒント:</h3>
              {hintType === 'root' && (
                <p className="text-yellow-700">
                  ルート音: {state.currentChord.root}
                </p>
              )}
              {hintType === 'quality' && (
                <p className="text-yellow-700">
                  コードタイプ: {state.currentChord.quality}
                </p>
              )}
            </div>
          )}
          
          {/* 回答入力 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">このコードは？</h3>
            <AnswerInput
              onSubmit={handleAnswerSubmit}
              disabled={showResult}
              difficulty={difficulty}
            />
            
            {/* ヒントボタン */}
            {!showResult && state.hintsUsed < 2 && (
              <button
                onClick={handleHintRequest}
                className="mt-4 w-full py-2 bg-yellow-500 text-white rounded-lg
                         hover:bg-yellow-600"
              >
                ヒントを表示 ({2 - state.hintsUsed}回残り)
              </button>
            )}
          </div>
          
          {/* 結果表示 */}
          {showResult && (
            <div className={`rounded-lg p-6 text-center ${
              lastAnswerCorrect 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className={`text-2xl font-bold mb-2 ${
                lastAnswerCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {lastAnswerCorrect ? '正解！' : '不正解'}
              </div>
              {state.currentChord && (
                <p className={`text-lg ${
                  lastAnswerCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  正解: {state.currentChord.name}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// スコア表示コンポーネント
const ScoreDisplay: React.FC<{
  score: number;
  streak: number;
  timeElapsed: number;
  hintsUsed: number;
}> = ({ score, streak, timeElapsed, hintsUsed }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{score}</div>
          <div className="text-sm text-gray-600">スコア</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{streak}</div>
          <div className="text-sm text-gray-600">連続正解</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
          <div className="text-sm text-gray-600">経過時間</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-orange-600">{hintsUsed}</div>
          <div className="text-sm text-gray-600">ヒント使用</div>
        </div>
      </div>
    </div>
  );
};
```

## 確認項目
- [ ] ゲーム開始・終了が正常に動作する
- [ ] フレットボード・回答入力が連携している
- [ ] スコア表示が正確に更新される
- [ ] ヒント機能が動作する
- [ ] 結果表示・フィードバックが適切
- [ ] レスポンシブレイアウトが機能する

## 成果物
- `src/components/quiz/QuizGame.tsx`

## 所要時間
60分