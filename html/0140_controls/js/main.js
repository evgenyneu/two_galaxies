import { initGraphics, loadColors } from './graphics.js';
import drawScene from './render.js';
import { numberOfStarsInAllRingsOneGalaxy } from '../../../js/initial_conditions.js';
import * as simulation from './simulation.js';
import * as rotate from './rotate_on_touch.js';
import * as zoom from './zoom.js';
import * as sliders from './sliders.js';

function onNextFrame(drawData, drawSettings, initialParams, currentParams) {
  return function(now) {
    if (currentParams.positions === null) { // First frame
      // calculate initial positions of the bodies
      simulation.setInitial(initialParams, currentParams);
    } else {
      // Update positions of the bodies at new time
      simulation.update(currentParams.timeStep, initialParams, currentParams);
    }

    drawScene(drawData, drawSettings, currentParams.positions);
    requestAnimationFrame(onNextFrame(drawData, drawSettings, initialParams, currentParams));
  };
}

function main() {
  // Initial parameters of the simulation, they can't be changed without restart
  var initialParams = {
    numberOfRings: [5, 5],
    colors: [[255, 127, 0], [0, 100, 255]],
    ringSeparation: 3,
    minimalGalaxySeparation: 25,
    galaxyInclinationAngles: [60 * Math.PI / 180, 60 * Math.PI / 180],
    masses: [1, 1],
    eccentricity: 0.6
  };

  // Current positions, velocities and accelerations of all the bodies.
  var currentParams = {
    positions: null,
    velocities: null,
    accelerations: null,
    timeStep: 1
  };

  sliders.setupSlider(currentParams);

  var drawData = initGraphics();

  loadColors(drawData,
    numberOfStarsInAllRingsOneGalaxy(initialParams.numberOfRings[0]),
    numberOfStarsInAllRingsOneGalaxy(initialParams.numberOfRings[1]),
    initialParams.colors
  );

  var drawSettings = {};

  var rotateState = rotate.init(drawData.gl.canvas);
  drawSettings.rotateState = rotateState;

  var zoomState = zoom.init(drawData.gl.canvas);
  drawSettings.zoomState = zoomState;

  requestAnimationFrame(onNextFrame(drawData, drawSettings, initialParams, currentParams));
}

window.onload = main;
