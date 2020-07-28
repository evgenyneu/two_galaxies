// Handle button clicks

/**
  * Stop propagation of events from elements defined by `selector`
  * to their parents.
  *
  * @param  {string} event  A HTML enent, e.g. "mousedown".
  * @param  {string} selector A CSS selector for child elements.
  */
function stopClickPropagation(event, selector) {
  var buttons = document.querySelectorAll(selector);

  buttons.forEach((button) => {
    button.addEventListener(event, (e) => e.stopPropagation());
  });
}



/**
 * Toggle visibility of the HTML elements: i.e. hide element if it's visible,
 * and show if it's hidden.
 *
 * @param  {array} elements HTML elements.
 */
function toggleElements(elements) {
  elements.forEach((element) => {
    element.classList.toggle('TwoGalaxies-button--isHidden');
  });
}

function didClickReload(currentParams) {
  return () => {
    // Reset the simulation
    currentParams.positions = null;
    currentParams.velocities = null;
    currentParams.accelerations = null;

    return false; // Prevent default
  };
}

function didClickReverseTime(currentParams, buttons) {
  return (e) => {
    currentParams.timeDirection *= -1;

    // Show time forward and hide time backward button when clicked and vice versa
    toggleElements(buttons);

    return false; // Prevent default
  };
}

function didClickPause(currentParams, buttons) {
  return (e) => {
    currentParams.paused = true;

    // Show play and hide pause button when pause is clicked and vice versa
    toggleElements(buttons);

    return false; // Prevent default
  };
}

function didClickResume(currentParams, buttons) {
  return (e) => {
    currentParams.paused = false;

    // Show play and hide pause button when pause is clicked and vice versa
    toggleElements(buttons);

    return false; // Prevent default
  };
}

function didClickFastForward(currentParams, fastForwardSeconds) {
  return (e) => {
    currentParams.fastForwardSeconds = fastForwardSeconds;
    return false; // Prevent default
  };
}

function didClickSliderButton(selectors) {
  return (e) => {
    var sliders = document.querySelectorAll(".SickSlider");

    // Hide all sliders
    sliders.forEach((slider) => slider.classList.add("SickSlider--isHidden"));

    // Show the current sliders
    selectors.forEach((selector) => {
      document.querySelector(selector).classList.remove("SickSlider--isHidden");
    });

    return false; // Prevent default
  };
}

function initSliderButton(buttonSelector, sliderSelectors) {
  var button = document.querySelector(buttonSelector);
  button.onclick = didClickSliderButton(sliderSelectors);
}

export function init(currentParams) {
  var button = document.querySelector(".TwoGalaxies-reloadButton");
  button.onclick = didClickReload(currentParams);

  var reverseTimeButton = document.querySelector(".TwoGalaxies-reverseTimeButton");
  var reverseTime2Button = document.querySelector(".TwoGalaxies-reverseTime2Button");
  var buttons = [reverseTimeButton, reverseTime2Button];

  reverseTimeButton.onclick = didClickReverseTime(currentParams, buttons);
  reverseTime2Button.onclick = didClickReverseTime(currentParams, buttons);

  // Pause/resume
  // ------------

  var pauseButton = document.querySelector(".TwoGalaxies-pauseButton");
  var resumeButton = document.querySelector(".TwoGalaxies-resumeButton");
  buttons = [pauseButton, resumeButton];
  pauseButton.onclick = didClickPause(currentParams, buttons);
  resumeButton.onclick = didClickResume(currentParams, buttons);

  stopClickPropagation("mousedown", ".TwoGalaxies-button");
  stopClickPropagation("touchstart", ".TwoGalaxies-button");

  // Fast forward / rewind
  // --------

  var fastForwardSeconds = 5;
  button = document.querySelector(".TwoGalaxies-fastForwardButton");
  button.onclick = didClickFastForward(currentParams, fastForwardSeconds);

  fastForwardSeconds = -5;
  button = document.querySelector(".TwoGalaxies-fastBackwardButton");
  button.onclick = didClickFastForward(currentParams, fastForwardSeconds);

  // Buttons for showing sliders
  // -----------

  var sliderButtonSelectors = {
    ".TwoGalaxies-timeStepButton": [".TwoGalaxies-sliderTimeStep"],
    ".TwoGalaxies-numberOfRingsButton": [
      ".TwoGalaxies-sliderRings1",
      ".TwoGalaxies-sliderRings2"
    ],
    ".TwoGalaxies-massButton": [
      ".TwoGalaxies-sliderMass1",
      ".TwoGalaxies-sliderMass2"
    ],
    ".TwoGalaxies-distanceButton": [".TwoGalaxies-sliderDistance"],
  };

  for (let buttonSelector in sliderButtonSelectors) {
    var sliderSelectors = sliderButtonSelectors[buttonSelector];
    initSliderButton(buttonSelector, sliderSelectors);
  }
}
