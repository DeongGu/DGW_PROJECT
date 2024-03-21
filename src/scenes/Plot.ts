import { Engine } from "matter";
import { Scene } from "phaser";

import Friend from "../sprite/friend";
import Character from "../sprite/character";

import TalkBoxContainer from "../container/talkBoxContainer";
import MsgBoxContainer from "../container/msgBoxContainer";

import { sceneEvents } from "../events/sceneEventEmit";

export class Plot extends Scene {
  private character!: Phaser.Physics.Matter.Sprite;
  private friend!: Phaser.Physics.Matter.Sprite;

  cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

  private msgBoxContainer!: Phaser.GameObjects.Container & MsgBoxContainer;
  private talkBoxContainer!: Phaser.GameObjects.Container & TalkBoxContainer;

  constructor() {
    super("Plot");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
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
    this.character = new Character(this, 200, 0, "dg", 0);

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
  }

  update(t: number, dt: number): void {
    // 캐릭터의 움직임 추가
    if (this.character) this.character.update(this.cursors);
  }
}
