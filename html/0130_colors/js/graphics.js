import * as init from '../../../js/initial_conditions.js';

import { createProgramFromScripts } from '../../../js/web_gl_utils.js';
import m4 from '../../../js/m4.js';

// Adjust the canvas to the size of the screen
function fitToContainer(drawData){
  var canvas = drawData.gl.canvas;
  const canvasHeight = Math.min(window.innerHeight, window.innerWidth) - 100;
  document.querySelector(".TwoGalaxies-container").style.height = canvasHeight + 'px';

  canvas.style.height = canvasHeight + 'px';

  var realToCSSPixels = window.devicePixelRatio;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
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

export default function initGraphics() {
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
    gl,
    [".Webgl-vertexShader2d", ".Webgl-fragmentShader2d"]);

  // Lookup location of the position attribute for the program
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer (attributes get their data from buffers)
  var positionBuffer = gl.createBuffer();

  var drawData = {
    gl: gl,
    program: program,
    positionLocation: positionLocation,
    matrixLocation: matrixLocation,
    positionBuffer: positionBuffer
  };

  fitToContainer(drawData);

  window.addEventListener('resize', (e) => fitToContainer(drawData));

  return drawData;
}
