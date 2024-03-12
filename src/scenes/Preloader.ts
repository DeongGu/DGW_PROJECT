import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {}

  preload() {
    // 화면 구성을 위한 assets(자원)을 불러오기
    this.load.setPath("assets");

    this.load.image("tiles", "tiles/tiles.png");
    this.load.tilemapTiledJSON("ground", "tiles/ground1.json");

    this.load.spritesheet("dg", "dg.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.spritesheet("friend", "friend.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.spritesheet("hello", "hello.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.scene.start("MainMenu");
  }
}
