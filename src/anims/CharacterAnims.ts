const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers("dg", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "turn",
    frames: [{ key: "dg", frame: 4 }],
    frameRate: 10,
  });

  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers("dg", {
      start: 5,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "fall",
    frames: anims.generateFrameNames("fall", {
      start: 0,
      end: 11,
    }),
    frameRate: 12,
    repeat: -1,
  });

  anims.create({
    key: "rolling",
    frames: anims.generateFrameNames("rolling", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "landing",
    frames: anims.generateFrameNames("landing", {
      start: 0,
      end: 1,
    }),
    frameRate: 1,
    repeat: 0,
  });
};

export { createCharacterAnims };
