// The entry point of the program.
// Initialises graphics and runs the simulation.

import { getInitialParameters, getCurrentParameters } from './params.js';
import { initGraphics, loadColors, loadStarSizes } from './3d/init.js';
import drawScene from './3d/render.js';
import * as simulation from './simulation.js';
import { measureRefreshRate } from './ui/refresh_rate.js';
import {init as initUserInput} from './ui/user_input.js';
import * as showFps from './ui/show_fps.js';
import { updateCameraDistance } from './ui/zoom.js';
import { show, hide } from './ui/html_element.js';


/**
 * Calculate positions of stars at the next time stamp and redraw the
 * stars on screen. This function is called at each frame of the animation,
 * e.g. 60 times per second on 60 Hz screens.
 *
 * @param  {object} drawData Drawing data.
 * @param  {object} initialParams Initial parameters of the simulation.
 * @param  {object} currentParams Current parameters of the simulation.
 * @param  {object} fpsState Data needed to show current refresh rate on screen.
 */
function onNextFrame(drawData, initialParams, currentParams, fpsState) {
  return function(now) {
    // Show current refresh rate
    showFps.update(now, fpsState);

    if (currentParams.positions === null) {
      // First frame of the animation: calculate initial positions of the bodies
      simulation.setInitial(initialParams, currentParams);
      updateCameraDistance(currentParams, drawData.gl.canvas);
    } else {
      // Update positions of the bodies at new time
      simulation.update(initialParams, currentParams);
    }

    // Draw stars on screen
    drawScene(drawData, initialParams, currentParams);

    // Call onNextFrame function on the next animation frame
    requestAnimationFrame(onNextFrame(drawData, initialParams,
                                      currentParams, fpsState));
  };
}


/**
 * Restart the simulation from time zero using current parameter values.
 *
 * @param  {object} drawData Drawing data.
 * @param  {object} initialParams Initial parameters of the simulation.
 * @param  {object} currentParams Current parameters of the simulation.
 * @param  {object} restartParams An object with following restart settings:
 *    restart           Start the simulation form the beginning.
 *    reloadColors      Reload the colors of the stars.
 *    reloadStarSizes   Reload the star sizes.
 */
function restart(drawData, initialParams, currentParams, restartParams) {
  if (restartParams.restart) {
    currentParams.positions = null;
    currentParams.velocities = null;
    currentParams.accelerations = null;

    // Recalculate the zoom
    currentParams.cameraDistance = null;
  }

  if (restartParams.reloadColors) loadColors(drawData, initialParams);
  if (restartParams.reloadStarSizes) loadStarSizes(drawData, initialParams);
}


/**
 * The entry function of the simulation. Initialises the simulation and
 * then runs it.
 *
 * @param  {number} screenRefreshRateFPS Estimated refresh rate
 *      of the screen. It is used to set the time step of the simulation
 *      so that it runs visually at the same speed for people with different
 *      monitors (i.e. 60 Hz, 144 Hz etc)
 */
function main(screenRefreshRateFPS) {
  // Hide loading spinner and show the simulation
  hide(".TwoGalaxies-loadingImageContainer");
  show(".TwoGalaxies-layoutFixed");

  // Get parameters of the simulation
  var initialParams = getInitialParameters();
  var currentParams = getCurrentParameters(screenRefreshRateFPS);

  // Prepare for drawing
  var drawData = initGraphics(initialParams, currentParams, restart);

  // Allow user to rotate and zoom the screen
  initUserInput(drawData, initialParams, currentParams,
    (restartParams) => restart(drawData, initialParams, currentParams, restartParams));

  // Prepare to calculate the current refresh rate of the animation
  var fpsState = showFps.init();

  // Run the animation
  requestAnimationFrame(onNextFrame(drawData, initialParams, currentParams, fpsState));
}

window.onload = () => measureRefreshRate(20).then(fps => main(fps));
