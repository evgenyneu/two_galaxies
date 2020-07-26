// Taking input from the user

import * as rotate from './rotate_on_touch.js';
import * as zoom from './zoom.js';
import * as sliders from './sliders.js';
import * as buttons from './buttons.js';

export function init(drawData, initialParams, currentParams) {
  sliders.setupSlider(initialParams, currentParams);
  buttons.init(currentParams);

  // Rotation
  // --------

  var hudContainer = document.querySelector(".TwoGalaxies-hudContainer");
  var rotateState = rotate.init(hudContainer);
  rotateState.didStartRotating = () => currentParams.rotating = true;
  rotateState.didStopRotating = () => currentParams.rotating = false;
  currentParams.rotateState = rotateState;

  // Zoom
  // -------

  var zoomState = zoom.init(hudContainer);
  currentParams.zoomState = zoomState;
}
