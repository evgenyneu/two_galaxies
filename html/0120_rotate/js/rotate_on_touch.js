import m4 from '../../../js/m4.js';

function startMoving(state, e) {
  state.moving = true;
  state.lastPosition = [e.pageX, e.pageY];
  console.log('startMoving');
}

function move(state, e) {
  if (!state.moving ) return;
  if (!state.lastPosition) return;

  const delta = [
    e.pageX - state.lastPosition[0],
    e.pageY - state.lastPosition[1]
  ];

  state.worldMatrix = m4.multiply(m4.xRotation(delta[1] / 100), state.worldMatrix);
  state.worldMatrix = m4.multiply(m4.yRotation(delta[0] / 100), state.worldMatrix);

  state.lastPosition = [e.pageX, e.pageY];
  console.log(`move ${state.cameraAngleDegrees}`);
}

function stopMoving(state) {
  state.moving = false;
  console.log('stopMoving');
}

export function init(canvas) {
  var state = {
    moving: false,
    lastPosition: null,
    worldMatrix: m4.indentity()
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
