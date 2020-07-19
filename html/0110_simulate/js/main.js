import initDrawing from './init_web_gl.js';
import drawScene from './render.js';
import SickSlider from '../../../js/sick_slider.js';
import * as simulation from './simulation.js';

function updateCameraAngle(angleIndex, drawData, drawSettings, currentParams) {
  return function(value, position) {
    drawSettings.cameraAnglesDegrees[angleIndex] = value;
    drawScene(drawData, drawSettings, currentParams.positions);
  };
}

function updateCameraDistance(drawData, drawSettings, currentParams) {
  return function(value, position) {
    drawSettings.cameraDistance = value;
    drawScene(drawData, drawSettings, currentParams.positions);
  };
}

function setupSlider(drawData, drawSettings, currentParams) {
  SickSlider(".SickSlider-cameraAngleX", {
    label: 'Camera angle X: ', labelSuffix: '°',
    value: 0, min: -360, max: 360,
    onChange: updateCameraAngle(0, drawData, drawSettings, currentParams)
  });

  SickSlider(".SickSlider-cameraAngleY", {
    label: 'Camera angle Y: ', labelSuffix: '°',
    value: 0, min: -360, max: 360,
    onChange: updateCameraAngle(1, drawData, drawSettings, currentParams)
  });

  SickSlider(".SickSlider-cameraAngleZ", {
    label: 'Camera angle Z: ', labelSuffix: '°',
    value: 0, min: -360, max: 360,
    onChange: updateCameraAngle(2, drawData, drawSettings, currentParams)
  });

  SickSlider(".SickSlider-cameraDistance", {
    label: 'Camera distance: ',
    value: 0, min: 1, max: 10,
    onChange: updateCameraDistance(drawData, drawSettings, currentParams)
  });
}

function animate(now) {
  console.log(now);
  requestAnimationFrame(hello);
}

function main() {
  var drawData = initDrawing();

  // Initial parameters of the simulation, they can't be changed without restart
  var initialParams = {
    numberOfRings: [5, 5],
    ringSeparation: 3,
    minimalGalaxySeparation: 25,
    galaxyInclinationAngles: [60 * Math.PI / 180, 60 * Math.PI / 180],
    masses: [1, 1],
    eccentricity: 0.6
  };

  // Current positions, velocities and accelerations
  // of all the bodies. First two elements are galaxy cores and
  // the rest are stars.
  var currentParams = {
    positions: [],
    velocities: [],
    accelerations: []
  };

  // Settings that control the drawing of the scene
  var drawSettings = {
    cameraAnglesDegrees: [0, 0, 0],
    cameraDistance: 2
  };

  setupSlider(drawData, drawSettings, currentParams);

  simulation.setInitial(initialParams, currentParams);

  // requestAnimationFrame(animate);

  drawScene(drawData, drawSettings, currentParams.positions);
}

window.onload = main;
