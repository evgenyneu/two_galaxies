// Handle button clicks

function didClickReload(currentParams) {
  return () => {
    // Reset the simulation
    currentParams.positions = null;
    currentParams.velocities = null;
    currentParams.accelerations = null;

    return false; // Prevent default
  };
}

function didClickReverseTime(currentParams) {
  return (e) => {
    currentParams.timeStep *= -1;
    return false; // Prevent default
  };
}

function didClickPause(currentParams, pauseButton, resumeButton) {
  return (e) => {
    currentParams.paused = true;
    pauseButton.classList.toggle('TwoGalaxies-bottomButton--isHidden');
    resumeButton.classList.toggle('TwoGalaxies-bottomButton--isHidden');
    return false; // Prevent default
  };
}

function didClickResume(currentParams, pauseButton, resumeButton) {
  return (e) => {
    currentParams.paused = false;
    pauseButton.classList.toggle('TwoGalaxies-bottomButton--isHidden');
    resumeButton.classList.toggle('TwoGalaxies-bottomButton--isHidden');
    return false; // Prevent default
  };
}

/**
  * Stop propagation of events from elements defined by `selector`
  * to their parents.
  *
  * @param  {string} event  A DOM enven, e.g. "mousedown".
  * @param  {string} selector A CSS selector for child elements.
  */
function stopClickPropagation(event, selector) {
  var buttons = document.querySelectorAll(selector);

  buttons.forEach((button) => {
    button.addEventListener(event, (e) => e.stopPropagation());
  });
}

export function init(currentParams) {
  var button = document.querySelector(".TwoGalaxies-reloadButton");
  button.onclick = didClickReload(currentParams);

  button = document.querySelector(".TwoGalaxies-reverseTimeButton");
  button.onclick = didClickReverseTime(currentParams);

  // Pause/resume
  // ------------

  var pauseButton = document.querySelector(".TwoGalaxies-pauseButton");
  var resumeButton = document.querySelector(".TwoGalaxies-resumeButton");

  pauseButton.onclick = didClickPause(currentParams, pauseButton, resumeButton);
  resumeButton.onclick = didClickResume(currentParams, pauseButton, resumeButton);

  stopClickPropagation("mousedown", ".TwoGalaxies-bottomButton");
  stopClickPropagation("touchstart", ".TwoGalaxies-bottomButton");
}
