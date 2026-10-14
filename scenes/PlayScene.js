import {
  playCoinSound,
  playGameOverSound,
  playStartSound,
  playTickSound,
  unlockAudio
} from '../systems/audio.js';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    const { width, height } = this.scale;
    this.width = width;
    this.height = height;

    this.score = 0;
    this.timeLeft = 60;
    this.isGameOver = false;
    this.touchTarget = null;

    this.createBackground();
    this.createParticles();
    this.createPlayer();
    this.createCoin();
    this.createHUD();
    this.createInput();
    this.setupAudio();
    this.startTimer();
    this.setupCollision();
  }

  // ============================================================
  // AUDIO
  // ============================================================
  setupAudio() {
    this.input.once('pointerdown', unlockAudio);
    this.input.keyboard.once('keydown', unlockAudio);

    this.time.delayedCall(100, () => {
      playStartSound();
    });
  }

  // ============================================================
  // BACKGROUND
  // ============================================================
  createBackground() {
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x1a1a3e, 0.5);
    for (let x = 0; x < this.width; x += 40) {
      grid.lineBetween(x, 0, x, this.height);
    }
    for (let y = 0; y < this.height; y += 40) {
      grid.lineBetween(0, y, this.width, y);
    }
  }

  // ============================================================
  // PARTICLES
  // ============================================================
  createParticles() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('spark', 8, 8);
    g.destroy();

    this.particles = this.add.particles(0, 0, 'spark', {
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.2, end: 0 },
      lifespan: 600,
      quantity: 20,
      blendMode: 'ADD',
      emitting: false
    });
  }

  // ============================================================
  // PLAYER
  // ============================================================
  createPlayer() {
    const cx = this.width / 2;
    const cy = this.height / 2;

    this.playerGlow = this.add.circle(cx, cy, 32, 0x00ffcc, 0.15);

    this.player = this.add.circle(cx, cy, 18, 0x00ffcc);
    this.player.setStrokeStyle(3, 0xffffff, 0.9);
    this.physics.add.existing(this.player);
    this.player.body.setCircle(18);
    this.player.body.setDamping(true);
    this.player.body.setDrag(0.85);
    this.player.body.setMaxVelocity(550);

    this.playerHighlight = this.add.circle(cx - 5, cy - 5, 5, 0xffffff, 0.6);
  }

  // ============================================================
  // COIN
  // ============================================================
  createCoin() {
    const x = Phaser.Math.Between(60, this.width - 60);
    const y = Phaser.Math.Between(80, this.height - 60);

    this.coinGlow = this.add.circle(x, y, 30, 0xffd700, 0.2);

    this.coin = this.add.circle(x, y, 16, 0xffd700);
    this.coin.setStrokeStyle(3, 0xffaa00, 1);
    this.physics.add.existing(this.coin);
    this.coin.body.setCircle(22);

    this.coinShine = this.add.circle(x - 4, y - 4, 4, 0xffffff, 0.7);

    this.tweens.add({
      targets: [this.coin, this.coinGlow, this.coinShine],
      y: '+=8',
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // ============================================================
  // HUD
  // ============================================================
  createHUD() {
    this.add.text(20, 20, 'SCORE', {
      fontSize: '14px',
      color: '#8899bb',
      fontStyle: 'bold',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      letterSpacing: 3
    });

    this.scoreText = this.add.text(20, 38, '0', {
      fontSize: '42px',
      color: '#00ffcc',
      fontStyle: 'bold',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    });
    this.scoreText.setShadow(0, 0, '#00ffcc', 12, true, true);

    this.add.text(this.width - 20, 20, 'TIME', {
      fontSize: '14px',
      color: '#8899bb',
      fontStyle: 'bold',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      letterSpacing: 3
    }).setOrigin(1, 0);

    this.timerText = this.add.text(this.width - 20, 38, '60', {
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }).setOrigin(1, 0);
    this.timerText.setShadow(0, 0, '#ffffff', 12, true, true);

    const hint = this.add.text(
      this.width - 20,
      this.height - 20,
      'DRAG TO MOVE  ·  ARROWS / WASD',
      {
        fontSize: '12px',
        color: '#556688',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        letterSpacing: 2
      }
    );
    hint.setOrigin(1, 1);
  }

  // ============================================================
  // INPUT — keyboard + touch/mouse
  // ============================================================
  createInput() {
    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Touch / mouse — drag anywhere to move the orb
    this.input.on('pointerdown', (pointer) => {
      this.touchTarget = { x: pointer.x, y: pointer.y };
    });

    this.input.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        this.touchTarget = { x: pointer.x, y: pointer.y };
      }
    });

    this.input.on('pointerup', () => {
      this.touchTarget = null;
    });
  }

  // ============================================================
  // TIMER
  // ============================================================
  startTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true
    });
  }

  tickTimer() {
    if (this.isGameOver) return;

    this.timeLeft -= 1;
    this.timerText.setText(this.timeLeft.toString());

    if (this.timeLeft <= 10) {
      this.timerText.setColor('#ff4444');
      this.timerText.setShadow(0, 0, '#ff4444', 12, true, true);
      playTickSound();
    }

    if (this.timeLeft <= 0) this.endGame();
  }

  // ============================================================
  // COLLISION
  // ============================================================
  setupCollision() {
    this.physics.add.overlap(this.player, this.coin, this.collectCoin, null, this);
  }

  collectCoin(playerObj, coinObj) {
    this.score += 10;
    this.scoreText.setText(this.score.toString());

    this.scoreText.setScale(1.3);
    this.tweens.add({
      targets: this.scoreText,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });

    this.particles.setParticleTint(0xffd700);
    this.particles.emitParticleAt(coinObj.x, coinObj.y, 20);

    this.cameras.main.shake(120, 0.006);

    playCoinSound();

    coinObj.setScale(0);
    this.coinGlow.setScale(0);
    this.coinShine.setScale(0);

    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const distance = Phaser.Math.Between(120, 260);
    let newX = this.player.x + Math.cos(angle) * distance;
    let newY = this.player.y + Math.sin(angle) * distance;
    newX = Phaser.Math.Clamp(newX, 60, this.width - 60);
    newY = Phaser.Math.Clamp(newY, 80, this.height - 60);

    coinObj.setPosition(newX, newY);
    this.coinGlow.setPosition(newX, newY);
    this.coinShine.setPosition(newX, newY);

    this.tweens.add({
      targets: [coinObj, this.coinGlow, this.coinShine],
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  // ============================================================
  // GAME OVER
  // ============================================================
  endGame() {
    this.isGameOver = true;
    this.player.body.setAcceleration(0, 0);
    this.player.body.setVelocity(0, 0);

    playGameOverSound();

    this.cameras.main.fade(400, 0, 0, 0);

    this.time.delayedCall(420, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  // ============================================================
  // UPDATE
  // ============================================================
  update() {
    if (this.isGameOver) return;

    const accel = 900;
    const left  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up    = this.cursors.up.isDown    || this.wasd.up.isDown;
    const down  = this.cursors.down.isDown  || this.wasd.down.isDown;

    // ---- Touch / mouse control takes priority when active ----
    if (this.touchTarget) {
      const dx = this.touchTarget.x - this.player.x;
      const dy = this.touchTarget.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 4) {
        const nx = dx / dist;
        const ny = dy / dist;
        this.player.body.setAcceleration(nx * accel, ny * accel);
      } else {
        this.player.body.setAcceleration(0, 0);
      }
    } else {
      // ---- Keyboard control ----
      if (left)       this.player.body.setAccelerationX(-accel);
      else if (right) this.player.body.setAccelerationX(accel);
      else            this.player.body.setAccelerationX(0);

      if (up)         this.player.body.setAccelerationY(-accel);
      else if (down)  this.player.body.setAccelerationY(accel);
      else            this.player.body.setAccelerationY(0);
    }

    // Clamp inside canvas
    this.player.x = Phaser.Math.Clamp(this.player.x, 18, this.width - 18);
    this.player.y = Phaser.Math.Clamp(this.player.y, 18, this.height - 18);

    // Update glow + highlight positions
    this.playerGlow.x = this.player.x;
    this.playerGlow.y = this.player.y;

    this.playerHighlight.x = this.player.x - 5;
    this.playerHighlight.y = this.player.y - 5;

    const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.15;
    this.playerGlow.setScale(pulse);

    // Coin animation
    if (this.coin.active) {
      const angle = Date.now() * 0.003;
      const radius = 8;
      this.coinShine.x = this.coin.x + Math.cos(angle) * radius;
      this.coinShine.y = this.coin.y + Math.sin(angle) * radius;

      this.coinGlow.x = this.coin.x;
      this.coinGlow.y = this.coin.y;

      const coinPulse = 1 + Math.sin(Date.now() * 0.004) * 0.2;
      this.coinGlow.setScale(coinPulse);
    }
  }
}