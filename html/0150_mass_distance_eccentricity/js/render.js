// Draw the stars on screen on each frame of animation

import m4 from './simulation/m4.js';


/**
 * Draw trajectories of the two galaxy cores.
 *
 * @param  {object} drawData      Drawing data
 * @param  {object} initialParams Initial parameters of the animation.
 * @param  {object} currentParams Current parameters of the animation.
 * @param  {array} uMatrix Matrix for transforming coordinates.
 */
function drawTrajectories(drawData, initialParams, currentParams, uMatrix) {
  let gl = drawData.gl;
  var program = drawData.trajectories.program;

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Position
  // ----------

  // Turn on the attribute
  gl.enableVertexAttribArray(drawData.trajectories.positionLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, drawData.trajectories.positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    drawData.trajectories.positionLocation, size, type,
    normalize, stride, offset);

  // Store the transformation matrix
  gl.uniformMatrix4fv(drawData.trajectories.matrixLocation, false, uMatrix);

  // Draw the trajectory of each galaxy core
  for (let iTrajectory = 0; iTrajectory < 2; iTrajectory++) {
    storeTrajectories(drawData, currentParams, iTrajectory);

    var color = initialParams.trajectoryColors[iTrajectory];

    // Set the color
    gl.uniform4fv(drawData.trajectories.colorLocation, color);

    // Draw the path of the core with lines
    var primitiveType = gl.LINE_STRIP;
    offset = 0;
    var numberOfPoints = currentParams.trajectoriesState.points;
    gl.drawArrays(primitiveType, offset, numberOfPoints);
  }
}

// Load trajectories of galaxy cores into GPU memory
function storeTrajectories(drawData, currentParams, coreId) {
  var gl = drawData.gl;

  // Bind ARRAY_BUFFER to the positionBuffer
  // (creates a global variable inside WebGL)
  gl.bindBuffer(gl.ARRAY_BUFFER, drawData.trajectories.positionBuffer);

  let positions = new Float32Array(currentParams.trajectoriesState.trajectories[coreId]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

export default function drawScene(drawData, initialParams, currentParams) {
  var positions = currentParams.positions;
  storePositions(drawData, positions);

  var gl = drawData.gl;
  var program = drawData.program;

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

  // Position
  // ----------

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

  // Color
  // ----------

  // Turn on the color attribute
  gl.enableVertexAttribArray(drawData.colorLocation);

  // Bind the color buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, drawData.colorBuffer);

  // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  size = 3;                 // 3 components per iteration
  type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
  normalize = true;         // normalize the data (convert from 0-255 to 0-1)
  stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
  offset = 0;               // start at the beginning of the buffer
  gl.vertexAttribPointer(
    drawData.colorLocation, size, type, normalize, stride, offset);

  // Compute transformation matrix
  // ---------

  // Compute the projection matrix
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 1;
  var zFar = 100000;

  var projectionMatrix = m4.perspective(
    currentParams.zoomState.fieldOfViewRadians, aspect, zNear, zFar);

  // Compute a matrix for the camera
  // ------------

  // Get the camera's position from the matrix we computed
  var cameraPosition = [ 0, 0, currentParams.cameraDistance ];

  var up = [0, 1, 0];

  // Compute the camera's matrix looking at the center of mass at the origin
  var target = [0, 0, 0];
  var cameraMatrix = m4.lookAt(cameraPosition, target, up);

  // Make a view matrix from the camera matrix.
  var viewMatrix = m4.inverse(cameraMatrix);

  // Compute a view projection matrix
  var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  // Set the matrix.
  var uMatrix = m4.multiply(viewProjectionMatrix, currentParams.rotationMatrix);
  gl.uniformMatrix4fv(drawData.matrixLocation, false, uMatrix);

  // Draw the geometry.
  var primitiveType = gl.POINTS;
  offset = 0;
  var numberOfBodies = positions.length / 3;
  gl.drawArrays(primitiveType, offset, numberOfBodies);

  drawTrajectories(drawData, initialParams, currentParams, uMatrix);
}

// Load positions of stars into GPU memory
function storePositions(drawData, positions) {
  var gl = drawData.gl;

  // Bind ARRAY_BUFFER to the positionBuffer
  // (creates a global variable inside WebGL)
  gl.bindBuffer(gl.ARRAY_BUFFER, drawData.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}
