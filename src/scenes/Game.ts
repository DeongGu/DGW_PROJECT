import { Engine } from "matter";
import { Scene } from "phaser";

import { createFriendAnims } from "../anims/FriendAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";

import Friend from "../sprite/friend";

import TalkBoxContainer from "../container/talkBoxContainer";
import MsgBoxContainer from "../container/msgBoxContainer";

export class Game extends Scene {
  private character!: Phaser.Physics.Matter.Sprite;
  private friend!: Phaser.Physics.Matter.Sprite;
  private isTouchingDown = false;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  triggerDistance = 300;

  private msgBoxContainer!: Phaser.GameObjects.Container & MsgBoxContainer;
  private talkBoxContainer!: Phaser.GameObjects.Container & TalkBoxContainer;

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

    // 대화 관련 컨테이너 생성
    this.msgBoxContainer = new MsgBoxContainer(
      this,
      0,
      0,
      "대화를 하려면 F키를 누르세요"
    );
    this.talkBoxContainer = new TalkBoxContainer(
      this,
      0,
      this.scale.height * 0.65,
      this
    );

    this.events.on(
      "openTalkBox",
      this.talkBoxContainer.open,
      this.talkBoxContainer
    );

    this.events.on(
      "moveNextScene",
      () => {
        this.triggerDistance = 0;
        this.friend.anims.play("friend-right");
        this.character.anims.play("right");
      },
      this
    );
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
        this.msgBoxContainer.open();
      } else {
        this.msgBoxContainer.close();
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
