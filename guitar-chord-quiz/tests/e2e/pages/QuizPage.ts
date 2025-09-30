/**
 * Guitar Chord Quiz - Quiz Page Object Model
 *
 * @description クイズページの操作とテスト用クラス
 * @author Claude Code
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestHelpers } from '../utils/helpers';

export class QuizPage extends BasePage {
  // メイン要素
  readonly fretboard: Locator;
  readonly answerInput: Locator;
  readonly submitButton: Locator;
  readonly skipButton: Locator;
  readonly hintButton: Locator;

  // スコア表示
  readonly currentScore: Locator;
  readonly currentStreak: Locator;
  readonly totalQuestions: Locator;
  readonly correctAnswers: Locator;
  readonly timeElapsed: Locator;

  // ゲーム制御
  readonly pauseButton: Locator;
  readonly resumeButton: Locator;
  readonly endGameButton: Locator;
  readonly newGameButton: Locator;

  // フィードバック
  readonly correctFeedback: Locator;
  readonly incorrectFeedback: Locator;
  readonly hintDisplay: Locator;
  readonly resultModal: Locator;

  // 回答入力関連
  readonly answerDropdown: Locator;
  readonly answerButtons: Locator;
  readonly answerSuggestions: Locator;

  // 音声制御
  readonly playChordButton: Locator;
  readonly volumeControl: Locator;
  readonly muteButton: Locator;

  constructor(page: Page) {
    super(page);

    // メイン要素
    this.fretboard = page.locator('[data-testid="fretboard"]');
    this.answerInput = page.locator('[data-testid="answer-input"]');
    this.submitButton = page.locator('[data-testid="submit-answer"]');
    this.skipButton = page.locator('[data-testid="skip-question"]');
    this.hintButton = page.locator('[data-testid="hint-button"]');

    // スコア表示
    this.currentScore = page.locator('[data-testid="current-score"]');
    this.currentStreak = page.locator('[data-testid="current-streak"]');
    this.totalQuestions = page.locator('[data-testid="total-questions"]');
    this.correctAnswers = page.locator('[data-testid="correct-answers"]');
    this.timeElapsed = page.locator('[data-testid="time-elapsed"]');

    // ゲーム制御
    this.pauseButton = page.locator('[data-testid="pause-game"]');
    this.resumeButton = page.locator('[data-testid="resume-game"]');
    this.endGameButton = page.locator('[data-testid="end-game"]');
    this.newGameButton = page.locator('[data-testid="new-game"]');

    // フィードバック
    this.correctFeedback = page.locator('[data-testid="correct-feedback"]');
    this.incorrectFeedback = page.locator('[data-testid="incorrect-feedback"]');
    this.hintDisplay = page.locator('[data-testid="hint-display"]');
    this.resultModal = page.locator('[data-testid="result-modal"]');

    // 回答入力関連
    this.answerDropdown = page.locator('[data-testid="answer-dropdown"]');
    this.answerButtons = page.locator('[data-testid="answer-buttons"]');
    this.answerSuggestions = page.locator('[data-testid="answer-suggestions"]');

    // 音声制御
    this.playChordButton = page.locator('[data-testid="play-chord"]');
    this.volumeControl = page.locator('[data-testid="volume-control"]');
    this.muteButton = page.locator('[data-testid="mute-button"]');
  }

  /**
   * クイズページの基本要素確認
   */
  async verifyQuizPageElements(): Promise<void> {
    await this.verifyElementVisible(this.fretboard);
    await this.verifyElementVisible(this.answerInput);
    await this.verifyElementVisible(this.submitButton);
    await this.verifyElementVisible(this.currentScore);
  }

  /**
   * フレットボードの表示確認
   */
  async verifyFretboardDisplay(): Promise<void> {
    await this.verifyElementVisible(this.fretboard);

    // SVG要素の確認
    const svgElement = this.fretboard.locator('svg');
    await this.verifyElementVisible(svgElement);

    // フレット線の確認
    const frets = this.fretboard.locator('[data-testid="fret-line"]');
    await this.verifyElementVisible(frets.first());

    // 弦の確認
    const strings = this.fretboard.locator('[data-testid="string-line"]');
    await this.verifyElementVisible(strings.first());
  }

  /**
   * 回答を入力
   */
  async enterAnswer(answer: string): Promise<void> {
    // デバイス別の入力方法を判定
    const isMobile = await this.page.locator('[data-testid="answer-buttons"]').isVisible();

    if (isMobile) {
      // モバイル: ボタン式入力
      await this.selectAnswerFromButtons(answer);
    } else {
      // デスクトップ: テキスト入力
      await this.fillInput(this.answerInput, answer);
    }
  }

  /**
   * ボタンから回答を選択（モバイル用）
   */
  async selectAnswerFromButtons(answer: string): Promise<void> {
    const answerButton = this.page.locator(`[data-testid="answer-button-${answer}"]`);
    await this.clickElement(answerButton);
  }

  /**
   * 回答を送信
   */
  async submitAnswer(): Promise<void> {
    await this.clickElement(this.submitButton);
    await this.wait(500); // フィードバックアニメーション待機
  }

  /**
   * 回答入力と送信（一連の流れ）
   */
  async answerQuestion(answer: string): Promise<void> {
    await this.enterAnswer(answer);
    await this.submitAnswer();
  }

  /**
   * ヒントを使用
   */
  async useHint(): Promise<void> {
    await this.clickElement(this.hintButton);
    await this.wait(300);
    await this.verifyElementVisible(this.hintDisplay);
  }

  /**
   * 問題をスキップ
   */
  async skipQuestion(): Promise<void> {
    await this.clickElement(this.skipButton);
    await this.wait(500);
  }

  /**
   * 正解フィードバックの確認
   */
  async verifyCorrectFeedback(): Promise<void> {
    await this.verifyElementVisible(this.correctFeedback);
    await this.verifyTextContent(this.correctFeedback, /正解|Correct/);
  }

  /**
   * 不正解フィードバックの確認
   */
  async verifyIncorrectFeedback(): Promise<void> {
    await this.verifyElementVisible(this.incorrectFeedback);
    await this.verifyTextContent(this.incorrectFeedback, /不正解|Incorrect/);
  }

  /**
   * スコアの取得
   */
  async getCurrentScore(): Promise<number> {
    return await TestHelpers.getCurrentScore(this.page);
  }

  /**
   * 連続正解数の取得
   */
  async getCurrentStreak(): Promise<number> {
    return await TestHelpers.getCurrentStreak(this.page);
  }

  /**
   * ゲームを一時停止
   */
  async pauseGame(): Promise<void> {
    await this.clickElement(this.pauseButton);
    await this.verifyElementVisible(this.resumeButton);
  }

  /**
   * ゲームを再開
   */
  async resumeGame(): Promise<void> {
    await this.clickElement(this.resumeButton);
    await this.verifyElementVisible(this.pauseButton);
  }

  /**
   * ゲームを終了
   */
  async endGame(): Promise<void> {
    await this.clickElement(this.endGameButton);
    await this.verifyElementVisible(this.resultModal);
  }

  /**
   * 新しいゲームを開始
   */
  async startNewGame(): Promise<void> {
    await this.clickElement(this.newGameButton);
    await this.waitForPageLoad();
  }

  /**
   * コードを再生
   */
  async playChord(): Promise<void> {
    await this.clickElement(this.playChordButton);
    await this.wait(1000); // 音声再生待機
  }

  /**
   * 音量を調整
   */
  async adjustVolume(volume: number): Promise<void> {
    // volume: 0-100の数値
    await this.volumeControl.fill(volume.toString());
  }

  /**
   * 音声をミュート/アンミュート
   */
  async toggleMute(): Promise<void> {
    await this.clickElement(this.muteButton);
  }

  /**
   * 結果モーダルの確認
   */
  async verifyResultModal(): Promise<void> {
    await this.verifyElementVisible(this.resultModal);

    // 結果情報の確認
    const finalScore = this.resultModal.locator('[data-testid="final-score"]');
    const accuracy = this.resultModal.locator('[data-testid="accuracy"]');

    await this.verifyElementVisible(finalScore);
    await this.verifyElementVisible(accuracy);
  }

  /**
   * レスポンシブ表示の確認
   */
  async verifyResponsiveLayout(device: 'mobile' | 'tablet' | 'desktop'): Promise<void> {
    await this.setDevice(device);
    await this.wait(300);

    if (device === 'mobile') {
      // モバイル用ボタン式回答入力
      await this.verifyElementVisible(this.answerButtons);
    } else {
      // デスクトップ用テキスト入力
      await this.verifyElementVisible(this.answerInput);
    }

    // 共通要素
    await this.verifyElementVisible(this.fretboard);
    await this.verifyElementVisible(this.currentScore);
  }

  /**
   * キーボードショートカットテスト
   */
  async testKeyboardShortcuts(): Promise<void> {
    // Enterキーで回答送信
    await this.enterAnswer('C');
    await this.pressKey('Enter');
    await this.wait(500);

    // Escapeキーでヒント非表示
    await this.useHint();
    await this.pressKey('Escape');
    await this.verifyElementHidden(this.hintDisplay);

    // Spaceキーで一時停止/再開
    await this.pressKey('Space');
    await this.wait(300);
  }

  /**
   * アクセシビリティ確認
   */
  async verifyAccessibility(): Promise<void> {
    // フレットボードのアクセシビリティ
    await this.verifyAriaLabel(this.fretboard, /フレットボード|Fretboard/);

    // 回答入力のラベル
    await this.verifyAriaLabel(this.answerInput, /回答入力|Answer input/);

    // ボタンのアクセシビリティ
    await this.verifyAriaLabel(this.submitButton, /回答送信|Submit answer/);
    await this.verifyAriaLabel(this.hintButton, /ヒント|Hint/);
  }

  /**
   * エラー状態の確認
   */
  async verifyNoErrors(): Promise<void> {
    await this.checkForErrors();

    // 無効な回答入力のエラー確認
    const errorMessage = this.page.locator('[data-testid="answer-error"]');
    await this.verifyElementHidden(errorMessage);
  }

  /**
   * パフォーマンス確認
   */
  async verifyPerformance(): Promise<void> {
    const performance = await TestHelpers.measurePagePerformance(this.page);

    // 読み込み時間のアサーション（3秒以内）
    if (performance.loadTime > 3000) {
      throw new Error(`Page load time too slow: ${performance.loadTime}ms`);
    }
  }

  /**
   * ゲーム完了までの一連フロー
   */
  async completeGameFlow(answers: string[]): Promise<void> {
    for (const answer of answers) {
      await this.answerQuestion(answer);
      await this.wait(1000); // 次の問題へのアニメーション待機

      // 最後の問題でない場合は次の問題を確認
      if (answer !== answers[answers.length - 1]) {
        await this.verifyFretboardDisplay();
      }
    }

    // ゲーム完了の確認
    await this.verifyResultModal();
  }
}