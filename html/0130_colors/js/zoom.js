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

export function init(canvas) {
  var state = {
    touching: false,
    cameraDistance: 100,
    maxCameraDistance: 50000,
    minCameraDistance: 10,
    lastDistance: null,
  };

  // Mouse wheel / scroll event
  canvas.addEventListener('wheel',(e) => onWheel(state, e));

  // Start touching
  canvas.addEventListener("touchstart", (e) => startTouch(state, e));

  // Touch is moving
  document.addEventListener("touchmove", (e) => touchMove(state, e));

  // Stopped touching
  document.addEventListener("touchend", () => stopTouch(state));

  return state;
}
