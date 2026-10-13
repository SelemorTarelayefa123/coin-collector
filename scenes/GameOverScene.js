import { playNewBestSound } from '../systems/audio.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.scale;

    this.checkHighScore();
    this.createOverlay(width, height);
    this.createTitle(width, height);
    this.createScores(width, height);
    this.createPlayAgainButton(width, height);

    // Fade the scene in from black
    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  checkHighScore() {
    const stored = parseInt(localStorage.getItem('coinCollectorBest') || '0', 10);
    this.previousBest = stored;
    this.isNewBest = this.finalScore > stored;

    if (this.isNewBest) {
      localStorage.setItem('coinCollectorBest', this.finalScore.toString());
      this.highScore = this.finalScore;

      // Delay the fanfare so it plays after the fade-in
      this.time.delayedCall(600, () => {
        playNewBestSound();
      });
    } else {
      this.highScore = stored;
    }
  }

  createOverlay(width, height) {
    // Dark translucent overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.6);
    overlay.fillRect(0, 0, width, height);
  }

  createTitle(width, height) {
    // Subtle glow behind title
    const glow = this.add.text(width / 2, height / 2 - 160, "TIME'S UP", {
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#ff4444',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(0.5);
    glow.setAlpha(0.3);
    glow.setScale(1.05);

    this.tweens.add({
      targets: glow,
      alpha: { from: 0.15, to: 0.45 },
      scale: { from: 1.02, to: 1.08 },
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Main title
    const title = this.add.text(width / 2, height / 2 - 160, "TIME'S UP", {
      fontSize: '52px',
      fontStyle: 'bold',
      color: '#ff4444',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(0.5);
    title.setShadow(0, 0, '#ff4444', 16, true, true);
  }

  createScores(width, height) {
    // "YOUR SCORE" label
    this.add.text(width / 2, height / 2 - 70, 'YOUR SCORE', {
      fontSize: '14px',
      color: '#8899bb',
      fontStyle: 'bold',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      letterSpacing: 3
    }).setOrigin(0.5);

    // Score number — big, glowing cyan
    const scoreText = this.add.text(width / 2, height / 2 - 30, this.finalScore.toString(), {
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#00ffcc',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(0.5);
    scoreText.setShadow(0, 0, '#00ffcc', 18, true, true);

    // "NEW BEST!" indicator if applicable
    if (this.isNewBest) {
      const newBest = this.add.text(width / 2, height / 2 + 30, '★ NEW BEST! ★', {
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#ffd700',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        letterSpacing: 2
      }).setOrigin(0.5);
      newBest.setShadow(0, 0, '#ffd700', 12, true, true);

      this.tweens.add({
        targets: newBest,
        scale: { from: 1, to: 1.12 },
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    } else {
      this.add.text(width / 2, height / 2 + 30, `BEST: ${this.highScore}`, {
        fontSize: '18px',
        color: '#ffd700',
        fontStyle: 'bold',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        letterSpacing: 2
      }).setOrigin(0.5);
    }
  }

  createPlayAgainButton(width, height) {
    const btnY = height / 2 + 130;

    const btn = this.add.rectangle(width / 2, btnY, 260, 64, 0x00ffcc, 1);
    btn.setStrokeStyle(2, 0xffffff, 0.6);
    btn.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(width / 2, btnY, 'PLAY AGAIN', {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#0f0f1e',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(0.5);

    btn.on('pointerover', () => {
      btn.setFillStyle(0x00ffee, 1);
      this.tweens.add({
        targets: [btn, btnText],
        scale: 1.06,
        duration: 120,
        ease: 'Back.easeOut'
      });
    });

    btn.on('pointerout', () => {
      btn.setFillStyle(0x00ffcc, 1);
      this.tweens.add({
        targets: [btn, btnText],
        scale: 1,
        duration: 120
      });
    });

    btn.on('pointerdown', () => {
      this.tweens.add({
        targets: [btn, btnText],
        scale: 0.94,
        duration: 80,
        yoyo: true,
        onComplete: () => {
          this.scene.start('PlayScene');
        }
      });
    });
  }
}