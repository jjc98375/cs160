class Triangle
{
  constructor(x, y, rgba, size)
  {
    this.x = x;
    this.y = y;
    this.rgba = rgba;
    this.size = size;
  }

  render()
  {
    let x = this.x;
    let y = this.y;
    let rgba = this.rgba;
    let size = this.size;
 
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size
    gl.uniform1f(u_Size, size)

    let d = size/200
    drawTriangle([x,y+d, x-d,y-d, x+d,y-d])
  }
}



function drawTriangle(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) 
  {
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

function drawTriangle3D(vertices) {
  var n = vertices.length/3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) 
  {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);

}

var vertexBuffer = null
function initTriangles()
{
    // Create a buffer object
  vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) 
  {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);


  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);
}

function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length/3; // The number of vertices
  
  initTriangles();

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);


  var uvBuffer = gl.createBuffer();
  if (!uvBuffer)
  {
    console.log('Failed to create buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_UV)

  gl.drawArrays(gl.TRIANGLES, 0, n);

}