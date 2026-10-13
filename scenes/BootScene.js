export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Later: load images, sounds, fonts here
  }

  create() {
    this.scene.start('StartScene');
  }
}