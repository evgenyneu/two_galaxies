// Handle the slider input

import SickSlider from './sick_slider.js';

function updateSlider(currentParams) {
  return function(value, position) {
    currentParams.timeStep = value;
  };
}

export function setupSlider(currentParams) {
  SickSlider(".SickSlider", {
    label: 'Time step: ',
    value: currentParams.timeStep, min: 0, max: 3,
    onChange: updateSlider(currentParams)
  });
}
