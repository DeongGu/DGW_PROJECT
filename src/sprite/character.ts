import { Scene } from "phaser";

import { sceneEvents } from "../events/sceneEventEmit";

enum Action {
  RIGHT,
  LEFT,
  STOP,
}

export default class Character extends Phaser.Physics.Matter.Sprite {
  private isTouchingDown = false;
  private action = Action.STOP;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
  ) {
    super(scene.matter.world, x, y, texture, frame);

    scene.add.existing(this);
    this.setScale(3, 3);
    this.setBounce(0.2);
    this.setFixedRotation();

    this.setOnCollide((/*data: MatterJS.ICollisionPair*/) => {
      this.isTouchingDown = true;
    });

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
        scene.cursors = null;
        this.anims.play("right", true),
          scene.tweens.add({
            targets: this,
            x: 300,
            ease: "linear",
            duration: 4000,
            onComplete: () => {
              this.anims.play("turn", true);
              scene.cursors = cursors;
            },
          });
      },
      this
    );
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    const speed = 5;

    switch (this.action) {
      case Action.LEFT:
        this.setVelocityX(-speed);
        this.anims.play("left", true);
        break;

      case Action.RIGHT:
        this.setVelocityX(speed);
        this.anims.play("right", true);
        break;

      default:
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (cursors && this) {
      if (cursors.left.isDown) {
        this.play("left", true);
        this.setVelocityX(-10);
      } else if (cursors.right.isDown) {
        this.play("right", true);
        this.setVelocityX(10);
      } else {
        this.play("turn");
        this.setVelocityX(0);
      }

      if (cursors.up.isDown && this.isTouchingDown) {
        this.setVelocityY(-20);
        this.isTouchingDown = false;
      }
    }
  }
}
