class Cube {
  constructor() {
    this.type = "cube";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }


  render() {
    var rgba = this.color;

    // gl.uniform1i(u_whichTexture, this.textureNum);

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Front of Cube
    drawTriangle3DUV([0.0,1.0,0.0, 1.0,1.0,0.0, 0.0,0.0,0.0 ], [0,0, 1,0, 1,1]);
    drawTriangle3DUV([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,1.0,0.0 ], [0,1, 1,1, 0,0]);
    // Back
    drawTriangle3DUV([0.0,1.0,1.0, 1.0,1.0,1.0, 0.0,0.0,1.0 ],[0,0, 1,0, 1,1]);
    drawTriangle3DUV([0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0 ],[0,1, 1,1, 0,0]);
    // Top
    drawTriangle3DUV([0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0 ], [0,0, 1,0, 1,1]);
    drawTriangle3DUV([0.0,1.0,1.0, 0.0,1.0,0.0, 1.0,1.0,1.0 ], [0,1, 1,1, 0,0]);
    // Bottom
    drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,0.0 ], [0,0, 1,0, 1,1]);
    drawTriangle3DUV([1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0 ], [0,1, 1,1, 0,0]);
    // Left
    drawTriangle3DUV([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0 ],[0,0, 1,0, 1,1]);
    drawTriangle3DUV([0.0,1.0,1.0, 0.0,0.0,0.0, 0.0,0.0,1.0 ],[0,1, 1,1, 0,0]);
    // Right
    drawTriangle3DUV([1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0 ],[0,0, 1,0, 1,1]);
    drawTriangle3DUV([1.0,1.0,1.0, 1.0,0.0,0.0, 1.0,0.0,1.0 ],[0,1, 1,1, 0,0]);


    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  }

  


}
