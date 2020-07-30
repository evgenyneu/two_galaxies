// Rotate the stars by clicking and dragging on the screen.

import m4 from './simulation/m4.js';

function startMoving(state, e) {
  state.moving = true;
  state.lastPosition = [e.pageX, e.pageY];
  if (state.didStartRotating) state.didStartRotating();
}

function startTouching(state, e) {
  if (e.targetTouches.length === 2) {
    // Touching with two fingers.
    // This is a pinch/zoom gesture, not rotation
    return;
  }

  // Single finger touch
  if (e.targetTouches.length === 1) startMoving(state, e.targetTouches[0]);
}

function move(state, currentParams, e) {
  if (!state.moving) return;
  if (!state.lastPosition) return;

  const delta = [
    e.pageX - state.lastPosition[0],
    e.pageY - state.lastPosition[1]
  ];

  currentParams.rotationMatrix = m4.multiply(m4.xRotation(delta[1] / 100),
                                             currentParams.rotationMatrix);

  currentParams.rotationMatrix = m4.multiply(m4.yRotation(delta[0] / 100),
                                             currentParams.rotationMatrix);

  state.lastPosition = [e.pageX, e.pageY];
}

function touchMove(state, currentParams, e) {
  if (e.targetTouches.length === 2) {
    // Touching with two fingers.
    // This is a pinch/zoom gesture, not rotation
    return;
  }

  // Single finger touch
  if (e.targetTouches.length === 1) {
    move(state, currentParams, e.targetTouches[0]);
  }
}

function stopMoving(state) {
  state.moving = false;
  if (state.didStopRotating) state.didStopRotating();
}

export function init(hudContainer, currentParams) {
  var state = {
    moving: false,
    lastPosition: null,
    didStartRotating: null, // callback
    didStopRotating: null // callback
  };

  currentParams.rotationMatrix = m4.indentity();

  // Start moving
  // -----------------

  hudContainer.addEventListener("mousedown", (e) => startMoving(state, e));
  hudContainer.addEventListener("touchstart", (e) => startTouching(state, e));

  // Move
  // -----------------

  document.addEventListener("mousemove", (e) => move(state, currentParams, e));
  document.addEventListener("touchmove", (e) => touchMove(state, currentParams, e));

  hudContainer.addEventListener("touchmove", (e) => {
    if (typeof e.preventDefault !== 'undefined' && e.preventDefault !== null) {
      // Prevent screen from sliding on touch devices when the element is dragged.
      e.preventDefault();
    }
  });

  // End moving
  // -----------------

  document.addEventListener("mouseup", () => stopMoving(state));
  document.addEventListener("dragend", () => stopMoving(state));
  document.addEventListener("touchend", () => stopMoving(state));

  return state;
}
