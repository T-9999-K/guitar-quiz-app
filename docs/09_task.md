# Task 09: 回答入力コンポーネント

## 概要
デバイスに最適化された回答入力UIコンポーネントを作成

## 実行内容
1. モバイル向けボタン型入力
2. デスクトップ向けドロップダウン入力
3. 入力補完機能
4. レスポンシブ切り替え

## 作成ファイル
`src/components/quiz/AnswerInput.tsx`

## 実装する機能
```typescript
interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  difficulty: ChordPattern['difficulty'];
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  onSubmit,
  disabled = false,
  difficulty
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // 難易度に応じたコード候補
  const getChordOptions = (difficulty: ChordPattern['difficulty']) => {
    return CHORD_PATTERNS
      .filter(chord => chord.difficulty === difficulty)
      .map(chord => chord.name)
      .sort();
  };
  
  // 入力補完
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value.length > 0) {
      const filtered = getChordOptions(difficulty)
        .filter(chord => chord.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSubmit = (answer: string) => {
    onSubmit(answer);
    setInputValue('');
    setSuggestions([]);
  };
  
  if (isMobile) {
    return <MobileAnswerInput {...props} />;
  } else {
    return <DesktopAnswerInput {...props} />;
  }
};

// モバイル向けボタン型入力
const MobileAnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, disabled, difficulty }) => {
  const chordOptions = getChordOptions(difficulty);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  
  const paginatedOptions = chordOptions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  return (
    <div className="space-y-4">
      {/* コードボタングリッド */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {paginatedOptions.map((chord) => (
          <button
            key={chord}
            onClick={() => onSubmit(chord)}
            disabled={disabled}
            className="h-12 rounded-lg bg-blue-500 text-white font-semibold
                     disabled:bg-gray-300 active:bg-blue-600
                     text-lg min-w-[44px]"
          >
            {chord}
          </button>
        ))}
      </div>
      
      {/* ページネーション */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          ←
        </button>
        <span className="px-4 py-2">
          {currentPage + 1} / {Math.ceil(chordOptions.length / itemsPerPage)}
        </span>
        <button
          onClick={() => setCurrentPage(prev => 
            Math.min(Math.ceil(chordOptions.length / itemsPerPage) - 1, prev + 1)
          )}
          disabled={currentPage >= Math.ceil(chordOptions.length / itemsPerPage) - 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
};

// デスクトップ向けドロップダウン入力
const DesktopAnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, disabled, difficulty }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        disabled={disabled}
        placeholder="コード名を入力..."
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg
                 focus:border-blue-500 focus:outline-none"
      />
      
      {/* 入力補完候補 */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 
                     rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onMouseDown={() => handleSubmit(suggestion)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      
      <button
        onClick={() => inputValue.trim() && handleSubmit(inputValue.trim())}
        disabled={disabled || !inputValue.trim()}
        className="mt-3 w-full py-3 bg-blue-500 text-white font-semibold rounded-lg
                 disabled:bg-gray-300 hover:bg-blue-600"
      >
        回答
      </button>
    </div>
  );
};
```

## 確認項目
- [ ] モバイルでボタン型入力が表示される
- [ ] デスクトップでドロップダウン入力が表示される
- [ ] 入力補完が正常に動作する
- [ ] ページネーションが機能する
- [ ] キーボード操作（Enter）が動作する
- [ ] タッチ操作が適切なサイズで動作する

## 成果物
- `src/components/quiz/AnswerInput.tsx`

## 所要時間
50分