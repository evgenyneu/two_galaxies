// Zoom the stars in and out by using the mouse scroll wheel
// or pinch gesture


function distanceBetweenFingers(e) {
  return Math.hypot(
      e.targetTouches[0].pageX - e.targetTouches[1].pageX,
      e.targetTouches[0].pageY - e.targetTouches[1].pageY);
}



/**
 * Returns the normalised amount of wheel spin to be used for zooming
 * in and out, a number near 1. Can be positive or negative depending on
 * spin direction. This is necessary because reported amount of shifts
 * differ between browsers, operating systems and input devices
 * (touch pad scroll vs mouse wheel).
 *
 * The code is based on combination of
 * https://stackoverflow.com/a/5542105/297131
 * https://gist.github.com/akella/11574989a9f3cc9e0ad47e401c12ccaf
 *
 * @param  {event} e The `wheel` event object.
 */
function wheelSpin(e) {
  let spin = 0;

  if ('wheelDelta' in e) {
    // On Chrome we can't rely on deltaY because it ideas ~4 on Mac and ~120
    // on Windows for mouse scroll. Therefore, we want `wheelDelta` instead.

    let deltaAbs = Math.abs(e.wheelDelta);

    // Set an upper limit because mouse scroll produces values larger than 100,
    // and sometimes even 700
    deltaAbs = Math.min(30, deltaAbs);

    // Normalise to a value around 1, the fudge factor was manually tuned
    // for Mac/Windows for Edge/Chrome browsers
    spin = - Math.sign(e.wheelDelta) * deltaAbs / 40;
  }

  if (!spin && 'deltaY' in e) {
    // WheelDelta is not fired in Firefox, we use deltaY instead
    let deltaAbs = Math.abs(e.deltaY);
    spin = Math.sign(e.deltaY) * deltaAbs / 5;
  }

  return spin;
}


/**
 * User is rolling the mouse wheel, we need to zoom in/out
 */
function onWheel(state, e, currentParams) {
  e.preventDefault();

  // The amount of wheel scroll, deltaY can vary between system.
  // We want to normalise it by using the sign
  const delta = Math.sign(e.deltaY);
  let spin = wheelSpin(e);
  currentParams.cameraDistance += spin / 5 * currentParams.cameraDistance;

  if (currentParams.cameraDistance > state.maxCameraDistance) {
    currentParams.cameraDistance = state.maxCameraDistance;
  }

  if (currentParams.cameraDistance < state.minCameraDistance) {
    currentParams.cameraDistance = state.minCameraDistance;
  }
}


function startTouch(state, e) {
  state.touching = true;
  if (e.targetTouches.length !== 2) return;

  state.lastDistance = distanceBetweenFingers(e);
}


function touchMove(state, e, currentParams) {
  if (!state.touching) return;
  if (!state.lastDistance) return;
  if (e.targetTouches.length !== 2) return;

  const distance = distanceBetweenFingers(e);
  currentParams.cameraDistance += (state.lastDistance - distance) /
                                    100 * currentParams.cameraDistance;

  state.lastDistance = distance;

  if (currentParams.cameraDistance > state.maxCameraDistance) {
    currentParams.cameraDistance = state.maxCameraDistance;
  }

  if (currentParams.cameraDistance < state.minCameraDistance) {
    currentParams.cameraDistance = state.minCameraDistance;
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
export function updateCameraDistance(currentParams, canvas) {
  if (currentParams.cameraDistance !== null) return;
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

  // Increase the distance if screen is too narrow to show both galaxies
  zDistance *= 500 / Math.min(500, canvas.clientWidth);

  currentParams.cameraDistance = zDistance;
}


/**
 * Start detecting zoom.
 *
 * @param  {object} hudContainer HTML element located in front of the drawn area
 *    with which the user touches to zoom in and out.
 * @param  {object} currentParams Current parameters of the simulation.
 * @return {object} Zoom state
 */
export function init(hudContainer, currentParams) {
  var state = {
    touching: false,
    // The larger field of view increases the effect of 3D perspective:
    // objects that are farther away appear smaller
    fieldOfViewRadians: 60 * Math.PI / 180,
    maxCameraDistance: 50000,
    minCameraDistance: 10,
    lastDistance: null,
  };

  // Mouse wheel / scroll event
  hudContainer.addEventListener('wheel',(e) => onWheel(state, e, currentParams));

  // Start touching
  hudContainer.addEventListener("touchstart", (e) => startTouch(state, e));

  // Touch is moving
  document.addEventListener("touchmove", (e) => touchMove(state, e, currentParams));

  // Stopped touching
  document.addEventListener("touchend", () => stopTouch(state));

  return state;
}
