import BootScene from './scenes/BootScene.js';
import StartScene from './scenes/StartScene.js';
import PlayScene from './scenes/PlayScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const WIDTH = 800;
const HEIGHT = 600;

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0f0f1e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT,
    max: {
      width: 900,
      height: 680
    }
  },
  scene: [BootScene, StartScene, PlayScene, GameOverScene]
};

const game = new Phaser.Game(config);

export default game;
export { WIDTH, HEIGHT };