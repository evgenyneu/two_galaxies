import { resizeCanvasToDisplaySize } from '../../../js/web_gl_utils.js';
import m4 from '../../../js/m4.js';

export default function drawScene(initData, settings) {
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

  // Translate, scale and rotate
  // ---------

  // Compute the projection matrix
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 1;
  var zFar = 2000;
  var fieldOfViewRadians = degToRad(60);
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  var numFs = 5;
  var radius = 200;

  // Compute a matrix for the camera
  // ------------

  var cameraAngleRadians = degToRad(settings.cameraAnglesDegrees[0]);
  var cameraMatrix = m4.xRotation(cameraAngleRadians);

  cameraAngleRadians = degToRad(settings.cameraAnglesDegrees[1]);
  cameraMatrix = m4.yRotate(cameraMatrix, cameraAngleRadians);

  cameraAngleRadians = degToRad(settings.cameraAnglesDegrees[2]);
  cameraMatrix = m4.zRotate(cameraMatrix, cameraAngleRadians);

  cameraMatrix = m4.translate(
    cameraMatrix, 0, 0, radius * settings.cameraDistance);

  // Make a view matrix from the camera matrix.
  var viewMatrix = m4.inverse(cameraMatrix);

  // Compute a view projection matrix
  var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  for (var ii = 0; ii < numFs; ++ii) {
    var angle = ii * Math.PI * 2 / numFs;
    var x = Math.cos(angle) * radius;
    var y = Math.sin(angle) * radius;

    // starting with the view projection matrix
    // compute a matrix for the F
    var matrix = m4.translate(viewProjectionMatrix, x, 0, y);

    // Set the matrix.
    gl.uniformMatrix4fv(initData.matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    offset = 0;
    var count = 16 * 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

function degToRad(d) {
  return d * Math.PI / 180;
}
