import { resizeCanvasToDisplaySize } from '../../../js/web_gl_utils.js';
import m3 from '../../../js/m3.js';

export default function drawScene(initData) {
  var gl = initData.gl;
  var program = initData.program;
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);

  var translation = [50, 100];
  matrix = m3.translate(matrix, translation[0], translation[1]);

  // Rotate
  // -------

  var angleInDegrees = 30;
  var angleInRadians = angleInDegrees * Math.PI / 180;
  var rotation = [Math.sin(angleInRadians), Math.cos(angleInRadians)];
  matrix = m3.rotate(matrix, angleInRadians);

  var scale = [1.3, 0.7];
  matrix = m3.scale(matrix, scale[0], scale[1]);

  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(initData.positionLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, initData.positionBuffer);

  // Put geometry data into buffer
  setGeometry(gl);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    initData.positionLocation, size, type, normalize, stride, offset);

  // set the color
  var color = [Math.random(), Math.random(), Math.random(), 1];
  gl.uniform4fv(initData.colorLocation, color);

  // Set the scale.
  gl.uniformMatrix3fv(initData.matrixLocation, false, matrix);

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  offset = 0;
  var count = 18;  // 6 triangles in the 'F', 3 points per triangle
  gl.drawArrays(primitiveType, offset, count);
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        // left column
        0, 0,
        30, 0,
        0, 150,
        0, 150,
        30, 0,
        30, 150,

        // top rung
        30, 0,
        100, 0,
        30, 30,
        30, 30,
        100, 0,
        100, 30,

        // middle rung
        30, 60,
        67, 60,
        30, 90,
        30, 90,
        67, 60,
        67, 90,
    ]),
    gl.STATIC_DRAW);
}
