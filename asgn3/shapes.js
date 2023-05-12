function drawShape() {
  // Draw the body cube
  body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix
    .setTranslate(-0.25, -0.75, 0.0)
    .rotate(-5, 1, 0, 0)
    .scale(0.5, 0.3, 0.5);
  body.render();

  // Draw a left arm
  yellow = new Cube();
  yellow.color = [1, 1, 0, 1];
  yellow.matrix
    .setTranslate(0, -0.5, 0.0)
    .rotate(-5, 1, 0, 0)
    .rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinates = new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.25, 0.7, 0.5).translate(-0.5, 0, 0);
  yellow.render();

  // Test box
  magenta = new Cube();
  magenta.color = [1, 0, 1, 1];
  magenta.matrix.set(yellowCoordinates);
  magenta.matrix
    .translate(0, 0.65, 0)
    .rotate(g_magentaAngle, 0, 0, 1)
    .scale(0.3, 0.3, 0.3)
    .translate(-0.5, 0, -0.001);
  magenta.render();

  for (var i = 0; i < K; i++) {
    c[i] = new Cube();
  }
  for (var i = 1; i < K; i++) {
    c[i].matrix
      .setTranslate(-0.8, (1.9 * i) / K - 1.0, 0)
      .rotate(g_seconds * 100, 1, 1, 1)
      .scale(0.1, 0.5 / K, 1.0 / K);
    c[i].render();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML(
    " ms: " +
      Math.floor(duration) +
      " fps: " +
      Math.floor(10000 / duration) / 10,
    "numdot"
  );
}
