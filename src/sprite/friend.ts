import { Scene } from "phaser";

import { sceneEvents } from "../events/sceneEventEmit";

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

    sceneEvents.on(
      "moveNextScene",
      () => {
        this.action = Action.RIGHT;
      },
      this
    );

    sceneEvents.on(
      "plotStart",
      () => {
        this.anims.play("friend-right", true);
        scene.tweens.add({
          targets: this,
          x: 500,
          ease: "linear",
          duration: 4000,
          onComplete: () => {
            this.anims.play("friend-turn", true);
            this.destroy(true);
            scene.add.image(500, 392, "friend", 4).setScale(3, 3);
          },
        });
      },
      this
    );
  }

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene);
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    const speed = 5;

    switch (this.action) {
      case Action.LEFT:
        this.setVelocityX(-speed);
        this.anims.play("friend-left", true);
        break;

      case Action.RIGHT:
        this.setVelocityX(speed);
        this.anims.play("friend-right", true);
        break;

      default:
        break;
    }
  }
}
