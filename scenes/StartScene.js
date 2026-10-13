export default class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    const { width, height } = this.scale;

    this.createBackground(width, height);
    this.createTitle(width, height);
    this.createPlayButton(width, height);
    this.createBestScore(width, height);
  }

  createBackground(width, height) {
    // Floating decorative coins in the background
    for (let i = 0; i < 8; i++) {
      const coin = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(8, 16),
        0xffd700,
        0.08
      );

      this.tweens.add({
        targets: coin,
        y: coin.y - Phaser.Math.Between(60, 120),
        alpha: { from: 0.08, to: 0.18 },
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 1500)
      });
    }
  }

  createTitle(width, height) {
    // Soft glow behind the title
    const glow = this.add.text(width / 2, height / 2 - 80, 'COIN COLLECTOR', {
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#00ffcc',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(0.5);
    glow.setAlpha(0.35);
    glow.setScale(1.06);

    this.tweens.add({
      targets: glow,
      alpha: { from: 0.2, to: 0.5 },
      scale: { from: 1.02, to: 1.08 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Main title text
    const title = this.add.text(width / 2, height / 2 - 80, 'COIN COLLECTOR', {
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#00ffcc',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(0.5);
    title.setShadow(0, 0, '#00ffcc', 16, true, true);

    // Subtitle
    this.add.text(width / 2, height / 2 - 20, 'Collect coins. Beat the clock.', {
      fontSize: '18px',
      color: '#8899bb',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(0.5);
  }

  createPlayButton(width, height) {
    const btnY = height / 2 + 60;

    // Button background
    const btn = this.add.rectangle(width / 2, btnY, 220, 64, 0x00ffcc, 1);
    btn.setStrokeStyle(2, 0xffffff, 0.6);
    btn.setInteractive({ useHandCursor: true });

    // Button text
    const btnText = this.add.text(width / 2, btnY, 'PLAY', {
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#0f0f1e',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(0.5);

    // Hover effect
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

    // Click → start the game
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

  createBestScore(width, height) {
    const best = parseInt(localStorage.getItem('coinCollectorBest') || '0', 10);

    this.add.text(width / 2, height - 60, `BEST: ${best}`, {
      fontSize: '16px',
      color: '#ffd700',
      fontStyle: 'bold',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      letterSpacing: 2
    }).setOrigin(0.5);
  }
}