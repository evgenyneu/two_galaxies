import * as init from '../../../js/initial_conditions.js';

import { createProgramFromScripts } from '../../../js/web_gl_utils.js';
import m4 from '../../../js/m4.js';


export default function initWebGl() {
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
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer (attributes get their data from buffers)
  var positionBuffer = gl.createBuffer();

  // Bind ARRAY_BUFFER to the positionBuffer
  // (creates a global variable inside WebGL)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Put geometry data into buffer
  let numberOfBodies = setGeometry(gl);

  return {
    gl: gl,
    program: program,
    positionBuffer: positionBuffer,
    positionLocation: positionLocation,
    matrixLocation: matrixLocation,
    numberOfBodies: numberOfBodies
  };
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  const numberOfRings = [5, 5];
  const ringSeparation = 3;
  const minimalGalaxySeparation = 25;
  const galaxyInclinationAngles = [60 * Math.PI / 180, 60 * Math.PI / 180];
  const masses = [1, 1];
  const eccentricity = 0.6;

  var { positions, velocities } =
    init.allPositionsAndVelocities(numberOfRings, ringSeparation,
      minimalGalaxySeparation, galaxyInclinationAngles, masses, eccentricity);

  const numberOfBodies = positions.length;
  positions = positions.flat();
  positions = new Float32Array(positions);

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  return numberOfBodies;
}
