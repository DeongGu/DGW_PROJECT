import { Scene } from "phaser";

enum Action {
  RIGHT,
  LEFT,
  PUSH,
  STOP,
}

export default class Friend extends Phaser.Physics.Matter.Sprite {
  private action = Action.STOP;

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

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    const speed = 1;

    switch (this.action) {
      case Action.LEFT:
        this.setVelocityX(-speed);
        break;

      case Action.RIGHT:
        this.setVelocityX(speed);
        break;

      default:
        break;
    }
  }
}
