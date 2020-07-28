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

function didChangeMass(initialParams, currentParams, galaxyIndex) {
  return function(value, position) {
    initialParams.masses[galaxyIndex] = value;
  };
}

function didChangeDistance(initialParams, currentParams, onRestart) {
  return function(value, position) {
    initialParams.minimalGalaxySeparation = value;
    onRestart();
  };
}

export function setupSlider(initialParams, currentParams, onRestart) {
  SickSlider(".TwoGalaxies-sliderTimeStep", {
    label: 'Time step: ',
    value: currentParams.timeStep, min: 0, max: 3,
    onChange: didChangeTimeStep(currentParams)
  });

  // Number of rings
  // --------

  SickSlider(".TwoGalaxies-sliderRings1", {
    label: 'Number of rings: ',
    value: initialParams.numberOfRings[0], min: 0, max: 150,
    decimalPlaces: 0,
    onChange: didChangeRings(initialParams, currentParams, 0, onRestart),
    visible: false
  });

  SickSlider(".TwoGalaxies-sliderRings2", {
    label: 'Number of rings: ',
    value: initialParams.numberOfRings[1], min: 0, max: 150,
    decimalPlaces: 0,
    onChange: didChangeRings(initialParams, currentParams, 1, onRestart),
    visible: false
  });

  // Mass
  // --------

  SickSlider(".TwoGalaxies-sliderMass1", {
    label: 'Core mass: ',
    value: initialParams.masses[0], min: 0, max: 10,
    decimalPlaces: 2,
    onChange: didChangeMass(initialParams, currentParams, 0),
    visible: false
  });

  SickSlider(".TwoGalaxies-sliderMass2", {
    label: 'Core mass: ',
    value: initialParams.masses[1], min: 0, max: 10,
    decimalPlaces: 2,
    onChange: didChangeMass(initialParams, currentParams, 1),
    visible: false
  });

  // Min distance between cores
  // --------

  SickSlider(".TwoGalaxies-sliderDistance", {
    label: 'Galaxy separation: ',
    value: initialParams.minimalGalaxySeparation, min: 0, max: 100,
    decimalPlaces: 2,
    onChange: didChangeDistance(initialParams, currentParams, onRestart),
    visible: false
  });
}
