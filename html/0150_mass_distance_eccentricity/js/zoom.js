// Zoom the stars in and out by using the mouse scroll wheel
// or pinch gensture

function distanceBetweenFingers(e) {
  return Math.hypot(
      e.targetTouches[0].pageX - e.targetTouches[1].pageX,
      e.targetTouches[0].pageY - e.targetTouches[1].pageY);
}

function onWheel(state, e) {
  e.preventDefault();
  state.cameraDistance += e.deltaY / 100 * state.cameraDistance;

  if (state.cameraDistance > state.maxCameraDistance) {
    state.cameraDistance = state.maxCameraDistance;
  }

  if (state.cameraDistance < state.minCameraDistance) {
    state.cameraDistance = state.minCameraDistance;
  }
}

function startTouch(state, e) {
  state.touching = true;
  if (e.targetTouches.length !== 2) return;

  state.lastDistance = distanceBetweenFingers(e);
}

function touchMove(state, e) {
  if (!state.touching) return;
  if (!state.lastDistance) return;
  if (e.targetTouches.length !== 2) return;

  const distance = distanceBetweenFingers(e);
  state.cameraDistance += (state.lastDistance - distance) / 100 * state.cameraDistance;
  state.lastDistance = distance;

  if (state.cameraDistance > state.maxCameraDistance) {
    state.cameraDistance = state.maxCameraDistance;
  }

  if (state.cameraDistance < state.minCameraDistance) {
    state.cameraDistance = state.minCameraDistance;
  }
}

function stopTouch(state) {
  state.touching = false;
}


/**
 * Update the z distance of the camera from the origin
 * needed to fully show the galaxies
 *
 * @param  {object} currentParams Current parameters
 */
export function updateCameraDistance(currentParams) {
  if (currentParams.zoomState.cameraDistance !== null) return;
  // Find min and max x coordinates
  var xMin = 1e10;
  var xMax = -1e10;

  for(let i = 0; i < currentParams.positions.length / 3; i++) {
    let x = currentParams.positions[i*3];

    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;
  }

  // Calculate the x distance from the center of the screen we need to show
  var maxXDistance = Math.max(Math.abs(xMax), Math.abs(xMin)) * 1.2;

  // Find the z distance needed to show the galaxies
  var zDistance = maxXDistance / Math.tan(currentParams.zoomState.fieldOfViewRadians * 0.5);
  currentParams.zoomState.cameraDistance = zDistance;
}

export function init(hudContainer) {
  var state = {
    touching: false,
    cameraDistance: null,
    fieldOfViewRadians: 60 * Math.PI / 180,
    maxCameraDistance: 50000,
    minCameraDistance: 10,
    lastDistance: null,
  };

  // Mouse wheel / scroll event
  hudContainer.addEventListener('wheel',(e) => onWheel(state, e));

  // Start touching
  hudContainer.addEventListener("touchstart", (e) => startTouch(state, e));

  // Touch is moving
  document.addEventListener("touchmove", (e) => touchMove(state, e));

  // Stopped touching
  document.addEventListener("touchend", () => stopTouch(state));

  // Prevent right click menu
  // hudContainer.addEventListener('contextmenu', (e) => { e.preventDefault(); }, true);

  return state;
}
