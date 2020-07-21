import { resizeCanvasToDisplaySize } from '../../../js/web_gl_utils.js';
import m4 from '../../../js/m4.js';

export default function drawScene(drawData, settings, positions) {
  storePositions(drawData, positions);

  var gl = drawData.gl;
  var program = drawData.program;
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
  gl.enableVertexAttribArray(drawData.positionLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, drawData.positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    drawData.positionLocation, size, type, normalize, stride, offset);

  // Translate, scale and rotate
  // ---------

  // Compute the projection matrix
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 1;
  var zFar = 2000;
  var fieldOfViewRadians = degToRad(60);
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  // Distance of the camera from the origin
  var radius = 50;

  // Compute a matrix for the camera
  // ------------

  // Get the camera's position from the matrix we computed
  var cameraPosition = [ 0, 0, radius * settings.cameraDistance ];

  var up = [0, 1, 0];

  // Compute the camera's matrix looking at the center of mass at the origin
  var target = [0, 0, 0];
  var cameraMatrix = m4.lookAt(cameraPosition, target, up);

  // Make a view matrix from the camera matrix.
  var viewMatrix = m4.inverse(cameraMatrix);

  // Compute a view projection matrix
  var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  // Set the matrix.
  var uMatrix = m4.multiply(viewProjectionMatrix, settings.rotateState.worldMatrix);
  gl.uniformMatrix4fv(drawData.matrixLocation, false, uMatrix);

  // Draw the geometry.
  var primitiveType = gl.POINTS;
  offset = 0;
  var numberOfBodies = positions.length;
  gl.drawArrays(primitiveType, offset, numberOfBodies);
}

// Load positions of stars into GPU memory
function storePositions(drawData, positions) {
  var gl = drawData.gl;

  // Bind ARRAY_BUFFER to the positionBuffer
  // (creates a global variable inside WebGL)
  gl.bindBuffer(gl.ARRAY_BUFFER, drawData.positionBuffer);

  const numberOfBodies = positions.length;
  positions = positions.flat();
  positions = new Float32Array(positions);

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

function degToRad(d) {
  return d * Math.PI / 180;
}
