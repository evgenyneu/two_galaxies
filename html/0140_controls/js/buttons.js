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
  var reloadButton = document.querySelector(".TwoGalaxies-reloadButton");
  reloadButton.onclick = didClickReload(currentParams);

  var reverseTimeButton = document.querySelector(".TwoGalaxies-reverseTimeButton");
  reverseTimeButton.onclick = didClickReverseTime(currentParams);

  stopClickPropagation("mousedown", ".TwoGalaxies-bottomButton");
}
