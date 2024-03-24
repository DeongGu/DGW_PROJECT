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
    this.load.tilemapTiledJSON("ground", "tiles/ground.json");
    this.load.image("tiles1", "tiles/tilemap1.png");
    this.load.tilemapTiledJSON("ground1", "tiles/ground1.json");

    this.load.image("talkbox", "talkbox.png");
    this.load.image("profile", "me.png");
    this.load.image("friend-profile", "friendProfile.png");

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
    // this.scene.start("Prologue");
    this.scene.start("Plot");
  }
}
