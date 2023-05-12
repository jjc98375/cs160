// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
var gl;
var canvas;
var a_Position;
var a_UV;
var u_FragColor;
var u_Size;
var u_ModelMatrix;
var u_ProjectionMatrix;
var u_ViewMatrix;
var u_GlobalRotateMatrix;
var u_Sampler0;
var u_whichTexture;
var u_workingTexture;

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
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
  //  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;

    v_UV = a_UV;
  }`;

// Fragment shader program ========================================
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;

  void main() {



    


    if(u_whichTexture == -2) { //use color
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) { //use uv debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if(u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else {
      gl_FragColor = vec4(1, .2, .2, 1);
    }



    //  gl_FragColor = u_FragColor;
    //  gl_FragColor = vec4(v_UV, 1.0, 1.0);
    // gl_FragColor = texture2D(u_Sampler0, v_UV);
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
  if (!canvas) {
    console.log("Failed to retrieve the <canvas> element");
    return;
  }

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

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (a_UV < 0) {
    console.log("Failed to get the storage location of a_UV");
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get u_ViewMatrix");
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log("Failed to get u_ProjectionMatrix");
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_whichTexture) {
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  // gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
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

// Texture Stuff ==================================================
function initTextures() {
  var image = new Image();
  if (!image) {
    console.log("Failed to create the image object");
    return false;
  }
  image.onload = function () {
    sendImageToTexture0(image);
  };
  image.src = "sky2.jpg";

  return true;
}

function sendImageToTexture0(image) {
  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

  console.log("finished loadTexture");
}

// Main ===========================================================
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
} // end of main

var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];


function keydown(ev) {
  if (ev.keyCode == 37) {
    g_eye[0] += 0.2;

  } else {
    if (ev.keyCode = 39) {
      g_eye[0] -= 0.2;
    }
  }
  renderAllShapes();
  console.log(ev.keyCode);
}

// renderAllShapes =================================================
function renderAllShapes() {
  var startTime = performance.now();

  // pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, 1 * canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);  // eye, lookat, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // ------------------------------------------------------------------
  // Draw Shapes !!! ------------------------------------------------
  // ------------------------------------------------------------------
  
  // Draw the floor
  // var body = new Cube();
  // body.color = [1.0, 0.0, 0.0, 1.0];
  // body.textureNum = 0;
  // body.matrix.translate(0, -0.75, 0.0);
  // body.matrix.scale(10, 0, 10);
  // body.matrix.translate(-0.5, 0, -0.5);
  // body.render();

  // Draw the body cube
  body = new Cube();
  body.textureNum = 0;
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix
    .setTranslate(-0.25, -0.75, 0.0)
    .rotate(-5, 1, 0, 0)
    .scale(0.5, 0.3, 0.5);
  body.render();

  // Draw a left arm
  yellow = new Cube();
  yellow.textureNum = -1;
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
  magenta.textureNum = -2;
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
  // ------------------------------------------------------------------
  // Draw Shapes !!! ------------------------------------------------
  // ------------------------------------------------------------------
}

function sendTextToHTML(text, htmlID) {
  var htmlElment = document.getElementById(htmlID);
  if (!htmlElment) {
    console.log("Failed to get the storage location of " + htmlID);
    return;
  }
  htmlElment.innerHTML = text;
}
