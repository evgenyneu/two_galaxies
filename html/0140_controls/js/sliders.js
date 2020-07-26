// Handle the slider input

import SickSlider from './sick_slider.js';

function didChangeTimeStep(currentParams) {
  return function(value, position) {
    currentParams.timeStep = value;
  };
}

function didChangeRings(initialParams, currentParams, galaxyIndex, onRestart) {
  return function(value, position) {
    initialParams.numberOfRings[galaxyIndex] = value;
    onRestart();
  };
}

export function setupSlider(initialParams, currentParams, onRestart) {
  SickSlider(".TwoGalaxies-sliderTimeStep", {
    label: 'Time step: ',
    value: currentParams.timeStep, min: 0, max: 3,
    onChange: didChangeTimeStep(currentParams)
  });


  SickSlider(".TwoGalaxies-sliderRings1", {
    label: 'Number of rings: ',
    value: initialParams.numberOfRings[0], min: 0, max: 100,
    decimalPlaces: 0,
    onChange: didChangeRings(initialParams, currentParams, 0, onRestart),
    visible: false
  });

  SickSlider(".TwoGalaxies-sliderRings2", {
    label: 'Number of rings: ',
    value: initialParams.numberOfRings[1], min: 0, max: 100,
    decimalPlaces: 0,
    onChange: didChangeRings(initialParams, currentParams, 1, onRestart),
    visible: false
  });
}
