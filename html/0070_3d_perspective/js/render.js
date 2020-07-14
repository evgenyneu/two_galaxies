import { resizeCanvasToDisplaySize } from '../../../js/web_gl_utils.js';
import m4 from '../../../js/m4.js';

export default function drawScene(initData) {
  var gl = initData.gl;
  var program = initData.program;
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas AND the depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Turn on culling. By default backfacing triangles
  // will be culled.
  gl.enable(gl.CULL_FACE);

  // Enable the depth buffer
  gl.enable(gl.DEPTH_TEST);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(initData.positionLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, initData.positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    initData.positionLocation, size, type, normalize, stride, offset);

  // Color
  // ----------

  // Turn on the color attribute
  gl.enableVertexAttribArray(initData.colorLocation);

  // Bind the color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, initData.colorBuffer);

  // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  size = 3;                 // 3 components per iteration
  type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
  normalize = true;         // normalize the data (convert from 0-255 to 0-1)
  stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
  offset = 0;               // start at the beginning of the buffer
  gl.vertexAttribPointer(
    initData.colorLocation, size, type, normalize, stride, offset);

  // Translate, scale and rotate
  // ---------

  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 1;
  var zFar = 2000;
  var fieldOfViewRadians = degToRad(30);
  var matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  var translation = [0, 0, -1000];
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);

  var rotation = [degToRad(20), degToRad(10), degToRad(-30)];
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);

  var scale = [1.3, 0.7, 0.9];
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

  // Set the matrix
  gl.uniformMatrix4fv(initData.matrixLocation, false, matrix);

  // Draw the rectangle.
  var primitiveType = gl.TRIANGLES;
  offset = 0;
  var count = 16 * 6;  // 6 triangles in the 'F', 3 points per triangle
  gl.drawArrays(primitiveType, offset, count);
}

function degToRad(d) {
  return d * Math.PI / 180;
}
