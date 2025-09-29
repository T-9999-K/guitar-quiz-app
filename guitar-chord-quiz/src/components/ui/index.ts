/**
 * UI Components - Export Module
 * 共通UIコンポーネントの一元エクスポート
 */

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { AudioControls } from './AudioControls';

export { AudioVisualizer, AudioIndicator } from './AudioVisualizer';

export {
  FeedbackAnimation,
  ScoreAnimation,
  StreakAnimation,
  PointsAnimation,
  HintAnimation
} from './FeedbackAnimation';

export {
  LoadingSpinner,
  FretboardLoader,
  AudioLoader,
  QuizLoader,
  PageLoader,
  InlineLoader
} from './LoadingSpinner';

// 今後追加されるUIコンポーネントをここからエクスポート
// 例: export { Card } from './Card';
// 例: export { Input } from './Input';