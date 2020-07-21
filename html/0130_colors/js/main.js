import initDrawing from './graphics.js';
import drawScene from './render.js';
import SickSlider from '../../../js/sick_slider.js';
import * as simulation from './simulation.js';
import * as rotate from './rotate_on_touch.js';
import * as zoom from './zoom.js';

function updateCameraAngle(angleIndex, drawSettings) {
  return function(value, position) {
    drawSettings.cameraAnglesDegrees[angleIndex] = value;
  };
}

function updateCameraDistance(drawSettings) {
  return function(value, position) {
    // drawSettings.cameraDistance = value;
  };
}

function setupSlider(drawSettings) {
  // SickSlider(".SickSlider-cameraAngleX", {
  //   label: 'Camera angle X: ', labelSuffix: '°',
  //   value: 0, min: -180, max: 180,
  //   onChange: updateCameraAngle(0, drawSettings)
  // });
  //
  // SickSlider(".SickSlider-cameraAngleY", {
  //   label: 'Camera angle Y: ', labelSuffix: '°',
  //   value: 0, min: -180, max: 180,
  //   onChange: updateCameraAngle(1, drawSettings)
  // });
  //
  // SickSlider(".SickSlider-cameraAngleZ", {
  //   label: 'Camera angle Z: ', labelSuffix: '°',
  //   value: 0, min: -180, max: 180,
  //   onChange: updateCameraAngle(2, drawSettings)
  // });

  SickSlider(".SickSlider-cameraDistance", {
    label: 'Camera distance: ',
    value: 0, min: 1, max: 10,
    onChange: updateCameraDistance(drawSettings)
  });
}

function onNextFrame(drawData, drawSettings, currentParams) {
  return function(now) {
    // Initial parameters of the simulation, they can't be changed without restart
    var initialParams = {
      numberOfRings: [5, 5],
      ringSeparation: 3,
      minimalGalaxySeparation: 25,
      galaxyInclinationAngles: [60 * Math.PI / 180, 60 * Math.PI / 180],
      masses: [1, 1],
      eccentricity: 0.6
    };

    if (currentParams.positions === null) { // First frame
      // calculate initial positions of the bodies
      simulation.setInitial(initialParams, currentParams);
    } else {
      // Update positions of the bodies at new time
      simulation.update(1, initialParams, currentParams);
    }

    drawScene(drawData, drawSettings, currentParams.positions);
    requestAnimationFrame(onNextFrame(drawData, drawSettings, currentParams));
  };
}

function main() {
  setupSlider();
  var drawData = initDrawing();
  var drawSettings = {};

  var rotateState = rotate.init(drawData.gl.canvas);
  drawSettings.rotateState = rotateState;

  var zoomState = zoom.init(drawData.gl.canvas);
  drawSettings.zoomState = zoomState;

  // Current positions, velocities and accelerations of all the bodies.
  var currentParams = {
    positions: null,
    velocities: null,
    accelerations: null
  };

  requestAnimationFrame(onNextFrame(drawData, drawSettings, currentParams));
}

window.onload = main;
