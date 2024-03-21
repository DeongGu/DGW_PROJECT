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

    // scene.matter.world.on(
    //   Phaser.Physics.Matter.Events.COLLISION_START,
    //   this.handleCollision,
    //   this
    // );
  }

  // private handleCollision(
  //   target: Phaser.GameObjects.GameObject,
  //   tile: Phaser.Tilemaps.Tile
  // ) {
  //   // if (target !== this) return;
  //   // console.log(target);
  // }

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
