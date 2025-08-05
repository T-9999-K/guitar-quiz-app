# Task 08: ローカルストレージ管理フック

## 概要
ブラウザのLocalStorageを使用したデータ永続化フックを作成

## 実行内容
1. LocalStorage読み書き汎用フック
2. 設定データ管理フック
3. スコア履歴管理フック
4. TypeScript型安全性確保

## 作成ファイル
`src/hooks/useLocalStorage.ts`

## 実装する機能
```typescript
// 汎用LocalStorageフック
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // 初期値の読み込み
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // 値の設定
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
};

// ゲーム設定管理
export const useGameSettings = () => {
  const defaultSettings: GameSettings = {
    difficulty: 'beginner',
    soundEnabled: true,
    capoPosition: 0,
    theme: 'light'
  };
  
  const [settings, setSettings] = useLocalStorage('guitar-quiz-settings', defaultSettings);
  
  return { settings, setSettings };
};

// スコア履歴管理
interface ScoreRecord {
  date: string;
  score: number;
  difficulty: ChordPattern['difficulty'];
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  timeElapsed: number;
}

export const useScoreHistory = () => {
  const [history, setHistory] = useLocalStorage<ScoreRecord[]>('guitar-quiz-scores', []);
  
  const addScore = (record: Omit<ScoreRecord, 'date'>) => {
    const newRecord: ScoreRecord = {
      ...record,
      date: new Date().toISOString()
    };
    
    setHistory(prev => [newRecord, ...prev].slice(0, 100)); // 最新100件保持
  };
  
  const getStats = () => {
    if (history.length === 0) return null;
    
    return {
      totalGames: history.length,
      averageScore: history.reduce((sum, record) => sum + record.score, 0) / history.length,
      bestScore: Math.max(...history.map(record => record.score)),
      bestStreak: Math.max(...history.map(record => record.streak)),
      favoritedifficulty: getMostFrequentDifficulty(history)
    };
  };
  
  return { history, addScore, getStats };
};
```

## ヘルパー関数
```typescript
const getMostFrequentDifficulty = (records: ScoreRecord[]): ChordPattern['difficulty'] => {
  const counts = records.reduce((acc, record) => {
    acc[record.difficulty] = (acc[record.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<ChordPattern['difficulty'], number>);
  
  return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0] as ChordPattern['difficulty'];
};
```

## 確認項目
- [ ] LocalStorageの読み書きが正常に動作する
- [ ] SSRでエラーが発生しない
- [ ] 型安全性が確保されている
- [ ] データの永続化が機能する
- [ ] 統計計算が正確に動作する

## 成果物
- `src/hooks/useLocalStorage.ts`

## 所要時間
30分