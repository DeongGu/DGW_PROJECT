import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "assets/bg.png");
  }

  create() {
    this.input.once("pointerdown", () => {
      this.scene.start("Preloader");
    });
  }
}
