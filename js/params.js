/* Parameters of the simulations */

import { getSharedInitialParameters, getSharedCurrentParameters } from './ui/share.js';
import m4 from './3d/m4.js';
import * as simulation from './simulation.js';


/**
 * Return initial parameters of the simulation, they can't be changed without
 * restart (except for masses)
 */
export function getInitialParameters() {
  var initialParams = {
    numberOfRings: [5, 5],
    colors: [[255, 127, 0], [0, 100, 255]],
    coreColors: [[255, 200, 100], [200, 200, 255]],
    trajectoryColors: [[0.7, 0.5, 0, 1], [0.0, 0.5, 0.9, 1]],
    starSize: 600 * window.devicePixelRatio,
    ringSeparation: 3,
    ringMultiplier: 6, // Increase in number of stars in next ring
    minimalGalaxySeparation: 25,
    galaxyInclinationAnglesDegree: [60, 60],
    masses: [1, 1],
    eccentricity: 0.6
  };

  // Load initial parameters if they were shared through the URL
  return getSharedInitialParameters(initialParams);
}


/**
 * Return parameters that can change during the simulation.
 *
 * @param  {number} screenRefreshRateFPS Estimated refresh rate of the screen.
 */
export function getCurrentParameters(screenRefreshRateFPS) {
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
  return getSharedCurrentParameters(currentParams);
}
