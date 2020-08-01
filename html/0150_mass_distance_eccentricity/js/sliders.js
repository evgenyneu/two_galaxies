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

    var restartParams = {
      restart: true,
      reloadColors: true,
      reloadStarSizes: true
    };

    onRestart(restartParams);
  };
}

function didChangeMass(initialParams, currentParams, galaxyIndex, onRestart) {
  return function(value, position) {
    initialParams.masses[galaxyIndex] = value;

    var restartParams = {
      restart: false,
      reloadColors: false,
      reloadStarSizes: true
    };

    onRestart(restartParams);
  };
}

function didChangeDistance(initialParams, currentParams, onRestart) {
  return function(value, position) {
    initialParams.minimalGalaxySeparation = value;

    var restartParams = {
      restart: true,
      reloadColors: false,
      reloadStarSizes: false
    };

    onRestart(restartParams);
  };
}

function didChangeEccentricity(initialParams, currentParams, onRestart) {
  return function(value, position) {
    initialParams.eccentricity = value;

    var restartParams = {
      restart: true,
      reloadColors: false,
      reloadStarSizes: false
    };

    onRestart(restartParams);
  };
}

function didChangeAngle(initialParams, currentParams, galaxyIndex, onRestart) {
  return function(value, position) {
    initialParams.galaxyInclinationAnglesDegree[galaxyIndex] = value;

    var restartParams = {
      restart: true,
      reloadColors: false,
      reloadStarSizes: false
    };

    onRestart(restartParams);
  };
}

function didChangeRingSeparation(initialParams, currentParams, onRestart) {
  return function(value, position) {
    initialParams.ringSeparation = value;
    const reloadColors = false;
    onRestart(reloadColors);
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
    onChange: didChangeMass(initialParams, currentParams, 0, onRestart),
    visible: false
  });

  SickSlider(".TwoGalaxies-sliderMass2", {
    label: 'Core mass: ',
    value: initialParams.masses[1], min: 0, max: 10,
    decimalPlaces: 2,
    onChange: didChangeMass(initialParams, currentParams, 1, onRestart),
    visible: false
  });

  // Galaxy separation
  // --------

  SickSlider(".TwoGalaxies-sliderDistance", {
    label: 'Galaxy separation: ',
    value: initialParams.minimalGalaxySeparation, min: 0, max: 100,
    decimalPlaces: 2,
    onChange: didChangeDistance(initialParams, currentParams, onRestart),
    visible: false
  });

  // Eccentricity
  // --------

  SickSlider(".TwoGalaxies-sliderEccentricity", {
    label: 'Eccentricity: ',
    value: initialParams.eccentricity, min: 0, max: 0.99,
    decimalPlaces: 2,
    onChange: didChangeEccentricity(initialParams, currentParams, onRestart),
    visible: false
  });


  // Galaxy inclination
  // --------

  SickSlider(".TwoGalaxies-sliderAngle1", {
    label: 'Galaxy inclination: ',
    labelSuffix: '°',
    value: initialParams.galaxyInclinationAnglesDegree[0], min: 0, max: 360,
    decimalPlaces: 0,
    onChange: didChangeAngle(initialParams, currentParams, 0, onRestart),
    visible: false
  });

  SickSlider(".TwoGalaxies-sliderAngle2", {
    label: 'Galaxy inclination: ',
    labelSuffix: '°',
    value: initialParams.galaxyInclinationAnglesDegree[1], min: 0, max: 360,
    decimalPlaces: 0,
    onChange: didChangeAngle(initialParams, currentParams, 1, onRestart),
    visible: false
  });

  // Ring separation
  // --------

  SickSlider(".TwoGalaxies-sliderRingSeparation", {
    label: 'Ring separation: ',
    value: initialParams.ringSeparation, min: 0.1, max: 10,
    decimalPlaces: 1,
    onChange: didChangeRingSeparation(initialParams, currentParams, onRestart),
    visible: false
  });
}
