const createFriendAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "friend-left",
    frames: anims.generateFrameNumbers("friend", {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "friend-turn",
    frames: [{ key: "friend", frame: 4 }],
    frameRate: 10,
  });

  anims.create({
    key: "friend-right",
    frames: anims.generateFrameNumbers("friend", {
      start: 5,
      end: 8,
    }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "friend-hello",
    frames: anims.generateFrameNumbers("hello", {
      start: 0,
      end: 1,
    }),
    frameRate: 5,
    repeat: -1,
  });
};

export { createFriendAnims };
