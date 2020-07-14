import { createProgramFromScripts } from '../../../js/web_gl_utils.js';

export default function init() {
  // Get canvas object
  var canvas = document.querySelector(".Webgl-canvas");
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
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorUniformLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer (attributes get their data from buffers)
  var positionBuffer = gl.createBuffer();

  // Bind ARRAY_BUFFER to the positionBuffer
  // (creates a global variable inside WebGL)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  return {
    gl: gl,
    program: program,
    positionAttributeLocation: positionAttributeLocation,
    resolutionUniformLocation: resolutionUniformLocation,
    positionBuffer: positionBuffer,
    colorUniformLocation: colorUniformLocation
  };
}
