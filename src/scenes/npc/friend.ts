import { Scene } from "phaser";

export default class Friend extends Phaser.Physics.Matter.Sprite {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene.matter.world, x, y, texture, frame);
    scene.add.existing(this);
    this.setScale(3, 3);
    this.setBounce(0.2);
    this.setFixedRotation();
    this.anims.play("friend-turn");
  }
}
