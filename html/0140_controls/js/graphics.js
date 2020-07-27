// Initialise the graphics, the canvas and WebGL

import { createProgramFromScripts } from '../../../js/web_gl_utils.js';
import m4 from './simulation/m4.js';
import { numberOfStarsInAllRingsOneGalaxy } from './simulation/initial_conditions.js';

// Adjust the canvas to the size of the screen
function fitToContainer(drawData){
  var canvas = drawData.gl.canvas;
  const canvasHeight = Math.min(window.innerHeight, window.innerWidth) - 150;
  document.querySelector(".TwoGalaxies-container").style.height = canvasHeight + 'px';

  canvas.style.height = canvasHeight + 'px';

  var realToCSSPixels = window.devicePixelRatio;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawing buffer match it in
  // device pixels.
  var displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
  var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

  // Check if the canvas is not the same size.
  if (canvas.width  !== displayWidth ||
      canvas.height !== displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

export function initGraphics(initialParams) {
  // Get canvas object
  var canvas = document.querySelector(".TwoGalaxies-canvas");
  var gl = canvas.getContext("webgl");

  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Create two shaders
  // ---------

  var program = createProgramFromScripts(
    gl, [".Webgl-vertexShader2d", ".Webgl-fragmentShader2d"]);

  // Lookup location of the position attribute for the program
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getAttribLocation(program, "a_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer (attributes get their data from buffers)
  var positionBuffer = gl.createBuffer();
  var colorBuffer = gl.createBuffer();

  var drawData = {
    gl: gl,
    program: program,
    positionLocation: positionLocation,
    positionBuffer: positionBuffer,
    colorLocation: colorLocation,
    colorBuffer: colorBuffer,
    matrixLocation: matrixLocation
  };

  loadColors(drawData, initialParams);
  fitToContainer(drawData);

  // Adjust the canvas size when the browser window is resized
  window.addEventListener('resize', (e) => fitToContainer(drawData));

  return drawData;
}


/**
 * Load star colors into the GPU buffer
 *
 * @param  {object} drawData Draw data
 * @param  {object} initialParams Initial parameters of the simulation
 * @param  {array} twoColors  Colors of the two galaxies
 */
export function loadColors(drawData, initialParams) {
  // Calculate the number of stars in each galaxy
  let stars1 = numberOfStarsInAllRingsOneGalaxy(initialParams.numberOfRings[0]);
  let stars2 = numberOfStarsInAllRingsOneGalaxy(initialParams.numberOfRings[1]);

  // Total number of bodies
  let bodies = 2 + stars1 + stars2;

  let twoColors = initialParams.colors;
  var colors = new Uint8Array(bodies * 3);

  // Core 1
  colors[0] = twoColors[0][0];
  colors[1] = twoColors[0][1];
  colors[2] = twoColors[0][2];

  // Core 2
  colors[3] = twoColors[1][0];
  colors[4] = twoColors[1][1];
  colors[5] = twoColors[1][2];

  // Stars of first galaxy
  for(let i = 0; i < stars1; i++) {
    colors[6 + i * 3 + 0] = twoColors[0][0];
    colors[6 + i * 3 + 1] = twoColors[0][1];
    colors[6 + i * 3 + 2] = twoColors[0][2];
  }

  // Stars of second galaxy
  for(let i = 0; i < stars2; i++) {
    colors[6 + i * 3 + stars1 * 3 + 0] = twoColors[1][0];
    colors[6 + i * 3 + stars1 * 3 + 1] = twoColors[1][1];
    colors[6 + i * 3 + stars1 * 3 + 2] = twoColors[1][2];
  }

  var gl = drawData.gl;

  // Bind ARRAY_BUFFER to the colorBuffer (creates a global variable inside WebGL)
  gl.bindBuffer(gl.ARRAY_BUFFER, drawData.colorBuffer);

  // Write colors to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
}
