import { Scene } from "phaser";

import Friend from "../sprite/friend";
import Character from "../sprite/character";

import TalkBoxContainer from "../container/talkBoxContainer";
import MsgBoxContainer from "../container/msgBoxContainer";

import { sceneEvents } from "../events/sceneEventEmit";
import { createCharacterAnims } from "../anims/CharacterAnims";
import { createFriendAnims } from "../anims/FriendAnims";

export class Plot extends Scene {
  private character!: Phaser.Physics.Matter.Sprite;
  private friend!: Phaser.Physics.Matter.Sprite | Phaser.GameObjects.Image;

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
    // 제거 예장
    createCharacterAnims(this.anims);
    createFriendAnims(this.anims);

    // 지면 생성
    const map = this.make.tilemap({ key: "ground1" });
    const tileset = map.addTilesetImage("tilemap1", "tiles1");
    const groundLayer = map.createLayer("ground", tileset);
    groundLayer?.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(groundLayer);

    // 세계 경계 설정
    this.matter.world.setBounds(0, 0, groundLayer?.width, groundLayer?.height);

    // 캐릭터 설정
    this.character = new Character(this, 10, 0, "dg", 0, this.cursors);

    // npc 생성
    this.friend = new Friend(this, 150, 410, "friend", 0);

    this.cameras.main.startFollow(this.character, false, 1, 1, 0, 100);
    this.cameras.main.setBounds(
      200,
      0,
      groundLayer?.width - 200,
      groundLayer?.height,
      true
    );

    sceneEvents.emit("plotStart");
    // sceneEvents.emit("moveNextScene");
    this.matter.world.setGravity(0.5);
  }

  update(t: number, dt: number): void {
    // 캐릭터의 움직임 추가
    if (this.character) this.character.update(this.cursors);
  }
}
