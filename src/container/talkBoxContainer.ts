import { Scene } from "phaser";
import { Prologue } from "../scenes/Prologue";
import { Plot } from "scenes/Plot";
import { sceneEvents } from "../events/sceneEventEmit";

export default class TalkBoxContainer extends Phaser.GameObjects.Container {
  private gameInstance: Prologue | Plot;
  private timerEvent?: Phaser.Time.TimerEvent;

  private text: Phaser.GameObjects.Text;
  private talkBox: Phaser.GameObjects.Image;
  private mark: Phaser.GameObjects.Triangle;
  private profile: Phaser.GameObjects.Image;
  private nameText: Phaser.GameObjects.Text;

  private isTyping: boolean = false;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    gameInstance: Prologue | Plot
  ) {
    super(scene, x, y);
    this.gameInstance = gameInstance;

    const script = [
      { speaker: "친구", contents: "안녕? Bro.", image: "friend-profile" },
      {
        speaker: "나",
        contents: "안녕, 잘 지내? 머하면서 지내냐?",
        image: "profile",
      },
      {
        speaker: "친구",
        contents: "음... 잘 지내지. 일 그만두고 공부하고 있어.",
        image: "friend-profile",
      },
      { speaker: "나", contents: "오? 무슨 공부?", image: "profile" },
      {
        speaker: "친구",
        contents: "웹(web) 개발자가 되려고",
        image: "friend-profile",
      },
      { speaker: "나", contents: "어, 너 전공 다르지 않아?", image: "profile" },
      {
        speaker: "친구",
        contents: "응, 다르지. 인생은 한 번 뿐이잖아. 하고 싶은 일을 해보려구.",
        image: "friend-profile",
      },
      { speaker: "나", contents: "오! 대박 멋있다.", image: "profile" },
      {
        speaker: "나",
        contents: "나도 내가 하고 싶은 것을 해볼까?",
        image: "profile",
      },
      {
        speaker: "친구",
        contents: "오우 ~ 내가 도와줄게, 따라와봐",
        image: "friend-profile",
      },
    ];

    this.talkBox = scene.add
      .image(0, 0, "talkbox")
      .setOrigin(0)
      .setScale(1, 0.9);

    this.profile = scene.add.image(30, 30, "").setOrigin(0).setScale(0.4);

    this.nameText = scene.add.text(170, 40, "", {
      fontSize: 20,
      padding: { x: 10, y: 10 },
      fontFamily: "DNFBitBitv2",
      color: "rgba(96, 155, 115, 1)",
      backgroundColor: "rgba(0,0,0,0.2)",
    });

    this.text = scene.add
      .text(180, 90, "", {
        fontSize: 30,
        padding: { x: 10, y: 10 },
        fontFamily: "DNFBitBitv2",
        fontStyle: "italic",
        color: "black",
      })
      .setWordWrapWidth(this.talkBox.width * 0.7);

    this.mark = scene.add
      .triangle(900, 180, 0, 0, 30, 0, 15, 15, 0x000000)
      .setOrigin(0);

    this.add(this.talkBox);
    this.add(this.text);
    this.add(this.mark);
    this.add(this.profile);
    this.add(this.nameText);

    this.close();

    scene.add.existing(this);

    sceneEvents.on("openTalkBox", this.open, this);

    const script1 = [
      {
        speaker: "친구",
        contents: "저기 절벽 끝으로 가봐.",
        image: "friend-profile",
      },
      {
        speaker: "나",
        contents: "???",
        image: "profile",
      },
    ];

    sceneEvents.on(
      "lastTalk",
      () => {
        scene.tweens.add({
          targets: this,
          duration: 2000,
          callbacks: () => {
            this.open();
            this.showNextScript(script1);
          },
          onComplete: () => {
            sceneEvents.emit("beforeFall");
          },
        });
      },
      this
    );

    let idx = 0;

    scene.input.keyboard?.on(
      "keyup-F",
      () => {
        if (idx === script.length) {
          sceneEvents.emit("moveNextScene");
          this.close();
          return;
        }
        if (this.isTyping) {
          return;
        }
        this.profile.setTexture(script[idx].image);
        this.nameText.setText(script[idx].speaker);
        this.typewriteText(script[idx].contents);
        idx++;
      },
      this
    );
  }

  private showNextScript(script: any[]) {
    let idx = 0;

    const showNext = () => {
      if (idx >= script.length) {
        return;
      }
      this.nameText.setText(script[idx].speaker);
      this.profile.setTexture(script[idx].image);
      this.typewriteText(script[idx].contents, () => {
        idx++;
        if (idx < script.length) {
          showNext();
        } else {
          setTimeout(() => this.close(), 1000);
        }
      });
    };

    showNext();
  }

  private typewriteText(text: string, onComplete?: () => void) {
    this.text.text = "";

    if (this.timerEvent) {
      this.timerEvent.destroy();
      this.timerEvent = undefined;
    }

    const length = text.length;
    let i = 0;
    this.timerEvent = this.scene.time.addEvent({
      callback: () => {
        this.isTyping = true;
        this.text.text += text[i];
        ++i;

        if (i === length) {
          this.isTyping = false;
          if (onComplete) onComplete();
        }
      },
      repeat: length - 1,
      delay: 100,
    });
  }

  open() {
    this.setVisible(true);
    this.gameInstance.cursors = null;
  }

  close() {
    this.setVisible(false);
  }
}
