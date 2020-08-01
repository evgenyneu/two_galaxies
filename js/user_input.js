// Taking input from the user: buttons clicks, zoom, rotation

import * as rotate from './rotate_on_touch.js';
import * as zoom from './zoom.js';
import * as sliders from './sliders.js';
import * as buttons from './buttons.js';


export function init(drawData, initialParams, currentParams, onRestart) {
  sliders.setupSlider(initialParams, currentParams, onRestart);
  buttons.init(initialParams, currentParams);

  // Rotation
  // --------

  var hudContainer = document.querySelector(".TwoGalaxies-hudContainer");
  var rotateState = rotate.init(hudContainer, currentParams);
  rotateState.didStartRotating = () => currentParams.rotating = true;
  rotateState.didStopRotating = () => currentParams.rotating = false;

  // Zoom
  // -------

  var zoomState = zoom.init(hudContainer, currentParams);
  currentParams.zoomState = zoomState;
}
