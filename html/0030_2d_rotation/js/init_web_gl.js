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
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var rotationLocation = gl.getUniformLocation(program, "u_rotation");

  // Create a buffer (attributes get their data from buffers)
  var positionBuffer = gl.createBuffer();

  // Bind ARRAY_BUFFER to the positionBuffer
  // (creates a global variable inside WebGL)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  return {
    gl: gl,
    program: program,
    positionLocation: positionLocation,
    resolutionLocation: resolutionLocation,
    positionBuffer: positionBuffer,
    colorLocation: colorLocation,
    translationLocation: translationLocation,
    rotationLocation: rotationLocation
  };
}
