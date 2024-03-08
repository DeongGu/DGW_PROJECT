import { Engine } from "matter";
import { Scene } from "phaser";

export class Game extends Scene {
  private character: Phaser.Physics.Matter.Sprite | null = null;
  private npc: Phaser.Physics.Matter.Sprite | null = null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private isTouchingDown = false;

  constructor() {
    super("Game");
  }

  init() {
    this.cursors = this.input.keyboard?.createCursorKeys() || null;
  }

  private createCharacterAnimations() {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dg", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dg", frame: 4 }],
      frameRate: 10,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dg", {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "hello",
      frames: this.anims.generateFrameNumbers("hello", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });
  }

  create() {
    this.createCharacterAnimations();

    // 세계법칙설정
    this.matter.world.setBounds(
      10,
      -100,
      +this.game.config.width - 20,
      +this.game.config.height
    );
    this.matter.world.on(
      "collisionstart",
      (event: MatterJS.IEventCollision<Engine>) => {
        event.pairs.forEach((pair: MatterJS.IPair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;

          // 두 개체가 겹칠 때 추가 작업을 수행합니다.
          if (bodyA === this.character?.body && bodyB === this.npc?.body) {
            console.log("Collision detected between:", bodyA, "and", bodyB);
          }
        });
      }
    );

    // 캐릭터 설정
    this.character = this.matter.add.sprite(200, 150, "dg").setFixedRotation();
    this.character.setScale(4, 4);
    this.character.setBounce(0.2);
    this.character.setOnCollide((data: MatterJS.ICollisionPair) => {
      this.isTouchingDown = true;
    });

    this.npc = this.matter.add.sprite(800, 580, "npc").setFixedRotation();
    this.npc.setScale(4, 4);
    this.npc.setBounce(0.2);
    this.npc.anims.play("hello");
    this.npc.setStatic(true);

    // this.cameras.main.startFollow(this.character, true, 1, 1, 200, 200);
  }

  update(): void {
    if (this.character && this.cursors) {
      if (this.cursors.left.isDown) {
        this.character.setVelocityX(-10);
        this.character.play("left", true);
      } else if (this.cursors.right.isDown) {
        this.character.setVelocityX(10);
        this.character.play("right", true);
      } else {
        this.character.setVelocityX(0);
        this.character.play("turn");
      }

      if (this.cursors.up.isDown && this.isTouchingDown) {
        this.character.setVelocityY(-20);
        this.isTouchingDown = false;
      }
    }
  }
}
