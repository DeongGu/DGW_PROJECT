import { Engine } from "matter";
import { Scene } from "phaser";

import { createFriendAnims } from "../anims/FriendAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";
import Friend from "./npc/friend";

export class Game extends Scene {
  private character!: Phaser.Physics.Matter.Sprite;
  private friend!: Phaser.Physics.Matter.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private isTouchingDown = false;
  triggerDistance = 300;

  private msgContainer!: Phaser.GameObjects.Container;
  private talkContainer!: Phaser.GameObjects.Container;

  constructor() {
    super("Game");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    // 애니메이션 추가
    createCharacterAnims(this.anims);
    createFriendAnims(this.anims);

    // 지면 생성
    const map = this.make.tilemap({ key: "ground" });
    const tileset = map.addTilesetImage("ground", "tiles");

    const groundLayer = map.createLayer("Ground", tileset);
    groundLayer?.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(groundLayer);

    // 충돌 감지
    this.matter.world.on(
      "collisionstart",
      (event: MatterJS.IEventCollision<Engine>) => {
        event.pairs.forEach((pair: MatterJS.IPair) => {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;

          // 두 개체가 겹칠 때 추가 작업 실행 - friend 위치 고정
          if (bodyA === this.character?.body && bodyB === this.friend?.body) {
            this.friend.setStatic(true);
          }
        });
      }
    );

    // 캐릭터 설정
    this.character = this.matter.add.sprite(200, 0, "dg").setFixedRotation();
    this.character.setScale(3, 3);
    this.character.setBounce(0.2);
    this.character.setOnCollide((/*data: MatterJS.ICollisionPair*/) => {
      this.isTouchingDown = true;
    });

    // npc 생성
    this.friend = new Friend(this, 750, 0, "friend", 0);
    this.friend.anims.play("friend-hello");

    this.input.keyboard?.on("keyup-F", () => {
      this.msgContainer.scene.add.tween({
        targets: this.msgContainer,
        y: this.scale.height * 0.8,
        duration: 0,
        ease: Phaser.Math.Easing.Sine.InOut,
      });
    });

    this.msgContainer = this.add.container(0, 0);

    const msgBox = this.add
      .rectangle(755, 310, 35, 35, 0xe0e0e0, 0.8)
      .setStrokeStyle(2, 0x000000);

    const text = this.add.text(620, 250, "대화를 하려면 F키를 누르세요", {
      fontSize: 20,
      padding: { x: 10, y: 10 },
      fontFamily: "DNFBitBitv2",
      color: "white",
    });
    const Ftext = this.add.text(750, 300, "F", {
      fontSize: 17,
      fontFamily: "DNFBitBitv2",
      color: "black",
    });

    this.msgContainer.add(msgBox);
    this.msgContainer.add(text);
    this.msgContainer.add(Ftext);

    this.msgContainer.scene.add.tween({
      targets: this.msgContainer,
      y: 0,
      duration: 0,
      ease: Phaser.Math.Easing.Sine.InOut,
    });

    this.talkContainer = this.add.container(0, this.scale.height * 0.65);

    const talkBox = this.add
      .image(0, 0, "talkbox")
      .setOrigin(0)
      .setScale(1, 0.9);

    let profileImgKey = "friend-profile";

    const profile = this.add
      .image(30, 30, profileImgKey)
      .setOrigin(0)
      .setScale(0.4);

    const name = "친구";
    const nameText = this.add.text(170, 40, name, {
      fontSize: 20,
      padding: { x: 10, y: 10 },
      fontFamily: "DNFBitBitv2",
      color: "rgba(96, 155, 115, 1)",
      backgroundColor: "rgba(0,0,0,0.2)",
    });

    let textContent =
      "안녕?  bro 인생은 한 번 뿐이잖아 하고 싶은 일을 해볼거야!";

    const textBox = this.add
      .text(180, 90, textContent, {
        fontSize: 30,
        padding: { x: 10, y: 10 },
        fontFamily: "DNFBitBitv2",
        fontStyle: "italic",
        color: "black",
      })
      .setWordWrapWidth(talkBox.width * 0.7);
    const mark = this.add
      .triangle(900, 180, 0, 0, 30, 0, 15, 15, 0x000000)
      .setOrigin(0);

    this.talkContainer.add(talkBox);
    this.talkContainer.add(textBox);
    this.talkContainer.add(mark);
    this.talkContainer.add(profile);
    this.talkContainer.add(nameText);
  }

  update(): void {
    // 캐릭터와 npc 사이 거리가 일정 거리가 됐을 경우, 특정 키를 누르면 상호작용을 할 수 있다는 텍스트를 화면에 보여주기
    if (this.character && this.friend) {
      const distance = Phaser.Math.Distance.Between(
        this.character?.x,
        this.character?.y,
        this.friend?.x,
        this.friend.y
      );

      if (distance < this.triggerDistance) {
        // 텍스트 화면에 보여주기
      } else {
      }
    }

    // 캐릭터의 움직임
    if (this.character && this.cursors) {
      if (this.cursors.left.isDown) {
        this.character.play("left", true);
        this.character.setVelocityX(-10);
      } else if (this.cursors.right.isDown) {
        this.character.play("right", true);
        this.character.setVelocityX(10);
      } else {
        this.character.play("turn");
        this.character.setVelocityX(0);
      }

      if (this.cursors.up.isDown && this.isTouchingDown) {
        this.character.setVelocityY(-20);
        this.isTouchingDown = false;
      }
    }
  }
}
