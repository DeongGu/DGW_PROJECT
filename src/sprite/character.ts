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

    // 현재 활성화된 scene에 객체 추가
    scene.add.existing(this);

    // sprite 객체 기본 설정
    this.setScale(3, 3);
    this.setBounce(0.2);
    this.setFixedRotation();

    // 충돌을 boolean으로 관리
    this.setOnCollide((/*data: MatterJS.ICollisionPair*/) => {
      this.isTouchingDown = true;
    });

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
        scene.cursors = null;
        scene.tweens.add({
          targets: this,
          x: 300,
          ease: "linear",
          callbacks: () => {
            this.anims.play("right", true);
          },
          duration: 4000,
          onComplete: () => {
            this.anims.complete();
            this.setFrame(6);
            sceneEvents.emit("lastTalk");
          },
        });
      },
      this
    );

    sceneEvents.on(
      "beforeFall",
      () => {
        scene.tweens.add({
          targets: this,
          x: 800,
          ease: "linear",
          duration: 3000,
          callbacks: () => {
            this.anims.play("right", true);
          },
          onComplete: () => {
            this.anims.complete();
            this.setFrame(2);
            sceneEvents.emit("approachCharacter");
          },
        });
      },
      this
    );

    sceneEvents.on("fallCharacter", () => {
      scene.tweens.add({
        targets: this,
        ease: "linear",
        duration: 2000,
        callbacks: () => {
          scene.matter.world.setGravity(0, 0.5, 0.001);
          this.setVelocity(4, -5);
          this.anims.play("fall", true);
        },
        onComplete: () => {
          sceneEvents.emit("rolling");
        },
      });
    });

    sceneEvents.on("rolling", () => {
      scene.tweens.add({
        targets: this,
        ease: "linear",
        duration: 3000,
        callbacks: () => {
          scene.cameras.main.startFollow(this);
          this.anims.play("rolling", true);
        },
        onComplete: () => {
          sceneEvents.emit("landing");
        },
      });

      scene.tweens.add({
        targets: scene.cameras.main,
        ease: "linear",
        duration: 2000,
        zoom: 2,
      });
    });

    sceneEvents.on("landing", () => {
      scene.tweens.add({
        targets: this,
        ease: "linear",
        duration: 1000,
        callbacks: () => {
          this.anims.play("landing", true);
        },
        onComplete: () => {
          sceneEvents.emit("updateCharacter");
        },
      });

      scene.tweens.add({
        targets: scene.cameras.main,
        ease: "linear",
        duration: 2000,
        zoom: 1,
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
