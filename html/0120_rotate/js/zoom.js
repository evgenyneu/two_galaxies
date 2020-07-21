function onWheel(state, e) {
  e.preventDefault();
  state.cameraDistance += e.deltaY / 100;
  if (state.cameraDistance < 0.5) state.cameraDistance = 0.5;
}

function startTouch(state, e) {
  console.log('startTouch');
}

function touchMove(state, e) {
  console.log('touchMove');
}

function stopTouch(state) {
  console.log('stopTouch');
}

export function init(canvas) {
  var state = {
    cameraDistance: 2
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
