function onWheel(state, e) {
  e.preventDefault();
  state.cameraDistance += e.deltaY / 100;
  if (state.cameraDistance < 0.5) state.cameraDistance = 0.5;
}

export function init(canvas) {
  var state = {
    cameraDistance: 2
  };

  canvas.addEventListener('wheel',(e) => onWheel(state, e));

  return state;
}
