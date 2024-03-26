import { Scene } from "phaser";
import { sceneEvents } from "../events/sceneEventEmit";

enum Action {
  RIGHT,
  LEFT,
  PUSH,
  STOP,
}

export default class Friend extends Phaser.Physics.Matter.Sprite {
  private friendImage?: Phaser.GameObjects.Image;
  private friendSprite: Phaser.Physics.Matter.Sprite;
  private action = Action.STOP;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene.matter.world, x, y, texture, frame);

    // 현재 활성화된 scene에 객체 추가
    scene.add.existing(this);

    // sprite 객체 기본 설정
    this.setScale(3, 3);
    this.setBounce(0.2);
    this.setFixedRotation();
    this.anims.play("friend-turn");

    // 이벤트 실행
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
        scene.tweens.add({
          targets: this,
          x: 500,
          ease: "linear",
          duration: 4000,
          callbacks: () => {
            this.anims.play("friend-right", true);
          },
          onComplete: () => {
            this.anims.play("friend-turn", true);
            this.destroy(true);
            this.friendImage = scene.add
              .image(500, 392, "friend", 2)
              .setScale(3, 3);
          },
        });
      },
      this
    );

    sceneEvents.on("approachCharacter", () => {
      this.friendImage?.destroy();
      this.friendSprite = scene.add
        .sprite(500, 392, "friend", 6)
        .setScale(3, 3);

      this.friendSprite.anims.play("friend-right", true);
      scene.tweens.add({
        targets: this.friendSprite,
        x: 740,
        ease: "linear",
        duration: 2000,
        onComplete: () => {
          sceneEvents.emit("pushCharacter");
        },
      });
    });

    sceneEvents.on("pushCharacter", () => {
      scene.tweens.add({
        targets: this.friendSprite,
        callbacks: this.friendSprite.anims.play("friend-push"),
        onComplete: () => {
          sceneEvents.emit("fallCharacter");
        },
      });
    });
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
