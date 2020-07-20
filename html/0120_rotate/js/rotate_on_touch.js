function startMoving(state, e) {
  state.moving = true;
  state.lastPosition = [e.pageX, e.pageY];
  console.log('startMoving');
}

function stopMoving(state) {
  state.moving = false;
  console.log('stopMoving');
}

function move(state, e) {
  if (!state.moving ) return;
  console.log('move');
}

export function init(canvas) {
  var state = {
    moving: false,
    lastPosition: null,
  };

  // Start moving
  // -----------------

  canvas.addEventListener("mousedown", (e) => startMoving(state, e));
  canvas.addEventListener("touchstart", (e) => startMoving(state, e.touches[0]));

  // Move
  // -----------------

  document.addEventListener("mousemove", (e) => move(state, e));
  document.addEventListener("touchmove", (e) => move(state, e.touches[0]));

  // End moving
  // -----------------

  document.addEventListener("mouseup", () => stopMoving(state));
  document.addEventListener("dragend", () => stopMoving(state));
  document.addEventListener("touchend", () => stopMoving(state));

  return state;
}
