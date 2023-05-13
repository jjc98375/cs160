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
var u_Sampler1;
var u_whichTexture;
var u_workingTexture;

var g_camera;

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
  //gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;

    v_UV = a_UV;
  }`;

// Fragment shader program ========================================
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;

  uniform int u_whichTexture;

  void main() {
    if(u_whichTexture == -2){
       gl_FragColor = u_FragColor;                  // Use color
    } else if (u_whichTexture == -1){
       gl_FragColor = vec4(v_UV, 1.0, 1.0);         // Use UV debug color
    } else if(u_whichTexture == 0){
       gl_FragColor = texture2D(u_Sampler0, v_UV);  // Use texture0
    } else if(u_whichTexture == 1){
       gl_FragColor = texture2D(u_Sampler1, v_UV);  // Use texture1
    } else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);  // Use texture2
    }
    
    else {
       gl_FragColor = vec4(1,.2,.2,1);              // Error, Red
    }
  }`;


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

  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
  if (!u_Sampler2) {
    console.log("Failed to get the storage location of u_Sampler2");
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_whichTexture) {
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }

  // var identityM = new Matrix4();
  // gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  // // gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
  // gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
  // gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
}

var body, yellow, magenta;
var c = [];
var K = 10.0;

// Texture Stuff ==================================================
function initTextures() {
  var water = new Image(); // Create the image object
  var suzumesky = new Image(); // Create the image object
  var daijin = new Image();

  if (!water) {
    console.log("Failed to create the image object");
    return false;
  }
  if (!suzumesky) {
    console.log("Failed to create the image1 object");
    return false;
  }
  if (!daijin) {
    console.log("Failed to create the image2 object");
    return false;
  }

  // Register the event handler to be called on loading an image
  water.onload = function () {
    loadTexture(water, u_Sampler0, 0);
  };
  suzumesky.onload = function () {
    loadTexture(suzumesky, u_Sampler1, 1);
  };
  daijin.onload = function () {
    loadTexture(daijin, u_Sampler2, 2);
  };

  // Tell the browser to load an image
  water.src = "animewater.jpg";
  suzumesky.src = "suzumeSky2.jpg";
  daijin.src = "daijin3.jpg";

  return true;
}

function loadTexture(image, sampler, num) {
  var skyTexture = gl.createTexture();
  if (!skyTexture) {
    console.log("Failed to create the skyTexture object");
    return false;
  }

  var groundTexture = gl.createTexture();
  if (!groundTexture) {
    console.log("Failed to create the groundTexture object");
    return false;
  }

  var daijintexture = gl.createTexture();
  if (!daijintexture) {
    console.log("Failed to create the daijintexture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  gl.activeTexture(gl.TEXTURE0 + num); // Enable texture unit0

  // Bind the texture object to the target
  if (num == 0) {
    gl.bindTexture(gl.TEXTURE_2D, skyTexture);
  } else if (num == 1) {
    gl.bindTexture(gl.TEXTURE_2D, groundTexture);
  } else if (num == 2) {
    gl.bindTexture(gl.TEXTURE_2D, daijintexture);
  }

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // Set the texture unit 0 to the sampler
  gl.uniform1i(sampler, num);
}

// Main ===========================================================
function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  g_camera = new Camera();
  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
} // end of main



// Map ============================================================




var g_map = new Array(32);
for (var i = 0; i < 32; i++) {
  g_map[i] = new Array(32);
  for (var j = 0; j < 32; j++) {
    if (i % 7 == 0 && j % 13 == 0) {
      g_map[i][j] = 1;
    } else if ( i == 5 && j == 5) {
      g_map[i][j] = 2;
    } else {
      g_map[i][j] = 0;
    }
  }
}

function drawMap() {
  for (x = 0; x < 32; x++) {
    for (y = 0; y < 32; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = 2;
        body.color = [1.0, 1.0, 1.0, 1.0];
        body.matrix.translate(x - 4, -2, y - 4);
        body.matrix.scale(1, 1, 1); // scale x and z to be thinner, and y to be taller
        body.render();
      } else if (g_map[x][y] == 2) {
        // Draw the body cube
        var body = new Cube();
        body.color = [1.0, 0.0, 0.0, 1.0];
        body.matrix
          .setTranslate(x - 4, -2, y - 4)
          .rotate(-5, 1, 0, 0)
          .scale(0.5, 0.3, 0.5);
        body.render();

        // Draw a left arm
        var yellow = new Cube();
        yellow.color = [1, 1, 0, 1];
        yellow.matrix
          .setTranslate(x - 3.75, -1.7, y - 4)
          .rotate(-5, 1, 0, 0)
          .rotate(-g_yellowAngle, 0, 0, 1);
        var yellowCoordinates = new Matrix4(yellow.matrix);
        yellow.matrix.scale(0.25, 0.7, 0.5).translate(-0.5, 0, 0);
        yellow.render();

        // Test box
        var magenta = new Cube();
        magenta.color = [1, 0, 1, 1];
        magenta.matrix.set(yellowCoordinates);
        magenta.matrix
          .translate(0, 0.65, 0)
          .rotate(g_magentaAngle, 0, 0, 1)
          .scale(0.3, 0.3, 0.3)
          .translate(-0.5, 0, -0.001);
        magenta.render();
      }
    }
  }
}







// Mouse & Keyboard move ===========================================

function keydown(ev) {
  if (ev.keyCode == 68) g_camera.right(); // "D" key
  if (ev.keyCode == 65) g_camera.left(); // "A" key
  if (ev.keyCode == 87) g_camera.forward(); // "W" key
  if (ev.keyCode == 83) g_camera.back(); // "S" key
}

// renderAllShapes =================================================
function renderAllShapes() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(50, (1 * canvas.width) / canvas.height, 0.1, 200);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0],
    g_camera.eye.elements[1],
    g_camera.eye.elements[2],
    g_camera.at.elements[0],
    g_camera.at.elements[1],
    g_camera.at.elements[2],
    g_camera.up.elements[0],
    g_camera.up.elements[1],
    g_camera.up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // ------------------------------------------------------------------
  // Draw Shapes !!! ------------------------------------------------
  // ------------------------------------------------------------------

  // Sky ====================================
  var sky = new Cube();
  sky.color = [0.6, 0.9, 0.95, 1];
  sky.textureNum = 1;
  sky.matrix.scale(30, 30, 30);
  sky.matrix.translate(-0.5, -0.4, -0.5);
  sky.render();

  // Floor ====================================
  var floor = new Cube();
  floor.color = [1.0, 0.0, 0.0, 1.0];
  floor.textureNum = 0;
  floor.matrix.translate(0, -2, 0.0);
  floor.matrix.scale(22, 0, 22);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  // Map ====================================
  drawMap();

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

// ================================================================
// Work from previous sections =====================================
// ================================================================

// HTML ============================================================
function addActionsForHtmlUI() {
  document.getElementById("camera").addEventListener("mousemove", function () {
    g_globalAngle = this.value;
    renderAllShapes();
  });

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
