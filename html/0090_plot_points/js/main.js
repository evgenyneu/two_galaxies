import initWebGl from './init_web_gl.js';
import drawScene from './render.js';
import SickSlider from '../../../js/sick_slider.js';

function updateCameraAngle(angleIndex, settings, initData) {
  return function(value, position) {
    settings.cameraAnglesDegrees[angleIndex] = value;
    drawScene(initData, settings);
  };
}

function updateCameraDistance(settings, initData) {
  return function(value, position) {
    settings.cameraDistance = value;
    drawScene(initData, settings);
  };
}

function main() {
  var initData = initWebGl();

  var settings = {
    cameraAnglesDegrees: [0, 0, 0],
    cameraDistance: 2
  };

  SickSlider(".SickSlider-cameraAngleX", {
    label: 'Camera angle X: ', labelSuffix: '°',
    value: 0, min: -360, max: 360,
    onChange: updateCameraAngle(0, settings, initData)
  });

  SickSlider(".SickSlider-cameraAngleY", {
    label: 'Camera angle Y: ', labelSuffix: '°',
    value: 0, min: -360, max: 360,
    onChange: updateCameraAngle(1, settings, initData)
  });

  SickSlider(".SickSlider-cameraAngleZ", {
    label: 'Camera angle Z: ', labelSuffix: '°',
    value: 0, min: -360, max: 360,
    onChange: updateCameraAngle(2, settings, initData)
  });

  SickSlider(".SickSlider-cameraDistance", {
    label: 'Camera distance: ',
    value: 0, min: 1, max: 10,
    onChange: updateCameraDistance(settings, initData)
  });

  drawScene(initData, settings);
}

window.onload = main;
