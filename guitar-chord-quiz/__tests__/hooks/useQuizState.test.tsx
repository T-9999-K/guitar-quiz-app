import { renderHook, act } from '@testing-library/react';
import { useQuizState } from '@/hooks/useQuizState';

// モックデータ
jest.mock('@/data/chord-patterns', () => ({
  getRandomChord: jest.fn(() => ({
    name: 'C',
    frets: [null, 3, 2, 0, 1, 0],
    fingers: [null, 3, 2, null, 1, null],
    difficulty: 'beginner',
    root: 'C',
    quality: 'major'
  }))
}));

describe('useQuizState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useQuizState('beginner'));

    expect(result.current.state.score).toBe(0);
    expect(result.current.state.streak).toBe(0);
    expect(result.current.state.currentChord).toBeNull();
    expect(result.current.gameActive).toBe(false);
  });

  it('should start quiz correctly', () => {
    const { result } = renderHook(() => useQuizState('beginner'));

    act(() => {
      result.current.startQuiz();
    });

    expect(result.current.gameActive).toBe(true);
    expect(result.current.state.currentChord).not.toBeNull();
    expect(result.current.state.currentChord?.name).toBe('C');
  });

  it('should handle correct answer', () => {
    const { result } = renderHook(() => useQuizState('beginner'));

    act(() => {
      result.current.startQuiz();
    });

    act(() => {
      result.current.submitAnswer('C');
    });

    expect(result.current.state.score).toBe(10);
    expect(result.current.state.streak).toBe(1);
  });

  it('should handle incorrect answer', () => {
    const { result } = renderHook(() => useQuizState('beginner'));

    act(() => {
      result.current.startQuiz();
    });

    act(() => {
      result.current.submitAnswer('G');
    });

    expect(result.current.state.score).toBe(0);
    expect(result.current.state.streak).toBe(0);
  });

  it('should increment hints used', () => {
    const { result } = renderHook(() => useQuizState('beginner'));

    act(() => {
      result.current.startQuiz();
    });

    act(() => {
      result.current.useHint();
    });

    expect(result.current.state.hintsUsed).toBe(1);
  });
});