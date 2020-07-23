import SickSlider from './sick_slider.js';


function updateSlider(currentParams) {
  return function(value, position) {
    currentParams.timeStep = value;
  };
}

export function setupSlider(currentParams) {
  SickSlider(".SickSlider", {
    label: 'Time step: ',
    value: 0, min: -10, max: 10,
    onChange: updateSlider(currentParams)
  });
}
