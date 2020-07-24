// Taking input from the user

import * as rotate from './rotate_on_touch.js';
import * as zoom from './zoom.js';

export function init(drawData, currentParams) {
  var hudContainer = document.querySelector(".TwoGalaxies-hudContainer");
  var rotateState = rotate.init(hudContainer);
  rotateState.didStartRotating = () => currentParams.rotating = true;
  rotateState.didStopRotating = () => currentParams.rotating = false;
  currentParams.rotateState = rotateState;

  var zoomState = zoom.init(hudContainer);
  currentParams.zoomState = zoomState;
}
