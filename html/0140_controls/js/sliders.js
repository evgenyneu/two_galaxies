// Handle the slider input

import SickSlider from './sick_slider.js';

function didChangeTimeStep(currentParams) {
  return function(value, position) {
    currentParams.timeStep = value;
  };
}

function didChangeRings(initialParams, galaxyIndex) {
  return function(value, position) {
    initialParams.numberOfRings[galaxyIndex] = value;
  };
}

export function setupSlider(initialParams, currentParams) {
  SickSlider(".TwoGalaxies-sliderTimeStep", {
    label: 'Time step: ',
    value: currentParams.timeStep, min: 0, max: 3,
    onChange: didChangeTimeStep(currentParams)
  });

  SickSlider(".TwoGalaxies-sliderRings1", {
    label: 'Number of rings: ',
    value: initialParams.numberOfRings[0], min: 0, max: 10,
    decimalPlaces: 0,
    onChange: didChangeRings(initialParams, 0)
  });

  SickSlider(".TwoGalaxies-sliderRings2", {
    label: 'Number of rings: ',
    value: initialParams.numberOfRings[1], min: 0, max: 10,
    decimalPlaces: 0,
    onChange: didChangeRings(initialParams, 1)
  });
}
