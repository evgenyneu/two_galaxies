export function init() {
  var state = {
    previousTime: -1,
    fpsValues: [],
    updateNumber: 0,
    fpsAverage: 1
  };

  state.label = document.querySelector(".TwoGalaxies-rightTopFPS");

  return state;
}

export function update(time, state) {
  if (state.previousTime === -1) {
    state.previousTime = time;
    return;
  }

  var fps = Math.round(1000 / (time - state.previousTime));

  if (state.fpsValues.length > 10) { state.fpsValues.shift(); }
  state.fpsValues.push(fps);

  if (state.updateNumber % state.fpsAverage === 0) {
    const sum = state.fpsValues.reduce((a, b) => a + b, 0);
    state.fpsAverage = Math.round(sum / state.fpsValues.length);
    state.label.innerHTML = `FPS: ${state.fpsAverage}`;
    state.updateNumber = 0;
  }

  state.updateNumber += 1;
  state.previousTime = time;
}
