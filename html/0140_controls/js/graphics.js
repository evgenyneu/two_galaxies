// Initialise the graphics, the canvas and WebGL

import { createProgramFromScripts } from '../../../js/web_gl_utils.js';
import m4 from '../../../js/m4.js';
import { numberOfStarsInAllRingsOneGalaxy } from '../../../js/initial_conditions.js';

// Adjust the canvas to the size of the screen
function fitToContainer(drawData){
  var canvas = drawData.gl.canvas;
  const canvasHeight = Math.min(window.innerHeight, window.innerWidth) - 100;
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

  loadColors(drawData,
    numberOfStarsInAllRingsOneGalaxy(initialParams.numberOfRings[0]),
    numberOfStarsInAllRingsOneGalaxy(initialParams.numberOfRings[1]),
    initialParams.colors
  );

  fitToContainer(drawData);

  // Adjust the canvas size when the browser window is resized
  window.addEventListener('resize', (e) => fitToContainer(drawData));

  return drawData;
}


/**
 * Load star colors into the GPU buffer
 *
 * @param  {object} drawData Draw data
 * @param  {number} stars1    Number of stars in first galaxy (not counting the core)
 * @param  {number} stars2    Number of stars in second galaxy (not counting the core)
 * @param  {array} twoColors  Colors of the two galaxies
 */
function loadColors(drawData, stars1, stars2, twoColors) {
  // Set two different colors for the galaxy cores
  var colors = [twoColors[0], twoColors[1]];

  // Colors of stars in first galaxy
  colors = colors.concat(Array(stars1).fill(colors[0]));

  // ... in second galaxy
  colors = colors.concat(Array(stars2).fill(colors[1]));

  // Make 1D array of numbers
  colors = colors.flat();

  var gl = drawData.gl;

  // Bind ARRAY_BUFFER to the colorBuffer (creates a global variable inside WebGL)
  gl.bindBuffer(gl.ARRAY_BUFFER, drawData.colorBuffer);

  // Write colors to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
}
