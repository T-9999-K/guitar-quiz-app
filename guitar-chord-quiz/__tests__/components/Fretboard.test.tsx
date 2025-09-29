import { render, screen } from '@testing-library/react';
import { AccessibleFretboard as Fretboard } from '@/components/fretboard/AccessibleFretboard';
import { ChordPattern } from '@/types';

const mockChord: ChordPattern = {
  name: 'C',
  frets: [null, 3, 2, 0, 1, 0],
  fingers: [null, 3, 2, null, 1, null],
  difficulty: 'beginner',
  root: 'C',
  quality: 'major'
};

describe('Fretboard', () => {
  it('should render fretboard with correct chord pattern', () => {
    render(
      <Fretboard
        chordPattern={mockChord}
        orientation="horizontal"
        showFingers={true}
      />
    );

    // SVG要素が存在することを確認
    const fretboardSvg = screen.getByRole('img', { hidden: true });
    expect(fretboardSvg).toBeInTheDocument();
  });

  it('should show finger numbers when showFingers is true', () => {
    render(
      <Fretboard
        chordPattern={mockChord}
        orientation="horizontal"
        showFingers={true}
      />
    );

    // 指番号が表示されることを確認（具体的な実装に依存）
    const fingerElements = screen.getAllByText(/[1-4]/);
    expect(fingerElements).toHaveLength(3); // Cコードは3本指
  });

  it('should hide finger numbers when showFingers is false', () => {
    render(
      <Fretboard
        chordPattern={mockChord}
        orientation="horizontal"
        showFingers={false}
      />
    );

    // 指番号が表示されないことを確認
    const fingerElements = screen.queryAllByText(/[1-4]/);
    expect(fingerElements).toHaveLength(0);
  });

  it('should handle vertical orientation', () => {
    render(
      <Fretboard
        chordPattern={mockChord}
        orientation="vertical"
        showFingers={false}
      />
    );

    const fretboardSvg = screen.getByRole('img', { hidden: true });
    expect(fretboardSvg).toBeInTheDocument();
  });
});