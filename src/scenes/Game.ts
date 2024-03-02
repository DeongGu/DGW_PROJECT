import { Scene } from "phaser";

export class Game extends Scene {
  private character: Phaser.Physics.Matter.Sprite | null = null;
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
  }

  create() {
    this.createCharacterAnimations();

    // this.matter.world.setBounds(
    //   10,
    //   -10,
    //   +this.game.config.width - 20,
    //   +this.game.config.height
    // );

    this.character = this.matter.add.sprite(100, 150, "dg").setFixedRotation();
    this.character.setScale(4, 4);
    this.character.setBounce(0.2);
    this.character.setOnCollide((data: MatterJS.ICollisionPair) => {
      this.isTouchingDown = true;
    });

    // this.cameras.main.startFollow(this.character);
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
