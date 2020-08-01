// Shows current FPS (frames per second) to check the performance of the system


export function init() {
  var state = {
    // The time stamp of the previous frame
    previousTime: -1,

    // Store last ten FPS value, so we can calculate the average
    fpsValues: [],

    // Number of frames elapsed since we last updated the FPS counter
    framesSinceLastUpdate: 0,

    // Current average FPS
    fpsAverage: 1
  };

  state.label = document.querySelector(".TwoGalaxies-FPS");

  return state;
}


/**
 * Show current FPS (frames per second). The function is called on each
 * frame of animation.
 *
 * @param  {number} time Current time stamp.
 * @param  {object} state The current state of FPS counter
 */
export function update(time, state) {
  if (state.previousTime === -1) {
    state.previousTime = time;
    return;
  }

  // Calculate the FPS
  var fps = Math.round(1000 / (time - state.previousTime));

  // Keep last ten FPS values
  if (state.fpsValues.length > 10) { state.fpsValues.shift(); }
  state.fpsValues.push(fps);

  // Show the FPS on screen. We don't want to update it on every frame,
  // because it will slow us down. Instead, update it every
  // state.fpsAverage frame.
  if (state.framesSinceLastUpdate % state.fpsAverage === 0) {
    // Calculate the average FPS value from last ten values
    const sum = state.fpsValues.reduce((a, b) => a + b, 0);
    state.fpsAverage = Math.round(sum / state.fpsValues.length);
    state.label.innerHTML = `FPS: ${state.fpsAverage}`;
    state.framesSinceLastUpdate = 0;
  }

  state.framesSinceLastUpdate += 1;
  state.previousTime = time;
}
