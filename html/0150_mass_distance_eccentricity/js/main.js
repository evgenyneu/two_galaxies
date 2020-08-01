// The entry point of the program.
// Initialises graphics and runs the simulation.

import { initGraphics, loadColors } from './graphics.js';
import drawScene from './render.js';
import * as simulation from './simulation.js';
import { measureRefreshRate } from './refresh_rate.js';
import {init as initUserInput} from './user_input.js';
import * as showFps from './show_fps.js';
import { updateCameraDistance } from './zoom.js';
import { getInitialParameters, getCurrentParameters } from './share.js';
import m4 from './simulation/m4.js';

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
      updateCameraDistance(currentParams);
      console.log(`Number of bodies: ${currentParams.positions.length / 3}`);
    } else {
      // Update positions of the bodies at new time
      simulation.update(initialParams, currentParams);
    }

    // Draw star on screen
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
 * @param  {boolean} reloadColors=false Load the colors into GPU if true.
 */
function restart(drawData, initialParams, currentParams, reloadColors=false) {
  currentParams.positions = null;
  currentParams.velocities = null;
  currentParams.accelerations = null;

  // Recalculate the zoom
  currentParams.zoomState.cameraDistance = null;

  if (reloadColors) loadColors(drawData, initialParams);
}



/**
 * The entry function of the simulation. Initialises the simulation and
 * then runs it.
 *
 * @param  {number} screenRefreshRateFPS Estimated refresh rate
 *      refresh rate of the screen. It is used to set the time step
 *      of the animation so that it runs visually at the same speed for
 *      people with different monitors
 *      (i.e. 60 Hz and 144 Hz).
 */
function main(screenRefreshRateFPS) {
  // Initial parameters of the simulation, they can't be changed without
  // restart (except for masses)
  var initialParams = {
    numberOfRings: [5, 5],
    colors: [[255, 127, 0], [0, 100, 255]],
    trajectoryColors: [[0.7, 0.5, 0, 1], [0.0, 0.5, 0.9, 1]],
    ringSeparation: 3,
    minimalGalaxySeparation: 25,
    galaxyInclinationAnglesDegree: [60, 60],
    masses: [1, 1],
    eccentricity: 0.6
  };

  // Load initial parameters if they were shared through the URL
  initialParams = getInitialParameters(initialParams);

  // Parameters that can change during the simulation
  var currentParams = {
    // Current positions, velocities and accelerations of all the bodies.
    positions: null,
    velocities: null,
    accelerations: null,

    // User is rotating the scene
    rotating: false,

    // Is simulation paused by the user
    paused: false,

    // The approximate detected refresh rate of the screen, in
    // number of frames per second (FPS). At each frame, the simulation
    // time is advanced by `timeStep` and then drawn on the screen
    screenRefreshRateFPS: screenRefreshRateFPS,

    // The amount of time the simulation is advanced after each
    // screen refresh frame. The number is always positive.
    // To simulate back in time, set timeDirection to -1.
    timeStep: simulation.calculateTimeStep(screenRefreshRateFPS),

    // Number of seconds to fast forward the simulation. The number
    // can be negative, which means we want to go back in simulation time.
    fastForwardSeconds: 0,

    // Direction of time. 1 for forward, -1 for backward.
    timeDirection: 1,

    // Matrix for handling rotation of the scene by the user
    rotationMatrix: m4.identity(),

    // The zoom level that can be adjusted by the user.
    // Determined automatically initially to make galaxies fit the screen
    cameraDistance: null
  };

  // Load current parameters if they were shared through the URL
  currentParams = getCurrentParameters(currentParams);

  // Prepare for drawing
  var drawData = initGraphics(initialParams);

  // Allow user to rotate and zoom the sceen.
  initUserInput(drawData, initialParams, currentParams,
    (reloadColors) => restart(drawData, initialParams, currentParams, reloadColors));

  // Prepare to calculate the current refresh rate of the animation.
  var fpsState = showFps.init();

  // Run the animation
  requestAnimationFrame(onNextFrame(drawData, initialParams,
                                    currentParams, fpsState));
}

window.onload = () => measureRefreshRate(20).then(fps => main(fps));
