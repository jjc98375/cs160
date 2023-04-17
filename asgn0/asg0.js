// DrawRectangle.js
function main() {
  // Retrieve <canvas> element <- (1)
  var canvas = document.getElementById("example");
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }

  // Get the rendering context for 2DCG <- (2)
  var ctx = canvas.getContext("2d");

  // Draw a blue rectangle <- (3)
  ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
}

function angleBetween(v1, v2) {
  const dotProduct = Vector3.dot(v1, v2);
  const magnitudeV1 = v1.magnitude();
  const magnitudeV2 = v2.magnitude();
  const cosAlpha = dotProduct / (magnitudeV1 * magnitudeV2);
  const angleRadians = Math.acos(cosAlpha);
  const angleDegrees = angleRadians * (180 / Math.PI);
  return angleDegrees;
}

function areaTriangle(v1, v2) {
  const crossProduct = Vector3.cross(v1, v2);
  const area = crossProduct.magnitude() / 2;
  return area;
}

function drawVector(canvas, ctx, v, color) {
  let cx = canvas.width / 2;
  let cy = canvas.height / 2;

  ctx.strokeStyle = color;
  ctx.lineWidth = "3";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + v.elements[0], cy + v.elements[1]);
  ctx.stroke();
}

function handleDrawEvent() {
  var canvas = document.getElementById("example");
  var ctx = canvas.getContext("2d");

  // Draw a black triangle
  ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

  let v1_dx = document.getElementById("v1x").value;
  let v1_dy = document.getElementById("v1y").value;

  let v2_dx = document.getElementById("v2x").value;
  let v2_dy = document.getElementById("v2y").value;

  let v = new Vector3([v1_dx, v1_dy, 0]);
  let v2 = new Vector3([v2_dx, v2_dy, 0]);

  drawVector(canvas, ctx, v, "red");
  drawVector(canvas, ctx, v2, "blue");
}

function handleDrawOperationEvent() {
  var canvas = document.getElementById("example");
  var ctx = canvas.getContext("2d");

  // Draw a black triangle
  ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

  let v1_dx = document.getElementById("v1x").value;
  let v1_dy = document.getElementById("v1y").value;

  let v2_dx = document.getElementById("v2x").value;
  let v2_dy = document.getElementById("v2y").value;

  let v1 = new Vector3([v1_dx, v1_dy, 0]);
  let v2 = new Vector3([v2_dx, v2_dy, 0]);

  drawVector(canvas, ctx, v1, "red");
  drawVector(canvas, ctx, v2, "blue");

  const operation = document.getElementById("operation").value;
  const scalar = document.getElementById("scalar").value;

  if (operation === "add" || operation === "sub") {
    const v3 = operation === "add" ? v1.add(v2) : v1.sub(v2);
    drawVector(canvas, ctx, v3, "green");
  } else if (operation === "mul" || operation === "div") {
    const v3 = operation === "mul" ? v1.mul(scalar) : v1.div(scalar);
    const v4 = operation === "mul" ? v2.mul(scalar) : v2.div(scalar);
    drawVector(canvas, ctx, v3, "green");
    drawVector(canvas, ctx, v4, "green");
  } else if (operation === "magnitude") {
    console.log("v1 magnitude:", v1.magnitude());
    console.log("v2 magnitude:", v2.magnitude());
  } else if (operation === "normalize") {
    const v3 = v1.normalize();
    const v4 = v2.normalize();
    drawVector(canvas, ctx, v3, "green");
    drawVector(canvas, ctx, v4, "green");
  } else if (operation === "angleBetween") {
    const angle = angleBetween(v1, v2);
    console.log("Angle between v1 and v2: ", angle);
  } else if (operation === "area") {
    const area = areaTriangle(v1, v2);
    console.log("Area of triangle:", area);
  }
}
