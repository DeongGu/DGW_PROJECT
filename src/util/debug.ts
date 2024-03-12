const debugDraw = (
  layer: Phaser.Tilemaps.TilemapLayer,
  scene: Phaser.Scene
) => {
  const debugGraphics = scene.add.graphics().setAlpha(0.75);
  layer.renderDebug(debugGraphics, {
    tileColor: null, // 충돌하지 않는 타일 색상
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // 충돌하는 타일 색상
    faceColor: new Phaser.Display.Color(40, 39, 37, 255), // 충돌하는 면, 모서리의 색상
  });
};

export { debugDraw };
