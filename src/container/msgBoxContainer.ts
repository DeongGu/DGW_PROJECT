import { Scene } from "phaser";

export default class MsgBoxContainer extends Phaser.GameObjects.Container {
  constructor(scene: Scene, x: number, y: number, textContents: string) {
    super(scene, x, y);

    const msgBox = scene.add
      .rectangle(755, 310, 35, 35, 0xe0e0e0, 0.8)
      .setStrokeStyle(2, 0x000000);

    // 좌표(x,y), 텍스트, 폰트사이즈, 폰트 컬러
    const text = scene.add.text(620, 250, textContents, {
      fontSize: 20,
      padding: { x: 10, y: 10 },
      fontFamily: "DNFBitBitv2",
      color: "white",
    });

    // text에 맞춰서 좌표 및 폰트 사이즈 설정, 텍스트, 컬러
    const Ftext = scene.add.text(750, 300, "F", {
      fontSize: 17,
      fontFamily: "DNFBitBitv2",
      color: "black",
    });

    this.add(msgBox);
    this.add(text);
    this.add(Ftext);

    scene.add.existing(this);
    this.close();

    // F키를 눌렸을 때 상호작용 - talkBox open()
    // 캐릭터 움직임이랑 msgBox 반응 안되게 해야함 (별도로 이벤트를 만들지, open 메서드를 수정할 지 선택)
    scene.input.keyboard?.on("keyup-F", () => {
      if (this.visible) {
        scene.events.emit("openTalkBox");
        text.setText("계속 진행하려면 F키를 눌러주세요");
      }
    });
  }

  // 가까이 접근하면 열기, 멀어지면 닫기
  open() {
    this.setVisible(true);
  }
  close() {
    this.setVisible(false);
  }
}
