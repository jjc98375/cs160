// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
var gl;
var canvas;
var a_Position;
var u_FragColor;
var u_Size;
var u_ModelMatrix;
var u_GlobalRotateMatrix;

// Array
var g_shapesList = [];

// UI
let g_selectedColor = [0.5, 0.5, 0.5, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedsCount = 12;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

var drag = false;

// Vertex shader program ==========================================
var VSHADER_SOURCE = `attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program ========================================
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Click ==========================================================
// function click(ev) {
//   var [x, y] = convertCoordinatesEventToGL(ev);
//   var point;
//   if (g_selectedType == POINT) {
//     point = new Point();
//   } else if (g_selectedType == TRIANGLE) {
//     point = new Triangle();
//   } else if (g_selectedType == CIRCLE) {
//     point = new Circle();
//     point.sCount = g_selectedsCount;
//   }

//   point.position = [x, y];
//   point.color = g_selectedColor.slice();
//   point.size = g_selectedSize;
//   g_shapesList.push(point);

//   // Draw every shape that is suppose to be in the canvas
//   renderAllShapes();
// }

// HTML ============================================================
function addActionsForHtmlUI() {
  document.getElementById("animationYellowOffButton").onclick = function () {
    g_yellowAnimation = false;
  };
  document.getElementById("animationYellowOnButton").onclick = function () {
    g_yellowAnimation = true;
  };
  document.getElementById("animationMagentaOffButton").onclick = function () {
    g_magentaAnimation = false;
  };
  document.getElementById("animationMagentaOnButton").onclick = function () {
    g_magentaAnimation = true;
  };

  document
    .getElementById("magentaSlide")
    .addEventListener("mousemove", function () {
      g_magentaAngle = this.value;
      renderAllShapes();
    });
  document
    .getElementById("yellowSlide")
    .addEventListener("mousemove", function () {
      g_yellowAngle = this.value;
      renderAllShapes();
    });

  document
    .getElementById("angleSlide")
    .addEventListener("mousemove", function () {
      g_globalAngle = this.value;
      renderAllShapes();
    });
}

// Get Canvas and GL Context ======================================
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

// Compile Shader Programs and connect js to GLSL =================
function connectVariablesToGLSL() {
  // Initialize shaders ==========================================
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // Get the storage location of attribute variable ==============
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Get the storage location of attribute variable ==============
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get u_FragColor");
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get u_ModelMatrix");
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get u_GlobalRotateMatrix");
    return;
  }

  // Set an initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  // u_Size = gl.getUniformLocation(gl.program, "u_Size");
  // if (!u_Size) {
  //   console.log("Failed to get u_Size");
  //   return;
  // }
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

// Called by browser repeatedly whenever its time
function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}

// update animation angles ========================================
function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = 45 * Math.sin(g_seconds);
  }
  if (g_magentaAnimation) {
    g_magentaAngle = 45 * Math.sin(3 * g_seconds);
  }
}

// Get Coordinates =================================================
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  // set coordinates based on origin
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  // Print coordinate in console
  // console.log("("+x+","+y+")");

  return [x, y];
}

var body, yellow, magenta;
var c = [];
var K = 10.0;

// Main ===========================================================
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Initialize body, yellow, magenta, and c[] first outside of the renderAllShapes() function
  // and optimize the algorithm
  body = new Cube();
  yellow = new Cube();
  magenta = new Cube();
  for (var i = 0; i < K; i++) {
    c[i] = new Cube();
  }

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function (ev) {
    click(ev);
    drag = true;
  };
  canvas.onmouseup = function (ev) {
    drag = false;
  };
  canvas.onmousemove = function (ev) {
    if (drag) {
      click(ev);
    }
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
} // end of main

// renderAllShapes =================================================
function renderAllShapes() {
  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the body cube
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix
    .setTranslate(-0.25, -0.75, 0.0)
    .rotate(-5, 1, 0, 0)
    .scale(0.5, 0.3, 0.5);
  body.render();

  // Draw a left arm
  yellow.color = [1, 1, 0, 1];
  yellow.matrix
    .setTranslate(0, -0.5, 0.0)
    .rotate(-5, 1, 0, 0)
    .rotate(-g_yellowAngle, 0, 0, 1);
  var yellowCoordinates = new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.25, 0.7, 0.5).translate(-0.5, 0, 0);
  yellow.render();

  // Test box
  magenta.color = [1, 0, 1, 1];
  magenta.matrix.set(yellowCoordinates);
  magenta.matrix
    .translate(0, 0.65, 0)
    .rotate(g_magentaAngle, 0, 0, 1)
    .scale(0.3, 0.3, 0.3)
    .translate(-0.5, 0, -0.001);
  magenta.render();

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

function sendTextToHTML(text, htmlID) {
  var htmlElment = document.getElementById(htmlID);
  if (!htmlElment) {
    console.log("Failed to get the storage location of " + htmlID);
    return;
  }
  htmlElment.innerHTML = text;
}
