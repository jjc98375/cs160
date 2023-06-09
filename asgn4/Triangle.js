class Triangle{
  constructor(){
     this.color = [1.0, 1.0, 1.0, 1.0];
     this.matrix = new Matrix4();
  }

  render() {
     var rgba = this.color;

     // Pass the color of a point to u_FragColor variable
     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

     // Pass the matrix to u_ModelMatrix attribute
     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

     // Front Triangle
     drawTriangle3D([-0.5,0.0,0.0, 0.0,1.0,0.0, 0.5,0.0,0.0 ]);
     //Back Triangle
     drawTriangle3D([-0.5,0.0,0.25, 0.0,1.0,0.25, 0.5,0.0,0.25 ]);
     // Left
     drawTriangle3D([-0.5,0.0,0.25, 0.0,1.0,0.25, 0.0,1.0,0.0 ]);
     drawTriangle3D([-0.5,0.0,0.25, -0.5,0.0,0.0, 0.0,1.0,0.0 ]);
     // Right
     drawTriangle3D([0.5,0.0,0.25, 0.0,1.0,0.25, 0.0,1.0,0.0 ]);
     drawTriangle3D([0.5,0.0,0.25, 0.5,0.0,0.0, 0.0,1.0,0.0 ]);
     // Bottom
     drawTriangle3D([0.5,0.0,0.0, 0.5,0.0,0.25, -0.5,0.0,0.0 ]);
     drawTriangle3D([-0.5,0.0,0.25, -0.5,0.0,0.0, 0.5,0.0,0.0 ]);

     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
     }
}

function drawTriangle(vertices){
  var n = 3;
  var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
     console.log('Failed to create the buffer object');
     return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}


var g_vertexBuffer = null;

function initTriangle3D() {
   var vertexBuffer = gl.createBuffer();
   if(!vertexBuffer){
      console.log('Failed to create the buffer object');
      return -1;
   }
 
   // Bind the buffer object to target
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); 
   // Assign the buffer object to a_Position variable
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
 
   // Enable the assignment to a_Position variable
   gl.enableVertexAttribArray(a_Position);
 
}


function drawTriangle3D(vertices){
   var n = vertices.length / 3;
   if (g_vertexBuffer == null) {
      initTriangle3D();
   }
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
   gl.drawArrays(gl.TRIANGLES, 0, n);
}



function initTriangle3DUV(vertices, uv){
   // Vertex Buffer
   var vertexBuffer = gl.createBuffer();
   if(!vertexBuffer){
      console.log('Failed to create the buffer object');
      return -1;
   }
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(a_Position);

   // UV Buffer
   var uvBuffer = gl.createBuffer();
   if(!uvBuffer){
      console.log('Failed to create the buffer object');
      return -1;
   }
   gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
   gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(a_UV);
}

function drawTriangle3DUV(vertices, uv){
   initTriangle3DUV(vertices, uv);
   gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
   g_vertexBuffer = null;
}

function initTriangle3DUVNormal(vertices, uv, normals){
   // Initialize Vertex and UV buffers
   initTriangle3DUV(vertices, uv);

   // Normal Buffer
   var normalBuffer = gl.createBuffer();
   if(!normalBuffer){
      console.log('Failed to create the buffer object');
      return -1;
   }
   gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
   gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(a_Normal);
}

function drawTriangle3DUVNormal(vertices, uv, normals){
   initTriangle3DUVNormal(vertices, uv, normals);
   gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
   g_vertexBuffer=null;
}

